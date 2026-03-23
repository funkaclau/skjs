// src/utils/swap.js

import { addrEq } from "./helpers.js";

export function dirForAction(poolMeta, tokenAddr, action) {
  const t0 = poolMeta?.token0?.address;
  const t1 = poolMeta?.token1?.address;
  if (!t0 || !t1) return "0to1";

  const is0 = addrEq(tokenAddr, t0);
  const is1 = addrEq(tokenAddr, t1);
  if (!is0 && !is1) return "0to1";

  if (action === "buy") return is0 ? "1to0" : "0to1";
  return is0 ? "0to1" : "1to0";
}

export function poolDirForToken(poolMeta, tokenAddr, action) {
  const t0 = poolMeta?.token0?.address;
  const t1 = poolMeta?.token1?.address;
  if (!t0 || !t1) return "0to1";

  const is0 = addrEq(t0, tokenAddr);
  if (is0) return action === "buy" ? "1to0" : "0to1";
  return action === "buy" ? "0to1" : "1to0";
}

export function makeSwapLink({ pool, dir, mode = "exactIn", inv = 0, slip = 50, dl = 300 }) {
  const sp = new URLSearchParams();
  sp.set("pool", pool);
  sp.set("mode", mode);
  sp.set("dir", dir);
  sp.set("inv", String(inv));
  sp.set("slip", String(slip));
  sp.set("dl", String(dl));
  return `/swap?${sp.toString()}`;
}

export function makeSwapUrl({ pool, slip = 50, dl = 300, mode = "exactIn" }) {
  const sp = new URLSearchParams();
  sp.set("pool", pool);
  sp.set("mode", mode);
  sp.set("slip", String(slip));
  sp.set("dl", String(dl));
  return `/swap?${sp.toString()}`;
}

