import { useCallback, useEffect, useMemo, useState } from "react";

import { TOKEN_ABI } from "../config";
import { useAccount } from "wagmi";
import Web3 from "web3";
import { RPC_URL } from "../config/price";
// Floors to 8dp and respects token decimals (not hardcoded to 18)
export function useTokenBalance(tokenAddress, decimals = 18) {
  const { address } = useAccount();
  const [raw, setRaw] = useState("0"); // raw string (wei-like, per token decimals)
  const [web3] = useState(() => new Web3(new Web3.providers.HttpProvider(RPC_URL, { timeout: 15000 })));
  const refreshTokenBalance = useCallback(async () => {
    try {
      if (!web3 || !address || !tokenAddress) { setRaw("0"); return; }
      const erc20 = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
      const val = await erc20.methods.balanceOf(address).call();
      setRaw(String(val ?? "0"));
    } catch {
      setRaw("0");
    }
  }, [web3, address, tokenAddress]);

  // Human string with floor to 8 decimals
  const formatted = useMemo(() => {
    try {
      const bn = BigInt(raw || "0");
      const base = 10n ** BigInt(decimals || 18);
      const whole = bn / base;
      const frac  = bn % base;
      const frac8 = (frac * 10n ** 8n) / base; // floor to 8dp
      const fracStr = frac8.toString().padStart(8, "0").replace(/0+$/,"");
      return fracStr ? `${whole.toString()}.${fracStr}` : whole.toString();
    } catch {
      return "0";
    }
  }, [raw, decimals]);

  useEffect(() => { refreshTokenBalance(); }, [refreshTokenBalance]);

  return { raw, formatted, refreshTokenBalance };
}
