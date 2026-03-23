// src/hooks/swap/useSwapImpactEngine.js
// JS only. Engine hook for SwapImpactWeb3.

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Web3 from "web3";
import { useAccount } from "wagmi";
//import { handleApproveAndRunWeb3, parseAmountToWei } from "../../utils";
import { handleApproveAndRunWeb3, parseAmountToWei } from "skjs";
import { multicallBalances } from "../../utils";
import {TOKEN_ABI} from "../../config/abi";
import {
  RPC_URL, QUOTER_V2, QUOTER_V2_ABI, SWAP_ROUTER_ABI, SWAP_ROUTER_V3,
  DOMINANT_GROUPS, 
} from "../../config/price";
import {
  PRESET_POOLS, POOL_REGISTRY, FULL_TOKEN_LIST
} from "../../config/markets"
import {
  toChecksumOrNull, toRaw, fromRaw, price1Per0_from_sqrtP,
  encodePathExactIn, encodePathExactOut,
  getMetaCached, getWshidoUsdOracle, resolveUsdPerToken,
  midOutPerIn_from_slot0,
  shortSym, selectRouteKeepingPayToken, fmt8, floorTo, poolMetaCache,
  getDisplayPairSymbols, fmtUSD
} from "../../utils/price";

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

const pickMax = (s) => String(s || "").replace(/[^\d.]/g, "");

const ratioOutPerInRaw = (rawOut, rawIn, decOut, decIn) => {
  const out = Number(fromRaw(rawOut, decOut));
  const inn = Number(fromRaw(rawIn, decIn));
  if (!inn || inn <= 0) return 0;
  return out / inn;
};

const ratioInPerOutRaw = (rawIn, rawOut, decIn, decOut) => {
  const inn = Number(fromRaw(rawIn, decIn));
  const out = Number(fromRaw(rawOut, decOut));
  if (!out || out <= 0) return 0;
  return inn / out;
};

const isAnchoredUsd = (addr, bench) => {
  if (!addr || !bench) return false;
  const a = String(addr).toLowerCase();
  return (
    a === String(bench.usdcAddr || "").toLowerCase() ||
    a === String(bench.wshidoAddr || "").toLowerCase()
  );
};


