import {
  CustomPoolSelect, PairInline,
  TokenLogo, Row, Chip, TokenSelect, TokenPicker
} from "../../components/swap";
export function RightRailWidget({ 
  eng, fmtUSD, fmt8, shouldShowToken0Markets, shouldShowToken1Markets, marketLabelFor, floorTo
}) {
  const {
    bench, usdRefOpen, setUsdRefOpen, meta, routes0, routes1, poolAddr, selectRoute, dominant
  } = eng;

  return (
    <aside className="space-y-4 lg:sticky lg:top-8 h-max transition-all min-w-0 w-full">
      {/* Global Base Price Card */}
      <div className="glass-card p-3 sm:p-4 border-blue-500/20 bg-blue-500/5 min-w-0">
        <div className="flex justify-between items-center gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Global Base</span>
            <span className="text-[10px] text-gray-500 font-mono">WSHIDO / USD</span>
          </div>
          <span className="text-base sm:text-lg font-mono font-bold text-white tracking-tighter">
            {fmtUSD(bench?.usdPerWshido)}
          </span>
        </div>
      </div>

      {/* Multi-Pool Reference Section */}
      <div className="glass-card p-4 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-4 border-b border-white/5 pb-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Liquidity Venues
          </span>
          <button
            onClick={() => setUsdRefOpen(!usdRefOpen)}
            className="text-[9px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-tight"
          >
            {usdRefOpen ? "[-] Collapse" : "[+] Expand"}
          </button>
        </div>

        {usdRefOpen && meta && (
          <div className="space-y-6 no-scrollbar overflow-y-auto max-h-[500px] min-w-0">
            {[
              { show: shouldShowToken0Markets, routes: routes0, token: meta.token0 },
              { show: shouldShowToken1Markets, routes: routes1, token: meta.token1 }
            ].map((section, idx) => (
              section.show && section.routes.length > 0 && (
                <div key={idx} className={idx > 0 ? "pt-4 border-t border-white/5" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <TokenLogo symbol={section.token.symbol} size={16} />
                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-tight truncate">
                      {section.token.symbol} Markets
                    </p>
                  </div>

                  <div className="space-y-2">
                    {section.routes.map((r) => {
                      const isActive = r.pool.toLowerCase() === poolAddr.toLowerCase();
                      return (
                        <div
                          key={r.pool}
                          className={`group p-2.5 rounded-xl border transition-all ${
                            isActive
                              ? "bg-blue-600/10 border-blue-500/40"
                              : "bg-black/40 border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-tighter">
                              ${fmt8(r.usd)}
                            </span>
                            <button
                              onClick={() => selectRoute(r.pool)}
                              disabled={isActive}
                              className={`text-[9px] px-2 py-1 rounded font-black transition-all ${
                                isActive 
                                  ? "bg-blue-500/20 text-blue-400 cursor-default" 
                                  : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
                              }`}
                            >
                              {isActive ? "ACTIVE" : "SWITCH"}
                            </button>
                          </div>

                          <div className="flex justify-between items-end gap-2">
                            <div className="min-w-0">
                              <div className="text-[10px] font-bold text-gray-400 truncate">
                                {marketLabelFor(section.token.symbol, r.pool)}
                              </div>
                              <div className="text-[9px] font-mono text-gray-600 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                {r.pool.slice(0, 6)}...{r.pool.slice(-4)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ))}

            {/* Arbitrage / Spread Logic */}
            {dominant && (
              <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Arbitrage Spread</p>
                </div>
                <div className="text-[11px] font-mono text-gray-300">
                  Δ vs Peers:{" "}
                  <span className={`font-bold ${dominant.spreadPct > 0 ? "text-amber-400" : "text-green-400"}`}>
                    {floorTo(dominant.spreadPct, 2).toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}