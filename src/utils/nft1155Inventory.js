/**
 * ERC-1155 inventory: candidate ids from TransferSingle / TransferBatch logs, then balanceOf(owner, id).
 * There is no wallet-wide balance; every id needs its own call after discovery.
 *
 * ### Why “one NFT” can still take a long time
 * Auto-discovery does **not** stop at the first id. It scans the full `[latest − lookback, latest]`
 * range. Per block chunk we run **four** serialized `getPastEvents` (Single to/from, Batch to/from) —
 * see {@link ERC1155_LOG_QUERIES_PER_CHUNK}.
 *
 * **Approx. eth_getLogs calls** ≈ `ceil(lookback / logChunk) × ERC1155_LOG_QUERIES_PER_CHUNK`.
 * Example: 600_000 / 10_000 = 60 chunks → **240** getLogs (four per chunk), plus network time.
 * If `pauseMs > 0`, wall time also adds **`pauseMs × (chunks − 1)`** (e.g. 100ms × 199 ≈ 20s) on top of RPC latency.
 * **`balanceOf` is usually cheap** for a small id set; the log scan dominates.
 *
 * **Fast path:** pass `skipLogs: true` and known ids (or use “Check balances” in SKTools) to skip log discovery entirely.
 *
 * ### Tuning (sweet spot)
 * Adjust {@link ERC1155_INVENTORY_TUNING} or override per call: `lookbackBlocks`, `blockChunkSize`, `pauseMs`, `balanceChunkSize`.
 */

/** All defaults for log scan + balance waves — change here to tune speed vs RPC load. */
export const ERC1155_INVENTORY_TUNING = Object.freeze({
  /** Blocks backward from latest when `fromBlock` is omitted. Lower = faster; may miss older transfers. */
  LOG_LOOKBACK_BLOCKS: 600_000n,
  /**
   * Blocks per `getPastEvents` range (inclusive span = this value).
   * Many Shido/public RPCs cap `eth_getLogs` to **10_000** blocks; Zeeve archive enforces the same — stay ≤10_000 or use adaptive shrink.
   */
  LOG_BLOCK_CHUNK_SIZE: 10_000n,
  /** Sleep after each log chunk (ms). Use `0` for max speed; raise if the RPC rate-limits. */
  LOG_PAUSE_MS_BETWEEN_CHUNKS: 0,
  /** Parallel `balanceOf(owner, id)` calls per wave in {@link fetchErc1155BalancesForIds} (capped 1–40). */
  BALANCE_OF_CONCURRENCY: 28,
});

/** Serialized `getPastEvents` calls executed per block chunk (to/from × Single/Batch). */
export const ERC1155_LOG_QUERIES_PER_CHUNK = 4;

/** @deprecated Prefer {@link ERC1155_INVENTORY_TUNING}.LOG_LOOKBACK_BLOCKS */
export const ERC1155_DEFAULT_LOOKBACK_BLOCKS = ERC1155_INVENTORY_TUNING.LOG_LOOKBACK_BLOCKS;

/** @deprecated Prefer {@link ERC1155_INVENTORY_TUNING}.LOG_BLOCK_CHUNK_SIZE */
export const ERC1155_LOG_CHUNK_BLOCKS = ERC1155_INVENTORY_TUNING.LOG_BLOCK_CHUNK_SIZE;

/**
 * Rough count of `eth_getLogs` RPCs for a full log scan (four queries per chunk).
 * @param {bigint | number | string} lookbackBlocks
 * @param {bigint | number | string} logChunkBlocks
 */
export function erc1155LogScanApproxGetLogsCalls(lookbackBlocks, logChunkBlocks) {
  const L = BigInt(lookbackBlocks ?? 0);
  const C = BigInt(logChunkBlocks ?? 1n);
  if (L <= 0n || C <= 0n) return 0;
  const chunks = (L + C - 1n) / C;
  return Number(chunks * BigInt(ERC1155_LOG_QUERIES_PER_CHUNK));
}

const ERC1155_BALANCE_ABI = [
  {
    constant: true,
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

const ERC1155_TRANSFER_SINGLE_EVENT = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "operator", type: "address" },
    { indexed: true, name: "from", type: "address" },
    { indexed: true, name: "to", type: "address" },
    { indexed: false, name: "id", type: "uint256" },
    { indexed: false, name: "value", type: "uint256" },
  ],
  name: "TransferSingle",
  type: "event",
};