export function useSwapImpactEngine() {
  const historyDebounceRef = useRef(null); // Add this line
  const usdRuntimeCacheRef = useRef(new Map());
  const [web3] = useState(() => new Web3(new Web3.providers.HttpProvider(RPC_URL, { timeout: 15000 })));

  // wallet
  const { address, isConnected } = useAccount();
  const evmAccount = isConnected ? address : null;
  const [writeWeb3, setWriteWeb3] = useState(null);

  // core form
  const [mode, setMode] = useState("exactIn"); 
  const [direction, setDirection] = useState("0to1");
  const [invert, setInvert] = useState(false);
  const [amount, setAmount] = useState("");
  const [poolAddr, setPoolAddr] = useState(PRESET_POOLS[0]?.address ?? "");

  // runtime
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [meta, setMeta] = useState(null);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");

  // USD bench
  const [bench, setBench] = useState(null);

  // USD/token mid cache
  const [usdToken0, setUsdToken0] = useState(null);
  const [usdToken1, setUsdToken1] = useState(null);
  const [usdTokenIn, setUsdTokenIn] = useState(null);
  const [usdTokenOut, setUsdTokenOut] = useState(null);
  const usdInlineCacheRef = useRef(new Map());
  // market refs
  const [routes0, setRoutes0] = useState([]);
  const [routes1, setRoutes1] = useState([]);
  const [dominant, setDominant] = useState(null);

  // controls
  const [slippageBps, setSlippageBps] = useState(50);
  const [deadlineSecs, setDeadlineSecs] = useState(300);

  // UI prefs (persisted)
  const [railCollapsedH, setRailCollapsedH] = usePersistentState("dex:railCollapsedH", false);
  const [usdRefOpen, setUsdRefOpen]         = usePersistentState("dex:usdRefOpen", true);
  const [railFoldV, setRailFoldV]           = usePersistentState("dex:railFoldV", false);
  const [autoRun, setAutoRun]               = usePersistentState("dex:autoRun", true);

  // ui mode (persisted)
  const [uiMode, setUiMode] = usePersistentState("dex:uiMode", "simple"); 
  const [tokenInAddr, setTokenInAddr] = useState(null);
  const [tokenOutAddr, setTokenOutAddr] = useState(null);
  const [pairIndex, setPairIndex] = useState(null);
  // Full routing graph: token pair -> ALL possible edges (multiple pools / fees)
  const [pairEdges, setPairEdges] = useState(null);
  const [knownTokens, setKnownTokens] = useState([]); 
  const [balancesMap, setBalancesMap] = useState({});
  const [balancesLoaded, setBalancesLoaded] = useState(false);
  const feeFrac = useMemo(() => (meta ? Number(meta.fee) / 1_000_000 : 0), [meta]);
  const feePercent = useMemo(() => (meta ? (meta.fee / 10000).toFixed(2) : "—"), [meta]);

// 1. Helper to safely get address string
  const getAddrStr = (val) => (typeof val === "string" ? val : val?.address || "");

  // 2. Direct lookup from state, not from the async meta object
  const displayBalIn = useMemo(() => {
    const addr = getAddrStr(tokenInAddr).toLowerCase();
    if (!addr) return "0";
    return balancesMap[addr] || "0";
  }, [balancesMap, tokenInAddr]);

  const displayBalOut = useMemo(() => {
    const addr = getAddrStr(tokenOutAddr).toLowerCase();
    if (!addr) return "0";
    return balancesMap[addr] || "0";
  }, [balancesMap, tokenOutAddr]);

  // 3. Keep these for internal logic if needed, but displayBalIn/Out are your UI stars
  const bal0 = displayBalIn; 
  const bal1 = displayBalOut;
  
  

  const fetchAllBalances = useCallback(async () => {
    if (!web3 || !evmAccount || typeof evmAccount !== "string") return;

    try {
      const tokenAddresses = FULL_TOKEN_LIST.map(t => t.address);
      const rawBalances = await multicallBalances(web3, evmAccount, tokenAddresses);

      const formattedMap = {};
      FULL_TOKEN_LIST.forEach(token => {
        const addr = token.address.toLowerCase();
        const rawValue = rawBalances[addr] || "0";
        const fullDecimals = fromRaw(rawValue, token.decimals);
        formattedMap[addr] = floorTo(fullDecimals, 4);
      });

      setBalancesMap(formattedMap);
      setBalancesLoaded(true);
    } catch (err) {
      console.error("[fetchAllBalances] failed:", err);
    }
  }, [web3, evmAccount]);

  useEffect(() => {
    if (!evmAccount) return;
    if (balancesLoaded) return;

    fetchAllBalances();
  }, [evmAccount, balancesLoaded, fetchAllBalances]);



  const { base: midBase, quote: midQuote } = getDisplayPairSymbols({ direction, invert, meta });

  const syncAllBalances = fetchAllBalances;

  // signer
  useEffect(() => {
    const eth = window.ethereum ?? null;
    if (eth) setWriteWeb3(new Web3(eth));
  }, []);

    // URL safe updater
  const updateUrl = useCallback((params = {}) => {
    const sp = new URLSearchParams(window.location.search);
    let changed = false;

    for (const key in params) {
      const val = params[key];
      if (val == null || val === "") {
        if (sp.has(key)) {
          sp.delete(key);
          changed = true;
        }
      } else {
        if (sp.get(key) !== String(val)) {
          sp.set(key, val);
          changed = true;
        }
      }
    }

    if (changed) {
      const newUrl = `${window.location.pathname}?${sp.toString()}`;
      
      // OPTIMIZATION: React-safe debounce
      if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
      
      historyDebounceRef.current = setTimeout(() => {
        window.history.replaceState(null, "", newUrl);
      }, 150);
    }
  }, []);


  // keep URL in sync with token in/out for shareable links
  useEffect(() => {
    updateUrl({
      tokenIn: tokenInAddr || "",
      tokenOut: tokenOutAddr || "",
    });
  }, [tokenInAddr, tokenOutAddr, updateUrl]);

  useEffect(() => {
    if (!web3) return;
    (async () => {
      try {
        const metas = [];
        const tMap = new Map();
        
        const validPools = PRESET_POOLS.filter(p => p.address && p.address.startsWith('0x'));
        
        for (const p of validPools) {
          try {
            const m = await getMetaCached(web3, p.address);
            metas.push({ 
              address: p.address, 
              token0: m.token0, 
              token1: m.token1, 
              fee: m.fee 
            });
            
            if (m.token0?.address) tMap.set(m.token0.address.toLowerCase(), { symbol: m.token0.symbol, address: m.token0.address });
            if (m.token1?.address) tMap.set(m.token1.address.toLowerCase(), { symbol: m.token1.symbol, address: m.token1.address });
          } catch (e) {
            console.warn(`Skipping pool ${p.address}:`, e.message);
          }
        }
        setKnownTokens(Array.from(tMap.values()));
        setPairIndex(buildPairIndex(metas)); // single edge for direct-pool UI
        setPairEdges(buildPairEdges(metas)); // full edge list for routing
      } catch (e) {
        console.error("Critical index failure:", e);
      }
    })();
  }, [web3]);

  /* ---------------- URL sync ---------------- */
  const hasSyncedFromUrl = useRef(false);
  useEffect(() => {
    if (hasSyncedFromUrl.current) return;
    
    const q = new URLSearchParams(window.location.search);
    const pool = q.get("pool") || "";
    const tInQ  = q.get("tokenIn") || "";
    const tOutQ = q.get("tokenOut") || "";
    const modeQ = (q.get("mode") || "exactIn").toLowerCase();
    const dirQ  = (q.get("dir")  || "0to1");
    const amtQ  = q.get("amt") || "";
    const invQ  = q.get("inv") === "1";
    const slipQ = q.get("slip");
    const dlQ   = q.get("dl");
    const uiQ = q.get("ui");
    

    if (uiQ === "simple" || uiQ === "pro" || uiQ === "lab") {
      setUiMode(uiQ);
    }

    if (tInQ) setTokenInAddr(tInQ);
    if (tOutQ) setTokenOutAddr(tOutQ);
    if (pool) setPoolAddr(pool);

    setMode(modeQ === "out" || modeQ === "exactout" ? "exactOut" : "exactIn");
    setDirection(dirQ === "1to0" ? "1to0" : "0to1");
    if (amtQ) setAmount(amtQ);
    if (invQ) setInvert(true);
    if (slipQ) setSlippageBps(Number(slipQ));
    if (dlQ) setDeadlineSecs(Number(dlQ));
    hasSyncedFromUrl.current = true;
  }, []);

  /* ---------------- bench oracle ---------------- */
  useEffect(() => { (async () => setBench(await getWshidoUsdOracle(web3)))(); }, [web3]);

  /* ---------------- meta load ---------------- */
  useEffect(() => {
    let isMounted = true;

    const fetchPoolMeta = async () => {
      setError("");
      setQuote(null); 
      setDominant(null);

      const norm = toChecksumOrNull(web3, poolAddr);
      if (!norm) {
        if (isMounted) setMeta(null);
        return;
      }

      try {
        if (isMounted) setLoadingMeta(true);
        const m = await getMetaCached(web3, norm);
        if (isMounted) setMeta(m);
      } catch (e) {
        if (isMounted) setError(e?.message || "Failed to read pool metadata");
      } finally {
        if (isMounted) setLoadingMeta(false);
      }
    };

    fetchPoolMeta();

    return () => {
      isMounted = false;
    };
  }, [web3, poolAddr]);
  

  const resolvePoolAndDirection = useCallback((inAddr, outAddr) => {
    if (!pairIndex || !inAddr || !outAddr) return null;

    const key = `${inAddr.toLowerCase()}_${outAddr.toLowerCase()}`;
    const entry = pairIndex.get(key);

    if (!entry) return null;

    return {
      pool: entry.address,
      direction: "0to1"
    };
  }, [pairIndex]);

  // Keep poolAddr in sync for direct pairs only.
  useEffect(() => {
    if (!pairIndex) return;
    if (!tokenInAddr || !tokenOutAddr) return;

    const key = `${tokenInAddr.toLowerCase()}_${tokenOutAddr.toLowerCase()}`;
    const entry = pairIndex.get(key); // { address, fee } or undefined

    if (entry?.address) {
      // Always store poolAddr as a plain string
      setPoolAddr((prev) => {
        const prevStr = typeof prev === "string" ? prev : prev?.address || "";
        return prevStr.toLowerCase() === entry.address.toLowerCase() ? prevStr : entry.address;
      });
      setError("");
    }
  }, [tokenInAddr, tokenOutAddr, pairIndex]);


  /* ---------------- mid price ---------------- */
  const midOutPerInRaw = useMemo(() => {
    if (!meta) return null;
    const p_1_per_0 = midOutPerIn_from_slot0(meta.sqrtPriceX96, meta.token0.decimals, meta.token1.decimals);
    return direction === "0to1" ? p_1_per_0 : (1 / p_1_per_0);
  }, [meta, direction]);

  const midOutPerIn = useMemo(() => {
    if (midOutPerInRaw == null) return null;
    return invert ? (1 / midOutPerInRaw) : midOutPerInRaw;
  }, [midOutPerInRaw, invert]);

  const getFastUsd = useCallback((addr, asyncPrice) => {
    if (!addr || !bench) return asyncPrice;
    const a = String(addr).toLowerCase();
    if (a === String(bench.usdcAddr || "").toLowerCase()) return 1;
    if (a === String(bench.wshidoAddr || "").toLowerCase()) return bench.usdPerWshido;
    return asyncPrice;
  }, [bench]);

  const resolveUsdNow = useCallback(async (addr, fallback = null) => {
    const fast = getFastUsd(addr, fallback);
    if (fast != null) return fast;
    if (!addr || !bench) return null;

    const key = String(addr).toLowerCase();
    if (usdInlineCacheRef.current.has(key)) {
      return usdInlineCacheRef.current.get(key);
    }

    try {
      const r = await resolveUsdPerToken(web3, addr, bench);
      const usd = r?.usd ?? null;
      usdInlineCacheRef.current.set(key, usd);
      return usd;
    } catch {
      usdInlineCacheRef.current.set(key, null);
      return null;
    }
  }, [web3, bench, getFastUsd]);

  const deriveMissingUsdSide = useCallback((usdIn, usdOut, outPerIn) => {
    let inUsd = usdIn;
    let outUsd = usdOut;
    if (!outPerIn || !Number.isFinite(outPerIn) || outPerIn <= 0) {
      return { inUsd, outUsd };
    }
    if (inUsd == null && outUsd != null) inUsd = outUsd * outPerIn;
    else if (outUsd == null && inUsd != null) outUsd = inUsd / outPerIn;
    return { inUsd, outUsd };
  }, []);

  useEffect(() => {
    usdInlineCacheRef.current.clear();
  }, [bench]);

  /* ---------------- USD token resolution ---------------- */
  useEffect(() => {
    (async () => {
      if (!bench || !meta) { setUsdToken0(null); setUsdToken1(null); return; }
      try {
        const r0 = await resolveUsdPerToken(web3, meta.token0.address, bench);
        const r1 = await resolveUsdPerToken(web3, meta.token1.address, bench);

        let u0 = r0?.usd ?? null;
        let u1 = r1?.usd ?? null;

        const p10 = midOutPerIn_from_slot0(meta.sqrtPriceX96, meta.token0.decimals, meta.token1.decimals);
        if (u0 == null && u1 != null && p10 > 0) u0 = u1 / p10;
        else if (u1 == null && u0 != null && p10 > 0) u1 = u0 * p10;

        setUsdToken0(u0 ?? null);
        setUsdToken1(u1 ?? null);
      } catch {
        setUsdToken0(null);
        setUsdToken1(null);
      }
    })();
  }, [web3, meta, bench]);

  /* ---------------- Resolve Selected In/Out USD Prices ---------------- */
  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!bench || !web3) return;
      try {
        const promises = [
          tokenInAddr ? resolveUsdPerToken(web3, tokenInAddr, bench) : Promise.resolve(null),
          tokenOutAddr ? resolveUsdPerToken(web3, tokenOutAddr, bench) : Promise.resolve(null)
        ];
        
        const [rIn, rOut] = await Promise.all(promises);

        if (isMounted) {
           setUsdTokenIn(rIn?.usd ?? null);
           setUsdTokenOut(rOut?.usd ?? null);
        }
      } catch (e) {
        if (isMounted) {
          setUsdTokenIn(null);
          setUsdTokenOut(null);
        }
      }
    })();
    return () => { isMounted = false; };
  }, [web3, bench, tokenInAddr, tokenOutAddr]);

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

  async function listUsdAcrossPools(web3, bench, tokenAddr) {
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

  useEffect(() => {
    (async () => {
      if (!bench || !meta) { setRoutes0([]); setRoutes1([]); return; }
      try {
        const [r0, r1] = await Promise.all([
          listUsdAcrossPools(web3, bench, meta.token0.address),
          listUsdAcrossPools(web3, bench, meta.token1.address),
        ]);
        setRoutes0(r0);
        setRoutes1(r1);
      } catch {
        setRoutes0([]); setRoutes1([]);
      }
    })();
  }, [web3, bench, meta]);

  /* ---------------- dominant spread ---------------- */
  useEffect(() => {
    (async () => {
      if (!bench || !meta || !toChecksumOrNull(web3, poolAddr)) { setDominant(null); return; }
      const activeL = poolAddr.toLowerCase();
      const group = DOMINANT_GROUPS.find(g => g.pools.map(p=>p.toLowerCase()).includes(activeL));
      if (!group) { setDominant(null); return; }
      const symbol = group.symbol.toUpperCase();

      async function usdOfDominantViaPool(localMeta, domSym) {
        const s0 = (localMeta.token0.symbol||"").toUpperCase();
        const s1 = (localMeta.token1.symbol||"").toUpperCase();
        const domIs0 = s0 === domSym.toUpperCase();
        const domIs1 = s1 === domSym.toUpperCase();
        if (!domIs0 && !domIs1) return null;

        const p_1_per_0 = price1Per0_from_sqrtP(localMeta.sqrtPriceX96, localMeta.token0.decimals, localMeta.token1.decimals);
        const peerAddr = domIs0 ? localMeta.token1.address : localMeta.token0.address;
        const peerPerDom = domIs0 ? p_1_per_0 : (1 / p_1_per_0);

        if (peerAddr.toLowerCase() === bench.usdcAddr.toLowerCase()) return peerPerDom;
        if (peerAddr.toLowerCase() === bench.wshidoAddr.toLowerCase()) return peerPerDom * bench.usdPerWshido;

        const peerUSD = await resolveUsdPerToken(web3, peerAddr, bench);
        if (!peerUSD) return null;
        return peerUSD.usd * peerPerDom;
      }

      const activeUsd = await usdOfDominantViaPool(meta, symbol);
      const siblings = [];
      for (const p of group.pools) {
        if (p.toLowerCase() === activeL) continue;
        try {
          const m = await getMetaCached(web3, p);
          const u = await usdOfDominantViaPool(m, symbol);
          if (u != null) siblings.push({ pool: p, usd: u });
        } catch {}
      }

      let spreadPct = null;
      if (activeUsd != null && siblings.length > 0) {
        const ref = siblings[0].usd;
        spreadPct = ((ref / activeUsd) - 1) * 100;
      }
      if (activeUsd != null) setDominant({ symbol, activeUsd, siblings, spreadPct });
    })();
  }, [web3, bench, meta, poolAddr]);

  function buildPairIndex(poolsMeta) {
    // Single-edge map for direct-pool selection only.
    // If multiple pools exist for a token pair, the first one encountered wins.
    const map = new Map();
    for (const p of poolsMeta) {
      const a = p.token0.address.toLowerCase();
      const b = p.token1.address.toLowerCase();
      const entry = { address: p.address, fee: p.fee };
      const k1 = `${a}_${b}`;
      const k2 = `${b}_${a}`;
      if (!map.has(k1)) map.set(k1, entry);
      if (!map.has(k2)) map.set(k2, entry);
    }
    return map;
  }

  function buildPairEdges(poolsMeta) {
    // Full edge list for routing.
    const map = new Map(); // key -> array of { address, fee }

    const add = (from, to, edge) => {
      const key = `${from}_${to}`;
      if (!map.has(key)) map.set(key, []);
      const arr = map.get(key);
      // Dedup by address so we don't add the same pool twice.
      if (!arr.some(e => e.address.toLowerCase() === edge.address.toLowerCase())) {
        arr.push(edge);
      }
    };

    for (const p of poolsMeta) {
      const a = p.token0.address.toLowerCase();
      const b = p.token1.address.toLowerCase();
      const edge = { address: p.address, fee: p.fee };
      add(a, b, edge);
      add(b, a, edge);
    }

    return map;
  }

  const findBestPath = useCallback((addrA, addrB) => {
    if (!addrA || !addrB || !pairEdges) return null;
    const a = addrA.toLowerCase();
    const b = addrB.toLowerCase();

    if (a === b) return { path: [a], pools: [], fees: [] };

    // Build adjacency from full edge list.
    const adj = new Map();
    const addEdge = (from, to, val) => {
      if (!adj.has(from)) adj.set(from, []);
      adj.get(from).push({
        next: to,
        pool: val.address,
        fee: val.fee
      });
    };
    for (const [key, edges] of pairEdges.entries()) {
      const [t0, t1] = key.split("_");
      if (!t0 || !t1 || !Array.isArray(edges)) continue;
      for (const edge of edges) {
        if (!edge?.address) continue;
        addEdge(t0, t1, edge);
      }
    }

    // BFS by hop count: shortest path first.
    const MAX_HOPS = 4;
    const queue = [{
      node: a,
      path: [a],
      pools: [],
      fees: []
    }];

    while (queue.length > 0) {
      const cur = queue.shift();
      const hops = Math.max(0, cur.path.length - 1);
      if (hops > MAX_HOPS) continue;
      if (cur.node === b) {
        return {
          path: cur.path,
          pools: cur.pools,
          fees: cur.fees
        };
      }
      if (hops === MAX_HOPS) continue;

      const edges = adj.get(cur.node) || [];
      for (const edge of edges) {
        // Avoid cycles in the route.
        if (cur.path.includes(edge.next)) continue;
        queue.push({
          node: edge.next,
          path: [...cur.path, edge.next],
          pools: [...cur.pools, edge.pool],
          fees: [...cur.fees, edge.fee]
        });
      }
    }

    return null;
  }, [pairEdges]);

  // Enumerate up to `maxCandidates` simple paths between addrA and addrB.
  // Returned order is BFS (shortest hop count first), so we try "least hops" before longer ones.
  const enumeratePaths = useCallback((addrA, addrB, maxHops = 4, maxCandidates = 12) => {
    if (!addrA || !addrB || !pairEdges) return [];
    const a = addrA.toLowerCase();
    const b = addrB.toLowerCase();
    if (a === b) return [];

    // Build adjacency from pair index entries.
    const adj = new Map();
    const addEdge = (from, to, val) => {
      if (!adj.has(from)) adj.set(from, []);
      adj.get(from).push({ next: to, pool: val.address, fee: val.fee });
    };
    for (const [key, edges] of pairEdges.entries()) {
      const [t0, t1] = key.split("_");
      if (!t0 || !t1 || !Array.isArray(edges)) continue;
      for (const edge of edges) {
        if (!edge?.address) continue;
        addEdge(t0, t1, edge);
      }
    }

    const results = [];
    const queue = [{ node: a, path: [a], pools: [], fees: [] }];

    while (queue.length > 0 && results.length < maxCandidates) {
      const cur = queue.shift();
      const hops = Math.max(0, cur.path.length - 1);
      if (hops > maxHops) continue;

      if (cur.node === b && cur.path.length > 1) {
        results.push({ path: cur.path, pools: cur.pools, fees: cur.fees });
        continue;
      }
      if (hops === maxHops) continue;

      const edges = adj.get(cur.node) || [];
      for (const edge of edges) {
        // Avoid cycles in the token route.
        if (cur.path.includes(edge.next)) continue;
        queue.push({
          node: edge.next,
          path: [...cur.path, edge.next],
          pools: [...cur.pools, edge.pool],
          fees: [...cur.fees, edge.fee]
        });
      }
    }

    return results;
  }, [pairEdges]);
  /* ---------------- simulate ---------------- */

  const bestPath = useMemo(() => {
    try {
      return findBestPath(tokenInAddr, tokenOutAddr);
    } catch (e) {
      console.error("findBestPath failed", { tokenInAddr, tokenOutAddr, pairIndex }, e);
      return null;
    }
  }, [tokenInAddr, tokenOutAddr, pairEdges]);

  const simulate = useCallback(async () => {
    setError(""); setQuote(null);

    const hasDirectPool = !!toChecksumOrNull(web3, poolAddr);
    const isMultiHop = bestPath && bestPath.pools && bestPath.pools.length > 1;

    // Debug: make sure we always know which branch is executing.
    // (Useful for 4-hop edge-token routes.)
    try {
      const addrInDbg = typeof tokenInAddr === "string" ? tokenInAddr : tokenInAddr?.address;
      const addrOutDbg = typeof tokenOutAddr === "string" ? tokenOutAddr : tokenOutAddr?.address;
      console.log("[simulate] route state", {
        addrIn: addrInDbg,
        addrOut: addrOutDbg,
        poolAddr,
        hasDirectPool,
        isMultiHop,
        bestPathHops: bestPath?.pools?.length ?? 0
      });
    } catch {}

    if (!hasDirectPool && !isMultiHop) {
      setError("Enter a valid pool address or choose a routed pair.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter a positive amount.");
      return;
    }

    // DIRECT / LEGACY PATH (single-hop via Quoter, using original logic)
    if (!isMultiHop) {
      if (!meta || midOutPerInRaw == null) {
        setError("Pool metadata not loaded yet.");
        return;
      }

      const tokenIn  = direction === "0to1" ? meta.token0 : meta.token1;
      const tokenOut = direction === "0to1" ? meta.token1 : meta.token0;
      const quoter   = new web3.eth.Contract(QUOTER_V2_ABI, QUOTER_V2);


      try {
        let outHuman = null, inHuman = null, ticksCrossed = 0, gasEstimate = "";
        let rawIn = null, rawOut = null;
        let sqrtAfter = 0n;

        if (mode === "exactIn") {
          rawIn = toRaw(amount, tokenIn.decimals);
          const path = encodePathExactIn(tokenIn.address, meta.fee, tokenOut.address);
          const res  = await quoter.methods.quoteExactInput(path, rawIn.toString()).call();
          rawOut       = BigInt(res.amountOut ?? res["0"]);
          outHuman     = fromRaw(rawOut, tokenOut.decimals);
          ticksCrossed = Number(res.initializedTicksCrossedList?.[0] ?? res["2"] ?? 0);
          gasEstimate  = (res.gasEstimate ?? res["3"] ?? "").toString();
          sqrtAfter    = BigInt(res.sqrtPriceX96AfterList?.[0] ?? res["1"] ?? 0);
        } else {
          rawOut = toRaw(amount, tokenOut.decimals);
          const path = encodePathExactOut(tokenIn.address, meta.fee, tokenOut.address);
          let res;
          try { res = await quoter.methods.quoteExactOutput(path, rawOut.toString()).call(); }
          catch { setError("Quoter reverted — likely not enough liquidity for this exact output amount."); return; }
          rawIn        = BigInt(res.amountIn ?? res["0"]);
          inHuman      = fromRaw(rawIn, tokenIn.decimals);
          ticksCrossed = Number(res.initializedTicksCrossedList?.[0] ?? res["2"] ?? 0);
          gasEstimate  = (res.gasEstimate ?? res["3"] ?? "").toString();
          sqrtAfter    = BigInt(res.sqrtPriceX96AfterList?.[0] ?? res["1"] ?? 0);
        }

        const postTrade_price1Per0 = price1Per0_from_sqrtP(sqrtAfter, meta.token0.decimals, meta.token1.decimals);
        const postTradeOutPerInRaw = (direction === "0to1") ? postTrade_price1Per0 : (1 / postTrade_price1Per0);
        const postTradeOutPerIn    = invert ? (1 / postTradeOutPerInRaw) : postTradeOutPerInRaw;

        const feeAdj = 1 - feeFrac;
        const idealOutPerInRaw = midOutPerInRaw * feeAdj;
        const idealOutPerIn    = invert ? (1 / idealOutPerInRaw) : idealOutPerInRaw;
        const idealInPerOut    = 1 / idealOutPerInRaw;

        let avgExecPriceRaw, impactVsMidPct, slippageVsIdealPct, minReceived=null, maxSold=null;

        if (mode === "exactIn") {
          const execOutPerIn = ratioOutPerInRaw(rawOut, rawIn, tokenOut.decimals, tokenIn.decimals);
          avgExecPriceRaw = execOutPerIn;
          impactVsMidPct     = midOutPerInRaw > 0 ? (1 - (execOutPerIn / midOutPerInRaw)) * 100 : 0;
          slippageVsIdealPct = idealOutPerInRaw > 0 ? (1 - (execOutPerIn / idealOutPerInRaw)) * 100 : 0;
          const minOut = Number(outHuman) * (1 - Number(slippageBps)/10_000);
          minReceived = `${fmt8(minOut)} ${tokenOut.symbol}`;
        } else {
          const execInPerOut = ratioInPerOutRaw(rawIn, rawOut, tokenIn.decimals, tokenOut.decimals);
          avgExecPriceRaw = 1 / execInPerOut;
          const midInPerOut = 1 / midOutPerInRaw;
          impactVsMidPct     = midInPerOut > 0 ? ((execInPerOut / midInPerOut) - 1) * 100 : 0;
          slippageVsIdealPct = idealInPerOut > 0 ? ((execInPerOut / idealInPerOut) - 1) * 100 : 0;
          const maxIn = Number(inHuman) * (1 + Number(slippageBps)/10_000);
          maxSold = `${fmt8(maxIn)} ${tokenIn.symbol}`;
        }

        const avgPrice = invert ? (1 / avgExecPriceRaw) : avgExecPriceRaw;

        const fallbackIn = (direction === "0to1") ? usdToken0 : usdToken1;
        const fallbackOut = (direction === "0to1") ? usdToken1 : usdToken0;
        let usdPerIn = await resolveUsdNow(tokenIn.address, fallbackIn);
        let usdPerOut = await resolveUsdNow(tokenOut.address, fallbackOut);
        ({ inUsd: usdPerIn, outUsd: usdPerOut } = deriveMissingUsdSide(usdPerIn, usdPerOut, avgExecPriceRaw));

        const inUnits  = Number(fromRaw(rawIn,  tokenIn.decimals));
        const outUnits = Number(fromRaw(rawOut, tokenOut.decimals));
        const amountInUSD  = (usdPerIn  != null) ? inUnits  * usdPerIn  : null;
        const amountOutUSD = (usdPerOut != null) ? outUnits * usdPerOut : null;

        // unit USD
        const usdIn_now    = (usdPerOut != null && midOutPerInRaw != null) ? midOutPerInRaw * usdPerOut : null;
        const usdOut_now   = (usdPerIn  != null && midOutPerInRaw != null) ? usdPerIn / midOutPerInRaw : null;

        const usdIn_after  = (usdPerOut != null && postTradeOutPerInRaw != null) ? postTradeOutPerInRaw * usdPerOut : null;
        const usdOut_after = (usdPerIn  != null && postTradeOutPerInRaw != null) ? usdPerIn / postTradeOutPerInRaw : null;

        const usdIn_ideal  = (usdPerOut != null && idealOutPerInRaw != null) ? idealOutPerInRaw * usdPerOut : null;
        const usdOut_ideal = (usdPerIn  != null && idealOutPerInRaw != null) ? usdPerIn / idealOutPerInRaw : null;

        const usdIn_exec   = (usdPerOut != null && avgExecPriceRaw != null) ? avgExecPriceRaw * usdPerOut : null;
        const usdOut_exec  = (usdPerIn  != null && avgExecPriceRaw != null) ? usdPerIn / avgExecPriceRaw : null;

        const unitDelta = {
          in:  (usdIn_now  != null && usdIn_after  != null && usdIn_now  !== 0) ? ((usdIn_after  / usdIn_now)  - 1) * 100 : null,
          out: (usdOut_now != null && usdOut_after != null && usdOut_now !== 0) ? ((usdOut_after / usdOut_now) - 1) * 100 : null,
        };

        const amountInShow  = mode === "exactIn"
          ? `${amount} ${tokenIn.symbol}`
          : `${fromRaw(rawIn, tokenIn.decimals)} ${tokenIn.symbol}`;

        const amountOutShow = mode === "exactIn"
          ? `${fromRaw(rawOut, tokenOut.decimals)} ${tokenOut.symbol}`
          : `${amount} ${tokenOut.symbol}`;

        const anchors = {
          inAnchored:  isAnchoredUsd(tokenIn.address, bench),
          outAnchored: isAnchoredUsd(tokenOut.address, bench),
        };

        setQuote({
          mode, fee: meta.fee,
          tokenIn, tokenOut,
          amountInShow, amountOutShow,
          amountInUSD, amountOutUSD,
          avgPrice,
          midOutPerIn,
          idealOutPerIn,
          impactVsMidPct,
          slippageVsIdealPct,
          ticksCrossed,
          gasEstimate,
          postTradeOutPerIn,
          minReceived,
          maxSold,
          unitUSD: {
            now:   { in: usdIn_now,   out: usdOut_now },
            ideal: { in: usdIn_ideal, out: usdOut_ideal },
            exec:  { in: usdIn_exec,  out: usdOut_exec },
            after: { in: usdIn_after, out: usdOut_after },
          },
          unitDelta,
          anchors,
        });
        return;
      } catch (e) {
        console.error("Simulation Failure (direct):", e);
        setError(e?.message || "Quoter call failed");
        return;
      }
    }

    // MULTI-HOP: try multiple candidate paths until one Quoter route succeeds.
    // Some 4-hop combinations have >1 viable route; Quoter can revert on a specific path.
    try {
      const addrIn = typeof tokenInAddr === "string" ? tokenInAddr : tokenInAddr?.address;
      const addrOut = typeof tokenOutAddr === "string" ? tokenOutAddr : tokenOutAddr?.address;
      if (!addrIn || !addrOut) {
        setError("No route exists for this token pair");
        return;
      }

      const tokenInObj = FULL_TOKEN_LIST.find(t => t.address.toLowerCase() === addrIn.toLowerCase());
      const tokenOutObj = FULL_TOKEN_LIST.find(t => t.address.toLowerCase() === addrOut.toLowerCase());
      if (!tokenInObj || !tokenOutObj) {
        setError("Token metadata missing");
        return;
      }

      const candidates = enumeratePaths(addrIn, addrOut, 4, 16) || [];
      const hasCandidates = candidates.length > 0;

      const quoter = new web3.eth.Contract(QUOTER_V2_ABI, QUOTER_V2);

      const decimals = mode === "exactIn" ? tokenInObj.decimals : tokenOutObj.decimals;
      const inputRawStr = toRaw(amount, decimals).toString();

      let chosen = null;
      let rawIn, rawOut, outHuman, inHuman, ticksCrossed = 0, gasEstimate = "";
      let lastErr = null;

      const symIn = String(tokenInObj.symbol || "").toUpperCase();
      const symOut = String(tokenOutObj.symbol || "").toUpperCase();

      const presetRouteSyms = (() => {
      // Special edge-token combos that need 4 hops.
      // Token order here is the canonical path order (exactInput).
        const K = "KENSEI";
        const W = "WSHIDO";
        const I = "ILCFNBR";
        const S = "SDS";
        const R = "RAKUN";
        const C = "CWK";
        const D = "DESHI";

        if (symIn === R && symOut === C) return [R, K, W, I, C];
        if (symIn === C && symOut === R) return [C, I, W, K, R];

        if (symIn === C && symOut === D) return [C, I, W, S, D];
        if (symIn === D && symOut === C) return [D, S, W, I, C];

        if (symIn === R && symOut === D) return [R, K, W, S, D];
        if (symIn === D && symOut === R) return [D, S, W, K, R];

        return null;
      })();

      const addrBySym = (sym) =>
        FULL_TOKEN_LIST.find(t => String(t.symbol || "").toUpperCase() === String(sym || "").toUpperCase())?.address?.toLowerCase();

      const tryPreset = async () => {
        if (!presetRouteSyms) return false;
        const tokens = presetRouteSyms.map(addrBySym);
        if (tokens.some(t => !t)) return false;

        // Build all fee options per hop (preserve multiple pools / fee tiers).
        const feeOptionsPerHop = [];
        for (let i = 0; i < tokens.length - 1; i++) {
          const from = tokens[i].toLowerCase();
          const to = tokens[i + 1].toLowerCase();
          const edges = pairEdges?.get(`${from}_${to}`) || [];
          if (!edges || edges.length === 0) return false;
          const fees = Array.from(new Set(edges.map(e => e.fee)));
          feeOptionsPerHop.push(fees);
        }

        // Cartesian product of fees per hop.
        const feeCombos = feeOptionsPerHop.reduce(
          (acc, opts) => acc.flatMap(c => opts.map(f => [...c, f])),
          [[]]
        );

        for (const fees of feeCombos) {
          const pathHex =
            mode === "exactIn" ? encodePathExactIn(tokens, fees) : encodePathExactOut(tokens, fees);
          try {
            let res;
            if (mode === "exactIn") {
              rawIn = BigInt(inputRawStr);
              res = await quoter.methods.quoteExactInput(pathHex, inputRawStr).call();
              rawOut = BigInt(res.amountOut ?? res["0"]);
              outHuman = fromRaw(rawOut, tokenOutObj.decimals);
            } else {
              rawOut = BigInt(inputRawStr);
              res = await quoter.methods.quoteExactOutput(pathHex, inputRawStr).call();
              rawIn = BigInt(res.amountIn ?? res["0"]);
              inHuman = fromRaw(rawIn, tokenInObj.decimals);
            }

            ticksCrossed = Number(
              (Array.isArray(res.initializedTicksCrossedList)
                ? res.initializedTicksCrossedList.reduce((a, b) => Number(a) + Number(b), 0)
                : res.initializedTicksCrossedList) ??
                res["2"] ??
                0
            );
            gasEstimate = (res.gasEstimate ?? res["3"] ?? "").toString();
            chosen = { path: tokens, fees };
            return true;
          } catch (err) {
            lastErr = err;
          }
        }

        return false;
      };

      if (mode === "exactIn") {
        // Attempt preset first; fallback to candidate enumeration.
        await tryPreset();
        if (!chosen) {
          rawIn = BigInt(inputRawStr);
          for (const cand of candidates) {
            const tokens = cand.path;
            const fees = cand.fees;
            const pathHex = encodePathExactIn(tokens, fees);
            console.log("multi-hop try:", { tokens, fees, pathHex });
            try {
              const res = await quoter.methods.quoteExactInput(pathHex, inputRawStr).call();
              console.log("quoter multi-hop res (exactIn):", res);

              rawOut = BigInt(res.amountOut ?? res["0"]);
              outHuman = fromRaw(rawOut, tokenOutObj.decimals);
              ticksCrossed = Number(
                res.initializedTicksCrossedList?.reduce((a, b) => Number(a) + Number(b), 0) ??
                  res["2"] ??
                  0
              );
              gasEstimate = (res.gasEstimate ?? res["3"] ?? "").toString();
              chosen = cand;
              break;
            } catch (err) {
              lastErr = err;
            }
          }
        }
      } else {
        await tryPreset();
        if (!chosen) {
          rawOut = BigInt(inputRawStr);
          for (const cand of candidates) {
            const tokens = cand.path;
            const fees = cand.fees;
            const pathHex = encodePathExactOut(tokens, fees);
            console.log("multi-hop try:", { tokens, fees, pathHex });
            try {
              const res = await quoter.methods.quoteExactOutput(pathHex, inputRawStr).call();
              console.log("quoter multi-hop res (exactOut):", res);

              rawIn = BigInt(res.amountIn ?? res["0"]);
              inHuman = fromRaw(rawIn, tokenInObj.decimals);
              ticksCrossed = Number(
                res.initializedTicksCrossedList?.reduce((a, b) => Number(a) + Number(b), 0) ??
                  res["2"] ??
                  0
              );
              gasEstimate = (res.gasEstimate ?? res["3"] ?? "").toString();
              chosen = cand;
              break;
            } catch (err) {
              lastErr = err;
            }
          }
        }
      }

      if (!chosen) {
        const msg = lastErr?.message || "Multi-hop simulation failed (no candidate path succeeded)";
        setError(msg);
        return;
      }

      const tokens = chosen.path;
      const fees = chosen.fees;

      const execOutPerIn = ratioOutPerInRaw(rawOut, rawIn, tokenOutObj.decimals, tokenInObj.decimals);
      const totalFeeFrac = 1 - fees.reduce((acc, f) => acc * (1 - (f / 1_000_000)), 1);
      const refMid = execOutPerIn / (1 - totalFeeFrac);

      const impactVsMidPct = refMid > 0 ? (1 - execOutPerIn / refMid) * 100 : 0;
      const idealOutPerInRaw = refMid * (1 - totalFeeFrac);
      const slippageVsIdealPct = idealOutPerInRaw > 0 ? (1 - execOutPerIn / idealOutPerInRaw) * 100 : 0;

      const minOut = mode === "exactIn" ? Number(outHuman) * (1 - Number(slippageBps) / 10_000) : amount;
      const maxIn = mode === "exactOut" ? Number(inHuman) * (1 + Number(slippageBps) / 10_000) : amount;
      const avgPrice = invert ? 1 / execOutPerIn : execOutPerIn;

      const inUnits = Number(fromRaw(rawIn, tokenInObj.decimals));
      const outUnits = Number(fromRaw(rawOut, tokenOutObj.decimals));

      let usdPerInMulti = await resolveUsdNow(tokenInObj.address, usdTokenIn);
      let usdPerOutMulti = await resolveUsdNow(tokenOutObj.address, usdTokenOut);
      ({ inUsd: usdPerInMulti, outUsd: usdPerOutMulti } = deriveMissingUsdSide(usdPerInMulti, usdPerOutMulti, execOutPerIn));

      const amountInUSD = usdPerInMulti != null ? inUnits * usdPerInMulti : null;
      const amountOutUSD = usdPerOutMulti != null ? outUnits * usdPerOutMulti : null;

      setQuote({
        mode,
        isMultiHop: true,
        path: tokens,
        fees,
        fee: null,
        tokenIn: tokenInObj,
        tokenOut: tokenOutObj,
        amountInShow:
          mode === "exactIn"
            ? `${amount} ${tokenInObj.symbol}`
            : `${fromRaw(rawIn, tokenInObj.decimals)} ${tokenInObj.symbol}`,
        amountOutShow:
          mode === "exactIn"
            ? `${fromRaw(rawOut, tokenOutObj.decimals)} ${tokenOutObj.symbol}`
            : `${amount} ${tokenOutObj.symbol}`,
        amountInUSD,
        amountOutUSD,
        unitUSD: {
          now: { in: usdPerInMulti, out: usdPerOutMulti },
          exec: {
            in: amountInUSD != null && inUnits > 0 ? amountInUSD / inUnits : null,
            out: amountOutUSD != null && outUnits > 0 ? amountOutUSD / outUnits : null,
          },
        },
        avgPrice,
        impactVsMidPct,
        slippageVsIdealPct,
        ticksCrossed,
        gasEstimate,
        minReceived: mode === "exactIn" ? `${fmt8(minOut)} ${tokenOutObj.symbol}` : null,
        maxSold: mode === "exactOut" ? `${fmt8(maxIn)} ${tokenInObj.symbol}` : null,
        anchors: {
          inAnchored: isAnchoredUsd(addrIn, bench),
          outAnchored: isAnchoredUsd(addrOut, bench),
        },
      });
    } catch (e) {
      console.error("Simulation Failure (multi-hop):", e);
      setError(e?.message || "Multi-hop simulation failed");
    }
  }, [
    web3, poolAddr, meta, midOutPerInRaw, direction, invert, mode,
    amount, slippageBps, feeFrac, usdToken0, usdToken1, bench,
    tokenInAddr, tokenOutAddr, bestPath, usdTokenIn, usdTokenOut,
    enumeratePaths,
    resolveUsdNow, deriveMissingUsdSide
  ]);
  /* ---------------- auto simulate ---------------- */ 
  useEffect(() => {
    if (!autoRun) return;
    setQuote(null);
    setError("");

    if (!amount || Number(amount) <= 0) return;

    const t = setTimeout(() => { 
      simulate(); 
    }, 500);

    return () => clearTimeout(t);
  }, [autoRun, amount, mode, direction, invert, poolAddr, meta, simulate, web3, usdTokenIn, usdTokenOut]); // Add these last two

  /* ---------------- after swap refresh ---------------- */
  const onAfterSwap = useCallback(async () => {
    try {
      poolMetaCache.delete((poolAddr||"").toLowerCase());
      const m = await getMetaCached(web3, poolAddr);
      setMeta(m);

      const [r0, r1] = await Promise.all([
        resolveUsdPerToken(web3, m.token0.address, bench),
        resolveUsdPerToken(web3, m.token1.address, bench),
      ]);
      setUsdToken0(r0?.usd ?? null);
      setUsdToken1(r1?.usd ?? null);

      const [nr0, nr1] = await Promise.all([
        listUsdAcrossPools(web3, bench, m.token0.address),
        listUsdAcrossPools(web3, bench, m.token1.address),
      ]);
      setRoutes0(nr0);
      setRoutes1(nr1);

      await fetchAllBalances();
      simulate();
    } finally {
      //setTimeout(() => { window.location.replace(window.location.href); }, 250);
    }
  }, [web3, poolAddr, bench, simulate, updateUrl, fetchAllBalances]);

  /* ---------------- execute swap ---------------- */
  const executeSwap = useCallback(async () => {
    try {
      if (!quote || (!meta && !quote.isMultiHop)) return;
      if (!writeWeb3 || !evmAccount) return;

      const router = new writeWeb3.eth.Contract(SWAP_ROUTER_ABI, SWAP_ROUTER_V3);
      const bps = Number(slippageBps);
      const deadline = Math.floor(Date.now() / 1000) + deadlineSecs;

      // 1. Determine the path encoding based on mode
      const pathHex = quote.mode === "exactIn"
        ? (quote.isMultiHop
          ? encodePathExactIn(quote.path, quote.fees)
          : encodePathExactIn(quote.tokenIn.address, quote.fee, quote.tokenOut.address)
        )
        : (quote.isMultiHop
          ? encodePathExactOut(quote.path, quote.fees)
          : encodePathExactOut(quote.tokenIn.address, quote.fee, quote.tokenOut.address)
        );

      const tokenContract = new writeWeb3.eth.Contract(TOKEN_ABI, tokenInAddr);

      if (quote.mode === "exactIn") {
        const inputRaw = parseAmountToWei(amount, quote.tokenIn.decimals).toString();
        const quotedOut = Number((quote.amountOutShow || "").split(" ")[0] || "0");
        const minOutHuman = quotedOut * (1 - bps / 10_000);
        const amountOutMinimumRaw = toRaw(minOutHuman, quote.tokenOut.decimals).toString();

        await handleApproveAndRunWeb3({
          tokenContract,
          account: evmAccount,
          spender: SWAP_ROUTER_V3,
          amount,
          decimals: quote.tokenIn.decimals,
          setApproving: setLoadingMeta,
          onAction: async () => {
            const txParams = {
              path: pathHex,
              recipient: evmAccount,
              deadline,
              amountIn: inputRaw,
              amountOutMinimum: amountOutMinimumRaw
            };

            const receipt = await router.methods.exactInput(txParams).send({ from: evmAccount });
            console.log("Swap executed:", receipt.transactionHash);
            if (onAfterSwap) onAfterSwap();
          }
        });
      } else {
        // EXACT OUT logic
        const outputRaw = parseAmountToWei(amount, quote.tokenOut.decimals).toString();
        const quotedIn = Number((quote.amountInShow || "").split(" ")[0] || "0");
        const maxInHuman = quotedIn * (1 + bps / 10_000);
        const amountInMaximumRaw = toRaw(maxInHuman, quote.tokenIn.decimals).toString();

        await handleApproveAndRunWeb3({
          tokenContract,
          account: evmAccount,
          spender: SWAP_ROUTER_V3,
          amount: maxInHuman.toFixed(quote.tokenIn.decimals), // Use calculated max for approval
          decimals: quote.tokenIn.decimals,
          setApproving: setLoadingMeta,
          onAction: async () => {
            const txParams = {
              path: pathHex,
              recipient: evmAccount,
              deadline,
              amountOut: outputRaw,
              amountInMaximum: amountInMaximumRaw
            };

            const receipt = await router.methods.exactOutput(txParams).send({ from: evmAccount });
            console.log("Swap executed:", receipt.transactionHash);
            if (onAfterSwap) onAfterSwap();
          }
        });
      }
    } catch (err) {
      setError(err?.message || "Swap failed");
    }
  }, [quote, meta, writeWeb3, evmAccount, slippageBps, amount, bestPath, deadlineSecs, tokenInAddr, tokenOutAddr, onAfterSwap]);
  // UI helper: select route keeping pay token
  const selectRoute = useCallback(async (pool) => {
    await selectRouteKeepingPayToken({
      poolAddress: pool,
      setPoolAddr,
      setDirection,
      currentMeta: meta,
      currentDirection: direction,
      getMeta: (addr) => getMetaCached(web3, addr),
    });
  }, [web3, meta, direction]);
  // Full token list for pickers
  const TOKENS = useMemo(() => {
    const tMap = new Map();

    // 1. Include all tokens from FULL_TOKEN_LIST
    FULL_TOKEN_LIST.forEach(t => {
      if (t?.address) tMap.set(t.address.toLowerCase(), t);
    });

    // 2. Include current pool tokens just in case
    if (meta?.token0) tMap.set(meta.token0.address.toLowerCase(), meta.token0);
    if (meta?.token1) tMap.set(meta.token1.address.toLowerCase(), meta.token1);

    return Array.from(tMap.values());
  }, [meta]);

  const gridCols = railCollapsedH ? "lg:grid-cols-1" : "lg:grid-cols-[1.1fr_0.9fr]";
  const containerMax = railCollapsedH ? "md:max-w-5xl" : "md:max-w-6xl";
  
  const tokenIn = useMemo(
    () => TOKENS.find(t => t.address?.toLowerCase() === tokenInAddr?.toLowerCase()),
    [tokenInAddr, TOKENS]
  );

  const tokenOut = useMemo(
    () => TOKENS.find(t => t.address?.toLowerCase() === tokenOutAddr?.toLowerCase()),
    [tokenOutAddr, TOKENS]
  );

  // derive selected pool safely
  const selectedPool = useMemo(() => {
    if (!tokenIn || !tokenOut || !pairIndex) return null;

    const key = `${tokenIn.address.toLowerCase()}_${tokenOut.address.toLowerCase()}`;
    return pairIndex.get(key) || null;
  }, [tokenIn, tokenOut, pairIndex]);

  // auto-set poolAddr if valid
  useEffect(() => {
    if (!selectedPool) return;

    // selectedPool is { address, fee }
    const newAddr = selectedPool.address; 

    setPoolAddr((prev) => {
      // prev might be an object here too, so stringify it
      const currentAddr = typeof prev === 'string' ? prev : prev?.address;
      if (currentAddr?.toLowerCase() === newAddr.toLowerCase()) return prev; 
      setError("");
      return newAddr; // Return ONLY the string
    });
  }, [selectedPool]);



  // SYNC 2: Token Pickers -> Top Dropdown

  // SYNC 2: Token Pickers -> Top Dropdown (Strict Checking)
  const handleTokenChange = useCallback((slot, addr) => {
    if (!addr || !web3) return;
    
    const check = toChecksumOrNull(web3, addr);
    if (!check) return;

    // Reset UI state for fluid feedback
    setQuote(null);
    setDominant(null);
    setError("");

    let newIn = tokenInAddr || "";
    let newOut = tokenOutAddr || "";

    if (slot === "in") {
      if (newOut && check.toLowerCase() === newOut.toLowerCase()) {
        newOut = newIn;
      }
      newIn = check;
    } else {
      if (newIn && check.toLowerCase() === newIn.toLowerCase()) {
        newIn = newOut;
      }
      newOut = check;
    }

    setTokenInAddr(newIn);
    setTokenOutAddr(newOut);

    // Use POOL_REGISTRY because it has the parsed token addresses
    const found = POOL_REGISTRY.find(p => {
      // Safety check: Skip if registry entry is missing addresses
      if (!p || !p.token0Address || !p.token1Address) return false;
      
      const t0 = p.token0Address.toLowerCase();
      const t1 = p.token1Address.toLowerCase();
      const i = newIn.toLowerCase();
      const o = newOut.toLowerCase();

      return (t0 === i && t1 === o) || (t1 === i && t0 === o);
    });

    if (found) {
      setPoolAddr(found.address);
      // Align direction: 0to1 means newIn is the pool's token0
      if (found.token0Address.toLowerCase() === newIn.toLowerCase()) {
        setDirection("0to1");
      } else {
        setDirection("1to0");
      }
    } else {
      // Clear pool if no direct pair exists (prevents ghost simulations)
      setPoolAddr("");
    }
  }, [tokenInAddr, tokenOutAddr, web3]);
  // Swap tokens order (flip)
  function swapTokenOrder() {
    const inAddr = tokenInAddr;
    const outAddr = tokenOutAddr;

    if (!inAddr || !outAddr) return;

    // flip swap direction
    setDirection(prev => (prev === "0to1" ? "1to0" : "0to1"));

    // swap tokens
    setTokenInAddr(outAddr);
    setTokenOutAddr(inAddr);

    // reset quote state
    setAmount("");
    setQuote(null);
    setError("");
  }


  useEffect(() => {
    if (!meta) return;

    const addr0 = meta.token0?.address;
    const addr1 = meta.token1?.address;
    if (!addr0 || !addr1) return;

    const expectedIn = (direction === "0to1" ? addr0 : addr1).toLowerCase();
    const expectedOut = (direction === "0to1" ? addr1 : addr0).toLowerCase();

    setTokenInAddr(prev => {
      const current = (typeof prev === 'string' ? prev : prev?.address || "").toLowerCase();
      return current === expectedIn ? prev : expectedIn;
    });

    setTokenOutAddr(prev => {
      const current = (typeof prev === 'string' ? prev : prev?.address || "").toLowerCase();
      return current === expectedOut ? prev : expectedOut;
    });
  }, [meta, direction]);

  return {
    web3,

    isConnected,
    evmAccount,

    uiMode, setUiMode,

    mode, setMode,
    direction, setDirection,
    invert, setInvert,
    amount, setAmount,
    poolAddr, setPoolAddr,

    loadingMeta,
    meta,
    quote,
    error, setError,

    bench,
    usdToken0, usdToken1,
    routes0, routes1,
    dominant,

    bal0, bal1,
    displayBalIn, displayBalOut,

    slippageBps, setSlippageBps,
    deadlineSecs, setDeadlineSecs,
    autoRun, setAutoRun,

    railCollapsedH, setRailCollapsedH,
    usdRefOpen, setUsdRefOpen,
    railFoldV, setRailFoldV,

    feePercent,
    feeFrac,
    midOutPerIn,
    midOutPerInRaw,
    midBase,
    midQuote,

    fmtUSD,
    fmt8,
    floorTo,
    pickMax,
    shortSym,

    gridCols,
    containerMax,

    simulate,
    executeSwap,
    selectRoute,
    updateUrl,

    tokenInAddr,
    tokenOutAddr,
    setTokenInAddr,
    setTokenOutAddr,
    handleTokenChange,
    setQuote,
    TOKENS,
    swapTokenOrder,
    findBestPath,
    bestPath
  };
}