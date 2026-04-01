/**
 * Read Uniswap v3 liquidity positions for a wallet from NonfungiblePositionManager (on-chain).
 * The pool contract only exposes aggregate tick data — per-position liquidity lives on the NFPM NFTs.
 */

import { MULTICALL } from "../config";
import { addrEq } from "./helpers";

const MULTICALL_ADDRESS = "0x49Bb5bfAAAe05e44d4922F236304b2e370DaF442";
const MAX_MULTICALL = 220;

const NFPM_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256", name: "" }],
  },
  {
    name: "tokenOfOwnerByIndex",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ type: "uint256", name: "" }],
  },
  {
    name: "positions",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      { type: "uint96", name: "nonce" },
      { type: "address", name: "operator" },
      { type: "address", name: "token0" },
      { type: "address", name: "token1" },
      { type: "uint24", name: "fee" },
      { type: "int24", name: "tickLower" },
      { type: "int24", name: "tickUpper" },
      { type: "uint128", name: "liquidity" },
      { type: "uint256", name: "feeGrowthInside0LastX128" },
      { type: "uint256", name: "feeGrowthInside1LastX128" },
      { type: "uint128", name: "tokensOwed0" },
      { type: "uint128", name: "tokensOwed1" },
    ],
  },
];

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

function positionMatchesPool(pos, poolToken0, poolToken1, poolFee) {
  const feePos = Number(pos.fee);
  const feePool = Number(poolFee);
  return (
    addrEq(pos.token0, poolToken0) &&
    addrEq(pos.token1, poolToken1) &&
    feePos === feePool
  );
}

function tickInRange(tick, tickLower, tickUpper) {
  return tick >= tickLower && tick < tickUpper;
}

/**
 * @param {import("web3").default} web3
 * @param {string} nfpmAddr - NonfungiblePositionManager
 * @param {string} owner - wallet
 * @param {string} poolToken0 - checksum
 * @param {string} poolToken1 - checksum
 * @param {number|string} poolFee - e.g. 10000 for 1%
 * @param {number} tickCurrent
 * @param {string} poolActiveLiquidity - pool.liquidity() at slot0 (uint128 string)
 * @param {{ maxNfts?: number }} [opts]
 */
export async function fetchWalletV3PositionsForPool(
  web3,
  nfpmAddr,
  owner,
  poolToken0,
  poolToken1,
  poolFee,
  tickCurrent,
  poolActiveLiquidity,
  opts = {}
) {
  const maxNfts = Number.isFinite(opts.maxNfts) ? opts.maxNfts : 128;
  let nfpmNorm = String(nfpmAddr || "").trim();
  let ownerNorm = String(owner || "").trim();
  try {
    nfpmNorm = web3.utils.toChecksumAddress(nfpmNorm);
    ownerNorm = web3.utils.toChecksumAddress(ownerNorm);
  } catch {
    throw new Error("Invalid NFPM or owner address");
  }
  const t0 = web3.utils.toChecksumAddress(String(poolToken0));
  const t1 = web3.utils.toChecksumAddress(String(poolToken1));

  const nfpm = new web3.eth.Contract(NFPM_ABI, nfpmNorm);
  const balBn = await nfpm.methods.balanceOf(ownerNorm).call();
  const n = Math.min(Number(balBn || 0), maxNfts);
  if (!n || n <= 0) {
    return {
      positions: [],
      walletInRangeL: "0",
      scannedNfts: 0,
    };
  }

  const iface = nfpm;
  const idCalls = [];
  for (let i = 0; i < n; i++) {
    idCalls.push({
      target: nfpmNorm,
      allowFailure: true,
      callData: iface.methods.tokenOfOwnerByIndex(ownerNorm, i).encodeABI(),
    });
  }
  const idRes = await aggregate3Chunked(web3, idCalls);
  const tokenIds = [];
  for (let i = 0; i < idRes.length; i++) {
    const r = idRes[i];
    if (!r?.success) continue;
    try {
      const id = web3.eth.abi.decodeParameter("uint256", r.returnData);
      tokenIds.push(BigInt(String(id)));
    } catch {
      continue;
    }
  }

  if (!tokenIds.length) {
    return { positions: [], walletInRangeL: "0", scannedNfts: 0 };
  }

  const posCalls = tokenIds.map((tid) => ({
    target: nfpmNorm,
    allowFailure: true,
    callData: iface.methods.positions(tid.toString()).encodeABI(),
  }));
  const posRes = await aggregate3Chunked(web3, posCalls);

  const poolL = BigInt(String(poolActiveLiquidity || "0"));
  const positions = [];
  let walletInRangeL = 0n;

  for (let i = 0; i < tokenIds.length; i++) {
    const r = posRes[i];
    if (!r?.success) continue;
    let d;
    try {
      d = web3.eth.abi.decodeParameters(
        ["uint96", "address", "address", "address", "uint24", "int24", "int24", "uint128", "uint256", "uint256", "uint128", "uint128"],
        r.returnData
      );
    } catch {
      continue;
    }
    const pos = {
      token0: d[2],
      token1: d[3],
      fee: d[4],
      tickLower: Number(d[5]),
      tickUpper: Number(d[6]),
      liquidity: BigInt(String(d[7])),
    };
    if (!positionMatchesPool(pos, t0, t1, poolFee)) continue;

    const inRange = tickInRange(tickCurrent, pos.tickLower, pos.tickUpper);
    const L = pos.liquidity;
    if (inRange && L > 0n) walletInRangeL += L;

    let pctOfActive = null;
    if (inRange && L > 0n && poolL > 0n) {
      pctOfActive = Number((L * 10000n) / poolL) / 100;
    }

    positions.push({
      tokenId: tokenIds[i].toString(),
      tickLower: pos.tickLower,
      tickUpper: pos.tickUpper,
      liquidity: L.toString(),
      inRange,
      pctOfActiveL: pctOfActive,
    });
  }

  positions.sort((a, b) => a.tickLower - b.tickLower || a.tickUpper - b.tickUpper);

  return {
    positions,
    walletInRangeL: walletInRangeL.toString(),
    scannedNfts: tokenIds.length,
  };
}