const ERC1155_TRANSFER_BATCH_EVENT = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "operator", type: "address" },
    { indexed: true, name: "from", type: "address" },
    { indexed: true, name: "to", type: "address" },
    { indexed: false, name: "ids", type: "uint256[]" },
    { indexed: false, name: "values", type: "uint256[]" },
  ],
  name: "TransferBatch",
  type: "event",
};

function toIdStr(v) {
  try {
    return (typeof v === "bigint" ? v : BigInt(String(v))).toString();
  } catch {
    return String(v ?? "");
  }
}

/** Some nodes reject `eth_getLogs` when `toBlock - fromBlock` is too large (e.g. Zeeve: max 10_000). */
function isGetLogsBlockRangeTooLargeError(e) {
  const s = `${e?.message ?? ""} ${e?.error?.message ?? ""} ${typeof e === "string" ? e : ""}`;
  return /maximum.*\b(from|,)?.*to.*\bblocks?\s*distance|blocks?\s+range|exceeds.*maximum|too many blocks|query returned more than/i.test(
    s
  );
}

/**
 * Collect candidate token ids from ERC-1155 transfer logs (received or sent by `owner`).
 * Uses chunked `getPastEvents` like {@link discoverOwnedErc721ViaTransferLogs}.
 *
 * @param {import("web3").default} web3
 * @param {string} collectionAddress
 * @param {string} ownerAddress
 * @param {{
 *   fromBlock?: bigint | number | string,
 *   toBlock?: bigint | number | string,
 *   lookbackBlocks?: bigint | number | string,
 *   blockChunkSize?: bigint | number | string,
 *   extraCandidateIds?: Iterable<string | number | bigint>,
 *   pauseMs?: number,
 * }} [options]
 * @returns {Promise<string[]>} Unique id strings (decimal), sorted numerically after merge
 */
export async function discoverErc1155CandidateIdsFromLogs(web3, collectionAddress, ownerAddress, options = {}) {
  const toBlockOpt = options.toBlock != null ? BigInt(options.toBlock) : null;
  const chunk =
    options.blockChunkSize != null
      ? BigInt(options.blockChunkSize)
      : ERC1155_INVENTORY_TUNING.LOG_BLOCK_CHUNK_SIZE;
  const pauseMs =
    options.pauseMs != null && options.pauseMs !== ""
      ? Math.max(0, Number(options.pauseMs))
      : Math.max(0, Number(ERC1155_INVENTORY_TUNING.LOG_PAUSE_MS_BETWEEN_CHUNKS));

  const collection = web3.utils.toChecksumAddress(collectionAddress);
  const owner = web3.utils.toChecksumAddress(ownerAddress);

  const abi = [...ERC1155_BALANCE_ABI, ERC1155_TRANSFER_SINGLE_EVENT, ERC1155_TRANSFER_BATCH_EVENT];
  const contract = new web3.eth.Contract(abi, collection);

  const latest = BigInt(await web3.eth.getBlockNumber());
  const upper = toBlockOpt != null && toBlockOpt <= latest ? toBlockOpt : latest;

  let fromBlock;
  if (options.fromBlock != null) {
    fromBlock = BigInt(options.fromBlock);
  } else {
    const lookback =
      options.lookbackBlocks != null
        ? BigInt(options.lookbackBlocks)
        : ERC1155_INVENTORY_TUNING.LOG_LOOKBACK_BLOCKS;
    fromBlock = latest >= lookback ? latest - lookback + 1n : 0n;
  }

  const candidates = new Set();

  for (const id of options.extraCandidateIds ?? []) {
    const s = toIdStr(id);
    if (s) candidates.add(s);
  }

  const pushSingle = (evs) => {
    for (const ev of evs) {
      const id = ev.returnValues?.id ?? ev.returnValues?.[3];
      const s = toIdStr(id);
      if (s) candidates.add(s);
    }
  };

  const pushBatch = (evs) => {
    for (const ev of evs) {
      const raw = ev.returnValues?.ids ?? ev.returnValues?.[3];
      const arr = Array.isArray(raw) ? raw : raw != null ? Object.values(raw) : [];
      for (const id of arr) {
        const s = toIdStr(id);
        if (s) candidates.add(s);
      }
    }
  };

  try {
    let chunkEffective = chunk;
    const minChunk = 1000n;
    let from = fromBlock;
    while (from <= upper) {
      const to = from + chunkEffective - 1n > upper ? upper : from + chunkEffective - 1n;
      const fb = Number(from);
      const tb = Number(to);

      try {
        /* Serialize eth_getLogs ({@link ERC1155_LOG_QUERIES_PER_CHUNK} calls per chunk). */
        pushSingle(
          await contract.getPastEvents("TransferSingle", { filter: { to: owner }, fromBlock: fb, toBlock: tb })
        );
        pushSingle(
          await contract.getPastEvents("TransferSingle", { filter: { from: owner }, fromBlock: fb, toBlock: tb })
        );
        pushBatch(
          await contract.getPastEvents("TransferBatch", { filter: { to: owner }, fromBlock: fb, toBlock: tb })
        );
        pushBatch(
          await contract.getPastEvents("TransferBatch", { filter: { from: owner }, fromBlock: fb, toBlock: tb })
        );
      } catch (e) {
        if (isGetLogsBlockRangeTooLargeError(e) && chunkEffective > minChunk) {
          chunkEffective = chunkEffective > 2n * minChunk ? chunkEffective / 2n : minChunk;
          continue;
        }
        throw e;
      }

      from = to + 1n;
      if (pauseMs > 0 && from <= upper) {
        await new Promise((r) => setTimeout(r, pauseMs));
      }
    }
  } catch (e) {
    console.warn("[discoverErc1155CandidateIdsFromLogs] log scan failed — using extras / manual ids only", e);
  }

  const sorted = [...candidates].sort((a, b) => {
    try {
      return BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0;
    } catch {
      return a.localeCompare(b);
    }
  });
  return sorted;
}

