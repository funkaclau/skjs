import React, { useState } from "react";
import { Chip, TokenPicker } from "../../components/swap";
import { BalanceControl } from "./BalanceControl";

export function SwapInputWidget({ eng, floorTo, fmtUSD }) {
  const {
    mode, setMode, feePercent, bench, amount, setAmount,
    quote, displayBalIn, tokenInAddr, handleTokenChange, TOKENS,
    displayBalOut, tokenOutAddr, swapTokenOrder, slippageBps,
    setSlippageBps, simulate, executeSwap, error, loadingMeta,
    // Extract the live USD prices and direction from the engine
    usdToken0, usdToken1, direction
  } = eng;

  const [showSlider, setShowSlider] = useState(false);

  // Helper to truncate decimals without trailing zeros
  const formatDisplayAmount = (val) => {
    if (!val || isNaN(val)) return "";
    const num = parseFloat(val);
    if (num === 0) return "0";
    return Number(num.toFixed(6)).toString();
  };

  // Determine which price applies to IN vs OUT based on the current direction
  const priceIn = direction === "0to1" ? usdToken0 : usdToken1;
  const priceOut = direction === "0to1" ? usdToken1 : usdToken0;

  // Extract the numeric values currently displayed in the inputs
  const valInStr = mode === "exactIn" ? amount : quote?.amountInShow?.split(" ")[0];
  const valIn = parseFloat(valInStr) || 0;
  
  const valOutStr = mode === "exactOut" ? amount : quote?.amountOutShow?.split(" ")[0];
  const valOut = parseFloat(valOutStr) || 0;

  // Calculate total USD values
  // Prefer quote-derived USD (simulation result), then fallback to local price*amount.
  const usdValueIn = (quote?.amountInUSD != null)
    ? quote.amountInUSD
    : (priceIn && valIn ? valIn * priceIn : null);
  const usdValueOut = (quote?.amountOutUSD != null)
    ? quote.amountOutUSD
    : (priceOut && valOut ? valOut * priceOut : null);
  // Resolve symbols for the route display
  const getSymbol = (addr) => TOKENS.find(t => t.address.toLowerCase() === addr.toLowerCase())?.symbol || "???";

  return (
    <div className="w-full max-w-full overflow-hidden bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08] rounded-3xl p-3 sm:p-4 md:p-6 shadow-2xl min-w-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-6 min-w-0">
        <div className="inline-flex max-w-full flex-wrap p-1 rounded-xl bg-black/40 border border-white/5">
          {["exactIn", "exactOut"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 sm:px-5 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                mode === m ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {m === "exactIn" ? "EXACT IN" : "EXACT OUT"}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 min-w-0 flex-wrap">
          <Chip className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">FEE {feePercent}%</Chip>
          {bench?.usdPerWshido && (
            <Chip className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
              WSHIDO {fmtUSD(bench.usdPerWshido)}
            </Chip>
          )}
        </div>
      </div>

      <div className="relative flex flex-col gap-2">
        {/* FROM Row (Input) */}
        <div className="input-area relative p-3 sm:p-4 rounded-[1.25rem] bg-black/20 border border-white/5 focus-within:border-blue-500/50 transition-all">
          <div className="flex justify-between items-center mb-1 relative">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Sell</span>
            
            {/* Balance Selector for Mobile & Desktop */}
            <div className="relative">
              <button 
                onClick={() => setShowSlider(!showSlider)}
                className={`text-[11px] sm:text-[12px] font-mono transition-all flex items-center gap-1.5 px-2 py-0.5 rounded-lg border ${
                  showSlider 
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-400" 
                    : "bg-black/40 border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <span className="text-[9px] font-black opacity-40 uppercase">Bal</span> 
                {displayBalIn}
              </button>
              
              {showSlider && (
                <div className="absolute right-0 top-full mt-2 z-[60]">
                  <BalanceControl 
                    balance={displayBalIn} 
                    onSelect={(val) => {
                      setMode("exactIn");
                      setAmount(val);
                      setShowSlider(false);
                    }} 
                    onClose={() => setShowSlider(false)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <input
                placeholder="0.00"
                value={
                  mode === "exactIn" 
                    ? amount 
                    : formatDisplayAmount(quote?.amountInShow?.split(" ")[0])
                }
                onChange={(e) => {
                  setMode("exactIn");
                  setAmount(e.target.value);
                }}
                className="w-full bg-transparent text-sm sm:text-lg md:text-4xl font-mono text-white outline-none placeholder:text-gray-800 tracking-tighter"
              />
              <div className="text-[10px] sm:text-[11px] font-medium text-gray-500 mt-1">
                {usdValueIn ? fmtUSD(usdValueIn) : "—"}
              </div>
            </div>
            <div className="shrink-0">
              <TokenPicker value={tokenInAddr} onChange={(addr) => handleTokenChange("in", addr)} tokens={TOKENS} />
            </div>
          </div>
        </div>

        {/* Flip Button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <button
            onClick={swapTokenOrder}
            className="p-2 sm:p-2.5 bg-[#1a1b1f] border border-white/10 hover:border-blue-500/50 rounded-xl text-white transition-all shadow-xl hover:shadow-blue-500/10 group"
            type="button"
          >
            <div className="group-hover:scale-110 transition-transform font-bold text-base sm:text-lg">⇅</div>
          </button>
        </div>

        {/* TO Row */}
        <div className="input-area relative p-3 sm:p-4 rounded-[1.25rem] bg-black/20 border border-white/5 focus-within:border-blue-500/50 transition-all">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Buy</span>
            <div className="text-[11px] sm:text-[12px] font-mono flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/40 border border-transparent text-gray-400">
              <span className="text-[9px] font-black opacity-40 uppercase">Bal</span> 
              {displayBalOut}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <input
                placeholder="0.00"
                value={
                  mode === "exactOut" 
                    ? amount 
                    : formatDisplayAmount(quote?.amountOutShow?.split(" ")[0])
                }
                onChange={(e) => {
                  setMode("exactOut");
                  setAmount(e.target.value);
                }}
                className="w-full bg-transparent text-sm sm:text-lg md:text-4xl font-mono text-white outline-none placeholder:text-gray-800 tracking-tighter"
              />
              <div className="text-[10px] sm:text-[11px] font-medium text-gray-500 mt-1">
                {usdValueOut ? fmtUSD(usdValueOut) : "—"}
              </div>
            </div>
            <div className="shrink-0">
              <TokenPicker value={tokenOutAddr} onChange={(addr) => handleTokenChange("out", addr)} tokens={TOKENS} />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-hop Route Badge - Only shows if more than 1 hop */}
      {quote?.isMultiHop && (
        <div className="mt-2 flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10 animate-in fade-in zoom-in duration-300">
          <span className="text-[9px] font-black text-blue-500/50 uppercase tracking-tighter">Route</span>
          <div className="flex items-center gap-1.5">
            {quote.path.map((addr, i) => (
              <React.Fragment key={i}>
                <span className="text-[10px] font-mono font-bold text-blue-400/90">
                  {getSymbol(addr)}
                </span>
                {i < quote.path.length - 1 && (
                  <span className="text-gray-700 text-[10px] opacity-50">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mt-6">
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-[0.1em]">Slippage</label>
          <div className="relative group">
            <input
              value={slippageBps}
              onChange={(e) => setSlippageBps(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-sm font-mono outline-none group-focus-within:border-blue-500/30 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-600">BPS</span>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={simulate}
            className="flex-1 px-4 sm:px-6 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold text-[10px] uppercase hover:bg-white/10 transition-all tracking-widest"
          >
            Simulate
          </button>
          <button
            onClick={executeSwap}
            disabled={!quote || error?.includes("No direct pool")}
            className="flex-[2] px-6 sm:px-10 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 font-black text-[10px] uppercase transition-all shadow-lg active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}