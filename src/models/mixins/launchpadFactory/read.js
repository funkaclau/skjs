export function LaunchpadFactoryReadMixin(Base) {
  return class extends Base {
    async owner() {
      return await this.contract.methods.owner().call();
    }

    async implementationCount() {
      return await this.contract.methods.implementationCount().call();
    }

    async totalLaunchpads() {
      return await this.contract.methods.totalLaunchpads().call();
    }

    async getAllLaunchpads() {
      return await this.contract.methods.getAllLaunchpads().call();
    }

    async getUserLaunchpads(user) {
      return await this.contract.methods.getUserLaunchpads(user).call();
    }

    async usedLabels(label) {
      return await this.contract.methods.usedLabels(label).call();
    }

    async implementations(index) {
      return await this.contract.methods.implementations(index).call();
    }

    async allLaunchpads(index) {
      return await this.contract.methods.allLaunchpads(index).call();
    }

    async userLaunchpads(user, index) {
      return await this.contract.methods.userLaunchpads(user, index).call();
    }

    async getUniqueUsers() {
      return await this.contract.methods.getUniqueUsers().call();
    }

    async erc20Payment() {
      return await this.contract.methods.erc20Payment().call();
    }

    async voucherManager() {
      return await this.contract.methods.voucherManager().call();
    }

    async splitter() {
      return await this.contract.methods.splitter().call();
    }

    async TIER_MULTIPLIER_SIMPLE() {
      return await this.contract.methods.TIER_MULTIPLIER_SIMPLE().call();
    }

    async TIER_MULTIPLIER_STANDARD() {
      return await this.contract.methods.TIER_MULTIPLIER_STANDARD().call();
    }

    async TIER_MULTIPLIER_PREMIUM() {
      return await this.contract.methods.TIER_MULTIPLIER_PREMIUM().call();
    }
  };
}
