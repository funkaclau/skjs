import {
  toChecksumOrNull, toRaw, fromRaw, price1Per0_from_sqrtP,
  encodePathExactIn, encodePathExactOut,
  getMetaCached, getWshidoUsdOracle, resolveUsdPerToken,
  midOutPerIn_from_slot0,
  shortSym, selectRouteKeepingPayToken, fmt8, floorTo, poolMetaCache,
  getDisplayPairSymbols, fmtUSD
} from "../price";
import { PRESET_POOLS } from "../../config/markets";
/* ---------------- list USD across pools ---------------- */
async function usdPerTokenViaThisPool(web3, bench, poolMeta, tokenAddr) {
    const t0 = poolMeta.token0.address.toLowerCase();
    const t1 = poolMeta.token1.address.toLowerCase();
    const T  = tokenAddr.toLowerCase();
    if (T !== t0 && T !== t1) return null;

    const p_1_per_0 = midOutPerIn_from_slot0(poolMeta.sqrtPriceX96, poolMeta.token0.decimals, poolMeta.token1.decimals);
    const peerAddr   = (T === t0) ? poolMeta.token1.address : poolMeta.token0.address;
    const peerPerTok = (T === t0) ? p_1_per_0 : (1 / p_1_per_0);

    if (peerAddr.toLowerCase() === bench.usdcAddr.toLowerCase()) {
        return { usd: peerPerTok, route: ["USDC (direct)"] };
    }
    if (peerAddr.toLowerCase() === bench.wshidoAddr.toLowerCase()) {
        return { usd: peerPerTok * bench.usdPerWshido, route: ["WSHIDO → USDC (oracle)"] };
    }

    const peerUSD = await resolveUsdPerToken(web3, peerAddr, bench);
    if (!peerUSD) return null;
    return { usd: peerPerTok * peerUSD.usd, route: peerUSD.route };
}

export async function listUsdAcrossPools(web3, bench, tokenAddr) {
    const tokenL = tokenAddr.toLowerCase();

    const results = await Promise.all(
        PRESET_POOLS.map(async (p) => {
        try {
            const m = await getMetaCached(web3, p.address);

            const t0 = m.token0.address.toLowerCase();
            const t1 = m.token1.address.toLowerCase();

            if (t0 !== tokenL && t1 !== tokenL) return null;

            const r = await usdPerTokenViaThisPool(web3, bench, m, tokenAddr);
            if (!r?.usd || !isFinite(r.usd)) return null;

            return {
            pool: p.address,
            meta: m,
            usd: r.usd,
            route: r.route
            };

        } catch {
            return null;
        }
        })
    );

    const out = results.filter(Boolean);
    out.sort((a, b) => a.usd - b.usd);
    return out;
}

// Fast path for anchored tokens (USDC / WSHIDO)
export function getFastUsd(addr, bench, fallback = null) {
  if (!addr || !bench) return fallback;

  const a = String(addr).toLowerCase();

  if (a === String(bench.usdcAddr || "").toLowerCase()) return 1;
  if (a === String(bench.wshidoAddr || "").toLowerCase()) return bench.usdPerWshido;

  return fallback;
}

// Main resolver with cache (cache passed from caller)
export async function resolveUsdNow({
  web3,
  addr,
  bench,
  cache,      // Map()
  fallback = null,
  resolveUsdPerToken
}) {
  const fast = getFastUsd(addr, bench, fallback);
  if (fast != null) return fast;

  if (!addr || !bench) return null;

  const key = String(addr).toLowerCase();

  if (cache?.has(key)) {
    return cache.get(key);
  }

  try {
    const r = await resolveUsdPerToken(web3, addr, bench);
    const usd = r?.usd ?? null;

    if (cache) cache.set(key, usd);

    return usd;
  } catch {
    if (cache) cache.set(key, null);
    return null;
  }
}

// Fill missing side using price ratio
export function deriveMissingUsdSide(usdIn, usdOut, outPerIn) {
  let inUsd = usdIn;
  let outUsd = usdOut;

  if (!outPerIn || !Number.isFinite(outPerIn) || outPerIn <= 0) {
    return { inUsd, outUsd };
  }

  if (inUsd == null && outUsd != null) {
    inUsd = outUsd * outPerIn;
  } else if (outUsd == null && inUsd != null) {
    outUsd = inUsd / outPerIn;
  }

  return { inUsd, outUsd };
}