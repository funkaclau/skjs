import React, { useState, useEffect, useRef } from "react";

export function BalanceControl({ balance, onSelect, onClose }) {
  const [percent, setPercent] = useState(0);
  const popoverRef = useRef(null);
  const rawMax = parseFloat(balance?.toString().replace(/,/g, "")) || 0;

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (e) => {
    const p = e.target.value;
    setPercent(p);
    const calculated = (rawMax * (p / 100)).toFixed(6);
    onSelect(calculated);
  };

  return (
    <div 
      ref={popoverRef}
      className="absolute right-0 top-10 z-[70] w-60 p-5 bg-[#1a1b1f] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-150"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Set Amount</span>
        <span className="text-[12px] font-mono text-blue-400 font-bold">{percent}%</span>
      </div>
      
      <input
        type="range"
        min="0"
        max="100"
        value={percent}
        onChange={handleChange}
        className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
      />
      
      <div className="grid grid-cols-4 gap-2">
        {[25, 50, 75, 100].map((p) => (
          <button
            key={p}
            onClick={() => {
              setPercent(p);
              onSelect((rawMax * (p / 100)).toFixed(6));
            }}
            className="text-[10px] font-bold py-2 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white text-gray-400 transition-all"
          >
            {p}%
          </button>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <div className="text-[10px] text-gray-500 font-mono truncate">
          Selected: <span className="text-gray-300">{(rawMax * (percent / 100)).toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}