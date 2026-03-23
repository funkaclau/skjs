import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {PRESET_POOLS, prettySymbol} from "../config/price"
import {splitSymbolsFromLabel, resolveLogoUrl, fmt8, shortSym} from "../utils/price"
function Chip({children, className=""}) {
  return <span className={`px-1.5 py-0.5 rounded-md text-[11px] border border-gray-700/70 bg-gray-800/70 ${className}`}>{children}</span>;
}
function MidBlock({ value, base, quote }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <span className="font-mono">{fmt8(value)}</span>
        <TokenLogo symbol={quote} className="shrink-0" />
        <span className="text-gray-300 text-sm">{shortSym(quote)} per</span>
        <TokenLogo symbol={base} className="shrink-0" />
        <span className="text-gray-300 text-sm">{shortSym(base)}</span>
      </div>
      <div className="flex items-center gap-1.5 opacity-80">
        <span className="font-mono">{fmt8(1 / (value || 1))}</span>
        <TokenLogo symbol={base} className="shrink-0" />
        <span className="text-gray-400 text-xs">{shortSym(base)} per</span>
        <TokenLogo symbol={quote} className="shrink-0" />
        <span className="text-gray-400 text-xs">{shortSym(quote)}</span>
      </div>
    </div>
  );
}


/* ---------- tiny UI helpers ---------- */
const Box = ({children, className=""}) => (
  <div className={`rounded-xl bg-gray-800/70 p-3 border border-gray-700/60 ${className}`}>{children}</div>
);

const Row = ({label, value, hint}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="font-mono">{value}</span>
    {hint && <span className="ml-2 text-[11px] text-gray-500">{hint}</span>}
  </div>
);

function TokenLogo({ symbol, size = 18, className = "" }) {
  const symUpper = (prettySymbol(symbol) || "").trim().toUpperCase();
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    setFailed(false);
  }, [symUpper]);

  const src = failed || !symUpper ? null : resolveLogoUrl(symUpper);

  if (!src) {
    const initials = symUpper ? symUpper[0] : "?";
    return (
      <span
        title={symUpper || "?"}
        className={`inline-flex items-center justify-center rounded-full bg-gray-700 text-white font-semibold ${className}`}
        style={{ width: size, height: size }}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={symUpper}
      title={symUpper}
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
function RouteRow({ r, symbol, active, onUse }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <div className="flex items-center gap-2">
        <span className="font-mono">${fmt8(r.usd)} / {symbol}</span>
        <span className="text-[11px] text-gray-500">{r.pool.slice(0,6)}…{r.pool.slice(-4)}</span>
        {Array.isArray(r.route) && r.route.length > 0 && (
          <Chip className="ml-1 text-[10px] opacity-80">{r.route.join(" → ")}</Chip>
        )}
        {active && <Chip className="ml-1">active</Chip>}
      </div>
      {!active && (
        <button
          onClick={onUse}
          className="px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs"
        >
          Use
        </button>
      )}
    </div>
  );
}


function PairInline({ value, base, quote }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="font-mono">{fmt8(value)}</span>
      <TokenLogo symbol={base} className="shrink-0" />
      <span className="text-gray-300 text-sm whitespace-nowrap">{shortSym(base)} per</span>
      <TokenLogo symbol={quote} className="shrink-0" />
      <span className="text-gray-300 text-sm whitespace-nowrap">{shortSym(quote)}</span>
    </div>
  );
}


function PoolOptionRow({ label }) {
  const [left, rightPart] = (label || "").split("/");
  const leftSym  = prettySymbol((left || "").trim());
  const rightSym = prettySymbol(((rightPart || "").split("—")[0] || "").trim());
  return (
    <div className="flex items-center gap-2">
      <TokenLogo symbol={leftSym} />
      <span className="text-gray-200 text-sm">{leftSym}</span>
      <span className="text-gray-500 text-sm">/</span>
      <TokenLogo symbol={rightSym} />
      <span className="text-gray-200 text-sm">{rightSym}</span>
    </div>
  );
}

