import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { formatNumberWithCommas } from "../utils";
import { useBalances } from "../hooks";
import { kiddoIMG, shidoIMG } from "../assets";

/**
 * PLACEHOLDER FOR LOCAL SUBDOMAIN LINKS
 * Add your internal route objects here.
 */
const localNavLinks = [
  { label: "Markets", to: "/markets" },
];

const ecosystemLinks = [
  { label: "Portfolio Tracker", href: "https://tools.shidokid.com/portfolio", priority: true },
  { label: "Tools", href: "https://tools.shidokid.com" },
  { label: "Factory", href: "https://factory.shidokid.com" },
];

const Navbar = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { userBalance, userShidoBalance } = useBalances();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  const [appsOpen, setAppsOpen] = useState(false);
  const appsRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (appsOpen && appsRef.current && !appsRef.current.contains(e.target)) {
        setAppsOpen(false);
      }
    };
    const onEsc = (e) => { 
      if (e.key === "Escape") {
        setMenuOpen(false);
        setAppsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen, appsOpen]);

  return (
    <nav className="relative z-[800] w-full bg-black text-white px-6 flex items-center justify-between h-[60px] border-b border-white/5">
      
      {/* 1. LEFT: Logo */}
      <div className="flex items-center w-[150px] lg:w-[250px]">
        <Link to="https://shidokid.com">
          <img src={kiddoIMG} alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10" />
        </Link>
      </div>

      {/* 2. CENTER: Symmetric Hub */}
      <div className="hidden lg:flex flex-1 items-center justify-around px-8">
        
        {/* Context Anchor */}
        <div className="flex flex-col items-center">
          <Link to="/" className="text-[11px] font-black text-yellow-400 tracking-[0.4em] uppercase">
            SWAP
          </Link>
          <div className="h-[1px] w-6 bg-yellow-400/60 mt-0.5" />
        </div>

        {/* Local Links Placeholder */}
        <div className="flex items-center gap-8">
          {localNavLinks.map(({ label, to }) => (
            <Link 
              key={label} 
              className="text-[12px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.15em]" 
              to={to}
            >
              {label}
            </Link>
          ))}
          {localNavLinks.length === 0 && (
             <span className="text-[10px] text-zinc-700 italic tracking-widest uppercase selection:bg-transparent">
               {/* Insert local links here */}
             </span>
          )}
        </div>

        {/* Ecosystem Dropdown */}
        <div className="relative" ref={appsRef}>
          <button 
            onClick={() => setAppsOpen((p) => !p)} 
            className="flex items-center gap-2 text-[12px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-[0.15em]"
          >
            Ecosystem <span className={`text-[9px] transition-transform ${appsOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {appsOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
              {ecosystemLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="block px-4 py-2.5 text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. RIGHT: Wallet & Menu */}
      <div className="flex items-center justify-end gap-4 w-[150px] lg:w-[250px]">
        <div className="hidden md:block scale-90 origin-right">
          <ConnectButton
            accountStatus="address"
            showBalance={false}
            chainStatus="icon"
          />
        </div>

        <button onClick={toggleMenu} className="group flex flex-col items-end gap-1.5 p-2 transition-all">
          <div className={`h-[2px] bg-white transition-all ${menuOpen ? 'w-4' : 'w-6'}`} />
          <div className={`h-[2px] bg-white transition-all ${menuOpen ? 'w-6' : 'w-4'}`} />
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-[790] bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)} />
          <div
            ref={menuRef}
            className="absolute right-4 top-[70px] w-72 bg-[#050505] border border-white/10 rounded-2xl shadow-2xl z-[800] overflow-hidden p-6"
          >
            <div className="flex flex-col">
              
              {/* Navigation Section */}
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-4">Navigation</p>
              <div className="flex flex-col gap-1 mb-8">
                <Link 
                  to="/" 
                  onClick={() => setMenuOpen(false)} 
                  className="py-3 px-4 rounded-xl text-yellow-400 font-black tracking-[0.2em] uppercase bg-yellow-400/5 border border-yellow-400/10 mb-2 text-xs"
                >
                  SWAP INTERFACE
                </Link>
                {localNavLinks.map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 rounded-xl text-zinc-300 font-bold hover:bg-white/5 transition text-xs uppercase tracking-widest"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* Ecosystem Section */}
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-4">Ecosystem</p>
              <div className="flex flex-col gap-1 mb-8">
                {ecosystemLinks.map((link) => (
                  <a 
                    key={link.label}
                    href={link.href} 
                    className="py-3 px-4 rounded-xl text-zinc-300 font-bold hover:bg-white/5 transition text-xs uppercase tracking-widest"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Portfolio Section */}
              {isConnected && (
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-4">Portfolio</p>
                  <div className="grid gap-2 mb-6">
                    <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <img src={kiddoIMG} className="w-5 h-5" alt="KIDDO" />
                        <span className="text-sm font-bold tracking-tight">{formatNumberWithCommas(userBalance ?? 0)}</span>
                      </div>
                      <span className="text-[9px] font-black text-zinc-500">KIDDO</span>
                    </div>
                    <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <img src={shidoIMG} className="w-5 h-5" alt="SHIDO" />
                        <span className="text-sm font-bold tracking-tight">{formatNumberWithCommas(userShidoBalance ?? 0)}</span>
                      </div>
                      <span className="text-[9px] font-black text-zinc-500">SHIDO</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center mb-4">
                <ConnectButton label="Connect Wallet" showBalance={false} />
              </div>

              {isConnected && (
                <button
                  onClick={() => { disconnect(); setMenuOpen(false); }}
                  className="mt-2 w-full py-3 text-[10px] font-black text-red-500/60 uppercase tracking-widest border-t border-white/5 hover:text-red-500 transition-colors"
                >
                  [ Disconnect ]
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;