import Web3 from "web3";
import { MULTICALL } from "../config";

const MULTICALL_ADDRESS = "0x49Bb5bfAAAe05e44d4922F236304b2e370DaF442";

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

// In-memory cache for token metadata
const tokenCache = {};

export async function multicallPools(web3, poolAddresses) {
  const multicall = new web3.eth.Contract(MULTICALL, MULTICALL_ADDRESS);
  const calls = [];

  // Filter valid addresses manually to avoid library quirks
  const validPools = poolAddresses.filter(addr => addr && typeof addr === 'string' && addr.startsWith('0x'));

  for (const addr of validPools) {
    const checksummedAddr = web3.utils.toChecksumAddress(addr);
    const c = new web3.eth.Contract(POOL_ABI, checksummedAddr);
    calls.push({ target: addr, allowFailure: true, callData: c.methods.slot0().encodeABI() });
    calls.push({ target: addr, allowFailure: true, callData: c.methods.token0().encodeABI() });
    calls.push({ target: addr, allowFailure: true, callData: c.methods.token1().encodeABI() });
    calls.push({ target: addr, allowFailure: true, callData: c.methods.liquidity().encodeABI() });
  }

  const result = await multicall.methods.aggregate3(calls).call();
  const pools = [];
  const tokenCalls = [];

  for (let i = 0; i < validPools.length; i++) {
    const base = i * 4;
    // CRITICAL FIX: Optional chaining ensures we don't crash if result is smaller than expected
    const r0 = result[base];
    const r1 = result[base + 1];
    const r2 = result[base + 2];
    const r3 = result[base + 3];

    if (!r0?.success || !r1?.success || !r2?.success) continue;

    try {
      const decodedSlot0 = web3.eth.abi.decodeParameters(["uint160", "int24", "uint16", "uint16", "uint16", "uint8", "bool"], r0.returnData);
      const t0 = web3.eth.abi.decodeParameter("address", r1.returnData);
      const t1 = web3.eth.abi.decodeParameter("address", r2.returnData);
      const liq = r3?.success ? web3.eth.abi.decodeParameter("uint128", r3.returnData) : "0";

      if (!tokenCache[t0]) tokenCalls.push(t0);
      if (!tokenCache[t1]) tokenCalls.push(t1);

      pools.push({ address: validPools[i], sqrtPriceX96: decodedSlot0[0], token0: { address: t0 }, token1: { address: t1 }, liquidity: liq });
    } catch (e) { console.error("Decoding error", e); }
  }

  // Fetch Token Metadata
  const uniqueTokens = [...new Set(tokenCalls)];
  if (uniqueTokens.length > 0) {
    const tCalls = uniqueTokens.flatMap(t => {
      const c = new web3.eth.Contract(ERC20_ABI, t);
      return [
        { target: t, allowFailure: true, callData: c.methods.decimals().encodeABI() },
        { target: t, allowFailure: true, callData: c.methods.symbol().encodeABI() }
      ];
    });
    const tResults = await multicall.methods.aggregate3(tCalls).call();
    uniqueTokens.forEach((addr, idx) => {
      const d = tResults[idx * 2];
      const s = tResults[idx * 2 + 1];
      tokenCache[addr] = {
        decimals: d?.success ? Number(web3.eth.abi.decodeParameter("uint8", d.returnData)) : 18,
        symbol: s?.success ? web3.eth.abi.decodeParameter("string", s.returnData) : "???"
      };
    });
  }

  return pools.map(p => ({
    ...p,
    token0: { ...p.token0, ...tokenCache[p.token0.address] },
    token1: { ...p.token1, ...tokenCache[p.token1.address] }
  }));
}

export async function resolveAllPrices(web3, poolAddresses, wshidoOraclePrice) {
  const pools = await multicallPools(web3, poolAddresses);
  const graph = {};
  
  const addEdge = (from, to, price) => {
    if (!graph[from]) graph[from] = [];
    graph[from].push({ to, price });
  };

  pools.forEach(p => {
    if (!p || !p.sqrtPriceX96 || p.liquidity === "0") return;
    const p1per0 = midOutPerIn_from_slot0(p.sqrtPriceX96, p.token0.decimals, p.token1.decimals);
    if (p1per0 <= 0) return;
    addEdge(p.token0.address.toLowerCase(), p.token1.address.toLowerCase(), p1per0);
    addEdge(p.token1.address.toLowerCase(), p.token0.address.toLowerCase(), 1 / p1per0);
  });

  const prices = { [USDC_ADDR]: 1.0 };
  if (wshidoOraclePrice) prices[WSHIDO_ADDR] = parseFloat(wshidoOraclePrice);

  const queue = Object.keys(prices);
  const visited = new Set(queue);

  while (queue.length > 0) {
    const curr = queue.shift();
    (graph[curr] || []).forEach(edge => {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        prices[edge.to] = prices[curr] / edge.price;
        queue.push(edge.to);
      }
    });
  }
  return prices;
}