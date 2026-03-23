// src/hooks/swap/useSwapAssets.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { multicallBalances } from "../../utils";
import { fromRaw, floorTo } from "../../utils/price";
import { FULL_TOKEN_LIST } from "../../config/price";

export function useSwapAssets({ web3, evmAccount, meta }) {
  const [balancesMap, setBalancesMap] = useState({});
  const [balancesLoaded, setBalancesLoaded] = useState(false);

  const fetchAllBalances = useCallback(async () => {
    if (!web3 || !evmAccount) return;
    try {
      const tokenAddresses = FULL_TOKEN_LIST.map(t => t.address);
      const rawBalances = await multicallBalances(web3, evmAccount, tokenAddresses);
      const formattedMap = {};
      FULL_TOKEN_LIST.forEach(token => {
        const addr = token.address.toLowerCase();
        const fullDecimals = fromRaw(rawBalances[addr] || "0", token.decimals);
        formattedMap[addr] = floorTo(fullDecimals, 4);
      });
      setBalancesMap(formattedMap);
      setBalancesLoaded(true);
    } catch (err) {
      console.error("[fetchAllBalances] failed:", err);
    }
  }, [web3, evmAccount]);

  // Auto-fetch on account load
  useEffect(() => {
    if (evmAccount && !balancesLoaded) fetchAllBalances();
  }, [evmAccount, balancesLoaded, fetchAllBalances]);

  // Derived current-pair balances
  const bal0 = useMemo(() => {
    const addr = meta?.token0?.address?.toLowerCase();
    return addr ? (balancesMap[addr] || "0") : "0";
  }, [balancesMap, meta]);

  const bal1 = useMemo(() => {
    const addr = meta?.token1?.address?.toLowerCase();
    return addr ? (balancesMap[addr] || "0") : "0";
  }, [balancesMap, meta]);

  return { balancesMap, fetchAllBalances, bal0, bal1, balancesLoaded };
}