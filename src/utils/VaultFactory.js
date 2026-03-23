
// 📁 src/funcs/vaultFactory.js

export async function fetchVaultFactoryData(factoryContract) {
    try {
        const implementationCount = await factoryContract.implementationCount();
        const totalVaults = await factoryContract.totalVaults();
        const owner = await factoryContract.owner();

        return {
            implementationCount: Number(implementationCount),
            totalVaults: Number(totalVaults),
            owner,
        };
    } catch (error) {
        console.error("Error fetching vault factory data:", error);
        return null;
    }
}

export async function fetchVaultImplementations(factoryContract, implementationCount) {
    try {
        const implementations = [];

        for (let i = 1; i <= implementationCount; i++) {
            const impl = await factoryContract.implementations(i);
            if (impl.active) {
                implementations.push({
                    id: i,
                    implementation: impl.implementation,
                    version: impl.version,
                    initSignature: impl.initSignature
                });
            }
        }

        return implementations;
    } catch (error) {
        console.error("Error fetching vault implementations:", error);
        return [];
    }
}
export async function fetchUserVaults(factoryContract, userAddress) {
    if (!userAddress || !factoryContract) return [];

    try {
        const vaults = await factoryContract.getVaultsByOwner(userAddress);
        return vaults; // array of vault addresses
    } catch (error) {
        console.error("Error fetching user vaults:", error);
        return [];
    }
}