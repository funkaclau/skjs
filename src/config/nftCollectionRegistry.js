/**
 * Single source of truth for Shido mainnet NFT collections (on-chain addresses, names, optional UI hints).
 * Drives {@link WHITELISTED_COLLECTIONS} and {@link GATEWAYS} in `config.js`.
 *
 * **Collection banners:** PNGs live under `src/config/assets/nftCollections/` and are imported in
 * `nftCollectionBanners.js`. The consuming app’s bundler turns those imports into URLs (same idea as
 * shipping images from `src` in any library consumed via Vite/webpack). `getNftCollectionUiMeta` prefers
 * a bundled banner when one exists for the contract.
 *
 * **`coverPath` on each row:** optional extra URL or host-relative path — absolute `https://…` overrides the
 * bundled banner; other values are passed through `resolveNftCollectionCoverUrl` (e.g. with
 * `publicAssetBase` from the host app).
 */

import { getBundledNftCollectionBannerUrl } from "./nftCollectionBanners.js";

export { getBundledNftCollectionBannerUrl } from "./nftCollectionBanners.js";

/** @typedef {{ address: string, name: string, symbol?: string, standard?: string, coverPath?: string | null, featured?: boolean, tags?: string[], ipfsGateway?: string | null }} NftCollectionRegistryRow */

/** @type {NftCollectionRegistryRow[]} */
export const NFT_COLLECTION_REGISTRY = [
  {
    address: "0xB0B228476Fa26140e6C8D04d437Cd38f47003fCC",
    name: "PixelTycoons Founders",
    symbol: "PTF",
    standard: "ERC721",
    coverPath: null,
    featured: true,
    tags: ["gaming", "founders"],
    ipfsGateway: "https://maroon-normal-parrotfish-989.mypinata.cloud/ipfs/",
  },
  {
    address: "0xB0B228476Fa26140e6C8D04d437Cd38f47003fCC",
    name: "PixelTycoons1155",
    symbol: "PT",
    standard: "ERC1155",
    coverPath: null,
    featured: true,
    tags: ["gaming"],
    ipfsGateway: "https://maroon-normal-parrotfish-989.mypinata.cloud/ipfs/",
  },
  {
    address: "0x5782fDaA53bAB4625B2ABf51aE73eb6228Bf6Ec8",
    name: "Shidoshi Ninja's",
    symbol: "SHININJA",
    standard: "ERC721",
    coverPath: null,
    tags: [],
    ipfsGateway: null,
  },
  {
    address: "0xDcA08690dEFA9Bbbb0FA21103a5F9E10B545e613",
    name: "Trash Mafia",
    symbol: "TRASH",
    standard: "ERC721",
    coverPath: null,
    tags: [],
    ipfsGateway: null,
  },
  {
    address: "0x4d39eac5e30a1f5559094a6afffe7b232055e632",
    name: "Dead Gang",
    symbol: "TDG",
    standard: "ERC721",
    coverPath: null,
    tags: [],
    ipfsGateway: null,
  },
  {
    address: "0x5DeeaAeC8B51e80C2Fee451bc4dc014E91f9aD4c",
    name: "CRAZY CHICKEN NFT Part 1",
    symbol: "CRA",
    standard: "ERC721",
    coverPath: null,
    tags: [],
    ipfsGateway: null,
  },
  {
    address: "0xD79d58c8e02957AdD6eE40173dB2a3488749D7cD",
    name: "Mango Stickyrice Warriror (Rare)",
    symbol: "MSWR",
    standard: "ERC721",
    coverPath: null,
    tags: [],
    ipfsGateway: null,
  },
  {
    address: "0xcb5004f97de6734819b56a2f413c73d82632f0b2",
    name: "Mango Stickyrice Warrior (Common)",
    symbol: "MSWC",
    standard: "ERC721",
    coverPath: null,
    tags: [],
    ipfsGateway: null,
  },
  {
    address: "0xF8Df8d12024B1f8fA0578Ae166534165EAF87a9C",
    name: "PixelTycoons1155",
    symbol: "PT1155",
    standard: "ERC1155",
    coverPath: null,
    tags: [],
    ipfsGateway: null,
  },
  {
    address: "0xba10879b62d829ddd541bb9aee9654cfa11c8429",
    name: "Shinobi Warriors",
    symbol: "SHINOBI",
    standard: "ERC721",
    coverPath: null,
    tags: [],
    ipfsGateway: null,
  },
  {
    address: "0x8782C1130FEc668724C700380e1DADe9b54F37D7",
    name: "Nerd Operations",
    symbol: "NERDOP",
    standard: "ERC721",
    coverPath: null,
    tags: [],
    ipfsGateway: null,
  },
];

