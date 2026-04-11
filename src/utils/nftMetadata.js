/**
 * Whitelisted ERC-721 metadata + Shidoscan-indexed holdings (complements `nft721.js` RPC/log flows).
 * Uses `GATEWAYS` / `WHITELISTED_COLLECTIONS` from config; override via optional `options` where noted.
 */

import { GATEWAYS, WHITELISTED_COLLECTIONS } from "../config/config.js";
import { getNftCollectionRegistryEntry } from "../config/nftCollectionRegistry.js";
import { getEnumerableNFTContract } from "./getContract.js";
import { addrEq } from "./helpers.js";
import { resolveTokenUriForFetch } from "./nft721.js";
import { DEFAULT_IPFS_PUBLIC_GATEWAY } from "./ipfs.js";
import { mapWithLimit } from "./mapWithLimit.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Shidoscan (Etherscan-compatible) `tokennfttx` endpoint — no trailing `&`. */
export const SHIDOSCAN_TOKEN_NFT_TX =
  "https://shidoscan.net/api?module=account&action=tokennfttx";

/** Shidoscan `token1155tx` — ERC-1155 transfers (complement to {@link SHIDOSCAN_TOKEN_NFT_TX} / ERC-721). */
export const SHIDOSCAN_TOKEN1155_TX =
  "https://shidoscan.net/api?module=account&action=token1155tx";

/**
 * Unique ERC-1155 token ids that appear in Shidoscan-indexed transfers for this wallet + contract.
 * Does not prove current balance — confirm with on-chain `balanceOf` / `fetchErc1155BalancesForIds` in skjs.
 *
 * @param {string} account
 * @param {string} contractAddress
 * @param {{ offset?: number, page?: number, signal?: AbortSignal }} [options]
 * @returns {Promise<string[]>} decimal token id strings
 */
export async function fetchShidoscanErc1155CandidateTokenIds(account, contractAddress, options = {}) {
  const offset = options.offset ?? 5000;
  const page = options.page ?? 1;
  const acc = String(account).toLowerCase();
  const ca = String(contractAddress);
  const url = `${SHIDOSCAN_TOKEN1155_TX}&address=${encodeURIComponent(acc)}&contractaddress=${encodeURIComponent(ca)}&page=${page}&offset=${offset}&sort=asc`;

  const res = await fetch(url, { signal: options.signal });
  if (!res.ok) throw new Error(`Shidoscan HTTP ${res.status}`);
  const data = await res.json();

  if (String(data.status) === "0") {
    const msg = String(data.message || "");
    if (
      /no transactions found|no record|not found|invalid action|no token transfers found/i.test(msg)
    ) {
      return [];
    }
    if (typeof data.result === "string") throw new Error(data.result || msg);
    return [];
  }

  if (!Array.isArray(data.result)) return [];

  const ids = new Set();
  const caLower = ca.toLowerCase();
  for (const tx of data.result) {
    const rc = String(tx.contractAddress ?? "").toLowerCase();
    if (rc && rc !== caLower) continue;
    const id = String(tx.tokenID ?? tx.tokenId ?? "");
    if (id) ids.add(id);
  }
  return [...ids];
}

/**
 * Token IDs the indexer attributes to this wallet for one NFT contract (last `to` per token wins).
 * Uses the same API as the Shidoscan UI; large holders may need `offset` / `page` pagination.
 *
 * @param {string} account wallet 0x…
 * @param {string} contractAddress NFT contract
 * @param {{ offset?: number, page?: number, signal?: AbortSignal }} [options] default offset 5000
 * @returns {Promise<string[]>} token ID strings
 */
export async function fetchShidoscanOwnedTokenIds(account, contractAddress, options = {}) {
  const offset = options.offset ?? 5000;
  const page = options.page ?? 1;
  const acc = String(account).toLowerCase();
  const ca = String(contractAddress);
  const url = `${SHIDOSCAN_TOKEN_NFT_TX}&address=${encodeURIComponent(acc)}&contractaddress=${encodeURIComponent(ca)}&page=${page}&offset=${offset}&sort=asc`;

  const res = await fetch(url, { signal: options.signal });
  if (!res.ok) throw new Error(`Shidoscan HTTP ${res.status}`);
  const data = await res.json();

  if (String(data.status) === "0") {
    const msg = String(data.message || "");
    if (/no transactions found|no record/i.test(msg)) return [];
    if (typeof data.result === "string") throw new Error(data.result || msg);
    return [];
  }

  if (!Array.isArray(data.result)) return [];

  const ownedTokenMap = {};
  for (const tx of data.result) {
    const tokenId = String(tx.tokenID ?? tx.tokenId ?? "");
    if (!tokenId) continue;
    const to = String(tx.to || "").toLowerCase();
    ownedTokenMap[tokenId] = to === acc;
  }

  return Object.entries(ownedTokenMap)
    .filter(([, isOwned]) => isOwned)
    .map(([tokenId]) => tokenId);
}

