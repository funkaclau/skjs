// src/hooks/swap/useSwapNavigation.js
import { useState, useEffect, useCallback, useRef } from "react";
import { PRESET_POOLS } from "../../config/markets";
import { getMetaCached, toChecksumOrNull } from "../../utils/price";
import { buildPairIndex } from "../../utils/swap/routing";

export function useSwapNavigation({ web3, setMode, setDirection, setAmount, setInvert, setSlippageBps, setDeadlineSecs, setUiMode, setPoolAddr }) {
  const [tokenInAddr, setTokenInAddr] = useState(null);
  const [tokenOutAddr, setTokenOutAddr] = useState(null);
  const [pairIndex, setPairIndex] = useState(null);
  const [knownTokens, setKnownTokens] = useState([]);
  const hasSyncedFromUrl = useRef(false);
  const historyDebounceRef = useRef(null);

  // 1. Build the Global Routing Index
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
            metas.push({ address: p.address, token0: m.token0, token1: m.token1, fee: m.fee });
            if (m.token0?.address) tMap.set(m.token0.address.toLowerCase(), { symbol: m.token0.symbol, address: m.token0.address });
            if (m.token1?.address) tMap.set(m.token1.address.toLowerCase(), { symbol: m.token1.symbol, address: m.token1.address });
          } catch (e) { console.warn(`Skipping pool ${p.address}:`, e.message); }
        }
        setKnownTokens(Array.from(tMap.values()));
        setPairIndex(buildPairIndex(metas));
      } catch (e) { console.error("Critical index failure:", e); }
    })();
  }, [web3]);

  // 2. URL History Updater
  const updateUrl = useCallback((params = {}) => {
    const sp = new URLSearchParams(window.location.search);
    let changed = false;
    for (const key in params) {
      const val = params[key];
      if (val == null || val === "") {
        if (sp.has(key)) { sp.delete(key); changed = true; }
      } else {
        if (sp.get(key) !== String(val)) { sp.set(key, val); changed = true; }
      }
    }
    if (changed) {
      if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
      historyDebounceRef.current = setTimeout(() => {
        window.history.replaceState(null, "", `${window.location.pathname}?${sp.toString()}`);
      }, 150);
    }
  }, []);

  // 3. Initial Hydration from URL
  useEffect(() => {
    if (hasSyncedFromUrl.current) return;
    const q = new URLSearchParams(window.location.search);
    const pool = q.get("pool") || "";
    const tInQ = q.get("tokenIn") || "";
    const tOutQ = q.get("tokenOut") || "";
    const uiQ = q.get("ui");
    const modeQ = (q.get("mode") || "exactIn").toLowerCase();

    if (uiQ) setUiMode(uiQ);
    if (tInQ) setTokenInAddr(tInQ);
    if (tOutQ) setTokenOutAddr(tOutQ);
    if (pool) setPoolAddr(pool);
    
    setMode(modeQ === "out" || modeQ === "exactout" ? "exactOut" : "exactIn");
    setDirection(q.get("dir") === "1to0" ? "1to0" : "0to1");
    if (q.get("amt")) setAmount(q.get("amt"));
    if (q.get("inv") === "1") setInvert(true);
    if (q.get("slip")) setSlippageBps(Number(q.get("slip")));
    if (q.get("dl")) setDeadlineSecs(Number(q.get("dl")));
    
    hasSyncedFromUrl.current = true;
  }, [setMode, setDirection, setAmount, setInvert, setSlippageBps, setDeadlineSecs, setUiMode, setPoolAddr]);

  // 4. Keep URL in sync with token changes
  useEffect(() => {
    updateUrl({ tokenIn: tokenInAddr || "", tokenOut: tokenOutAddr || "" });
  }, [tokenInAddr, tokenOutAddr, updateUrl]);

  return { pairIndex, knownTokens, tokenInAddr, tokenOutAddr, setTokenInAddr, setTokenOutAddr, updateUrl, setKnownTokens, setPairIndex};
}