// components/ProgressBar.jsx
import React from "react";

const ProgressBar = ({ current, max }) => {
  const percent = max > 0 ? (current / max) * 100 : 0;
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full h-6 bg-black/70 rounded-full overflow-hidden relative border border-blue-500 shadow-[0_0_10px_#3ea5ff] mb-5">
      <div
        className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-[0_0_15px_#3ea5ff] transition-all duration-300"
        style={{ width: `${clamped}%` }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center text-blue-300 font-bold text-sm tracking-wider">
        {clamped.toFixed(2)}%
      </div>
    </div>
  );
};

export default ProgressBar;
