/**
 * ERC-20 `balanceOf` via Multicall3 `aggregate3`. By default one batch for the full list.
 * Use `opts.maxTokensPerAggregate` + `opts.pauseMsBetweenChunks` when the RPC rejects large multicalls.
 */

import { MULTICALL } from "../config";

const MULTICALL_ADDRESS = "0x49Bb5bfAAAe05e44d4922F236304b2e370DaF442";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ERC20_BALANCE_ABI = [
  { 
    name: "balanceOf", 
    type: "function", 
    stateMutability: "view", 
    inputs: [{ name: "account", type: "address" }], 
    outputs: [{ name: "balance", type: "uint256" }] 
  }
];

/**
 * @param {import("web3").default} web3
 * @param {string} userAddress
 * @param {string[]} tokenAddresses
 * @param {{ maxTokensPerAggregate?: number, chunkSize?: number, pauseMsBetweenChunks?: number }} [opts]
 */
export async function multicallBalances(web3, userAddress, tokenAddresses, opts = {}) {
  if (!web3 || !userAddress || !web3.utils.isAddress(userAddress)) {
    console.warn("[multicallBalances] Invalid userAddress:", userAddress);
    return {};
  }
  const maxPer =
    opts.maxTokensPerAggregate ??
    opts.chunkSize ??
    Number.POSITIVE_INFINITY;
  const chunkCap = Number.isFinite(maxPer) && maxPer > 0 ? Math.min(200, Math.floor(maxPer)) : Number.POSITIVE_INFINITY;
  const pauseMs = Math.max(0, Math.min(30_000, Number(opts.pauseMsBetweenChunks) || 0));

  try {
    const multicall = new web3.eth.Contract(MULTICALL, MULTICALL_ADDRESS);

    // Normalize & filter token addresses
    const validTokens = [...new Set(
      tokenAddresses
        .map(t => (typeof t === "string" ? t : t?.address))
        .filter(tAddr => tAddr && web3.utils.isAddress(tAddr))
    )];

    if (validTokens.length === 0) return {};

    const balanceMap = {};

    const runChunk = async (tokensSlice) => {
      const entries = [];
      for (const tAddr of tokensSlice) {
        const contract = new web3.eth.Contract(ERC20_BALANCE_ABI, tAddr);
        if (!contract.methods?.balanceOf) {
          console.warn("[multicallBalances] Invalid contract instance for:", tAddr);
          continue;
        }
        entries.push({
          tAddr,
          callData: contract.methods.balanceOf(userAddress).encodeABI(),
        });
      }
      if (entries.length === 0) return;
      const calls = entries.map((e) => ({
        target: e.tAddr,
        allowFailure: true,
        callData: e.callData,
      }));
      const results = await multicall.methods.aggregate3(calls).call();
      entries.forEach((e, i) => {
        const res = results[i];
        const addr = e.tAddr.toLowerCase();
        balanceMap[addr] = res?.success
          ? web3.eth.abi.decodeParameter("uint256", res.returnData).toString()
          : "0";
      });
    };

    if (!Number.isFinite(chunkCap) || validTokens.length <= chunkCap) {
      await runChunk(validTokens);
      return balanceMap;
    }

    for (let i = 0; i < validTokens.length; i += chunkCap) {
      const slice = validTokens.slice(i, i + chunkCap);
      await runChunk(slice);
      if (pauseMs > 0 && i + chunkCap < validTokens.length) await sleep(pauseMs);
    }

    return balanceMap;
  } catch (err) {
    console.error("[multicallBalances] Internal Failure:", err);
    return {};
  }
}