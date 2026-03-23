export function WriteMixin(Base) {
    return class extends Base {
        // ========== WRITE FUNCTIONS ==========

        async stake(amount, from = this.from) {
            const sender = this._requireSender(from);
            return await this._send(this.contract.methods.stake, [amount], from, "0x0", 10000000000000000000 );
        }

        async unstake(from = this.from) {
            const sender = this._requireSender(from);
            return await this._send(this.contract.methods.unstake, [], from, "0x0", 10000000000000000000 );
        }

        async claimRewards(from = this.from) {
            return await this._send(this.contract.methods.claimRewards, [], from, "0x0", 10000000000000000000 );
        }

        async forceUnstake(userAddress, from = this.from) {
            return await this._send(this.contract.methods.forceUnstake, [userAddress], from);
        }

        async addRewards(amount, from = this.from) {
            return await this._send(this.contract.methods.addRewards, [amount], from);
        }

        async withdrawExcessRewards(from = this.from) {
            return await this._send(this.contract.methods.withdrawExcessRewards, [], from);
        }

        async withdrawFees(from = this.from) {
            return await this._send(this.contract.methods.withdrawFees, [], from);
        }
    };
}
