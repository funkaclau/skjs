// src/utils/erc20/staking.js
import { STAKING_POOL_ABI } from "./abi";
import { STAKING_POOLS } from "../../config";



export const humanBI = (amountBI, decimals = 18, precision = 6) => {
  if (!amountBI || amountBI === 0n) return "0";
  const factor = BigInt(10 ** decimals);
  const integerPart = amountBI / factor;
  const fractionalPart = amountBI % factor;
  
  const fractionStr = fractionalPart.toString().padStart(decimals, "0");
  return `${integerPart}.${fractionStr.slice(0, precision)}`;
};


export async function fetchUserStakingData(userAddress, web3) {
  if (!userAddress || !web3) return [];

  // 1. Get all valid pools
  const activePools = Object.entries(STAKING_POOLS).filter(
    ([_, poolAddr]) => poolAddr && poolAddr.trim() !== ""
  );

  if (activePools.length === 0) return [];

  // 2. Map through pools and create individual promises
  const promises = activePools.map(async ([tokenAddress, poolAddress]) => {
    try {
      const contract = new web3.eth.Contract(STAKING_POOL_ABI, poolAddress);
      
      // Direct call - cleaner and more compatible with modern Web3
      const info = await contract.methods.getStakeInfo(userAddress).call();
      
      const totalAmount = BigInt(info.totalAmount || 0);
      const availableRewards = BigInt(info.availableRewards || 0);

      // Only return data if they actually have a stake or rewards
      if (totalAmount > 0n || availableRewards > 0n) {
        return {
          tokenAddress: tokenAddress.toLowerCase(),
          poolAddress: poolAddress.toLowerCase(),
          // Use your humanBI util for precise decimals
          stakedHuman: (Number(totalAmount) / 1e18).toString(), 
          rewardsHuman: (Number(availableRewards) / 1e18).toString(),
          unlockTime: info.nextUnlockTime
        };
      }
    } catch (err) {
      // Log error for specific pool but don't crash the whole loop
      console.warn(`Stake fetch failed for ${tokenAddress}:`, err.message);
    }
    return null;
  });

  // 3. Wait for all calls to finish
  const results = await Promise.all(promises);
  
  // 4. Filter out the nulls (empty stakes or failed calls)
  return results.filter((r) => r !== null);
}