import {POOL_ABI, Q96, Q192, WSHIDO_USDC_POOL, prettySymbol, TOKEN_ABI  } from "../config"
import { EXPLICIT_MAP, ROUTE_HINTS_BY_SYMBOL, PRESET_POOLS } from "../config/markets";
// Optional extra pools to help derive USD for tricky symbols

const toChecksumOrNull = (web3, a) => {
  const s = (a || "").trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(s)) return null;
  try { return web3.utils.toChecksumAddress(s); }
  catch { return s.toLowerCase(); }
};
const eqAddr = (a,b) => a && b && a.toLowerCase() === b.toLowerCase();

function toRaw(amount, decimals) {
  const [i, f = ""] = String(amount).split(".");
  const frac = (f + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(i + frac);
}
function fromRaw(raw, decimals) {
  const s = BigInt(raw).toString();
  if (decimals === 0) return s;
  const pad = s.padStart(decimals + 1, "0");
  const i = pad.slice(0, -decimals);
  const f = pad.slice(-decimals).replace(/0+$/, "");
  return f ? `${i}.${f}` : i;
}
function price1Per0_from_sqrtP(sqrtP, dec0, dec1) {
  const s = BigInt(sqrtP);
  const SCALE = 36n;
  const pow  = BigInt(dec0 - dec1);
  let num = s * s;
  if (pow >= 0n) {
    num = num * (10n ** (SCALE + pow));
  } else {
    num = (num * (10n ** SCALE)) / (10n ** (-pow));
  }
  const raw = num / Q192;
  return Number(raw) / 1e36;
}
function encodeFee3(feeUint24) {
  return Number(feeUint24).toString(16).padStart(6, "0");
}
function encodePathExactIn(tokenIn, feeUint24, tokenOut) {
  // Support both single-hop and multi-hop signatures.
  // Single-hop (legacy): (tokenIn, fee, tokenOut)
  // Multi-hop (canonical v3): tokens[], fees[] =>
  //   t0 + f0 + t1 + f1 + t2 + ...
  if (Array.isArray(tokenIn)) {
    const tokens = tokenIn;
    const fees = Array.isArray(feeUint24) ? feeUint24 : [];
    let hex = "0x";
    if (tokens.length === 0) return hex;
    // first token
    hex += String(tokens[0] || "").toLowerCase().slice(2);
    // then fee + next token for each hop
    for (let i = 0; i < tokens.length - 1; i++) {
      const fee = fees[i] ?? fees[fees.length - 1] ?? 0;
      const next = String(tokens[i + 1] || "").toLowerCase();
      hex += encodeFee3(fee) + next.slice(2);
    }
    return hex;
  }
  // Fallback: original single-hop behavior
  return "0x" + tokenIn.toLowerCase().slice(2) + encodeFee3(feeUint24) + tokenOut.toLowerCase().slice(2);
}
function encodePathExactOut(tokenIn, feeUint24, tokenOut) {
  // Support both single-hop and multi-hop signatures.
  // Single-hop (legacy): (tokenIn, fee, tokenOut)
  // Multi-hop: (tokensArray, feesArray) – reverse tokens/fees and reuse same pattern
  if (Array.isArray(tokenIn)) {
    const tokens = tokenIn;
    const fees = Array.isArray(feeUint24) ? feeUint24 : [];
    let hex = "0x";
    if (tokens.length === 0) return hex;
    const revTokens = [...tokens].reverse();
    const revFees   = [...fees].reverse();
    // first token (which is original tokenOut)
    hex += String(revTokens[0] || "").toLowerCase().slice(2);
    for (let i = 0; i < revTokens.length - 1; i++) {
      const fee = revFees[i] ?? revFees[revFees.length - 1] ?? 0;
      const next = String(revTokens[i + 1] || "").toLowerCase();
      hex += encodeFee3(fee) + next.slice(2);
    }
    return hex;
  }
  // Fallback: original single-hop behavior
  return "0x" + tokenOut.toLowerCase().slice(2) + encodeFee3(feeUint24) + tokenIn.toLowerCase().slice(2);
}

function fmtUSD(n) {
  const x = Number(n);
  if (!isFinite(x)) return "—";
  if (x >= 1_000_000_000) return `$${(x/1_000_000_000).toFixed(2)}B`;
  if (x >= 1_000_000)     return `$${(x/1_000_000).toFixed(2)}M`;
  if (x >= 1_000)         return `$${(x/1_000).toFixed(2)}k`;
  if (x >= 1)             return `$${x.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
  return `$${x.toFixed(8)}`;
}

/* =========================================================
   Web3 helpers & caching
   ========================================================= */
const poolMetaCache = new Map(); // key: poolAddress lowercased -> meta

async function fetchPoolMeta(web3, poolAddr) {
  const pool = new web3.eth.Contract(POOL_ABI, poolAddr);
  const [t0, t1, fee, slot0] = await Promise.all([
    pool.methods.token0().call(),
    pool.methods.token1().call(),
    pool.methods.fee().call(),
    pool.methods.slot0().call(),
  ]);
  const c0 = new web3.eth.Contract(TOKEN_ABI, t0);
  const c1 = new web3.eth.Contract(TOKEN_ABI, t1);
  const [d0, s0, d1, s1] = await Promise.all([
    c0.methods.decimals().call(), c0.methods.symbol().call(),
    c1.methods.decimals().call(), c1.methods.symbol().call(),
  ]);
  return {
    fee: Number(fee),
    sqrtPriceX96: slot0.sqrtPriceX96,
    token0: { address: t0, symbol: s0, decimals: Number(d0) },
    token1: { address: t1, symbol: s1, decimals: Number(d1) },
    __poolAddr: poolAddr,
  };
}


async function getMetaCached(web3, addr) {
  const k = addr.toLowerCase();
  if (poolMetaCache.has(k)) return poolMetaCache.get(k);
  const m = await fetchPoolMeta(web3, addr);
  poolMetaCache.set(k, m);
  return m;
}

function midOutPerIn_from_slot0(sqrtPriceX96, dec0, dec1) {
  return price1Per0_from_sqrtP(sqrtPriceX96, dec0, dec1);
}

async function getWshidoUsdOracle(web3) {
  const m = await fetchPoolMeta(web3, WSHIDO_USDC_POOL);
  const p_1_per_0 = midOutPerIn_from_slot0(m.sqrtPriceX96, m.token0.decimals, m.token1.decimals);
  const t0 = (m.token0.symbol || "").toUpperCase();
  const t1 = (m.token1.symbol || "").toUpperCase();

  let wshidoAddr, usdcAddr, usdPerWshido;
  if (t0.includes("WSHIDO") && t1.includes("USDC")) {
    wshidoAddr = m.token0.address; usdcAddr = m.token1.address; usdPerWshido = p_1_per_0;
  } else if (t1.includes("WSHIDO") && t0.includes("USDC")) {
    wshidoAddr = m.token1.address; usdcAddr = m.token0.address; usdPerWshido = 1 / p_1_per_0;
  } else {
    const looksUSDC0 = m.token0.decimals === 6;
    if (looksUSDC0) { usdcAddr = m.token0.address; wshidoAddr = m.token1.address; usdPerWshido = 1 / p_1_per_0; }
    else { usdcAddr = m.token1.address; wshidoAddr = m.token0.address; usdPerWshido = p_1_per_0; }
  }
  return { wshidoAddr, usdcAddr, usdPerWshido, meta: m };
}

/* Build a small adjacency map for 1-hop discovery */
function buildPoolIndex(metaList) {
  const G = new Map();
  const add = (a, b, pool) => {
    const k = a.toLowerCase();
    if (!G.has(k)) G.set(k, []);
    G.get(k).push({ peer: b.toLowerCase(), pool });
  };
  for (const m of metaList) {
    add(m.token0.address, m.token1.address, m.__poolAddr);
    add(m.token1.address, m.token0.address, m.__poolAddr);
  }
  return G;
}
function midPer1(meta, fromAddr, toAddr) {
  const from0 = eqAddr(meta.token0.address, fromAddr);
  const p_1_per_0 = midOutPerIn_from_slot0(meta.sqrtPriceX96, meta.token0.decimals, meta.token1.decimals);
  return from0 ? p_1_per_0 : 1 / p_1_per_0;
}

/* Resolve USD for any token (direct USDC, direct WSHIDO * oracle, or one hop).
   Returns { usd:number, route:string[] } | null */
// ----- precise mid conversion helpers -----
function midOutPerIn_scaled(meta, fromAddr, toAddr) {
  // returns tokenOut per 1 tokenIn as Number with 18dp (BigInt scaled)
  const SCALE = 10n ** 18n;
  const sqrt = BigInt(meta.sqrtPriceX96);
  // price1Per0 with decimals accounted
  const pow = BigInt(meta.token0.decimals - meta.token1.decimals);
  let num = sqrt * sqrt;                 // Q192 numerator
  let scaled;
  if (pow >= 0n) {
    scaled = (num * (10n ** (18n + pow))) / Q192;
  } else {
    scaled = (num * (10n ** 18n)) / (Q192 / (10n ** (-pow)));
  }
  const p1per0 = Number(scaled) / 1e18;
  const fromIs0 = meta.token0.address.toLowerCase() === fromAddr.toLowerCase();
  const outPerIn = fromIs0 ? p1per0 : (1 / p1per0);
  return outPerIn;
}

// multiply with 18dp scale, avoid float drift
function mul18(a, b) {
  const A = BigInt(Math.floor(a * 1e18));
  const B = BigInt(Math.floor(b * 1e18));
  return Number((A * B) / (10n ** 18n)) / 1e18;
}
async function resolveUsdPerToken(
  web3,
  tokenAddr,
  bench,
  visited = new Set(),
  avoidAddr = null
) {
  const key = (tokenAddr || "").toLowerCase();
  if (!key) return null;

  // Stop cycles
  if (visited.has(key)) return null;
  visited.add(key);

  // If caller wants to prevent routing through a token (the "target" token), enforce it
  const avoid = avoidAddr ? avoidAddr.toLowerCase() : null;
  if (avoid && key === avoid) return null;

  if (!bench?.usdPerWshido) return null;

  const USDC   = (bench.usdcAddr || "").toLowerCase();
  const WSHIDO = (bench.wshidoAddr || "").toLowerCase();
  const T      = key;

  if (T === USDC)   return { usd: 1, route: ["USDC (anchor)"] };
  if (T === WSHIDO) return { usd: bench.usdPerWshido, route: ["WSHIDO → USDC (oracle)"] };

  // ----------------------------
  // seed metas from presets
  // ----------------------------
  const metas = [];
  for (const p of PRESET_POOLS) {
    try { metas.push(await getMetaCached(web3, p.address)); } catch {}
  }

  // (optional) route hints by symbol
  let tokenSym = null;
  for (const m of metas) {
    if ((m.token0.address || "").toLowerCase() === T) { tokenSym = prettySymbol(m.token0.symbol); break; }
    if ((m.token1.address || "").toLowerCase() === T) { tokenSym = prettySymbol(m.token1.symbol); break; }
  }

  const hints = (tokenSym && ROUTE_HINTS_BY_SYMBOL[tokenSym]) || [];
  for (const addr of hints) {
    try {
      if (!metas.some(x => (x.__poolAddr || "").toLowerCase() === (addr || "").toLowerCase())) {
        metas.push(await getMetaCached(web3, addr));
      }
    } catch {}
  }

  // ----------------------------
  // build adjacency graph
  // token -> [{ peer, meta }]
  // ----------------------------
  const G = new Map();
  const add = (a, b, m) => {
    const k = (a || "").toLowerCase();
    const peer = (b || "").toLowerCase();
    if (!k || !peer) return;
    if (avoid && (k === avoid || peer === avoid)) return; // ✅ block avoided token from graph
    if (!G.has(k)) G.set(k, []);
    G.get(k).push({ peer, meta: m });
  };

  for (const m of metas) {
    add(m.token0.address, m.token1.address, m);
    add(m.token1.address, m.token0.address, m);
  }

  const targets = [USDC, WSHIDO].filter(Boolean);
  const MAX_DEPTH = 4;

  // ----------------------------
  // BFS to nearest target (USDC or WSHIDO)
  // ----------------------------
  const q = [{ node: T, path: [] }];
  const seen = new Set([T]);

  let bestPath = null;
  let bestIsUSDC = false;

  while (q.length) {
    const { node, path } = q.shift();
    if (path.length > MAX_DEPTH) continue;

    if (avoid && node === avoid) continue;

    if (targets.includes(node)) {
      bestPath = path;
      bestIsUSDC = (node === USDC);
      break;
    }

    const edges = G.get(node) || [];
    for (const e of edges) {
      if (avoid && e.peer === avoid) continue;
      if (seen.has(e.peer)) continue;
      seen.add(e.peer);
      q.push({ node: e.peer, path: [...path, e] });
    }
  }

  if (!bestPath || bestPath.length === 0) return null;

  // ----------------------------
  // Multiply mid prices along the path
  // ----------------------------
  let factor = 1.0; // targetTokens per 1 token (cumulative)
  let prev = T;

  for (const step of bestPath) {
    const meta = step.meta;

    const p1per0 = midOutPerIn_from_slot0(
      meta.sqrtPriceX96,
      meta.token0.decimals,
      meta.token1.decimals
    );

    const fromIs0 = (meta.token0.address || "").toLowerCase() === prev.toLowerCase();
    const outPerIn = fromIs0 ? p1per0 : (p1per0 > 0 ? 1 / p1per0 : null);

    if (!outPerIn || !Number.isFinite(outPerIn) || outPerIn <= 0) return null;

    factor *= outPerIn;
    prev = step.peer;
  }

  const usd = bestIsUSDC ? factor : (factor * bench.usdPerWshido);
  if (!Number.isFinite(usd) || usd <= 0) return null;

  return {
    usd,
    route: bestIsUSDC ? ["hop → USDC"] : ["hop → WSHIDO → USDC"],
  };
}


async function fetchDexhubPriceByAddress(addr) {
  try {
    const r = await fetch("https://dexhub.mavnode.io/api/v1/prices", {
      headers: { "X-API-Key": "key_MSGkDgSUFyqMIKhQCZgHNKdGjmHj1kXB" }
    });
    const j = await r.json();
    if (!j?.success) return null;
    const t = j.data.find(x => (x.address || "").toLowerCase() === addr.toLowerCase());
    if (!t) return null;
    return Number(t.usdPrice);
  } catch { return null; }
}

// NEW


function getDisplayPairSymbols({ direction, invert, meta }) {
  // out per in (before invert)
  const outSym = direction === "0to1" ? meta?.token1?.symbol : meta?.token0?.symbol;
  const inSym  = direction === "0to1" ? meta?.token0?.symbol : meta?.token1?.symbol;

  // if user inverted, the printed ratio is the inverse, so flip labels
  return invert
    ? { base: inSym, quote: outSym }   // showing "in per out"
    : { base: outSym, quote: inSym };  // showing "out per in"
}
function nextOtherPool(routes, current) {
  if (!routes?.length) return null;
  const sorted = [...routes].sort((a,b)=>a.usd - b.usd);     // asc
  // pick the first that isn't the current pool
  return sorted.find(r => r.pool.toLowerCase() !== current.toLowerCase()) || null;
}

function pctDiff(a, b) {
  if (a == null || b == null || a === 0) return null;
  return ((b / a) - 1) * 100; // b vs a
}

/* ---------- number helpers (8dp floor) ---------- */
const POW8 = 100000000;
const floorTo = (v, dp=8) => {
  const x = Number(v);
  if (!isFinite(x)) return 0;
  const f = Math.pow(10, dp);
  return Math.floor(x * f) / f;
};
const fmt8 = (v) => floorTo(v, 8).toFixed(8);
const numFromDisplay = (s) => Number(String(s||"").trim().split(/\s+/)[0] || "0");



function resolveLogoUrl(symUpper) {
  const safe = String(symUpper || "").replace(/[^A-Z0-9]/g, "");
  const file = EXPLICIT_MAP[symUpper] || `${safe.toLowerCase()}.png`;
  return `/${file}`; // served from /public
}

// -------- precise BigInt ratio helpers (no precision loss) --------
function ratioOutPerInRaw(outRaw, inRaw, decOut, decIn) {
  // returns tokenOut per 1 tokenIn as a Number with 18dp precision
  const SCALE = 10n ** 18n;
  const num = BigInt(outRaw) * (10n ** BigInt(decIn)) * SCALE;
  const den = BigInt(inRaw)  * (10n ** BigInt(decOut));
  return Number(num / den) / 1e18;
}
function ratioInPerOutRaw(inRaw, outRaw, decIn, decOut) {
  // returns tokenIn per 1 tokenOut as a Number with 18dp precision
  const SCALE = 10n ** 18n;
  const num = BigInt(inRaw)  * (10n ** BigInt(decOut)) * SCALE;
  const den = BigInt(outRaw) * (10n ** BigInt(decIn));
  return Number(num / den) / 1e18;
}


// Jump to a pool and keep the same “pay” token the user currently has selected.
async function selectRouteKeepingPayToken({ poolAddress, setPoolAddr, setDirection, currentMeta, currentDirection, getMeta }) {
  const paySym = currentDirection === "0to1" ? currentMeta.token0.symbol : currentMeta.token1.symbol;
  const m = await getMeta(poolAddress);
  const payIsToken0 = (prettySymbol(m.token0.symbol) === prettySymbol(paySym));
  const payIsToken1 = (prettySymbol(m.token1.symbol) === prettySymbol(paySym));
  // If this pool doesn't include the pay token (shouldn't happen with our route lists), default to 0→1.
  const dir = payIsToken0 ? "0to1" : (payIsToken1 ? "1to0" : "0to1");
  setPoolAddr(poolAddress);
  setDirection(dir);
}


// Parse symbols from labels like "AAA / BBB — 1%"
function splitSymbolsFromLabel(label) {
  const [lhs] = String(label).split("—");
  const parts = lhs.replace(/\s+/g, "").split("/");
  const a = prettySymbol(parts[0] || "");
  const b = prettySymbol(parts[1] || "");
  return [a, b];
}
// helpers (place near TokenLogo / PairInline)
const SHORT_MAP = {
  ILCFNBR: "ILC…",
  ILCFNB: "ILC…",
};
function shortSym(s) {
  const clean = prettySymbol(s || "");
  if (SHORT_MAP[clean]) return SHORT_MAP[clean];
  return clean.length > 6 ? `${clean.slice(0,6)}…` : clean;
}



export { 
    toChecksumOrNull, toRaw, fromRaw, price1Per0_from_sqrtP, encodePathExactIn, 
    encodePathExactOut, encodeFee3, fmtUSD, poolMetaCache, fetchPoolMeta, 
    getMetaCached, getWshidoUsdOracle, resolveUsdPerToken, midOutPerIn_from_slot0, 
    midPer1, buildPoolIndex,
    shortSym, splitSymbolsFromLabel, selectRouteKeepingPayToken, ratioInPerOutRaw, ratioOutPerInRaw, resolveLogoUrl, numFromDisplay, fmt8, pctDiff, nextOtherPool,
    getDisplayPairSymbols, floorTo
}