/**
 * ERC-721 helpers for inventory + batch tooling (shared by SKTools, NerdDapp, etc.).
 * NerdDapp’s ERC-1155 “Archives” inventory stays app-specific; this module is ERC-721 only.
 */

import { ipfsToHttp, DEFAULT_IPFS_PUBLIC_GATEWAY } from "./ipfs.js";

/** Includes standard `Transfer` for log-based ownership discovery (non-enumerable contracts). */
export const ERC721_TRANSFER_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];

/** Minimal ABI: enumerable inventory + metadata + operator approvals */
export const ERC721_BATCH_HELPER_ABI = [
  { constant: true, inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], type: "function" },
  { constant: true, inputs: [{ name: "owner", type: "address" }, { name: "index", type: "uint256" }], name: "tokenOfOwnerByIndex", outputs: [{ name: "", type: "uint256" }], type: "function" },
  { constant: true, inputs: [{ name: "tokenId", type: "uint256" }], name: "ownerOf", outputs: [{ name: "", type: "address" }], type: "function" },
  { constant: true, inputs: [{ name: "tokenId", type: "uint256" }], name: "tokenURI", outputs: [{ name: "", type: "string" }], type: "function" },
  { constant: true, inputs: [], name: "name", outputs: [{ name: "", type: "string" }], type: "function" },
  { constant: true, inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], type: "function" },
  { constant: true, inputs: [{ name: "owner", type: "address" }, { name: "operator", type: "address" }], name: "isApprovedForAll", outputs: [{ name: "", type: "bool" }], type: "function" },
  { constant: false, inputs: [{ name: "operator", type: "address" }, { name: "approved", type: "bool" }], name: "setApprovalForAll", outputs: [], type: "function" },
];

/**
 * Parse token id list: "1, 2, 5-8" → bigint[] (order preserved, deduped first-seen).
 * @param {string} s
 * @returns {bigint[]}
 */
export function parseTokenIdsFromString(s) {
  const out = [];
  const seen = new Set();
  const raw = String(s || "")
    .split(/[,;\n]+/)
    .map((x) => x.trim())
    .filter(Boolean);

  for (const part of raw) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((x) => x.trim());
      const start = BigInt(a);
      const end = BigInt(b);
      if (end < start) throw new Error(`Invalid range "${part}" (end < start)`);
      for (let x = start; x <= end; x += 1n) {
        const key = x.toString();
        if (!seen.has(key)) {
          seen.add(key);
          out.push(x);
        }
      }
    } else {
      const x = BigInt(part);
      const key = x.toString();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(x);
      }
    }
  }
  return out;
}

/**
 * @param {import("web3").default} web3
 * @param {string} collectionAddress
 * @param {string} owner
 * @returns {Promise<{ ids: bigint[], enumerable: boolean, balance: bigint }>}
 */
export async function listOwnedErc721TokenIds(web3, collectionAddress, owner) {
  const c = new web3.eth.Contract(ERC721_BATCH_HELPER_ABI, collectionAddress);
  const bal = BigInt(await c.methods.balanceOf(owner).call());
  if (bal === 0n) return { ids: [], enumerable: true, balance: 0n };

  try {
    const ids = [];
    const n = Number(bal);
    for (let i = 0; i < n; i++) {
      const id = await c.methods.tokenOfOwnerByIndex(owner, i).call();
      ids.push(BigInt(id));
    }
    return { ids, enumerable: true, balance: bal };
  } catch {
    return { ids: [], enumerable: false, balance: bal };
  }
}

/**
 * Default block span per `getPastEvents` range (fits typical RPC limits; tune via `blockChunkSize`).
 * @type {bigint}
 */
export const ERC721_TRANSFER_LOG_CHUNK_BLOCKS = 45000n;

/**
 * Confirm which candidate token IDs the wallet still owns (cheap `ownerOf` calls; use after Shidoscan index).
 * @param {import("web3").default} web3
 * @param {string} collectionAddress
 * @param {string} ownerAddress
 * @param {Iterable<string | number | bigint>} candidateIds
 * @returns {Promise<bigint[]>}
 */
