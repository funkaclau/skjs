// 📌 src/api/factoryAPI.js
export async function fetchFactoryData(factoryContract, web3) {
    try {
        const totalDeployedTokens = await factoryContract.tokenDeploymentCount(1);
        const tokenTypeCount = await factoryContract.tokenTypeCount();
        const totalNativeEarned = await factoryContract.totalNativeEarned();
        const totalERC20Earned = await factoryContract.totalERC20Earned();
        const owner = await factoryContract.owner();

        return {
            totalDeployedTokens: totalDeployedTokens.toString(),
            tokenTypeCount,
            totalNativeEarned: web3.utils.fromWei(totalNativeEarned, "ether"),
            totalERC20Earned: web3.utils.fromWei(totalERC20Earned, "ether"),
            owner,
        };
    } catch (error) {
        console.error("Error fetching factory data:", error);
        return null;
    }
}


//src/api/factoryAPI.js
export async function fetchAllDeployedTokens(factoryContract, totalTokens) {
    if (!factoryContract || totalTokens === 0) return [];

    try {
        let tokens = [];
        for (let i = 0; i < totalTokens; i++) {
            const token = await factoryContract.deployedTokens(i);
            tokens.push({
                address: token.tokenAddress,
                name: token.name,
                symbol: token.symbol,
                owner: token.owner,
            });
        }

        return tokens;
    } catch (error) {
        console.error("Error fetching all deployed tokens:", error);
        return [];
    }
}