const SHIDOSHI_COLLECTION = "0x5782fDaA53bAB4625B2ABf51aE73eb6228Bf6Ec8";
const SHIDOSHI_IMAGE_BASE =
  "https://shidodutch.com/wp-content/uploads/2025/04/NFT/images/";
const SHIDOSHI_JSON_BASE =
  "https://shidodutch.com/wp-content/uploads/2025/04/NFT/json/";

function gatewayFor(collectionAddress, gateways = GATEWAYS) {
  const found = Object.entries(gateways).find(
    ([k]) => k.toLowerCase() === String(collectionAddress).toLowerCase()
  );
  return found?.[1] || DEFAULT_IPFS_PUBLIC_GATEWAY;
}

/**
 * Legacy helper: pull IPFS path / CID fragment for gateway concatenation (incl. subdomain gateways).
 * @deprecated Prefer `resolveTokenUriForFetch` for `ipfs://` when possible.
 */
export function extractIPFSHash(uri, tokenId) {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) return uri.slice(7);
  const pathMatch = uri.match(/\/ipfs\/([^/?#]+)/);
  if (pathMatch) return pathMatch[1];
  const subdomainMatch = uri.match(/^https?:\/\/([a-z0-9]+)\.ipfs\.[^/]+/i);
  if (subdomainMatch) return `${subdomainMatch[1]}/${tokenId}.json`;
  return uri;
}

export function transformImageURI(uri, collection, tokenId) {
  if (addrEq(collection, SHIDOSHI_COLLECTION)) {
    return `${SHIDOSHI_IMAGE_BASE}${tokenId}.png`;
  }
  const hash = extractIPFSHash(uri, tokenId);
  const gw = gatewayFor(collection);
  if (!hash) return uri || "";
  if (String(hash).startsWith("http")) return hash;
  return `${gw.replace(/\/$/, "")}/${hash}`;
}

async function fetchShidoshiJson(tokenId) {
  const url = `${SHIDOSHI_JSON_BASE}${tokenId}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
}

/**
 * @param {string} uri tokenURI from contract
 * @param {string} collection contract address (checks gateway + Shidoshi override)
 * @param {string|number|bigint} tokenId
 * @param {{ gateways?: Record<string, string> }} [opts]
 */
export async function fetchIPFSMetadata(uri, collection, tokenId, opts = {}) {
  const gateways = opts.gateways ?? GATEWAYS;
  if (addrEq(collection, SHIDOSHI_COLLECTION)) {
    return fetchShidoshiJson(tokenId);
  }
  const u = String(uri || "").trim();
  if (!u) throw new Error("empty tokenURI");

  const gw = gatewayFor(collection, gateways);
  let url;
  if (u.startsWith("http://") || u.startsWith("https://")) {
    url = u;
  } else {
    url = resolveTokenUriForFetch(u, gw);
  }
  if (!url) throw new Error("could not resolve metadata URL");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
}

/**
 * Holdings keyed by collection address → token ID strings, using Shidoscan `tokennfttx`
 * (last transfer per token in ascending list wins — same as legacy behavior).
 *
 * @param {string} account wallet (0x…)
 * @param {{ whitelistedCollections?: Record<string, string>, signal?: AbortSignal, delayMsBetweenCollections?: number, shidoscanOffset?: number }} [options]
 */
export async function fetchNFTsFromTransactions(account, options = {}) {
  const collections = options.whitelistedCollections ?? WHITELISTED_COLLECTIONS;
  const holdings = {};
  const acc = String(account).toLowerCase();
  const delayMs =
    options.delayMsBetweenCollections != null
      ? Math.max(0, Number(options.delayMsBetweenCollections))
      : 0;

  for (const collectionAddress of Object.keys(collections)) {
    try {
      const ownedTokenIds = await fetchShidoscanOwnedTokenIds(account, collectionAddress, {
        offset: options.shidoscanOffset ?? 5000,
        page: 1,
        signal: options.signal,
      });

      if (ownedTokenIds.length > 0) {
        holdings[collectionAddress] = ownedTokenIds;
      }
    } catch (err) {
      if (err?.name === "AbortError") throw err;
      console.warn(`Failed to fetch transactions for ${collectionAddress}`, err?.message || err);
    }
    if (delayMs > 0) await sleep(delayMs);
  }

  return holdings;
}

/**
 * @param {import("web3").default} web3
 * @param {string} account
 * @param {{ whitelistedCollections?: Record<string, string>, getEnumerableNFTContract?: typeof getEnumerableNFTContract, signal?: AbortSignal, delayBetweenCollectionsMs?: number, delayMsBetweenCollections?: number, delayMetadataBetweenCollectionsMs?: number, metadataConcurrency?: number }} [options]
 */
export async function fetchUserNFTsAcrossCollections(web3, account, options = {}) {
  const collections = options.whitelistedCollections ?? WHITELISTED_COLLECTIONS;
  const getContractFn = options.getEnumerableNFTContract ?? getEnumerableNFTContract;
  const allNFTs = [];
  const delayBetween =
    options.delayMetadataBetweenCollectionsMs != null
      ? Math.max(0, Number(options.delayMetadataBetweenCollectionsMs))
      : 0;

  try {
    const scanDelay =
      options.delayMsBetweenCollections != null
        ? Math.max(0, Number(options.delayMsBetweenCollections))
        : options.delayBetweenCollectionsMs != null
          ? Math.max(0, Number(options.delayBetweenCollectionsMs))
          : 400;
    const holds = await fetchNFTsFromTransactions(account, {
      whitelistedCollections: collections,
      signal: options.signal,
      delayMsBetweenCollections: scanDelay,
    });

    for (const [collectionAddress, tokenIds] of Object.entries(holds)) {
      if (!(collectionAddress in collections)) continue;
      const row = getNftCollectionRegistryEntry(collectionAddress);
      const symbol = row?.symbol || collections[collectionAddress] || "";
      try {
        const contract = await getContractFn(web3, collectionAddress);
        const metadata = await getMultipleNFTsMetadata(
          web3,
          collectionAddress,
          tokenIds,
          contract,
          getContractFn,
          { concurrency: options.metadataConcurrency ?? 3 }
        );
        const enriched = metadata.map((nft) => ({
          ...nft,
          collectionAddress,
          symbol,
        }));
        allNFTs.push(...enriched);
      } catch (err) {
        console.warn(`Error loading metadata for ${symbol}`, err);
      }
      if (delayBetween > 0) await sleep(delayBetween);
    }
  } catch (err) {
    console.error("Unable to fetch holdings:", err);
  }

  return allNFTs;
}

/**
 * @param {import("web3").default} web3
 * @param {{ nftAddress: string, tokenId: string|number|bigint }[]} auctions
 * @param {{ getEnumerableNFTContract?: typeof getEnumerableNFTContract }} [options]
 */
export async function fetchAuctionNFTMetadata(web3, auctions, options = {}) {
  const getContractFn = options.getEnumerableNFTContract ?? getEnumerableNFTContract;
  const enriched = await Promise.all(
    auctions.map(async (auction) => {
      try {
        const { nftAddress, tokenId } = auction;
        const contract = await getContractFn(web3, nftAddress);
        const uri = await contract.methods.tokenURI(tokenId).call();
        const metadata = await fetchIPFSMetadata(uri, nftAddress, tokenId);
        metadata.image = transformImageURI(metadata.image, nftAddress, tokenId);

        return {
          auction,
          metadata: {
            ...metadata,
            tokenId: tokenId.toString(),
            collectionAddress: nftAddress,
          },
        };
      } catch (err) {
        console.warn("Failed to load metadata for auction", auction, err);
        return null;
      }
    })
  );

  return enriched.filter(Boolean);
}

export async function getNFTMetadataById(
  web3,
  contractAddress,
  tokenId,
  getNFTContractFn = getEnumerableNFTContract
) {
  const contract = await getNFTContractFn(web3, contractAddress);
  const tokenURI = await contract.methods.tokenURI(tokenId).call();
  const metadata = await fetchIPFSMetadata(tokenURI, contractAddress, tokenId);
  metadata.image = transformImageURI(metadata.image, contractAddress, tokenId);

  return {
    tokenId,
    ...metadata,
  };
}

export async function getMultipleNFTsMetadata(
  web3,
  contractAddress,
  tokenIds,
  contractInstance = null,
  getNFTContractFn = getEnumerableNFTContract,
  opts = {}
) {
  const contract =
    contractInstance || (await getNFTContractFn(web3, contractAddress));
  const concurrency = Math.max(1, Math.min(12, Number(opts.concurrency) || 3));

  return (
    await mapWithLimit(tokenIds, concurrency, async (tokenId) => {
      try {
        const tokenURI = await contract.methods.tokenURI(tokenId).call();
        const metadata = await fetchIPFSMetadata(tokenURI, contractAddress, tokenId);

        if (addrEq(contractAddress, SHIDOSHI_COLLECTION)) {
          metadata.image = transformImageURI(tokenURI, contractAddress, tokenId);
        } else {
          metadata.image = transformImageURI(metadata.image, contractAddress, tokenId);
        }

        return {
          tokenId,
          ...metadata,
        };
      } catch (e) {
        console.warn(`Failed to fetch metadata for token ${tokenId}`, e?.message || e);
        return null;
      }
    })
  ).filter(Boolean);
}

export async function getNFTOwner(
  web3,
  contractAddress,
  tokenId,
  getNFTContractFn = getEnumerableNFTContract
) {
  const contract = await getNFTContractFn(web3, contractAddress);
  const owner = await contract.methods.ownerOf(tokenId).call();
  return owner.toLowerCase();
}
