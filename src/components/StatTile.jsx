// src/components/StatTile.jsx
import React from "react";
import { CN } from "../utils";

export const StatTile = ({ label, value, sub, className = "" }) => {
  return (
    <div className={`${CN.baseCard} relative overflow-hidden p-5 border-white/5 bg-[#0d0d0f]/40 backdrop-blur-xl ${className}`}>
      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-blue-600/50 via-blue-400 to-transparent opacity-50" />
      
      {/* Label */}
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
        {label}
      </p>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">
          {value}
        </h3>
      </div>

      {/* Subtext/Secondary Info */}
      {sub && (
        <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-zinc-400">
          <span className="h-[1px] w-3 bg-blue-500/50" />
          {sub}
        </div>
      )}
      
      {/* Subtle Corner Ornament */}
      <div className="absolute bottom-1 right-1 h-1 w-1 bg-white/10 rounded-full" />
    </div>
  );
};