import {
  CustomPoolSelect, PairInline,
  TokenLogo, Row, Chip, TokenSelect, TokenPicker
} from "../../components/swap";
import { PRESET_POOLS } from "../../config";
export function SwapHeaderWidget({ eng, showLab, chipOn, chipOff, routeLabel }) {
  const {
    uiMode, setUiMode,
    usdRefOpen, setUsdRefOpen,
    railFoldV, setRailFoldV,
    railCollapsedH, setRailCollapsedH,
    autoRun, setAutoRun,
    poolAddr, setPoolAddr,
    quote
  } = eng;

  return (
    <div className="flex flex-col gap-4 mb-6 sm:mb-8 min-w-0">
      {/* Top Row: Title & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            Shido Dex <span className="text-blue-500/50">/</span> Swap
          </h2>
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mt-0.5">
            Liquidity Router v3
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
            {["simple", "pro", "lab"].map((m) => (
              <button
                key={m}
                onClick={() => setUiMode(m)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-black transition-all uppercase ${
                  uiMode === m 
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lab Mode Advanced Controls */}
      {uiMode === "lab" && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
          {/* Pool Selection Row */}
          <div className="flex flex-col md:flex-row items-stretch gap-2 bg-blue-500/5 p-2 rounded-2xl border border-blue-500/10">
            <div className="w-full md:w-72">
              <CustomPoolSelect
                value={poolAddr}
                onChange={setPoolAddr}
                tokens={PRESET_POOLS}
                disabled={quote?.isMultiHop}
              />
            </div>
            <input
              placeholder="Custom Contract Address 0x..."
              value={poolAddr ?? ""}
              onChange={(e) => setPoolAddr(e.target.value.trim())}
              disabled={quote?.isMultiHop}
              className="flex-1 px-4 py-2 rounded-xl bg-black/60 border border-white/5 focus:border-blue-500/50 outline-none text-xs font-mono text-blue-400 placeholder:text-gray-700 disabled:opacity-30"
            />
          </div>

          {/* Engine Toggles Row */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "USD Refs", on: usdRefOpen, set: setUsdRefOpen, color: "blue" },
              { label: "Vertical Rail", on: railFoldV, set: setRailFoldV, color: "purple" },
              { label: "Side Panels", on: !railCollapsedH, set: setRailCollapsedH, color: "amber", invert: true },
              { label: "Auto-Simulate", on: autoRun, set: setAutoRun, color: "emerald" },
            ].map((t) => {
              const isOn = t.invert ? !t.on : t.on;
              return (
                <button
                  key={t.label}
                  onClick={() => t.set((v) => !v)}
                  className={`px-3 py-1.5 text-[9px] font-bold rounded-lg border transition-all uppercase tracking-wider ${
                    isOn ? chipOn[t.color] : "bg-black/20 border-white/5 text-gray-600 hover:border-white/20"
                  }`}
                >
                  {t.label}: {isOn ? "Active" : "Off"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Route Indicator (Optional, show in Pro/Lab) */}
      {uiMode !== "simple" && routeLabel && (
        <div className="flex items-center gap-2 px-1">
          <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tight">
            Active Route: <span className="text-gray-300">{routeLabel}</span> {quote?.isMultiHop && "(Multi-Hop)"}
          </span>
        </div>
      )}
    </div>
  );
}