/* --- Custom dropdown with logos (single rendering; no duplicate badge) --- */
function CustomPoolSelect({ value, onChange, tokens, placeholder="— Select a pool —" }) {
  const [open, setOpen] = React.useState(false);
  
  const selected = useMemo(() => 
    tokens.find(t => t.address?.toLowerCase() === value?.toLowerCase()),
    [tokens, value]
  );
  const [selectedLeft, selectedRight] = selected ? splitSymbolsFromLabel(selected.label) : ["", ""];
  React.useEffect(() => {
    function onKey(e){ if (e.key === "Escape") setOpen(false); }
    function onClick(e){ if (!e.target.closest?.("[data-poolselect]")) setOpen(false); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("click", onClick); };
  }, []);

  return (
    <div className="relative" data-poolselect>
      <button
        type="button"
        onClick={() => setOpen(o=>!o)}
        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 pr-10 text-left flex items-center gap-2"
      >
        {selected ? (
          <>
            <span className="inline-flex items-center gap-1">
              <TokenLogo key={`sel-left-${selectedLeft}`} symbol={selectedLeft} />
              <TokenLogo key={`sel-right-${selectedRight}`} symbol={selectedRight} />
            </span>
            <span className="truncate">
              {selected ? selected.label : poolAddr ? poolAddr : placeholder}
            </span>
          </>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span className="ml-auto opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-128 overflow-auto rounded-lg border border-gray-700 bg-gray-900 shadow-lg">
          {PRESET_POOLS.map((p) => (
            <button
              key={p.address}
              type="button"
              onClick={() => { onChange(p.address); setOpen(false); }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-800 flex items-center justify-between ${
                p.address.toLowerCase() === (value||"").toLowerCase() ? "bg-gray-800" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <PoolOptionRow label={p.label} />
              </div>
              <span className="text-[11px] text-gray-500 ml-2">{p.address.slice(0,6)}…{p.address.slice(-4)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------- Collapsible -------- */
function Collapsible({ title, defaultOpen=true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-3">
      <button onClick={()=>setOpen(o=>!o)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 text-sm">
        <span className="text-gray-200">{title}</span>
        <span className="text-gray-400">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function DealMeter({ title, deals, symbol, currentPool, onUseBuy, onUseSell }) {
  if (!deals) return null;
  const buyGood  = deals.buyEdgePct  > 0.5;
  const sellGood = deals.sellEdgePct > 0.5;

  return (
    <Box className="space-y-1">
      ...
      <div className="text-[11px] text-gray-400 mt-1 space-y-1">
        {deals.nextBuy && deals.nextBuy.pool.toLowerCase() !== currentPool.toLowerCase() && (
          <div>
            Better buy at {deals.nextBuy.pool.slice(0,6)}…{deals.nextBuy.pool.slice(-4)} (${fmt8(deals.nextBuy.usd)})
            <button onClick={onUseBuy} className="ml-2 px-2 py-0.5 rounded bg-blue-600 text-white text-xs">Use</button>
          </div>
        )}
        {deals.nextSell && deals.nextSell.pool.toLowerCase() !== currentPool.toLowerCase() && (
          <div>
            Better sell at {deals.nextSell.pool.slice(0,6)}…{deals.nextSell.pool.slice(-4)} (${fmt8(deals.nextSell.usd)})
            <button onClick={onUseSell} className="ml-2 px-2 py-0.5 rounded bg-blue-600 text-white text-xs">Use</button>
          </div>
        )}
      </div>
    </Box>
  );
}

function TokenSelect({ value, onChange, tokens, placeholder="Select token" }) {
  const [open, setOpen] = React.useState(false);

  const selected = tokens.find(
    (t) => (t.address || "").toLowerCase() === (value || "").toLowerCase()
  );

  React.useEffect(() => {
    function onKey(e){ if (e.key === "Escape") setOpen(false); }
    function onClick(e){ if (!e.target.closest?.("[data-tokenselect]")) setOpen(false); }

    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="relative" data-tokenselect>
      <button
        type="button"
        onClick={() => setOpen(o=>!o)}
        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 pr-10 text-left flex items-center gap-2"
      >
        {selected ? (
          <>
            <TokenLogo symbol={selected.symbol} />
            <span>{selected.symbol}</span>
          </>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}

        <span className="ml-auto opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-80 overflow-auto rounded-lg border border-gray-700 bg-gray-900 shadow-lg">
          {tokens.map((t) => (
            <button
              key={t.address}
              type="button"
              onClick={() => {
                onChange(t.address);
                setOpen(false);
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-800 flex items-center gap-2"
            >
              <TokenLogo symbol={t.symbol} />
              <span>{t.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TokenPicker({ value, onChange, tokens }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);

  const filtered = tokens.filter(t => t.symbol?.toLowerCase().includes(query.toLowerCase()));
  const selected = tokens.find(t => t.address?.toLowerCase() === value?.toLowerCase());

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const leftPos = rect.left + window.scrollX;
      // Keep it from flying off the right side
      const optimizedLeft = Math.min(leftPos, window.innerWidth - 160);
      
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: optimizedLeft,
        width: rect.width
      });
    }
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        /* Ultra-compact padding: px-1.5 py-1 (mobile) */
        className="flex items-center gap-1 px-1.5 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-gray-800/60 border border-white/5 hover:border-white/10 transition-all shrink-0"
      >
        <div className="scale-[0.8] sm:scale-100 origin-center">
          <TokenLogo symbol={selected?.symbol} size={18} />
        </div>
        
        {/* Tightening the text tracking and width */}
        <span className="text-[10px] sm:text-sm font-black text-white uppercase tracking-tight">
          {selected?.symbol || "???"}
        </span>
        
        {/* Smaller, lighter chevron */}
        <span className="text-[8px] opacity-30 ml-0.5">▼</span>
      </button>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div
            className="bg-[#1a1b1f] border border-white/10 rounded-xl shadow-2xl z-[9999] overflow-hidden"
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              minWidth: 140,
              maxWidth: 180 
            }}
          >
            <div className="p-2 border-b border-white/5">
              <input
                placeholder="Find..."
                value={query}
                autoFocus
                onChange={e => setQuery(e.target.value)}
                className="w-full px-2 py-1 bg-black/40 text-[10px] rounded-md border border-white/5 outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="max-h-56 overflow-y-auto">
              {filtered.map(t => (
                <button
                  key={t.address}
                  onClick={() => { onChange(t.address); setOpen(false); setQuery(""); }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-left transition-colors"
                >
                  <TokenLogo symbol={t.symbol} size={16} />
                  <span className="text-[11px] font-bold text-gray-200">{t.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
export {DealMeter, Collapsible, CustomPoolSelect, PoolOptionRow, PairInline, RouteRow, TokenLogo, Row, Box, Chip, MidBlock, TokenSelect, TokenPicker}