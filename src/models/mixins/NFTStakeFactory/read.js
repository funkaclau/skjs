// Reads aligned to NFT_STAKE_FACTORY_ABI
export function NftStakingFactoryReadMixin(Base) {
  return class extends Base {
    /** -------------------- basic views -------------------- */
    async owner() {
      return this.contract.methods.owner().call();
    }

    async implementationCount() {
      return this.contract.methods.implementationCount().call();
    }

    async mostUsedVersion() {
      return this.contract.methods.mostUsedVersion().call(); // bytes32
    }

    async paymentToken() {
      return this.contract.methods.paymentToken().call(); // address (immutable)
    }

    async splitter() {
      return this.contract.methods.splitter().call(); // address (immutable)
    }

    async voucherManager() {
      return this.contract.methods.voucherManager().call(); // address (immutable)
    }

    async topDeployer() {
      return this.contract.methods.topDeployer().call();
    }

    async topDeploys() {
      return this.contract.methods.topDeploys().call();
    }

    async userDeployCount(user) {
      return this.contract.methods.userDeployCount(user).call();
    }

    /**
     * @param {string} versionBytes32 - bytes32 keccak256(version)
     */
    async versionDeployCount(versionBytes32) {
      return this.contract.methods.versionDeployCount(versionBytes32).call();
    }

    /** -------------------- implementations -------------------- */

    async getActiveImplementations() {
      return this.contract.methods.getActiveImplementations().call();
    }

    async getImplementation(id) {
      return this.contract.methods.getImplementation(id).call();
    }

    async getImplementationBatch(start, count) {
      const out = await this.contract.methods.getImplementationBatch(start, count).call();
      return Array.isArray(out) ? out : out?.result ?? [];
    }

    /** -------------------- deployments registry -------------------- */

    async getAllDeployments() {
      return this.contract.methods.getAllDeployments().call();
    }

    async getDeploymentsBatch(start, count) {
      const out = await this.contract.methods.getDeploymentsBatch(start, count).call();
      return Array.isArray(out) ? out : out?.result ?? [];
    }

    async getDeploymentsOf(user) {
      return this.contract.methods.getDeploymentsOf(user).call();
    }
  };
}
