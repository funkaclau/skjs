// src/utils/pricing.js

import { addrEq } from "./helpers.js";

// ⚠️ assume this already exists somewhere
import { midOutPerIn_from_slot0 } from "./price.js";

export async function resolveUsdFromPools(tokenAddr, bench, poolMetas, visited = new Set()) {
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
    if (addrEq(peer, bench.wshidoAddr)) return { usd: peerPerToken * bench.usdPerWshido, route: ["WSHIDO → USDC"] };

    const r = await resolveUsdFromPools(peer, bench, poolMetas, nextVisited);
    const usd = (r?.usd ?? 1) * peerPerToken;

    if (!best || usd > best.usd) best = { usd, route: r?.route || [] };
  }

  return best ?? { usd: 1, route: ["fallback"] };
}