/**
 * @param {import("web3").default} web3
 * @param {string} collectionAddress
 * @param {string} ownerAddress
 * @param {string[]} idStrs
 * @param {{ chunkSize?: number }} [opts]
 * @returns {Promise<{ tokenId: bigint, balance: bigint }[]>} Only ids with balance &gt; 0, sorted by token id
 */
export async function fetchErc1155BalancesForIds(web3, collectionAddress, ownerAddress, idStrs, opts = {}) {
  const chunkSize = Math.max(
    1,
    Math.min(40, Number(opts.chunkSize) || Number(ERC1155_INVENTORY_TUNING.BALANCE_OF_CONCURRENCY))
  );
  const contract = new web3.eth.Contract(ERC1155_BALANCE_ABI, collectionAddress);
  const want = ownerAddress;
  const out = [];

  for (let i = 0; i < idStrs.length; i += chunkSize) {
    const slice = idStrs.slice(i, i + chunkSize);
    const rows = await Promise.all(
      slice.map(async (idStr) => {
        try {
          const b = await contract.methods.balanceOf(want, idStr).call();
          const bal = BigInt(String(b ?? "0"));
          if (bal > 0n) return { tokenId: BigInt(idStr), balance: bal };
        } catch {
          /* invalid id or RPC */
        }
        return null;
      })
    );
    for (const r of rows) {
      if (r) out.push(r);
    }
  }

  out.sort((a, b) => (a.tokenId < b.tokenId ? -1 : a.tokenId > b.tokenId ? 1 : 0));
  return out;
}

/**
 * Discover candidate ids from logs, then keep only ids with non-zero balance (current wallet).
 *
 * @param {import("web3").default} web3
 * @param {string} collectionAddress
 * @param {string} ownerAddress
 * @param {{
 *   fromBlock?: bigint | number | string,
 *   toBlock?: bigint | number | string,
 *   lookbackBlocks?: bigint | number | string,
 *   blockChunkSize?: bigint | number | string,
 *   extraCandidateIds?: Iterable<string | number | bigint>,
 *   balanceChunkSize?: number,
 *   skipLogs?: boolean,
 *   pauseMs?: number,
 *   logsWeb3?: import("web3").default,
 * }} [options]
 * `logsWeb3` — optional second provider for `getPastEvents` only (e.g. archive RPC); `balanceOf` still uses `web3`.
 * @returns {Promise<{ tokenId: bigint, balance: bigint }[]>}
 */
export async function loadErc1155HoldingsFromChain(web3, collectionAddress, ownerAddress, options = {}) {
  const logsWeb3 = options.logsWeb3 ?? web3;
  if (options.skipLogs) {
    const raw = [...(options.extraCandidateIds ?? [])]
      .map((x) => toIdStr(x))
      .filter(Boolean);
    const uniq = [...new Set(raw)];
    if (uniq.length === 0) return [];
    return fetchErc1155BalancesForIds(web3, collectionAddress, ownerAddress, uniq, {
      chunkSize: options.balanceChunkSize,
    });
  }
  const candidates = await discoverErc1155CandidateIdsFromLogs(
    logsWeb3,
    collectionAddress,
    ownerAddress,
    options
  );
  if (candidates.length === 0) return [];
  return fetchErc1155BalancesForIds(web3, collectionAddress, ownerAddress, candidates, {
    chunkSize: options.balanceChunkSize,
  });
}
