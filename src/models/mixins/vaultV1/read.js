export function VaultV1ReadMixin(Base) {
    return class extends Base {
        async owner() {
            return await this.contract.methods.owner().call();
        }

        async createdAt() {
            return await this.contract.methods.createdAt().call();
        }

        async tokenAddress() {
            return await this.contract.methods.tokenAddress().call();
        }

        async totalLocked() {
            return await this.contract.methods.totalLocked().call();
        }

        async vaultName() {
            return await this.contract.methods.vaultName().call();
        }

        async getLockById(id) {
            return await this.contract.methods.getLockById(id).call();
        }

        async getLockCount() {
            return await this.contract.methods.getLockCount().call();
        }

        async getLocks(start, count) {
            return await this.contract.methods.getLocks(start, count).call();
        }

        async getUnlockedLockIds() {
            return await this.contract.methods.getUnlockedLockIds().call();
        }

        async getUnlockedLocks() {
            return await this.contract.methods.getUnlockedLocks().call();
        }

        async getVaultSummary() {
            return await this.contract.methods.getVaultSummary().call();
        }

        async getWithdrawableAmount() {
            return await this.contract.methods.getWithdrawableAmount().call();
        }

        async tokenLocks(index) {
            return await this.contract.methods.tokenLocks(index).call();
        }
    };
}
