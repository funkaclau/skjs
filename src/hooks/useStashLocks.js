import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { getStash } from "../utils/getContract";
import { convertBigIntToFloat } from "../utils";

export function useStashLocks(web3, account) {
  const [contract, setContract] = useState(null);
  const [locks, setLocks] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!web3) return;

    try {
      const instance = await getStash(web3);
      setContract(instance);
      const owner = await instance.tokenCreator();
      instance.setSender(account)
      if (account && account.toLowerCase() === owner.toLowerCase()) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }

      const lockData = await instance.getLocks(owner);
      const now = Math.floor(Date.now() / 1000);

      const formatted = lockData.map((lock, i) => {
        const seconds = convertBigIntToFloat(lock.unlockTime, 0) - now;
        const daysRemaining = seconds / 86400;
        return {
          scIndex: i, // ✅ original index on-chain
          label: lock.label,
          amount: parseFloat(web3.utils.fromWei(lock.amount, "ether")),
          daysRemaining: daysRemaining < 0 ? -1 : daysRemaining.toFixed(2),
        };
      });
      

      const sorted = formatted.sort((a, b) => {
        if (a.daysRemaining < 0 && b.daysRemaining < 0) return 0;
        if (a.daysRemaining < 0) return -1;
        if (b.daysRemaining < 0) return 1;
        return a.daysRemaining - b.daysRemaining;
      });
      

      setLocks(sorted);
    } catch (err) {
      console.error("Stash fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [web3, account]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { contract, locks, isOwner, loading, refresh };
}
