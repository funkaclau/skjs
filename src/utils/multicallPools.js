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
    const start = performance.now();
    let poolCallCount = 0;
let tokenCallCount = 0;
  const multicall = new web3.eth.Contract(MULTICALL, MULTICALL_ADDRESS);

  const calls = [];

  // --- Pool calls ---
  for (const addr of poolAddresses) {
    if (!addr || !Web3.utils.isAddress(addr)) {
      console.warn("Skipping invalid pool:", addr);
      continue;
    }

    const c = new web3.eth.Contract(POOL_ABI, addr);
    calls.push({ target: addr, allowFailure: true, callData: c.methods.slot0().encodeABI() });
    calls.push({ target: addr, allowFailure: true, callData: c.methods.token0().encodeABI() });
    calls.push({ target: addr, allowFailure: true, callData: c.methods.token1().encodeABI() });
    calls.push({ target: addr, allowFailure: true, callData: c.methods.liquidity().encodeABI() });
    poolCallCount += 4;
  }

  const result = await multicall.methods.aggregate3(calls).call();

  const pools = [];
  const tokenCalls = [];

  // --- decode pool-level results ---
  for (let i = 0; i < poolAddresses.length; i++) {
    const base = i * 4;
    const slot0 = result[base];
    const token0Res = result[base + 1];
    const token1Res = result[base + 2];
    const liquidity = result[base + 3];

    if (!slot0.success) {
      console.warn("Pool slot0 failed", poolAddresses[i]);
      pools.push(null);
      continue;
    }

    const decodedSlot0 = web3.eth.abi.decodeParameters(
      ["uint160", "int24", "uint16", "uint16", "uint16", "uint8", "bool"],
      slot0.returnData
    );

    const token0Addr = web3.eth.abi.decodeParameter("address", token0Res.returnData);
    const token1Addr = web3.eth.abi.decodeParameter("address", token1Res.returnData);
    const decodedLiquidity = web3.eth.abi.decodeParameter("uint128", liquidity.returnData);

    // schedule token metadata fetch if not cached
    if (!tokenCache[token0Addr]) tokenCalls.push({ address: token0Addr, type: "token" });
    if (!tokenCache[token1Addr]) tokenCalls.push({ address: token1Addr, type: "token" });

    pools.push({
      address: poolAddresses[i],
      sqrtPriceX96: decodedSlot0[0],
      token0: { address: token0Addr },
      token1: { address: token1Addr },
      liquidity: decodedLiquidity
    });
  }

  // --- token metadata multicall ---
  if (tokenCalls.length > 0) {
    const tokenMulticall = [];
    const uniqueTokenCalls = [...new Set(tokenCalls.map(c => c.address))];

    for (const t of uniqueTokenCalls) {
      const c = new web3.eth.Contract(ERC20_ABI, t);
      tokenMulticall.push({ target: t, allowFailure: true, callData: c.methods.decimals().encodeABI() });
      tokenMulticall.push({ target: t, allowFailure: true, callData: c.methods.symbol().encodeABI() });
      tokenCallCount += 2;
    }

    const tokenResult = await multicall.methods.aggregate3(tokenMulticall).call();

    for (let i = 0; i < uniqueTokenCalls.length; i++) {
      const base = i * 2;
      const decRes = tokenResult[base];
      const symRes = tokenResult[base + 1];
      const addr = uniqueTokenCalls[i];

      const decimals = decRes.success
        ? Number(web3.eth.abi.decodeParameter("uint8", decRes.returnData))
        : 18;
      const symbol = symRes.success
        ? web3.eth.abi.decodeParameter("string", symRes.returnData)
        : addr.slice(0, 6);

      tokenCache[addr] = { decimals, symbol };
    }
  }

  // --- enrich pools with decimals/symbol ---
  for (const p of pools) {
    if (!p) continue;
    p.token0 = { ...p.token0, ...tokenCache[p.token0.address] };
    p.token1 = { ...p.token1, ...tokenCache[p.token1.address] };
  }

  const end = performance.now();
    const duration = (end - start).toFixed(2);

    const uniqueTokens = Object.keys(tokenCache).length;

    console.log(
    `[multicallPools] 
    Pools: ${poolAddresses.length}
    Unique tokens: ${uniqueTokens}
    Pool contract calls: ${poolCallCount}
    Token contract calls: ${tokenCallCount}
    Total ABI calls encoded: ${poolCallCount + tokenCallCount}
    Multicall RPC requests: ${tokenCallCount > 0 ? 2 : 1}
    Duration: ${duration} ms`
    );

  return pools;
}