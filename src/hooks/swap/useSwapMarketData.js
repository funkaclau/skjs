// src/hooks/swap/useSwapMarketData.js
import { useState, useEffect } from "react";
import { DOMINANT_GROUPS } from "../../config/price";
import {
  getWshidoUsdOracle,
  resolveUsdPerToken,
  midOutPerIn_from_slot0,
  price1Per0_from_sqrtP,
  getMetaCached,
  toChecksumOrNull
} from "../../utils/price";
import {listUsdAcrossPools} from "../../utils/swap/usd";
import { isAnchoredUsd } from "../../utils/swap/math";
import { FULL_TOKEN_LIST } from "../../config/price";

export function useSwapMarketData({ web3, meta, poolAddr, tokenInAddr, tokenOutAddr }) {
  const [bench, setBench] = useState(null);

  // Pool-specific USD values (for direct pool display)
  const [usdToken0, setUsdToken0] = useState(null);
  const [usdToken1, setUsdToken1] = useState(null);

  // Selection-specific USD values (for routing & simulator)
  const [usdIn, setUsdIn] = useState(null);
  const [usdOut, setUsdOut] = useState(null);

  const [routes0, setRoutes0] = useState([]);
  const [routes1, setRoutes1] = useState([]);
  const [dominant, setDominant] = useState(null);

  /* ---------------- 1. Bench Oracle ---------------- */
  useEffect(() => { 
    (async () => setBench(await getWshidoUsdOracle(web3)))(); 
  }, [web3]);

  /* ---------------- 2. Pool Token USD (Direct Pair) ---------------- */
  useEffect(() => {
    (async () => {
      if (!bench || !meta) { 
        setUsdToken0(null); setUsdToken1(null); return; 
      }
      try {
        const [r0, r1] = await Promise.all([
          resolveUsdPerToken(web3, meta.token0.address, bench),
          resolveUsdPerToken(web3, meta.token1.address, bench)
        ]);
        setUsdToken0(r0?.usd || null);
        setUsdToken1(r1?.usd || null);
      } catch {
        setUsdToken0(null); setUsdToken1(null);
      }
    })();
  }, [web3, bench, meta]);

    /* ---------------- 3. Selection USD (Routed/Simulator) - AUDITED ---------------- */
    useEffect(() => {
    const SPECIAL_PATHS = {
        "RAKUN": "KENSEI",
        "CWK": "ILCFNBR",
        "DESHI": "SDS"
    };

    const getDeepUsd = async (addr) => {
        if (isAnchoredUsd(addr, bench)) return 1;
        
        const tokenObj = FULL_TOKEN_LIST.find(t => t.address.toLowerCase() === addr.toLowerCase());
        const symbol = tokenObj?.symbol?.toUpperCase();

        // Handle Special 3-Hop Cases
        if (SPECIAL_PATHS[symbol]) {
        const intermediateSym = SPECIAL_PATHS[symbol];
        const intermediateToken = FULL_TOKEN_LIST.find(t => t.symbol.toUpperCase() === intermediateSym);
        
        if (intermediateToken && web3 && bench) {
            // 1. Get Price of Token in Intermediate
            const pairRes = await resolveUsdPerToken(web3, addr, bench); 
            // 2. Get Price of Intermediate in USD
            const interRes = await resolveUsdPerToken(web3, intermediateToken.address, bench);
            
            if (pairRes?.usd && interRes?.usd) {
            return pairRes.usd * interRes.usd;
            }
        }
        }

        // Standard Path (Token -> WSHIDO -> USDC)
        if (web3 && bench) {
        const res = await resolveUsdPerToken(web3, addr, bench);
        return res?.usd ?? null;
        }
        return null;
    };

    const updateSelectionUsd = async () => {
        if (tokenInAddr) {
        const val = await getDeepUsd(tokenInAddr);
        setUsdIn(val);
        } else {
        setUsdIn(null);
        }

        if (tokenOutAddr) {
        const val = await getDeepUsd(tokenOutAddr);
        setUsdOut(val);
        } else {
        setUsdOut(null);
        }
    };

    updateSelectionUsd();
    }, [web3, tokenInAddr, tokenOutAddr, bench]);

  /* ---------------- 4. Market Routes & Dominance ---------------- */
  useEffect(() => {
    (async () => {
      if (!bench || !meta) { 
        setRoutes0([]); setRoutes1([]); return; 
      }
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

  useEffect(() => {
    (async () => {
      if (!bench || !meta || !toChecksumOrNull(web3, poolAddr)) { 
        setDominant(null); return; 
      }
      const activeL = poolAddr.toLowerCase();
      const group = DOMINANT_GROUPS.find(g => g.pools.map(p => p.toLowerCase()).includes(activeL));
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
        return peerUSD ? peerUSD.usd * peerPerDom : null;
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

  return {
    bench,
    usdToken0,
    usdToken1,
    usdIn,
    usdOut,
    routes0,
    routes1,
    dominant,
    setDominant
  };
}