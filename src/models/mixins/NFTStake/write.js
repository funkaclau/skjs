// NftStakingImplWriteMixin.js
export function NftStakingImplWriteMixin(Base) {
  return class extends Base {
    /** Utility: nonpayable send wrapper using your Base._send pattern */
    _s(method, args = [], from = this.from) {
    // align with Base._send signature used across your other mixins
    return this._send(method, args, from);
  }
    /** -------------------- ownership / admin -------------------- */
    async transferOwnership(newOwner, from = this.from) {
      return this._s(this.contract.methods.transferOwnership, [newOwner], from);
    }

    async renounceOwnership(from = this.from) {
      return this._s(this.contract.methods.renounceOwnership, [], from);
    }

    async setPaused(p, from = this.from) {
      return this._s(this.contract.methods.setPaused, [p], from);
    }

    async setMaxCap(newCap, from = this.from) {
      return this._s(this.contract.methods.setMaxCap, [newCap], from);
    }

    async updateRewardRate(newRate, from = this.from) {
      return this._s(this.contract.methods.updateRewardRate, [newRate], from);
    }

    async extendRewardPeriod(additionalSeconds, from = this.from) {
      return this._s(this.contract.methods.extendRewardPeriod, [additionalSeconds], from);
    }

    async withdrawUnallocated(to, from = this.from) {
      return this._s(this.contract.methods.withdrawUnallocated, [to], from);
    }

    async recoverAlien721(tokenId, to, from = this.from) {
      return this._s(this.contract.methods.recoverAlien721, [tokenId, to], from);
    }

    async recoverAlien1155(id, amount, to, from = this.from) {
      return this._s(this.contract.methods.recoverAlien1155, [id, amount, to], from);
    }

    async sync(from = this.from) {
      return this._s(this.contract.methods.sync, [], from);
    }

    /**
     * Usually called by the factory. Exposed for completeness.
     * @param {string} data - ABI-encoded init bytes
     */
    async initialize(data, from = this.from) {
      return this._s(this.contract.methods.initialize, [data], from);
    }

    /** -------------------- funding / rewards -------------------- */
    /**
     * Fund the pool with reward tokens.
     * NOTE: Caller must approve `rewardToken` for `amount` before calling.
     */
    async fund(amount, from = this.from) {
      return this._s(this.contract.methods.fund, [amount], from);
    }

    async claimAllRewards(from = this.from) {
      return this._s(this.contract.methods.claimAllRewards, [], from);
    }

    /**
     * The ABI has `claimReward(uint256)` (unnamed param).
     * Semantics are implementation-specific (index/tokenId/slot).
     */
    async claimReward(indexOrId, from = this.from) {
      return this._s(this.contract.methods["claimReward"], [indexOrId], from);
    }

    /** -------------------- staking (overloads) -------------------- */
    /** 721: stake(uint256[] tokenIds) */
    async stake721(tokenIds, from = this.from) {
      return this._s(this.contract.methods["stake(uint256[])"], [tokenIds], from);
    }

    /** 1155: stake(uint256[] ids, uint256[] amounts) */
    async stake1155(ids, amounts, from = this.from) {
      return this._s(this.contract.methods["stake(uint256[],uint256[])"], [ids, amounts], from);
    }

    /** 721: unstake(uint256[] tokenIds) */
    async unstake721(tokenIds, from = this.from) {
      return this._s(this.contract.methods["unstake(uint256[])"], [tokenIds], from);
    }

    /** 1155: unstake(uint256[] ids, uint256[] amounts) */
    async unstake1155(ids, amounts, from = this.from) {
      return this._s(this.contract.methods["unstake(uint256[],uint256[])"], [ids, amounts], from);
    }

    /** -------------------- emergency unstake -------------------- */
    async emergencyUnstake721(tokenIds, from = this.from) {
      return this._s(this.contract.methods.emergencyUnstake721, [tokenIds], from);
    }

    async emergencyUnstake1155(ids, amounts, from = this.from) {
      return this._s(this.contract.methods.emergencyUnstake1155, [ids, amounts], from);
    }
  };
}
