export function TokenFactoryReadMixin(Base) {
    return class extends Base {
        async owner() {
            return await this.contract.methods.owner().call();
        }

        async splitterContract() {
            return await this.contract.methods.splitterContract().call();
        }

        async voucherManager() {
            return await this.contract.methods.voucherManager().call();
        }

        async paymentToken() {
            return await this.contract.methods.paymentToken().call();
        }

        async tokenTypeCount() {
            return await this.contract.methods.tokenTypeCount().call();
        }

        async topDeployer() {
            return await this.contract.methods.topDeployer().call();
        }

        async mostUsedTokenType() {
            return await this.contract.methods.mostUsedTokenType().call();
        }

        async mostUsedCount() {
            return await this.contract.methods.mostUsedCount().call();
        }

        async totalNativeEarned() {
            return await this.contract.methods.totalNativeEarned().call();
        }

        async totalERC20Earned() {
            return await this.contract.methods.totalERC20Earned().call();
        }

        // ==== SCOPED ==== //

        async tokenImplementations(id) {
            return await this.contract.methods.tokenImplementations(id).call();
        }

        async tokenDeploymentCount(id) {
            return await this.contract.methods.tokenDeploymentCount(id).call();
        }

        async deployedTokens(id) {
            return await this.contract.methods.deployedTokens(id).call();
        }

        async uniqueUsers(id) {
            return await this.contract.methods.uniqueUsers(id).call();
        }

        async userDeployCount(address) {
            return await this.contract.methods.userDeployCount(address).call();
        }

        async isUserTracked(address) {
            return await this.contract.methods.isUserTracked(address).call();
        }

        async userTokens(user, index) {
            return await this.contract.methods.userTokens(user, index).call();
        }

        async voucherUsageByImplementation(address, code) {
            return await this.contract.methods.voucherUsageByImplementation(address, code).call();
        }
    };
}
