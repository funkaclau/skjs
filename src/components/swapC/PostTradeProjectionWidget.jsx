import {
  CustomPoolSelect, PairInline,
  TokenLogo, Row, Chip, TokenSelect, TokenPicker
} from "../../components/swap";
export function PostTradeProjectionWidget({ eng, projections, slippageBadge, fmt8, showLab, deltaBadge }) {
  const { quote, meta, railCollapsedH } = eng;

  if (!quote?.postTradeOutPerIn || !meta || projections.length === 0) return null;

  return (
    <div className={`${showLab ? "lg:col-span-2" : ""} ${showLab && railCollapsedH ? "max-w-3xl mx-auto w-full" : "w-full"} min-w-0`}>
      <div className="glass-card p-3 sm:p-5 md:p-6 border-indigo-500/20 bg-indigo-500/5 min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="min-w-0">
            <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-indigo-300">
              Post-Trade Forecast
            </h4>
            <p className="text-[9px] text-indigo-500/60 font-medium">Market state after execution</p>
          </div>
          <div className="shrink-0 scale-90 sm:scale-100 origin-right">
            {slippageBadge(quote.slippageVsIdealPct)}
          </div>
        </div>

        {/* Projections Grid */}
        <div className={`grid grid-cols-1 ${projections.length > 1 ? "xs:grid-cols-2 sm:grid-cols-2" : ""} gap-3 sm:gap-4 min-w-0`}>
          {projections.map((proj, i) => {
            const b = deltaBadge(proj.delta);
            return (
              <div key={i} className="bg-black/40 p-3 sm:p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TokenLogo symbol={proj.sym?.symbol} size={14} />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter truncate">
                      {proj.sym?.symbol} Floor
                    </span>
                  </div>
                  
                  {/* "Whale-Proof" font sizing for prices */}
                  <div className="font-mono text-base sm:text-xl font-bold text-white tracking-tighter break-all">
                    ${fmt8(proj.usd ?? 0)}
                  </div>
                </div>

                {/* Impact Delta Badge */}
                <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] mt-2 font-black w-fit border ${b.cls.includes('red') ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                  {b.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        {(quote.anchors?.inAnchored || quote.anchors?.outAnchored) && (
          <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-indigo-400/50 italic leading-tight">
            USD Anchors (WSHIDO/USDC) omitted from projections.
          </div>
        )}
      </div>
    </div>
  );
}