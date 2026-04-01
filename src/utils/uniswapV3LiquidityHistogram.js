/**
 * Uniswap V3: scan pool tick bitmap, read tick details, return per-tick liquidity for histograms.
 * Partial window: liquidity outside the scanned range is not included (expand wordRadius if needed).
 */

import { MULTICALL } from "../config";

const MULTICALL_ADDRESS = "0x49Bb5bfAAAe05e44d4922F236304b2e370DaF442";

const POOL_EXT_ABI = [
  {
    name: "slot0",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "sqrtPriceX96", type: "uint160" },
      { name: "tick", type: "int24" },
      { type: "uint16" },
      { type: "uint16" },
      { type: "uint16" },
      { type: "uint8" },
      { type: "bool" },
    ],
  },
  {
    name: "liquidity",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint128", name: "" }],
  },
  {
    name: "tickSpacing",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "int24" }],
  },
  {
    name: "tickBitmap",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "wordPosition", type: "int16" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "ticks",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tick", type: "int24" }],
    outputs: [
      { name: "liquidityGross", type: "uint128" },
      { name: "liquidityNet", type: "int128" },
      { name: "feeGrowthOutside0X128", type: "uint256" },
      { name: "feeGrowthOutside1X128", type: "uint256" },
      { name: "tickCumulativeOutside", type: "int56" },
      { name: "secondsPerLiquidityOutsideX128", type: "uint160" },
      { name: "secondsOutside", type: "uint32" },
      { name: "initialized", type: "bool" },
    ],
  },
];

const MAX_MULTICALL = 220;

/** Uniswap v3 tick bounds (tick must be multiple of tickSpacing for positions). */
const V3_MIN_TICK = -887272;
const V3_MAX_TICK = 887272;

function int24FromWordBit(wordPos, bitPos) {
  const x = wordPos * 256 + bitPos;
  const v = x & 0xffffff;
  return v >= 0x800000 ? v - 0x1000000 : v;
}

function iterBits(wordBn) {
  const w = BigInt(wordBn);
  const idx = [];
  for (let i = 0; i < 256; i++) {
    if ((w >> BigInt(i)) & 1n) idx.push(i);
  }
  return idx;
}

async function aggregate3Chunked(web3, calls) {
  const mc = new web3.eth.Contract(MULTICALL, MULTICALL_ADDRESS);
  const out = [];
  for (let i = 0; i < calls.length; i += MAX_MULTICALL) {
    const chunk = calls.slice(i, i + MAX_MULTICALL);
    const res = await mc.methods.aggregate3(chunk).call();
    out.push(...res);
  }
  return out;
}

/**
 * @param {import("web3").default} web3
 * @param {string} poolAddr
 * @param {{ wordRadius?: number }} [opts] - half-width of tickBitmap words around current compressed tick (default 96)
 * @returns {Promise<{
 *   tickCurrent: number,
 *   tickSpacing: number,
 *   compressedCurrent: number,
 *   wordRange: { min: number, max: number },
 *   poolLiquidity: string,
 *   bars: Array<{ tick: number, liquidityGross: string, liquidityNet: string }>,
 * }>}
 */
export async function fetchUniswapV3TickLiquidityHistogram(web3, poolAddr, opts = {}) {
  const wordRadius = Number.isFinite(opts.wordRadius) ? opts.wordRadius : 96;
  let poolAddrNorm = String(poolAddr || "").trim();
  try {
    poolAddrNorm = web3.utils.toChecksumAddress(poolAddrNorm);
  } catch {
    throw new Error("Invalid pool address");
  }
  const pool = new web3.eth.Contract(POOL_EXT_ABI, poolAddrNorm);

  const [s0, tickSpacingRaw, liqRaw] = await Promise.all([
    pool.methods.slot0().call(),
    pool.methods.tickSpacing().call(),
    pool.methods.liquidity().call(),
  ]);

  const tickCurrent = Number(s0.tick ?? s0[1]);
  const tickSpacing = Number(tickSpacingRaw);
  const poolLiquidity = String(liqRaw ?? "0");

  if (!tickSpacing || tickSpacing <= 0) {
    throw new Error("Invalid tickSpacing");
  }

  const compressedCurrent = Math.trunc(tickCurrent / tickSpacing);
  const centerWord = compressedCurrent >> 8;
  const wordMin = centerWord - wordRadius;
  const wordMax = centerWord + wordRadius;

  const poolIface = new web3.eth.Contract(POOL_EXT_ABI, poolAddrNorm);
  const bitmapCalls = [];
  for (let wp = wordMin; wp <= wordMax; wp++) {
    bitmapCalls.push({
      target: poolAddrNorm,
      allowFailure: true,
      callData: poolIface.methods.tickBitmap(wp).encodeABI(),
    });
  }

  const bitmapRes = await aggregate3Chunked(web3, bitmapCalls);

  const rawTicksSet = new Set();
  let bi = 0;
  for (let wp = wordMin; wp <= wordMax; wp++) {
    const r = bitmapRes[bi++];
    if (!r?.success) continue;
    let wordBn;
    try {
      wordBn = web3.eth.abi.decodeParameter("uint256", r.returnData);
    } catch {
      continue;
    }
    for (const bp of iterBits(wordBn)) {
      const compressed = int24FromWordBit(wp, bp);
      const rawTick = compressed * tickSpacing;
      if (rawTick < -887272 || rawTick > 887272) continue;
      rawTicksSet.add(rawTick);
    }
  }

  /** Full-range positions only touch min/max aligned ticks — bitmap near spot may miss them. */
  const minAligned = Math.floor(V3_MIN_TICK / tickSpacing) * tickSpacing;
  const maxAligned = Math.floor(V3_MAX_TICK / tickSpacing) * tickSpacing;
  rawTicksSet.add(minAligned);
  rawTicksSet.add(maxAligned);

  const tickIndices = Array.from(rawTicksSet).sort((a, b) => a - b);

  const tickCalls = tickIndices.map((t) => ({
    target: poolAddrNorm,
    allowFailure: true,
    callData: poolIface.methods.ticks(t).encodeABI(),
  }));

  const tickRes = tickCalls.length ? await aggregate3Chunked(web3, tickCalls) : [];

  const bars = [];
  for (let i = 0; i < tickIndices.length; i++) {
    const tr = tickRes[i];
    if (!tr?.success) continue;
    let decoded;
    try {
      decoded = web3.eth.abi.decodeParameters(
        ["uint128", "int128", "uint256", "uint256", "int56", "uint160", "uint32", "bool"],
        tr.returnData
      );
    } catch {
      continue;
    }
    const liquidityGross = BigInt(String(decoded[0]));
    const liquidityNet = BigInt(String(decoded[1]));
    const initialized = Boolean(decoded[7]);
    if (!initialized && liquidityGross === 0n && liquidityNet === 0n) continue;
    bars.push({
      tick: tickIndices[i],
      liquidityGross: liquidityGross.toString(),
      liquidityNet: liquidityNet.toString(),
    });
  }

  bars.sort((a, b) => a.tick - b.tick);

  return {
    tickCurrent,
    tickSpacing,
    compressedCurrent,
    wordRange: { min: wordMin, max: wordMax },
    poolLiquidity,
    bars,
  };
}
