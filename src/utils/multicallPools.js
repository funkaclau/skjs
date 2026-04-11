import { MULTICALL } from "../config";
import { midOutPerIn_from_slot0 } from "./price";
const MULTICALL_ADDRESS = "0x49Bb5bfAAAe05e44d4922F236304b2e370DaF442";

/** {@link multicallPools} — pool batch size, token meta batch size, pause between aggregate3 waves. */
export const MULTICALL_POOLS_TUNING = Object.freeze({
  /** Pools per Multicall3 batch (4 calls each: slot0, token0, token1, liquidity). */
  POOLS_PER_AGGREGATE_BATCH: 20,
  /** Unique tokens per Multicall3 batch (2 calls each: decimals, symbol). */
  TOKENS_PER_AGGREGATE_BATCH: 20,
  PAUSE_MS_BETWEEN_AGGREGATE_BATCHES: 90,
});

const POOLS_PER_AGGREGATE_BATCH = MULTICALL_POOLS_TUNING.POOLS_PER_AGGREGATE_BATCH;
const TOKENS_PER_AGGREGATE_BATCH = MULTICALL_POOLS_TUNING.TOKENS_PER_AGGREGATE_BATCH;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAUSE_BETWEEN_AGGREGATE_MS = MULTICALL_POOLS_TUNING.PAUSE_MS_BETWEEN_AGGREGATE_BATCHES;

const POOL_ABI = [
  {
    name: "slot0",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "uint160", name: "sqrtPriceX96" },
      { type: "int24", name: "tick" },
      { type: "uint16", name: "observationIndex" },
      { type: "uint16", name: "observationCardinality" },
      { type: "uint16", name: "observationCardinalityNext" },
      { type: "uint8", name: "feeProtocol" },
      { type: "bool", name: "unlocked" }
    ]
  },
  { name: "token0", type: "function", inputs: [], outputs: [{ type: "address" }] },
  { name: "token1", type: "function", inputs: [], outputs: [{ type: "address" }] },
  { name: "liquidity", type: "function", inputs: [], outputs: [{ type: "uint128" }] }
];

const ERC20_ABI = [
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] }
];

const tokenCache = {};

function decodePoolChunk(web3, poolAddrsSlice, result) {
  const pools = [];
  for (let i = 0; i < poolAddrsSlice.length; i++) {
    const base = i * 4;
    const r0 = result[base];
    const r1 = result[base + 1];
    const r2 = result[base + 2];
    const r3 = result[base + 3];

    if (!r0?.success || !r1?.success || !r2?.success) continue;

    try {
      const decodedSlot0 = web3.eth.abi.decodeParameters(
        ["uint160", "int24", "uint16", "uint16", "uint16", "uint8", "bool"],
        r0.returnData
      );

      const sqrtPriceX96 = decodedSlot0[0].toString();
      const t0 = web3.eth.abi.decodeParameter("address", r1.returnData);
      const t1 = web3.eth.abi.decodeParameter("address", r2.returnData);
      const liq = r3?.success ? r3.returnData : "0";

      pools.push({
        address: poolAddrsSlice[i],
        sqrtPriceX96,
        token0: { address: t0 },
        token1: { address: t1 },
        liquidity: liq
      });
    } catch (e) {
      console.error("multicallPools decode chunk", e);
    }
  }
  return pools;
}

