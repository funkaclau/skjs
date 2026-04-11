/** Shidoscan Etherscan-compatible API origin (module/action passed in query). */
export const SHIDOSCAN_API_ORIGIN = "https://shidoscan.net/api";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * JSON GET with backoff on 429 / 5xx / timeout — use for Shidoscan from browsers.
 */
export async function fetchShidoscanJsonWithRetry(url, opts = {}) {
  const {
    retries = 6,
    baseDelayMs = 700,
    maxDelayMs = 6000,
    timeoutMs = 15000,
    signal,
  } = opts;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await Promise.race([
        fetch(url, { headers: { Accept: "application/json" }, signal }),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), timeoutMs)),
      ]);

      if (res.status === 429) {
        const ra = res.headers.get("retry-after");
        const retryAfterMs = ra ? Number(ra) * 1000 : 0;
        const delay = Math.min(
          maxDelayMs,
          Math.max(retryAfterMs, baseDelayMs * Math.pow(2, attempt))
        );
        await sleep(delay);
        continue;
      }

      if (!res.ok) {
        if (res.status >= 500 && attempt < retries) {
          const delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
          await sleep(delay);
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json();
    } catch (e) {
      if (attempt >= retries) throw e;
      const delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
      await sleep(delay);
    }
  }

  throw new Error("unreachable");
}

const TX_CACHE = new Map();

/**
 * Cached `tokennfttx` payload per wallet + contract (2 min TTL).
 */
export async function fetchTokenNftTxHistory({ account, contractAddress, page = 1, offset = 300, sort = "asc" }) {
  const a = account.toLowerCase();
  const c = contractAddress.toLowerCase();
  const cacheKey = `${a}-${c}`;

  const cached = TX_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.ts < 2 * 60 * 1000) {
    return cached.data;
  }

  const url =
    `${SHIDOSCAN_API_ORIGIN}?module=account&action=tokennfttx` +
    `&address=${a}&contractaddress=${c}&page=${page}&offset=${offset}&sort=${sort}`;

  const data = await fetchShidoscanJsonWithRetry(url, { retries: 6 });
  TX_CACHE.set(cacheKey, { ts: Date.now(), data });
  return data;
}
