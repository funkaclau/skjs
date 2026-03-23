import {midOutPerIn_from_slot0} from "./price";

function dirForAction(poolMeta, tokenAddr, action /* "buy" | "sell" */) {
  const t0 = poolMeta?.token0?.address;
  const t1 = poolMeta?.token1?.address;
  if (!t0 || !t1) return "0to1";

  const is0 = addrEq(tokenAddr, t0);
  const is1 = addrEq(tokenAddr, t1);
  if (!is0 && !is1) return "0to1";

  if (action === "buy") {
    // BUY token => token must be OUT
    return is0 ? "1to0" : "0to1";
  }

  // SELL token => token must be IN
  return is0 ? "0to1" : "1to0";
}

function makeSwapLink({ pool, dir, mode = "exactIn", inv = 0, slip = 50, dl = 300 }) {
  const sp = new URLSearchParams();
  sp.set("pool", pool);
  sp.set("mode", mode);
  sp.set("dir", dir);
  sp.set("inv", String(inv));
  sp.set("slip", String(slip));
  sp.set("dl", String(dl));
  return `/swap?${sp.toString()}`;
}

function uniqBy(arr, keyFn) {
  const m = new Map();
  for (const x of arr) m.set(keyFn(x), x);
  return [...m.values()];
}

async function resolveUsdFromPools(tokenAddr, bench, poolMetas, visited = new Set()) {
  const T = tokenAddr.toLowerCase();
  if (visited.has(T)) return { usd: 1, route: ["fallback-loop"] };

  const nextVisited = new Set(visited);
  nextVisited.add(T);

  let best = null;

  for (const { meta } of poolMetas) {
    const t0 = meta?.token0;
    const t1 = meta?.token1;
    if (!t0?.address || !t0?.decimals || !t1?.address || !t1?.decimals) continue;

    const t0Addr = t0.address.toLowerCase();
    const t1Addr = t1.address.toLowerCase();

    let peer = null;
    let peerPerToken = null;

    const p1per0 = midOutPerIn_from_slot0(meta.sqrtPriceX96, t0.decimals, t1.decimals);
    if (!Number.isFinite(p1per0) || p1per0 <= 0) continue;

    if (t0Addr === T) {
      peer = t1Addr;
      peerPerToken = p1per0;
    } else if (t1Addr === T) {
      peer = t0Addr;
      peerPerToken = 1 / p1per0;
    }

    if (!peer || !Number.isFinite(peerPerToken)) continue;

    if (addrEq(peer, bench.usdcAddr)) return { usd: peerPerToken, route: ["USDC (direct)"] };
    if (addrEq(peer, bench.wshidoAddr)) return { usd: peerPerToken * bench.usdPerWshido, route: ["WSHIDO → USDC (oracle)"] };

    try {
      const r = await resolveUsdFromPools(peer, bench, poolMetas, nextVisited);
      const usd = (r?.usd ?? 1) * peerPerToken;
      if (!best || usd > best.usd) best = { usd, route: r?.route || [] };
    } catch (e) {
      console.warn("resolveUsdFromPools failed:", tokenAddr, peer, e);
    }
  }

  return best ?? { usd: 1, route: ["fallback"] };
}
// Compute token USD using *this pool* as the local price source, then anchor via USDC or WSHIDO->USDC oracle.
// If peer is neither USDC nor WSHIDO, we ask resolveUsdPerToken(peer) (your existing recursion).
async function usdPerTokenViaPool(web3, bench, poolMeta, tokenAddr, poolMetas) {
  const t0 = poolMeta?.token0;
  const t1 = poolMeta?.token1;
  if (!t0?.address || !t0?.decimals || !t1?.address || !t1?.decimals) return null;

  const T = tokenAddr?.toLowerCase();
  const is0 = t0.address.toLowerCase() === T;
  const is1 = t1.address.toLowerCase() === T;
  if (!is0 && !is1) return null;

  // mid price = token1 per token0
  const p1per0 = midOutPerIn_from_slot0(poolMeta.sqrtPriceX96, t0.decimals, t1.decimals);
  if (!Number.isFinite(p1per0) || p1per0 <= 0) return null;

  const peerAddr = is0 ? t1.address : t0.address;
  const peerPerToken = is0 ? p1per0 : 1 / p1per0;

  if (!peerAddr || !Number.isFinite(peerPerToken)) return null;

  // Anchor via USDC/WSHIDO
  if (addrEq(peerAddr, bench.usdcAddr)) return { usd: peerPerToken, route: ["USDC (direct)"] };
  if (addrEq(peerAddr, bench.wshidoAddr)) return { usd: peerPerToken * bench.usdPerWshido, route: ["WSHIDO → USDC (oracle)"] };

  // Resolve peer USD recursively
  const peerUSD = await resolveUsdFromPools(peerAddr, bench, poolMetas);
  const usd = peerPerToken * (peerUSD?.usd ?? 1);
  return { usd, route: peerUSD?.route || ["fallback"] };
}

    

function makeSwapUrl({ pool, tokenAddr, poolMeta, slip = 50, dl = 300, mode = "exactIn" }) {
  // dir:
  // - if tokenAddr is token0, then buying token0 usually means 1to0, selling token0 means 0to1
  // Landing buttons will decide what token is "focus" and set dir accordingly.
  const sp = new URLSearchParams();
  sp.set("pool", pool);
  sp.set("mode", mode);
  sp.set("slip", String(slip));
  sp.set("dl", String(dl));
  // We leave amt empty so user types it.
  // dir must be set by caller (BUY vs SELL) for clarity.
  return `/swap?${sp.toString()}`;
}

function poolDirForToken(poolMeta, tokenAddr, action /* "buy"|"sell" */) {
  const t0 = poolMeta?.token0?.address;
  const t1 = poolMeta?.token1?.address;
  if (!t0 || !t1) return "0to1";

  const is0 = addrEq(t0, tokenAddr);
  // Convention for landing:
  // - BUY token = pay peer to receive token
  // - SELL token = pay token to receive peer
  // If token is token0:
  //   BUY token0 = 1to0 ; SELL token0 = 0to1
  // If token is token1:
  //   BUY token1 = 0to1 ; SELL token1 = 1to0
  if (is0) return action === "buy" ? "1to0" : "0to1";
  return action === "buy" ? "0to1" : "1to0";
}
