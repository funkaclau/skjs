import React from "react";

const CustomModal = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg mx-4 rounded-xl bg-gray-900 border border-white/10 text-white p-8 shadow-2xl ${className}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-400"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
};


export default CustomModal;

