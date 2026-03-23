import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import Web3 from "web3";
import { useAccount } from "wagmi";

import { BalanceContext } from "../providers";
import { TOKEN_ABI } from "../config";

// pick the same RPC you use elsewhere
const RPC_URL = "https://evm.shidoscan.net";

/* =========================
   MAIN BALANCES (Context)
   ========================= */
function useBalances(spender = null) {
  const {
    userBalance,
    userShidoBalance,
    allowances,
    fetchAllowance,
    approveAllowance,
    refreshAllowance,
    fetchShidoBalance,
  } = useContext(BalanceContext);

  const [userAllowance, setUserAllowance] = useState("0");

  useEffect(() => {
    if (!spender) {
      setUserAllowance("0");
      return;
    }

    (async () => {
      const val = allowances?.[spender] ?? (await fetchAllowance(spender));
      setUserAllowance(val);
    })();
  }, [spender, allowances, fetchAllowance]);

  const refreshBalance = useCallback(async () => {
    if (typeof fetchShidoBalance === "function") {
      await fetchShidoBalance();
    }
  }, [fetchShidoBalance]);

  return {
    userBalance,
    userShidoBalance,
    userAllowance,
    approveAllowance,
    refreshAllowance,
    refreshBalance,
  };
}

/* =========================
   GENERIC ERC20 BALANCE
   ========================= */
export function useTokenBalance(tokenAddress) {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState("0");

  const web3 = useMemo(() => new Web3(RPC_URL), []);

  const refreshTokenBalance = useCallback(async () => {
    if (!isConnected || !address || !tokenAddress) return;

    const token = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
    const raw = await token.methods.balanceOf(address).call();

    // NOTE: this assumes 18 decimals; if you want correct decimals, we’ll format by token.decimals()
    setBalance(web3.utils.fromWei(raw.toString(), "ether"));
  }, [web3, address, isConnected, tokenAddress]);

  useEffect(() => {
    refreshTokenBalance();
  }, [refreshTokenBalance]);

  return { balance, refreshTokenBalance };
}

/* =========================
   ERC20 META + ALLOWANCE
   ========================= */
export function useTokenInfo(tokenAddress, spender) {
  const { address, isConnected } = useAccount();
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [allowance, setAllowance] = useState("0");

  const web3 = useMemo(() => new Web3(RPC_URL), []);

  const refreshInfo = useCallback(async () => {
    if (!isConnected || !address || !tokenAddress) return;

    const token = new web3.eth.Contract(TOKEN_ABI, tokenAddress);

    const [sym, dec, rawAllowance] = await Promise.all([
      token.methods.symbol().call(),
      token.methods.decimals().call(),
      spender ? token.methods.allowance(address, spender).call() : Promise.resolve("0"),
    ]);

    setSymbol(sym);
    setDecimals(Number(dec));

    // NOTE: still assumes 18 decimals for displaying allowance.
    setAllowance(web3.utils.fromWei(rawAllowance.toString(), "ether"));
  }, [web3, address, isConnected, tokenAddress, spender]);

  useEffect(() => {
    refreshInfo();
  }, [refreshInfo]);

  return { symbol, decimals, allowance, refreshInfo };
}

export default useBalances;
