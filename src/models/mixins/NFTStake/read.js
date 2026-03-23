// NftStakingImplReadMixin.js
export function NftStakingImplReadMixin(Base) {
  return class extends Base {
    /** -------------------- constants / simple views -------------------- */
    async CLAIM_GRACE() {
      return this.contract.methods.CLAIM_GRACE().call();
    }

    async owner() {
      return this.contract.methods.owner().call();
    }

    async paused() {
      return this.contract.methods.paused().call();
    }

    async poolName() {
      return this.contract.methods.poolName().call();
    }

    async project() {
      return this.contract.methods.project().call();
    }

    async uri() {
      return this.contract.methods.uri().call();
    }

    async mode() {
      // enum as uint8
      return this.contract.methods.mode().call();
    }

    async rewardToken() {
      return this.contract.methods.rewardToken().call();
    }

    async startTime() {
      return this.contract.methods.startTime().call();
    }

    async lastUpdateTime() {
      return this.contract.methods.lastUpdateTime().call();
    }

    async isFinished() {
      return this.contract.methods.isFinished().call();
    }

    async maxCap() {
      return this.contract.methods.maxCap().call();
    }

    async maxPerUser() {
      return this.contract.methods.maxPerUser().call();
    }

    async rewards() {
      return this.contract.methods.rewards().call();
    }

    async rewardPerUnitStored() {
      return this.contract.methods.rewardPerUnitStored().call();
    }

    async totalUnits() {
      return this.contract.methods.totalUnits().call();
    }

    async totalUsers() {
      return this.contract.methods.totalUsers().call();
    }

    async totalClaimed() {
      return this.contract.methods.totalClaimed().call();
    }

    async globalAccrued() {
      return this.contract.methods.globalAccrued().call();
    }

    /** -------------------- NFT addresses -------------------- */
    async nft721() {
      return this.contract.methods.nft721().call();
    }

    async nft1155() {
      return this.contract.methods.nft1155().call();
    }

    /** -------------------- user-specific views -------------------- */
    async accrued(user) {
      return this.contract.methods.accrued(user).call();
    }

    async totalEarned(user) {
      return this.contract.methods.totalEarned(user).call();
    }

    async userUnitBalance(user) {
      return this.contract.methods.userUnitBalance(user).call();
    }

    async userRewardPerUnitPaid(user) {
      return this.contract.methods.userRewardPerUnitPaid(user).call();
    }

    /** stakes for 721: stakes721(user, tokenId) -> { stakedAt, claimedAt } */
    async stakes721(user, tokenId) {
      return this.contract.methods.stakes721(user, tokenId).call();
    }

    /** stakes for 1155: stakes1155(user, id) -> { amount, stakedAt, claimedAt } */
    async stakes1155(user, id) {
      return this.contract.methods.stakes1155(user, id).call();
    }

    /** index helpers */
    async tokenIndexInUserList721(user, tokenId) {
      return this.contract.methods.tokenIndexInUserList721(user, tokenId).call();
    }

    async tokenIndexInUserList1155(user, id) {
      return this.contract.methods.tokenIndexInUserList1155(user, id).call();
    }

    async userTokenIds721(user, index) {
      return this.contract.methods.userTokenIds721(user, index).call();
    }

    async userTokenIds1155(user, index) {
      return this.contract.methods.userTokenIds1155(user, index).call();
    }

    /** -------------------- pool-wide views -------------------- */
    async tokenOwner(index) {
      return this.contract.methods.tokenOwner(index).call();
    }

    async totalStakedPerId1155(id) {
      return this.contract.methods.totalStakedPerId1155(id).call();
    }

    async rewardParams() {
      // { rewardRate, lockPeriod, rewardEnd }
      return this.contract.methods.rewardParams().call();
    }

    async currentEmission() {
      // { poolPerSec, perUnitPerSec, poolPerDay, perUnitPerDay } (web3 returns object+array)
      return this.contract.methods.currentEmission().call();
    }

    async getPoolMetadata() {
      return this.contract.methods.getPoolMetadata().call();
    }

    /** -------------------- user staking data (paged & full) -------------------- */
    async getUserStakingData721(user) {
      return this.contract.methods.getUserStakingData721(user).call();
    }

    async getUserStakingData721Batch(user, start, count) {
      return this.contract.methods.getUserStakingData721Batch(user, start, count).call();
    }

    async getUserStakingData1155(user) {
      return this.contract.methods.getUserStakingData1155(user).call();
    }

    async getUserStakingData1155Batch(user, start, count) {
      return this.contract.methods.getUserStakingData1155Batch(user, start, count).call();
    }

    /** -------------------- interface helpers -------------------- */
    async supportsInterface(interfaceId) {
      return this.contract.methods.supportsInterface(interfaceId).call();
    }

    // The ERC1155/721 receiver views exist in ABI; you typically don't call them, but exposing anyway:
    async onERC721Received(operator, from, tokenId, data) {
      return this.contract.methods.onERC721Received(operator, from, tokenId, data).call();
    }

    async onERC1155Received(operator, from, id, value, data) {
      return this.contract.methods.onERC1155Received(operator, from, id, value, data).call();
    }

    async onERC1155BatchReceived(operator, from, ids, values, data) {
      return this.contract.methods.onERC1155BatchReceived(operator, from, ids, values, data).call();
    }
  };
}
