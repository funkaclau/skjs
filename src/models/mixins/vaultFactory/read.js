export function VaultFactoryReadMixin(Base) {
    return class extends Base {
        async owner() { return await this.contract.methods.owner().call(); }
        async onlyEOA() { return await this.contract.methods.onlyEOA().call(); }
        async topDeployer() { return await this.contract.methods.topDeployer().call(); }
        async topDeployCount() { return await this.contract.methods.topDeployCount().call(); }
        async totalVaults() { return await this.contract.methods.totalVaults().call(); }
        async implementationCount() { return await this.contract.methods.implementationCount().call(); }

        async getDeployedVaults() {
            return await this.contract.methods.getDeployedVaults().call();
        }

        async getUniqueUsers() {
            return await this.contract.methods.getUniqueUsers().call();
        }

        async getUserDeploymentCount(user) {
            return await this.contract.methods.getUserDeploymentCount(user).call();
        }

        async getVaultsByOwner(user) {
            return await this.contract.methods.getVaultsByOwner(user).call();
        }

        async getVaults(start, count) {
            return await this.contract.methods.getVaults(start, count).call();
        }

        async getVaultMetadata(start, count) {
            return await this.contract.methods.getVaultMetadata(start, count).call();
        }

        async getVaultDetails(address) {
            return await this.contract.methods.getVaultDetails(address).call();
        }

        async listImplementations(start, count) {
            return await this.contract.methods.listImplementations(start, count).call();
        }

        async usedVaultNames(name) {
            return await this.contract.methods.usedVaultNames(name).call();
        }

        async deployedVaults(index) {
            return await this.contract.methods.deployedVaults(index).call();
        }

        async implementations(index) {
            return await this.contract.methods.implementations(index).call();
        }

        async userVaults(user, index) {
            return await this.contract.methods.userVaults(user, index).call();
        }

        async vaultDetails(address) {
            return await this.contract.methods.vaultDetails(address).call();
        }
    };
}
