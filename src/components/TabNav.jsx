import React from "react";

const TabNav = ({ tabs, activeTab, onChange, adminTab }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tabs.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded font-semibold transition ${
            activeTab === key ? "bg-blue-500 text-black" : "bg-gray-800 text-white"
          }`}
        >
          {icon} {label}
        </button>
      ))}

      {adminTab?.enabled && (
        <button
          onClick={() => onChange("admin")}
          className={`px-4 py-2 rounded font-semibold transition ${
            activeTab === "admin" ? "bg-blue-500 text-black" : "bg-gray-800 text-white"
          }`}
        >
          🛠 {adminTab.label || "Admin"}
        </button>
      )}
    </div>
  );
};

export default TabNav;
