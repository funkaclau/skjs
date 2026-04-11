/**
 * ERC-20 `balanceOf` via **one** Multicall3 `aggregate3` over the full call list — no chunking or pauses here.
 * Large token lists can hit RPC payload limits; split upstream or extend this module if needed.
 */

import Web3 from "web3";
import { MULTICALL } from "../config";

const MULTICALL_ADDRESS = "0x49Bb5bfAAAe05e44d4922F236304b2e370DaF442";


const ERC20_BALANCE_ABI = [
  { 
    name: "balanceOf", 
    type: "function", 
    stateMutability: "view", 
    inputs: [{ name: "account", type: "address" }], 
    outputs: [{ name: "balance", type: "uint256" }] 
  }
];

export async function multicallBalances(web3, userAddress, tokenAddresses) {
  if (!web3 || !userAddress || !web3.utils.isAddress(userAddress)) {
    console.warn("[multicallBalances] Invalid userAddress:", userAddress);
    return {};
  }
  try {
    const multicall = new web3.eth.Contract(MULTICALL, MULTICALL_ADDRESS);

    // Normalize & filter token addresses
    const validTokens = [...new Set(
      tokenAddresses
        .map(t => (typeof t === "string" ? t : t?.address))
        .filter(tAddr => tAddr && web3.utils.isAddress(tAddr))
    )];

    if (validTokens.length === 0) return {};

    const calls = [];
    for (const tAddr of validTokens) {
      const contract = new web3.eth.Contract(ERC20_BALANCE_ABI, tAddr);
      if (!contract.methods || !contract.methods.balanceOf) {
        console.warn("[multicallBalances] Invalid contract instance for:", tAddr);
        continue;
      }
      
      calls.push({
        target: tAddr,
        allowFailure: true,
        callData: contract.methods.balanceOf(userAddress).encodeABI()
      });
    }

    if (calls.length === 0) return {};

    const results = await multicall.methods.aggregate3(calls).call();
    const balanceMap = {};

    results.forEach((res, i) => {
      const addr = validTokens[i].toLowerCase();
      balanceMap[addr] = res.success
        ? web3.eth.abi.decodeParameter("uint256", res.returnData).toString()
        : "0";
    });

    return balanceMap;
  } catch (err) {
    console.error("[multicallBalances] Internal Failure:", err);
    return {};
  }
}