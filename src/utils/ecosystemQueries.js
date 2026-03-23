import { 
  getVaultFactoryContract, 
  getTokenFactoryContract, 
  getLaunchpadFactoryContract, 
  getNftStakingFactoryContract 
} from "./getContract";
import { readAllVaultsSummaries, computeFactoryKPIs } from "./vaultQueries";
import { calculateUSDValueFromMap } from "./tvlPriceUtility";
/**
 * Fetches high-level stats from all ShidoKid factories for the Landing Page Pulse.
 */


/**
 * Transforms arkSummaries into a per-token mapping for TVL.
 * @param {Array} summaries - The array of vault objects you logged.
 * @returns {Object} - Mapping of token addresses to their aggregated stats.
 */
export function mapTokensForTVL(summaries) {
  if (!Array.isArray(summaries)) return {};

  return summaries.reduce((acc, vault) => {
    const addr = vault.token.toLowerCase();
    
    if (!acc[addr]) {
      acc[addr] = {
        symbol: vault.tokenSymbol,
        decimals: vault.tokenDecimals,
        totalLockedRaw: 0n,
        vaultCount: 0
      };
    }

    // Accumulate the BigInt values safely
    acc[addr].totalLockedRaw += BigInt(vault.lockedRaw || 0n);
    acc[addr].vaultCount += 1;

    return acc;
  }, {});
}

/**
 * Helper to get a clean string of unique addresses for API calls.
 */
export function getUniqueTokenAddresses(tokenMap) {
  return Object.keys(tokenMap).join(",");
}

export async function fetchEcosystemGlobalStats(web3) {
  if (!web3) return null;

  try {
    // 1. Connect Factories
    const [arkF, tokenF, presaleF, nftF] = await Promise.all([
      getVaultFactoryContract(web3),
      getTokenFactoryContract(web3),
      getLaunchpadFactoryContract(web3),
      getNftStakingFactoryContract(web3)
    ]);

    // 2. Batch Total Counts
    const [totalArk, totalTokens, totalPresales, nftDeployments] = await Promise.all([
      arkF.totalVaults().then(Number).catch(() => 0),
      tokenF.deployedTokens().then(Number).catch(() => 0),
      presaleF.totalLaunchpads().then(Number).catch(() => 0),
      nftF.getAllDeployments().catch(() => [])
    ]);

    // 3. Fetch Ark Metadata & Compute KPI Map
    const arkMetadata = await arkF.getVaultMetadata(0, totalArk);
    const arkSummaries = await readAllVaultsSummaries(web3, null, arkMetadata);
    const arkKPIs = computeFactoryKPIs(arkSummaries);

    // 4. Calculate USD TVL using the new DexHub Utility
    const liveTVL = await calculateUSDValueFromMap(arkKPIs?.perToken);

    return {
      totalImplementations: totalArk + totalTokens + totalPresales + (nftDeployments?.length || 0),
      tvlUSD: liveTVL, 
      nftPoolsCount: nftDeployments?.length || 0,
      uniqueTokensCount: arkKPIs?.uniqueTokensCount || 0
    };
  } catch (error) {
    console.error("Global Stats Fetch Failed:", error);
    return null;
  }
}