export async function filterOwnedErc721TokenIds(web3, collectionAddress, ownerAddress, candidateIds) {
  const contract = new web3.eth.Contract(ERC721_BATCH_HELPER_ABI, collectionAddress);
  const want = ownerAddress.toLowerCase();
  const owned = [];
  for (const id of candidateIds) {
    const idStr = typeof id === "bigint" ? id.toString() : String(id);
    try {
      const o = await contract.methods.ownerOf(idStr).call();
      if (String(o).toLowerCase() === want) owned.push(BigInt(idStr));
    } catch {
      /* burned or invalid */
    }
  }
  owned.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return owned;
}

/**
 * For ERC-721 contracts without `tokenOfOwnerByIndex`, discover candidate token IDs from
 * `Transfer` logs where `to` is the wallet, then verify with `ownerOf`.
 *
 * **Range:** scans **`fromBlock` → `toBlock`** (defaults **genesis → latest**), in chunks of
 * `blockChunkSize` (default {@link ERC721_TRANSFER_LOG_CHUNK_BLOCKS}). There is no time cutoff —
 * only what the node retains. Non-archive RPCs often return **empty** logs for old blocks; use
 * `RPC_URL_ARCHIVE` from config for historical `eth_getLogs`.
 *
 * @param {import("web3").default} web3
 * @param {string} collectionAddress
 * @param {string} ownerAddress
 * @param {{
 *   fromBlock?: bigint | number | string,
 *   toBlock?: bigint | number | string,
 *   blockChunkSize?: bigint | number | string
 * }} [options]
 * @returns {Promise<bigint[]>}
 */
export async function discoverOwnedErc721ViaTransferLogs(web3, collectionAddress, ownerAddress, options = {}) {
  const fromBlock = options.fromBlock != null ? BigInt(options.fromBlock) : 0n;
  const toBlockOpt = options.toBlock != null ? BigInt(options.toBlock) : null;
  const chunk =
    options.blockChunkSize != null ? BigInt(options.blockChunkSize) : ERC721_TRANSFER_LOG_CHUNK_BLOCKS;

  const collection = web3.utils.toChecksumAddress(collectionAddress);
  const owner = web3.utils.toChecksumAddress(ownerAddress);

  const abi = [...ERC721_BATCH_HELPER_ABI, ...ERC721_TRANSFER_EVENT_ABI];
  const contract = new web3.eth.Contract(abi, collection);
  const latest = BigInt(await web3.eth.getBlockNumber());
  const upper = toBlockOpt != null && toBlockOpt <= latest ? toBlockOpt : latest;

  const candidates = new Set();
  let from = fromBlock;
  while (from <= upper) {
    const to = from + chunk - 1n > upper ? upper : from + chunk - 1n;
    const evs = await contract.getPastEvents("Transfer", {
      filter: { to: owner },
      fromBlock: Number(from),
      toBlock: Number(to),
    });
    for (const ev of evs) {
      const id = ev.returnValues.tokenId;
      candidates.add((typeof id === "bigint" ? id : BigInt(id)).toString());
    }
    from = to + 1n;
  }

  const want = ownerAddress.toLowerCase();
  const owned = [];
  for (const idStr of candidates) {
    try {
      const o = await contract.methods.ownerOf(idStr).call();
      if (String(o).toLowerCase() === want) owned.push(BigInt(idStr));
    } catch {
      /* burned or invalid */
    }
  }
  owned.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return owned;
}

/**
 * Resolve ipfs:// or bare CIDs using an optional gateway prefix (no trailing slash).
 * @param {string} uri
 * @param {string} [gatewayPrefix] e.g. from skjs GATEWAYS[address]
 */
export function resolveTokenUriForFetch(uri, gatewayPrefix = "") {
  const u = String(uri || "").trim();
  if (!u) return "";
  if (u.startsWith("ipfs://")) {
    const gw = gatewayPrefix
      ? `${gatewayPrefix.replace(/\/$/, "")}/`
      : DEFAULT_IPFS_PUBLIC_GATEWAY;
    return ipfsToHttp(u, gw);
  }
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (/^Qm[a-zA-Z0-9]+$/.test(u) || u.startsWith("bafy")) {
    return gatewayPrefix
      ? `${gatewayPrefix.replace(/\/$/, "")}/${u}`
      : `${DEFAULT_IPFS_PUBLIC_GATEWAY.replace(/\/$/, "")}/${u}`;
  }
  return u;
}