export async function multicallPools(web3, poolAddresses) {
  const multicall = new web3.eth.Contract(MULTICALL, MULTICALL_ADDRESS);
  const validPools = poolAddresses.filter(
    (addr) => addr && typeof addr === "string" && addr.startsWith("0x")
  );

  const pools = [];

  for (let off = 0; off < validPools.length; off += POOLS_PER_AGGREGATE_BATCH) {
    const slice = validPools.slice(off, off + POOLS_PER_AGGREGATE_BATCH);
    const calls = [];
    for (const addr of slice) {
      const checksummedAddr = web3.utils.toChecksumAddress(addr);
      const c = new web3.eth.Contract(POOL_ABI, checksummedAddr);
      calls.push({ target: checksummedAddr, allowFailure: true, callData: c.methods.slot0().encodeABI() });
      calls.push({ target: checksummedAddr, allowFailure: true, callData: c.methods.token0().encodeABI() });
      calls.push({ target: checksummedAddr, allowFailure: true, callData: c.methods.token1().encodeABI() });
      calls.push({ target: checksummedAddr, allowFailure: true, callData: c.methods.liquidity().encodeABI() });
    }
    if (calls.length === 0) continue;
    const result = await multicall.methods.aggregate3(calls).call();
    pools.push(...decodePoolChunk(web3, slice, result));
    if (off + POOLS_PER_AGGREGATE_BATCH < validPools.length) {
      await sleep(PAUSE_BETWEEN_AGGREGATE_MS);
    }
  }

  const tokenSet = new Set();
  for (const p of pools) {
    if (p.token0?.address) tokenSet.add(String(p.token0.address).toLowerCase());
    if (p.token1?.address) tokenSet.add(String(p.token1.address).toLowerCase());
  }
  const uniqueTokens = [...tokenSet];

  for (let ti = 0; ti < uniqueTokens.length; ti += TOKENS_PER_AGGREGATE_BATCH) {
    const tSlice = uniqueTokens.slice(ti, ti + TOKENS_PER_AGGREGATE_BATCH);
    const tCalls = tSlice.flatMap((t) => {
      const c = new web3.eth.Contract(ERC20_ABI, web3.utils.toChecksumAddress(t));
      return [
        { target: web3.utils.toChecksumAddress(t), allowFailure: true, callData: c.methods.decimals().encodeABI() },
        { target: web3.utils.toChecksumAddress(t), allowFailure: true, callData: c.methods.symbol().encodeABI() }
      ];
    });
    const tResults = await multicall.methods.aggregate3(tCalls).call();
    if (ti + TOKENS_PER_AGGREGATE_BATCH < uniqueTokens.length) {
      await sleep(PAUSE_BETWEEN_AGGREGATE_MS);
    }
    tSlice.forEach((addr, idx) => {
      const k = addr.toLowerCase();
      const d = tResults[idx * 2];
      const s = tResults[idx * 2 + 1];
      tokenCache[k] = {
        decimals: d?.success ? Number(web3.eth.abi.decodeParameter("uint8", d.returnData)) : 18,
        symbol: s?.success ? web3.eth.abi.decodeParameter("string", s.returnData) : "???"
      };
    });
  }

  return pools.map((p) => ({
    ...p,
    token0: { ...p.token0, ...tokenCache[String(p.token0.address).toLowerCase()] },
    token1: { ...p.token1, ...tokenCache[String(p.token1.address).toLowerCase()] }
  }));
}

export async function resolveAllPrices(web3, poolAddresses, wshidoOraclePrice) {
  const pools = await multicallPools(web3, poolAddresses);
  const graph = {};

  const USDC = "0xeE1Fc22381e6B6bb5ee3bf6B5ec58DF6F5480dF8".toLowerCase();
  const WSHIDO = "0x8cbafFD9b658997E7bf87E98FEbF6EA6917166F7".toLowerCase();

  pools.forEach((p) => {
    if (!p || !p.sqrtPriceX96 || p.sqrtPriceX96 === "0") return;

    const t0 = p.token0.address.toLowerCase();
    const t1 = p.token1.address.toLowerCase();

    let d0 = tokenCache[t0]?.decimals;
    let d1 = tokenCache[t1]?.decimals;
    const SIX_DECIMAL_TOKENS = [
      "0xeE1Fc22381e6B6bb5ee3bf6B5ec58DF6F5480dF8",
      "0xF7B264B723059a05fBf13E32783F88db33A24365",
    ].map((a) => a.toLowerCase());

    if (SIX_DECIMAL_TOKENS.includes(t0)) d0 = 6;
    if (SIX_DECIMAL_TOKENS.includes(t1)) d1 = 6;

    if (t0 === WSHIDO) d0 = 18;
    if (t1 === WSHIDO) d1 = 18;

    d0 = d0 || 18;
    d1 = d1 || 18;
    try {
      const ratio = midOutPerIn_from_slot0(p.sqrtPriceX96.toString(), d0, d1);
      if (!ratio || isNaN(ratio)) return;

      if (!graph[t0]) graph[t0] = [];
      if (!graph[t1]) graph[t1] = [];

      graph[t0].push({ to: t1, ratio: ratio });
      graph[t1].push({ to: t0, ratio: 1 / ratio });
    } catch (e) {}
  });

  const prices = { [USDC]: 1.0 };

  if (wshidoOraclePrice && !isNaN(parseFloat(wshidoOraclePrice))) {
    prices[WSHIDO] = parseFloat(wshidoOraclePrice);
  }

  const queue = Object.keys(prices);
  const visited = new Set(queue);

  let i = 0;
  while (i < queue.length) {
    const curr = queue[i];
    const currentPrice = prices[curr];
    i++;

    (graph[curr] || []).forEach((edge) => {
      const target = edge.to.toLowerCase();
      if (!visited.has(target)) {
        visited.add(target);
        prices[target] = currentPrice / edge.ratio;
        queue.push(target);
      }
    });
  }

  return prices;
}