/** Lowercase address → full registry row */
export const NFT_COLLECTION_BY_ADDRESS_LOWER = new Map(
  NFT_COLLECTION_REGISTRY.map((r) => [r.address.toLowerCase(), r])
);

/** `address` (checksummed) → display name — feeds `WHITELISTED_COLLECTIONS` in config. */
export const SHIDO_WHITELISTED_COLLECTIONS = Object.fromEntries(
  NFT_COLLECTION_REGISTRY.map((r) => [r.address, r.name])
);

/** Per-collection IPFS gateway prefix (trailing slash) — feeds `GATEWAYS` in config. */
export const SHIDO_COLLECTION_GATEWAYS = Object.fromEntries(
  NFT_COLLECTION_REGISTRY.filter((r) => r.ipfsGateway).map((r) => [r.address, r.ipfsGateway])
);

/**
 * Turns registry `coverPath` into a string suitable for `<img src>`. Does not fetch or verify the resource.
 * Absolute `http(s)://` values pass through. Otherwise returns `publicAssetBase + path` when `publicAssetBase`
 * is set, or the path alone (root-relative on whatever **host page** loads the consumer app).
 *
 * @param {string | null | undefined} coverPath
 * @param {{ publicAssetBase?: string }} [options] e.g. your deployed origin or CDN (no trailing slash)
 * @returns {string | null}
 */
export function resolveNftCollectionCoverUrl(coverPath, options = {}) {
  if (coverPath == null || coverPath === "") return null;
  const s = String(coverPath).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const base = String(options.publicAssetBase ?? "").replace(/\/$/, "");
  const path = s.startsWith("/") ? s : `/${s}`;
  return base ? `${base}${path}` : path;
}

/**
 * @param {NftCollectionRegistryRow} row
 * @param {{ publicAssetBase?: string }} [options]
 * @returns {string | null}
 */
function resolveCollectionCoverForUi(row, options = {}) {
  const cp = row.coverPath;
  const trimmed = cp != null ? String(cp).trim() : "";
  if (trimmed && /^https?:\/\//i.test(trimmed)) {
    return resolveNftCollectionCoverUrl(cp, options);
  }
  const bundled = getBundledNftCollectionBannerUrl(row.address);
  if (bundled) return bundled;
  return resolveNftCollectionCoverUrl(cp, options);
}

/**
 * @param {string | null | undefined} address
 * @returns {NftCollectionRegistryRow | null}
 */
export function getNftCollectionRegistryEntry(address) {
  if (address == null || address === "") return null;
  return NFT_COLLECTION_BY_ADDRESS_LOWER.get(String(address).toLowerCase()) ?? null;
}

/**
 * @param {string | null | undefined} address
 * @param {{ publicAssetBase?: string }} [options] forwarded to {@link resolveNftCollectionCoverUrl}
 * @returns {{ ca: string, name: string, symbol: string, standard: string, cover: string | null, featured: boolean, tags: string[] } | null}
 */
export function getNftCollectionUiMeta(address, options = {}) {
  const row = getNftCollectionRegistryEntry(address);
  if (!row) return null;
  return {
    ca: row.address,
    name: row.name,
    symbol: row.symbol ?? "",
    standard: row.standard ?? "ERC721",
    cover: resolveCollectionCoverForUi(row, options),
    featured: Boolean(row.featured),
    tags: Array.isArray(row.tags) ? row.tags.filter((t) => t && String(t).trim()) : [],
  };
}

/**
 * @param {{ publicAssetBase?: string }} [options]
 */
export function getNftCollectionListForUi(options = {}) {
  return NFT_COLLECTION_REGISTRY.map((r) => getNftCollectionUiMeta(r.address, options)).filter(Boolean);
}

/**
 * @param {string | null | undefined} address
 * @returns {string | null}
 */
export function getIpfsGatewayForNftCollection(address) {
  const r = getNftCollectionRegistryEntry(address);
  return r?.ipfsGateway ?? null;
}
