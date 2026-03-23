export function GlobalStatsMixin(Base) {
    return class extends Base {

        // ========== READ FUNCTIONS ==========

        async apy() { return await this.contract.methods.apy().call(); }
        async stakeFee() { return await this.contract.methods.stakeFee().call(); }
        async unstakeFee() { return await this.contract.methods.unstakeFee().call(); }
        async claimFee() { return await this.contract.methods.claimFee().call(); }
        async accumulatedFees() { return await this.contract.methods.accumulatedFees().call(); }
        async totalStaked() { return await this.contract.methods.totalStaked().call(); }
        async rewardBalance() { return await this.contract.methods.rewardBalance().call(); }
        async startTime() { return await this.contract.methods.startTime().call(); }
        async endTime() { return await this.contract.methods.endTime().call(); }
        async maxStakeable() { return await this.contract.methods.maxStakeable().call(); }
        async stakingToken() { return await this.contract.methods.stakingToken().call(); }
        async blacklistContract() { return await this.contract.methods.blacklistContract().call(); }
        async requiredRewardAmount() { return await this.contract.methods.requiredRewardAmount().call(); }
        async getRemainingRewards() { return await this.contract.methods.getRemainingRewards().call(); }
        async owner() { return await this.contract.methods.owner().call(); }

        async getFees() {
            const [stake, claim, unstake] = await this.contract.methods.getFees().call();
            return {
                stakeFee: stake,
                claimFee: claim,
                unstakeFee: unstake
            };
        }

        // ========== SCOPED READ FUNCTIONS ==========

        async getClaimableRewards(userAddress) {
            return await this.contract.methods.getClaimableRewards(userAddress).call();
        }

        async rewards(userAddress) {
            return await this.contract.methods.rewards(userAddress).call();
        }

        async stakes(userAddress) {
            const { amount, lastUpdate } = await this.contract.methods.stakes(userAddress).call();
            return { amount, lastUpdate };
        }
    };
}
