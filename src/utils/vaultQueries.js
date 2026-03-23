// plain JS, no TS types

import { getVaultV1, getTokenSC } from "./getContract";


/**
 * GENTLE Summary Puller
 * Optimized for Mobile RPC limits.
 */
export async function readAllVaultsSummaries(web3, _factory, vaults) {
  if (!web3 || !Array.isArray(vaults) || vaults.length === 0) return [];

  const results = [];
  
  // We process in chunks of 5 to avoid overwhelming MetaMask Mobile
  const chunkSize = 5; 
  
  for (let i = 0; i < vaults.length; i += chunkSize) {
    const chunk = vaults.slice(i, i + chunkSize);
    
    const chunkPromises = chunk.map(async (v) => {
      try {
        if (!v.vaultAddress || v.vaultAddress === "0x0000000000000000000000000000000000000000") return null;

        const inst = await getVaultV1(web3, v.vaultAddress);
        
        // Execute vault calls
        const summary = await inst.getVaultSummary();
        const token = await inst.tokenAddress();

        const tokenSC = await getTokenSC(web3, token);
        const [symbol, decimals] = await Promise.all([
          tokenSC.symbol().catch(() => "???"), 
          tokenSC.decimals().catch(() => 18),
        ]);

        return {
          address: v.vaultAddress,
          owner: v.owner,
          name: v.vaultName,
          token,
          tokenSymbol: symbol,
          tokenDecimals: Number(decimals),
          totalLocks: Number(summary?.lockedAmount ? summary.totalLocks : 0),
          lockedRaw: BigInt(summary?.lockedAmount || 0),
        };
      } catch (e) {
        console.warn(`Skipping vault ${v.vaultAddress}:`, e.message);
        return null;
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults.filter(r => r !== null));
    
    // Tiny rest period between chunks for the Mobile RPC to breathe
    if (i + chunkSize < vaults.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}
/**
 * Aggregate across summaries for the KPI tiles.
 */
export function computeFactoryKPIs(summaries) {
  if (!Array.isArray(summaries)) return null;

  const totalVaults = summaries.length;
  const totalLocks = summaries.reduce((acc, s) => acc + (Number(s.totalLocks) || 0), 0);

  const perToken = new Map();
  for (const s of summaries) {
    const key = (s.token || "").toLowerCase();
    if (!key) continue;
    const prev = perToken.get(key) || {
      symbol: s.tokenSymbol || "TOK",
      decimals: s.tokenDecimals ?? 18,
      lockedRaw: 0n,
    };
    prev.lockedRaw += BigInt(s.lockedRaw ?? 0n);
    perToken.set(key, prev);
  }

  return {
    totalVaults,
    totalLocks,
    uniqueTokensCount: perToken.size,
    perToken,
  };
}
