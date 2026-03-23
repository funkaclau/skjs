// src/hooks/swap/useSwapSimulator.js
import { useCallback } from "react";
import { 
  QUOTER_V2, QUOTER_V2_ABI, SWAP_ROUTER_ABI, SWAP_ROUTER_V3 
} from "../../config/price";
import { TOKEN_ABI } from "../../config/abi";
import { 
  toRaw, fromRaw, price1Per0_from_sqrtP, encodePathExactIn, 
  encodePathExactOut, fmt8 
} from "../../utils/price";
import { parseAmountToWei } from "../../utils";
import { ratioOutPerInRaw, ratioInPerOutRaw, isAnchoredUsd } from "../../utils/swap/math";
import { handleApproveAndRunWeb3 } from "../../utils";
import { FULL_TOKEN_LIST } from "../../config/price";

export function useSwapSimulator({
  web3, writeWeb3, evmAccount,
  meta, poolAddr, mode, direction, invert, amount, 
  slippageBps, deadlineSecs, feeFrac,
  usdIn, usdOut, bench,
  tokenInAddr, tokenOutAddr, bestPath,
  setQuote, setError, setLoadingMeta, onAfterSwap
}) {

  const simulate = useCallback(async () => {
    setError(""); 
    setQuote(null);

    const hasDirectPool = !!(poolAddr && poolAddr.startsWith('0x'));
    const isMultiHop = bestPath && bestPath.pools && bestPath.pools.length > 1;

    if (!hasDirectPool && !isMultiHop) {
      setError("Enter a valid pool address or choose a routed pair.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Enter a positive amount.");
      return;
    }

    // --- DIRECT PATH (Single-Hop) ---
    if (!isMultiHop) {
      if (!meta) {
        setError("Pool metadata not loaded yet.");
        return;
      }

      const p_1_per_0 = price1Per0_from_sqrtP(meta.sqrtPriceX96, meta.token0.decimals, meta.token1.decimals);
      const midOutPerInRaw = direction === "0to1" ? p_1_per_0 : (1 / p_1_per_0);
      const midOutPerIn = invert ? (1 / midOutPerInRaw) : midOutPerInRaw;

      const tokenIn  = direction === "0to1" ? meta.token0 : meta.token1;
      const tokenOut = direction === "0to1" ? meta.token1 : meta.token0;
      const quoter   = new web3.eth.Contract(QUOTER_V2_ABI, QUOTER_V2);

      try {
        let outHuman, inHuman, ticksCrossed, gasEstimate, rawIn, rawOut, sqrtAfter;

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
          catch { setError("Quoter reverted — likely not enough liquidity."); return; }
          rawIn        = BigInt(res.amountIn ?? res["0"]);
          inHuman      = fromRaw(rawIn, tokenIn.decimals);
          ticksCrossed = Number(res.initializedTicksCrossedList?.[0] ?? res["2"] ?? 0);
          gasEstimate  = (res.gasEstimate ?? res["3"] ?? "").toString();
          sqrtAfter    = BigInt(res.sqrtPriceX96AfterList?.[0] ?? res["1"] ?? 0);
        }

        const postTrade_p10 = price1Per0_from_sqrtP(sqrtAfter, meta.token0.decimals, meta.token1.decimals);
        const postTradeOutPerInRaw = (direction === "0to1") ? postTrade_p10 : (1 / postTrade_p10);
        const postTradeOutPerIn = invert ? (1 / postTradeOutPerInRaw) : postTradeOutPerInRaw;

        const feeAdj = 1 - feeFrac;
        const idealOutPerInRaw = midOutPerInRaw * feeAdj;
        const idealOutPerIn = invert ? (1 / idealOutPerInRaw) : idealOutPerInRaw;
        const idealInPerOut = 1 / idealOutPerInRaw;

        let avgExecPriceRaw, impactVsMidPct, slippageVsIdealPct, minReceived=null, maxSold=null;

        if (mode === "exactIn") {
          const execOutPerIn = ratioOutPerInRaw(rawOut, rawIn, tokenOut.decimals, tokenIn.decimals);
          avgExecPriceRaw = execOutPerIn;
          impactVsMidPct = midOutPerInRaw > 0 ? (1 - (execOutPerIn / midOutPerInRaw)) * 100 : 0;
          slippageVsIdealPct = idealOutPerInRaw > 0 ? (1 - (execOutPerIn / idealOutPerInRaw)) * 100 : 0;
          minReceived = `${fmt8(Number(outHuman) * (1 - slippageBps/10000))} ${tokenOut.symbol}`;
        } else {
          const execInPerOut = ratioInPerOutRaw(rawIn, rawOut, tokenIn.decimals, tokenOut.decimals);
          avgExecPriceRaw = 1 / execInPerOut;
          impactVsMidPct = (1 / midOutPerInRaw) > 0 ? ((execInPerOut / (1 / midOutPerInRaw)) - 1) * 100 : 0;
          slippageVsIdealPct = idealInPerOut > 0 ? ((execInPerOut / idealInPerOut) - 1) * 100 : 0;
          maxSold = `${fmt8(Number(inHuman) * (1 + slippageBps/10000))} ${tokenIn.symbol}`;
        }

        const avgPrice = invert ? (1 / avgExecPriceRaw) : avgExecPriceRaw;
        const usdPerIn = usdIn;
        const usdPerOut = usdOut;

        setQuote({
          mode, fee: meta.fee, tokenIn, tokenOut,
          amountInShow: mode === "exactIn" ? `${amount} ${tokenIn.symbol}` : `${fromRaw(rawIn, tokenIn.decimals)} ${tokenIn.symbol}`,
          amountOutShow: mode === "exactIn" ? `${fromRaw(rawOut, tokenOut.decimals)} ${tokenOut.symbol}` : `${amount} ${tokenOut.symbol}`,
          amountInUSD: usdIn ? Number(fromRaw(rawIn, tokenIn.decimals)) * usdIn : null,
          amountOutUSD: usdOut ? Number(fromRaw(rawOut, tokenOut.decimals)) * usdOut : null,
          avgPrice, midOutPerIn, idealOutPerIn, impactVsMidPct, slippageVsIdealPct,
          ticksCrossed, gasEstimate, postTradeOutPerIn, minReceived, maxSold,
          unitUSD: {
            now: { in: (usdPerOut && midOutPerInRaw) ? midOutPerInRaw * usdPerOut : null, out: (usdPerIn && midOutPerInRaw) ? usdPerIn / midOutPerInRaw : null },
            after: { in: (usdPerOut && postTradeOutPerInRaw) ? postTradeOutPerInRaw * usdPerOut : null, out: (usdPerIn && postTradeOutPerInRaw) ? usdPerIn / postTradeOutPerInRaw : null }
          },
          anchors: { inAnchored: isAnchoredUsd(tokenIn.address, bench), outAnchored: isAnchoredUsd(tokenOut.address, bench) }
        });
      } catch (e) { setError(e?.message || "Quoter call failed"); }
      return;
    }

    // --- MULTI-HOP PATH ---
    try {
        
      const addrIn = typeof tokenInAddr === 'string' ? tokenInAddr : tokenInAddr?.address;
      const addrOut = typeof tokenOutAddr === 'string' ? tokenOutAddr : tokenOutAddr?.address;
      const tInObj = FULL_TOKEN_LIST.find(t => t.address.toLowerCase() === addrIn.toLowerCase());
      const tOutObj = FULL_TOKEN_LIST.find(t => t.address.toLowerCase() === addrOut.toLowerCase());

      if (!tInObj || !tOutObj) {
        setError("Token metadata not found for routed path.");
        return;
      }
      const quoter = new web3.eth.Contract(QUOTER_V2_ABI, QUOTER_V2);
      const inputRawStr = toRaw(amount, mode === "exactIn" ? tInObj.decimals : tOutObj.decimals).toString();

      let rawIn, rawOut, outHuman, inHuman, res;
      if (mode === "exactIn") {
        res = await quoter.methods.quoteExactInput(encodePathExactIn(bestPath.path, bestPath.fees), inputRawStr).call();
        rawIn = BigInt(inputRawStr);
        rawOut = BigInt(res.amountOut ?? res["0"]);
        outHuman = fromRaw(rawOut, tOutObj.decimals);
      } else {
        res = await quoter.methods.quoteExactOutput(encodePathExactOut(bestPath.path, bestPath.fees), inputRawStr).call();
        rawOut = BigInt(inputRawStr);
        rawIn = BigInt(res.amountIn ?? res["0"]);
        inHuman = fromRaw(rawIn, tInObj.decimals);
      }

      const execOutPerIn = ratioOutPerInRaw(rawOut, rawIn, tOutObj.decimals, tInObj.decimals);
      const totalFeeFrac = 1 - bestPath.fees.reduce((acc, f) => acc * (1 - (f / 1_000_000)), 1);
      const refMid = execOutPerIn / (1 - totalFeeFrac);
      // --- FIX: ADD USD CALCULATION FOR MULTI-HOP ---

      const amountInRaw = mode === "exactIn" ? rawIn : rawIn; 
        const amountOutRaw = mode === "exactIn" ? rawOut : rawOut;

        const inHumanCalculated = fromRaw(amountInRaw, tInObj.decimals);
        const outHumanCalculated = fromRaw(amountOutRaw, tOutObj.decimals);

      setQuote({
        mode, 
        isMultiHop: true, 
        path: bestPath.path, 
        tokenIn: tInObj, 
        tokenOut: tOutObj,
        amountInShow: `${inHumanCalculated} ${tInObj.symbol}`,
        amountOutShow: `${outHumanCalculated} ${tOutObj.symbol}`,
        
        // Deterministic USD conversion using MarketData's resolved prices
        amountInUSD: usdIn ? Number(inHumanCalculated) * usdIn : null,
        amountOutUSD: usdOut ? Number(outHumanCalculated) * usdOut : null,
        
        avgPrice: invert ? (1 / execOutPerIn) : execOutPerIn,
        impactVsMidPct: refMid > 0 ? (1 - (execOutPerIn / refMid)) * 100 : 0,
        gasEstimate: (res.gasEstimate ?? res["3"] ?? "").toString(),
        minReceived: mode === "exactIn" ? `${fmt8(Number(outHumanCalculated) * (1 - slippageBps/10000))} ${tOutObj.symbol}` : null,
        maxSold: mode === "exactOut" ? `${fmt8(Number(inHumanCalculated) * (1 + slippageBps/10000))} ${tInObj.symbol}` : null,
        anchors: { inAnchored: isAnchoredUsd(addrIn, bench), outAnchored: isAnchoredUsd(addrOut, bench) }
      });
    } catch (e) { setError(e?.message || "Multi-hop simulation failed"); }
  }, [
    web3, poolAddr, meta, direction, invert, mode, amount, slippageBps, 
    feeFrac, usdIn, usdOut, bench, tokenInAddr, tokenOutAddr, bestPath, setQuote, setError]);

  const executeSwap = useCallback(async (quote) => {
    try {
      if (!quote || !writeWeb3 || !evmAccount) return;
      const router = new writeWeb3.eth.Contract(SWAP_ROUTER_ABI, SWAP_ROUTER_V3);
      const deadline = Math.floor(Date.now() / 1000) + deadlineSecs;
      const pathHex = quote.mode === "exactIn" 
        ? encodePathExactIn(bestPath.path, bestPath.fees) 
        : encodePathExactOut(bestPath.path, bestPath.fees);

      const tokenContract = new writeWeb3.eth.Contract(TOKEN_ABI, tokenInAddr);

      if (quote.mode === "exactIn") {
        const inputRaw = parseAmountToWei(amount, quote.tokenIn.decimals).toString();
        const minOutHuman = Number((quote.amountOutShow || "").split(" ")[0]) * (1 - slippageBps / 10000);
        
        await handleApproveAndRunWeb3({
          tokenContract, account: evmAccount, spender: SWAP_ROUTER_V3, amount,
          decimals: quote.tokenIn.decimals, setApproving: setLoadingMeta,
          onAction: async () => {
            await router.methods.exactInput({
              path: pathHex, recipient: evmAccount, deadline,
              amountIn: inputRaw, amountOutMinimum: toRaw(minOutHuman, quote.tokenOut.decimals).toString()
            }).send({ from: evmAccount });
            if (onAfterSwap) onAfterSwap();
          }
        });
      } else {
        const outputRaw = parseAmountToWei(amount, quote.tokenOut.decimals).toString();
        const maxInHuman = Number((quote.amountInShow || "").split(" ")[0]) * (1 + slippageBps / 10000);

        await handleApproveAndRunWeb3({
          tokenContract, account: evmAccount, spender: SWAP_ROUTER_V3, 
          amount: maxInHuman.toFixed(quote.tokenIn.decimals),
          decimals: quote.tokenIn.decimals, setApproving: setLoadingMeta,
          onAction: async () => {
            await router.methods.exactOutput({
              path: pathHex, recipient: evmAccount, deadline,
              amountOut: outputRaw, amountInMaximum: toRaw(maxInHuman, quote.tokenIn.decimals).toString()
            }).send({ from: evmAccount });
            if (onAfterSwap) onAfterSwap();
          }
        });
      }
    } catch (err) { setError(err?.message || "Swap failed"); }
  }, [writeWeb3, evmAccount, slippageBps, amount, bestPath, deadlineSecs, tokenInAddr, onAfterSwap, setError, setLoadingMeta]);

  return { simulate, executeSwap };
}