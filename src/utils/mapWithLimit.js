/**
 * Map with bounded concurrency (RPC / IPFS friendly).
 * @template T, R
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T, index: number) => Promise<R>} fn
 * @returns {Promise<R[]>}
 */
export async function mapWithLimit(items, limit, fn) {
  const arr = Array.isArray(items) ? items : [];
  const out = new Array(arr.length);
  let i = 0;

  const workers = Array.from({ length: Math.min(Math.max(1, limit), arr.length) }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= arr.length) return;
      out[idx] = await fn(arr[idx], idx);
    }
  });

  await Promise.all(workers);
  return out;
}
