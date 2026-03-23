// src/hooks/markets/useMarketsOverview.js
// JS ONLY. Derives token universe from PRESET_POOLS and computes best buy/sell (USD) across pools.
// Landing-friendly, fast, and works with your current swap primitives.

import { useCallback, useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import { multicallPools } from "../../utils/multicallPools";
import { RPC_URL, PRESET_POOLS, prettySymbol } from "../../config/markets";

// Reuse your existing utils from swap
import {
  getMetaCached,
  getWshidoUsdOracle,
  resolveUsdPerToken,
  midOutPerIn_from_slot0,
  fmt8,
  floorTo,
} from "../../utils/price";

// ---------- helpers ----------
const addrEq = (a, b) => (a && b) ? a.toLowerCase() === b.toLowerCase() : false;
// dir meaning in your swap:
// 0to1 => token0 in, token1 out
// 1to0 => token1 in, token0 out
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

function safeNum(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : null;
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

async function listUsdAcrossPools(web3, bench, tokenAddr, poolMetas) {
  const out = [];
  const targetT = tokenAddr.toLowerCase();

  // 1. Get ALL raw prices for this token across ALL pools it lives in
  const rawPrices = poolMetas.map((item) => {
    const meta = item?.meta;
    if (!meta?.token0?.address || !meta?.token1?.address) return null;

    const t0 = meta.token0.address.toLowerCase();
    const t1 = meta.token1.address.toLowerCase();
    
    if (t0 !== targetT && t1 !== targetT) return null;

    const p1per0 = midOutPerIn_from_slot0(meta.sqrtPriceX96, meta.token0.decimals, meta.token1.decimals);
    if (!Number.isFinite(p1per0) || p1per0 <= 0) return null;

    const isT0 = t0 === targetT;
    return { 
      pool: item.pool, 
      meta, 
      peerAddr: isT0 ? t1 : t0, 
      priceInPeer: isT0 ? p1per0 : 1 / p1per0 
    };
  }).filter(Boolean);

  // 2. Convert raw prices to USD by finding ANY path to an anchor
  for (const p of rawPrices) {
    let peerUsd = 0;

    // Direct Anchor
    if (addrEq(p.peerAddr, bench.usdcAddr)) {
      peerUsd = 1;
    } else if (addrEq(p.peerAddr, bench.wshidoAddr)) {
      peerUsd = bench.usdPerWshido;
    } else {
      // Indirect: Search poolMetas for a pool that connects this peer to an anchor
      const connection = poolMetas.find(m => {
        const mt0 = m.meta.token0.address;
        const mt1 = m.meta.token1.address;
        const hasPeer = addrEq(mt0, p.peerAddr) || addrEq(mt1, p.peerAddr);
        const hasAnchor = addrEq(mt0, bench.usdcAddr) || addrEq(mt1, bench.usdcAddr) || 
                          addrEq(mt0, bench.wshidoAddr) || addrEq(mt1, bench.wshidoAddr);
        return hasPeer && hasAnchor;
      });

      if (connection) {
        const c0 = connection.meta.token0;
        const c1 = connection.meta.token1;
        const cPrice1per0 = midOutPerIn_from_slot0(connection.meta.sqrtPriceX96, c0.decimals, c1.decimals);
        
        const peerIs0 = addrEq(c0.address, p.peerAddr);
        const anchorAddr = peerIs0 ? c1.address : c0.address;
        const anchorPrice = peerIs0 ? cPrice1per0 : 1 / cPrice1per0;
        const anchorUsd = addrEq(anchorAddr, bench.usdcAddr) ? 1 : bench.usdPerWshido;
        
        peerUsd = anchorPrice * anchorUsd;
      }
    }

    if (peerUsd > 0) {
      out.push({
        pool: p.pool,
        meta: p.meta,
        usd: p.priceInPeer * peerUsd
      });
    }
  }

  return out.sort((a, b) => a.usd - b.usd);
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

export function useMarketsOverview() {
  const [web3] = useState(() => new Web3(new Web3.providers.HttpProvider(RPC_URL, { timeout: 15_000 })));

  const [bench, setBench] = useState(null); // { wshidoAddr, usdcAddr, usdPerWshido }
  const [poolMetas, setPoolMetas] = useState([]); // [{ pool, meta }]
  const [rows, setRows] = useState([]); // computed tokens overview

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [onlyArb, setOnlyArb] = useState(false);
  const [minSpread, setMinSpread] = useState(1); // %

  const [sortKey, setSortKey] = useState(() => localStorage.getItem("mk_sortKey") || "spread");
    const [sortDir, setSortDir] = useState(() => localStorage.getItem("mk_sortDir") || "desc");

    useEffect(() => localStorage.setItem("mk_sortKey", sortKey), [sortKey]);
    useEffect(() => localStorage.setItem("mk_sortDir", sortDir), [sortDir]);


  // --- load bench ---
  useEffect(() => {
    (async () => {
      try {
        const b = await getWshidoUsdOracle(web3);
        setBench(b);
      } catch (e) {
        setBench(null);
      }
    })();
  }, [web3]);

  // --- load pool metas (once bench exists OR not needed, but we do it immediately) ---
  useEffect(() => {
    (async () => {

      setLoading(true);
      setError("");

      try {

        const poolConfigs = PRESET_POOLS
          .filter(p => p.address && Web3.utils.isAddress(p.address));

        const pools = poolConfigs.map(p => p.address);

        const metas = await multicallPools(web3, pools);
        console.log(metas)

        // after multicallPools returns metas
        const list = metas
          .map((m, i) => {
            if (!m) return null;
            // Fallback symbols if metadata fails to prevent pool dropping
            const t0 = {
              ...m.token0,
              symbol: m.token0?.symbol || m.token0.address.slice(0, 6),
              decimals: m.token0?.decimals || 18
            };
            const t1 = {
              ...m.token1,
              symbol: m.token1?.symbol || m.token1.address.slice(0, 6),
              decimals: m.token1?.decimals || 18
            };

            return {
              pool: pools[i],
              meta: { ...m, token0: t0, token1: t1 },
              label: poolConfigs[i].label
            };
          })
          .filter(Boolean);

        setPoolMetas(list);

      } catch (e) {

        console.error("Pool load error", e);
        setError(e?.message || "Failed to load pools");

      } finally {

        setLoading(false);

      }

    })();
  }, [web3]);

  // --- derive token universe from pool metas, only after token metadata is loaded ---
  const tokens = useMemo(() => {
    const t = [];
    poolMetas.forEach(({ meta }) => {
      if (meta.token0.address) t.push(meta.token0);
      if (meta.token1.address) t.push(meta.token1);
    });
    return uniqBy(t, (x) => x.address.toLowerCase());
  }, [poolMetas]);
  
  const refresh = useCallback(async () => {
    if (!bench || poolMetas.length === 0) return;

    // only proceed if all pool tokens have metadata
    const readyTokens = tokens.filter(
      (tok) => tok.decimals != null && tok.symbol
    );
    if (readyTokens.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const results = await Promise.all(
        readyTokens.map(async (tok) => {
          try {
            if (addrEq(tok.address, bench.usdcAddr)) return null;
            if (addrEq(tok.address, bench.wshidoAddr)) return null;

            const routes = await listUsdAcrossPools(
              web3,
              bench,
              tok.address,
              poolMetas
            );

            if (!routes || routes.length === 0) return null;

            const bestBuy = routes[0];
            const bestSell = routes[routes.length - 1];

            const buyUsd = Number(bestBuy?.usd);
            const sellUsd = Number(bestSell?.usd);

            const spreadPct =
              Number.isFinite(buyUsd) && buyUsd > 0 && Number.isFinite(sellUsd)
                ? ((sellUsd / buyUsd) - 1) * 100
                : null;

            const buyDir = dirForAction(bestBuy.meta, tok.address, "buy");
            const sellDir = dirForAction(bestSell.meta, tok.address, "sell");

            const buyUrl = makeSwapLink({ pool: bestBuy.pool, dir: buyDir });
            const sellUrl = makeSwapLink({ pool: bestSell.pool, dir: sellDir });

            return {
              token: tok,
              routes,
              bestBuy,
              bestSell,
              usdBuy: buyUsd,
              usdSell: sellUsd,
              spreadPct,
              buyUrl,
              sellUrl,
              dex: null
            };
          } catch (e) {
            console.warn("Token compute failed", tok.symbol, e);
            return null;
          }
        })
      );

      setRows(results.filter(Boolean).sort((a, b) => (b.spreadPct ?? -1) - (a.spreadPct ?? -1)));
    } catch (e) {
      setError(e?.message || "Failed to compute markets");
    } finally {
      setLoading(false);
    }
  }, [bench, tokens, web3, poolMetas]);

  useEffect(() => { refresh(); }, [refresh]);

    const filtered = useMemo(() => {
    let r = [...rows];

    const q = (search || "").trim().toLowerCase();
    if (q) {
        r = r.filter(x =>
        (x.token.symbol || "").toLowerCase().includes(q) ||
        (x.token.address || "").toLowerCase().includes(q)
        );
    }

    if (onlyArb) {
        r = r.filter(x => (x.spreadPct ?? 0) >= Number(minSpread || 0));
    }

    // ✅ sorting (after filtering)
    const dir = sortDir === "asc" ? 1 : -1;
    const get = (x) => {
        if (sortKey === "spread") return x.spreadPct ?? -1;
        if (sortKey === "change24h") return x.dex?.change24h ?? -999999;
        if (sortKey === "volume24h") return x.dex?.volume24h ?? -1;
        if (sortKey === "tvl") return x.dex?.tvl ?? -1;
        return x.spreadPct ?? -1;
    };

    r.sort((a, b) => (get(a) - get(b)) * dir);

    return r;
    }, [rows, search, onlyArb, minSpread, sortKey, sortDir]);


  return {
    // state
    loading,
    error,

    bench,
    poolMetas,
    tokens,

    // results
    rows: filtered,

    // controls
    search, setSearch,
    onlyArb, setOnlyArb,
    minSpread, setMinSpread,
    // actions
    refresh,
        sortKey, setSortKey,
sortDir, setSortDir,
  };
}
