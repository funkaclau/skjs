const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch with retries on 429 / 5xx (IPFS and public APIs).
 */
export async function fetchRetry(url, init = {}, opts = {}) {
  const {
    retries = 4,
    baseDelay = 600,
    maxDelay = 8000,
    jitter = 250,
    retryOn = (res) => res && (res.status === 429 || res.status >= 500),
  } = opts;

  let lastErr;

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, init);

      if (!retryOn(res)) return res;

      const ra = res.headers?.get?.("retry-after");
      const retryAfterMs = ra ? Number(ra) * 1000 : 0;

      const delay =
        Math.min(maxDelay, retryAfterMs || baseDelay * 2 ** i) + Math.floor(Math.random() * jitter);

      await sleep(delay);
      continue;
    } catch (e) {
      lastErr = e;
      const delay = Math.min(maxDelay, baseDelay * 2 ** i) + Math.floor(Math.random() * jitter);
      await sleep(delay);
    }
  }

  throw lastErr || new Error("fetchRetry failed");
}
