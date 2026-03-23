// src/components/TokenLogo.jsx
import React, { useState } from "react";
import { TOKEN_IMAGE_MAP } from "../config";

export const TokenLogo = ({ address, symbol, size = 32 }) => {
  const normalized = address?.toLowerCase();
  const src = TOKEN_IMAGE_MAP[normalized];
  
  // DEBUG LINE: Check your console!
  

  if (!src) {
    return (
      <div 
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full bg-zinc-800 border border-white/10 text-[10px] font-bold text-zinc-500 uppercase"
      >
        {symbol?.slice(0, 1)}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={symbol} 
      style={{ width: size, height: size }} 
      className="rounded-full object-cover"
      onError={(e) => {
        console.error(`Failed to load image at: ${src}`);
        e.target.style.display = 'none'; 
      }}
    />
  );
};