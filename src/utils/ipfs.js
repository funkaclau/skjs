/**
 * Public IPFS gateways (HTTPS). Pinata is a solid default; ipfs.io remains a common fallback.
 * Per-collection overrides still come from `GATEWAYS` in config where you pin your own CID space.
 */
export const IPFS_GATEWAY_PINATA = "https://gateway.pinata.cloud/ipfs/";
export const IPFS_GATEWAY_IPFS_IO = "https://ipfs.io/ipfs/";

/** Default when no app/collection gateway is passed — Pinata first. */
export const DEFAULT_IPFS_PUBLIC_GATEWAY = IPFS_GATEWAY_PINATA;

/**
 * Turn `ipfs://CID/path` into an HTTPS gateway URL.
 * @param {string} uri
 * @param {string} [gateway] trailing slash optional; defaults to {@link DEFAULT_IPFS_PUBLIC_GATEWAY}
 */
export function ipfsToHttp(uri, gateway = DEFAULT_IPFS_PUBLIC_GATEWAY) {
  if (!uri || typeof uri !== "string") return "";
  const m = uri.match(/^ipfs:\/\/(.+)/i);
  if (m) return `${gateway.replace(/\/$/, "")}/${m[1]}`;
  return uri;
}

/**
 * HTTPS URLs to try for an `ipfs://` URI — Pinata first, then ipfs.io (e.g. `<img src={urls[0]} onError` → `urls[1]`).
 * Non-`ipfs://` input returns `[uri]` so callers can still branch.
 * @param {string} uri
 * @returns {string[]}
 */
export function ipfsPublicGatewayUrls(uri) {
  if (!uri || typeof uri !== "string") return [];
  const m = uri.match(/^ipfs:\/\/(.+)/i);
  if (!m) return [uri];
  const path = m[1];
  const join = (gw) => `${gw.replace(/\/$/, "")}/${path}`;
  return [join(IPFS_GATEWAY_PINATA), join(IPFS_GATEWAY_IPFS_IO)];
}

/** @type {Map<string, string>} */
let _memo;
const MEMO_MAX = 512;

/**
 * Memoize resolved gateway URLs for identical `(uri, gateway)` pairs (e.g. grid of NFT thumbs).
 * Does not persist across reloads; for stronger caching use HTTP (gateways send Cache-Control) or a service worker.
 */
export function ipfsToHttpMemoized(uri, gateway = DEFAULT_IPFS_PUBLIC_GATEWAY) {
  const key = `${gateway}\0${uri}`;
  if (!_memo) _memo = new Map();
  const hit = _memo.get(key);
  if (hit !== undefined) return hit;
  const out = ipfsToHttp(uri, gateway);
  if (_memo.size >= MEMO_MAX) {
    const first = _memo.keys().next().value;
    if (first !== undefined) _memo.delete(first);
  }
  _memo.set(key, out);
  return out;
}
