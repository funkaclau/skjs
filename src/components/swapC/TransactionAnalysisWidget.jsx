import {
  CustomPoolSelect, PairInline,
  TokenLogo, Row, Chip, TokenSelect, TokenPicker
} from "../../components/swap";
export function TransactionAnalysisWidget({ eng, analysisOpen, setAnalysisOpen, fmt8 }) {
  const { quote, midOutPerIn, midBase, midQuote, feePercent, deadlineSecs, mode } = eng;

  if (!quote) return null;

  return (
    /* Reduced padding on mobile to save horizontal space */
    <div className="glass-card p-3 sm:p-6 mt-5 border-blue-500/10 min-w-0 overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-blue-400">
            Transaction Analysis
          </h3>
          <p className="text-[9px] text-gray-500 mt-0.5 font-medium">Post-quote diagnostics</p>
        </div>

        <button
          onClick={() => setAnalysisOpen((v) => !v)}
          className={`px-3 py-1.5 rounded-lg border text-[10px] font-black transition-all ${
            analysisOpen 
              ? "bg-blue-600/20 border-blue-500/40 text-blue-400" 
              : "bg-white/5 border-white/10 text-gray-400"
          }`}
        >
          {analysisOpen ? "DETAILED" : "COMPACT"}
        </button>
      </div>

      {/* --- COMPACT VIEW (Always visible or toggled) --- */}
      {!analysisOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-w-0">
          <div className="bg-black/20 p-2 rounded-xl border border-white/5">
            <p className="text-[8px] font-bold text-gray-600 uppercase mb-1">Impact</p>
            <div className={`text-[11px] font-mono font-bold ${Number(quote.impactVsMidPct) > 1 ? "text-amber-400" : "text-green-400"}`}>
              {fmt8(quote.impactVsMidPct)}%
            </div>
          </div>
          <div className="bg-black/20 p-2 rounded-xl border border-white/5">
            <p className="text-[8px] font-bold text-gray-600 uppercase mb-1">Slippage</p>
            <div className={`text-[11px] font-mono font-bold ${Number(quote.slippageVsIdealPct) > 2 ? "text-red-300" : "text-gray-200"}`}>
              {fmt8(quote.slippageVsIdealPct)}%
            </div>
          </div>
          {/* Third box only on tablet+ or full width on mobile if you prefer */}
          <div className="bg-black/20 p-2 rounded-xl border border-white/5 col-span-2 sm:col-span-1">
            <p className="text-[8px] font-bold text-gray-600 uppercase mb-1 text-blue-500/50">Gas Est.</p>
            <div className="text-[11px] font-mono font-bold text-blue-400/80">
              {quote.gasEstimate} <span className="text-[8px] opacity-50 uppercase">Units</span>
            </div>
          </div>
        </div>
      )}

      {/* --- LAB/DETAILED VIEW --- */}
      {analysisOpen && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Unit Price Logic - The "Core" of Lab Mode */}
          <div className="space-y-2">
            <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-1">Unit Price Logic</h4>
            <div className="bg-black/40 rounded-2xl p-3 border border-white/5 space-y-2.5">
              {[
                { l: "Market Mid", v: quote.unitUSD?.now?.in, color: "text-gray-400" },
                { l: "After-Fee Ideal", v: quote.unitUSD?.ideal?.in, color: "text-gray-400" },
                { l: "Execution Price", v: quote.unitUSD?.after?.in, color: "text-blue-400", bold: true },
              ].map((row, i) => (
                <div key={i} className={`flex justify-between items-center ${row.bold ? "pt-2 border-t border-white/10" : ""}`}>
                  <span className={`text-[10px] ${row.bold ? "font-black" : "font-bold text-gray-600"}`}>{row.l}</span>
                  <span className={`text-[11px] font-mono ${row.color}`}>${fmt8(row.v ?? 0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Protocol Diagnostics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
              <span className="text-[8px] font-bold text-gray-600 uppercase block mb-1">Route Type</span>
              <span className="text-[10px] font-bold text-gray-300">
                 {quote.isMultiHop ? "Multi-hop V3" : "Direct Pool V3"}
              </span>
            </div>
            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
              <span className="text-[8px] font-bold text-gray-600 uppercase block mb-1">Protection</span>
              <span className="text-[10px] font-bold text-gray-300">
                 {mode === "exactIn" ? "Min. Received" : "Max. Sold"}
              </span>
              <div className="text-[10px] font-mono text-emerald-400 mt-1 truncate">
                {mode === "exactIn" ? quote.minReceived : quote.maxSold}
              </div>
            </div>
          </div>

          {/* Anchor Disclaimer */}
          {(quote.anchors?.inAnchored || quote.anchors?.outAnchored) && (
            <div className="px-2 py-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
              <p className="text-[9px] text-blue-400/80 leading-tight italic">
                Notice: WSHIDO/USDC parity anchoring is active.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}