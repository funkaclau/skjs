/**
 * ERC-1155 inventory discovery: candidate ids from TransferSingle / TransferBatch logs,
 * then confirmed with balanceOf(owner, id).
 *
 * Browser note: many archive RPCs block CORS or 429 on heavy eth_getLogs — default to a **recent
 * lookback** and **small chunks**; there is no ERC-1155 equivalent to ERC-721 `balanceOf(address)` (one
 * number for the whole wallet); balances are always per `(owner, id)`.
 */

/** Default blocks to scan backward from latest when `fromBlock` is omitted (not full chain history). */
export const ERC1155_DEFAULT_LOOKBACK_BLOCKS = 2_000_000n;

/** Smaller than ERC-721 default — fewer logs per eth_getLogs, less 429 / payload blowups in the browser. */
export const ERC1155_LOG_CHUNK_BLOCKS = 10_000n;

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
    options.blockChunkSize != null ? BigInt(options.blockChunkSize) : ERC1155_LOG_CHUNK_BLOCKS;
  const pauseMs = Math.max(0, Number(options.pauseMs) || 0);

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
      options.lookbackBlocks != null ? BigInt(options.lookbackBlocks) : ERC1155_DEFAULT_LOOKBACK_BLOCKS;
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
    let from = fromBlock;
    while (from <= upper) {
      const to = from + chunk - 1n > upper ? upper : from + chunk - 1n;
      const fb = Number(from);
      const tb = Number(to);

      /* Serialize eth_getLogs — parallel bursts often trigger 429 / CORS failures on public RPCs. */
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
  const chunkSize = Math.max(1, Math.min(40, Number(opts.chunkSize) || 28));
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
 *   blockChunkSize?: bigint | number | string,
 *   extraCandidateIds?: Iterable<string | number | bigint>,
 *   balanceChunkSize?: number,
 *   skipLogs?: boolean,
 *   lookbackBlocks?: bigint | number | string,
 *   blockChunkSize?: bigint | number | string,
 *   pauseMs?: number,
 * }} [options]
 * @returns {Promise<{ tokenId: bigint, balance: bigint }[]>}
 */
export async function loadErc1155HoldingsFromChain(web3, collectionAddress, ownerAddress, options = {}) {
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
  const candidates = await discoverErc1155CandidateIdsFromLogs(web3, collectionAddress, ownerAddress, options);
  if (candidates.length === 0) return [];
  return fetchErc1155BalancesForIds(web3, collectionAddress, ownerAddress, candidates, {
    chunkSize: options.balanceChunkSize,
  });
}
