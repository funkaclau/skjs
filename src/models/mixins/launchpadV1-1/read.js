export function LaunchpadV11ReadMixin(Base) {
  return class extends Base {
    // ---- copy all v1 reads (owner, baseToken, saleToken, getLaunchpadInfo, etc.) ----
    async owner()            { return this.contract.methods.owner().call(); }
    // ... (same as your v1 read mixin) ...

    // ---- v1.1 whitelist reads ----
    async whitelistEnabled() { return this.contract.methods.whitelistEnabled().call(); }
    async isWhitelisted(addr){ return this.contract.methods.isWhitelisted(addr).call(); }
    async owner() {
      return await this.contract.methods.owner().call();
    }

    async baseToken() {
      return await this.contract.methods.baseToken().call();
    }

    async saleToken() {
      return await this.contract.methods.saleToken().call();
    }

    async saleTokenDecimals() {
      return await this.contract.methods.saleTokenDecimals().call();
    }

    async burnUnsoldTokens() {
      return await this.contract.methods.burnUnsoldTokens().call();
    }

    async startTime() {
      return await this.contract.methods.startTime().call();
    }

    async endTime() {
      return await this.contract.methods.endTime().call();
    }

    async rate() {
      return await this.contract.methods.rate().call();
    }

    async softCap() {
      return await this.contract.methods.softCap().call();
    }

    async hardCap() {
      return await this.contract.methods.hardCap().call();
    }

    async maxPerWallet() {
      return await this.contract.methods.maxPerWallet().call();
    }

    async minBuy() {
      return await this.contract.methods.minBuy().call();
    }

    async totalRaised() {
      return await this.contract.methods.totalRaised().call();
    }

    async totalSold() {
      return await this.contract.methods.totalSold().call();
    }

    async finalized() {
      return await this.contract.methods.finalized().call();
    }

    async cancelled() {
      return await this.contract.methods.cancelled().call();
    }

    async isSuccessful() {
      return await this.contract.methods.isSuccessful().call();
    }

    async isHardCapReached() {
      return await this.contract.methods.isHardCapReached().call();
    }

    async metadataSet() {
      return await this.contract.methods.metadataSet().call();
    }

    async tokensForSale() {
      return await this.contract.methods.tokensForSale().call();
    }

    async tokensBought(address) {
      return await this.contract.methods.tokensBought(address).call();
    }

    async tokensClaimed(address) {
      return await this.contract.methods.tokensClaimed(address).call();
    }

    async userDeposits(address) {
      return await this.contract.methods.userDeposits(address).call();
    }

    async name() {
      return await this.contract.methods.name().call();
    }

    async description() {
      return await this.contract.methods.description().call();
    }

    async telegram() {
      return await this.contract.methods.telegram().call();
    }

    async twitter() {
      return await this.contract.methods.twitter().call();
    }

    async website() {
      return await this.contract.methods.website().call();
    }

    async getLaunchpadInfo() {
      return await this.contract.methods.getLaunchpadInfo().call();
    }

    async getUserInfo(address) {
      return await this.contract.methods.getUserInfo(address).call();
    }
    async getAdminState() {
      return await this.contract.methods.getAdminState().call();
    }
  };
}
