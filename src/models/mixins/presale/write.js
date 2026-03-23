export function PresaleWriteMixin(Base) {
    return class extends Base {
        async buyTokens(from = this.from, value = 0) {
            const sender = this._requireSender(from);
            return await this.contract.methods.buyTokens().send({ from: sender, value });
        }

        async startSeedRoundStage(rate, cap, startTime, duration, from = this.from) {
            return await this._send(this.contract.methods.startSeedRoundStage, [rate, cap, startTime, duration], from);
        }

        async finalizeSeedRound(from = this.from) {
            return await this._send(this.contract.methods.finalizeSeedRound, [], from);
        }

        async withdrawFunds(from = this.from) {
            return await this._send(this.contract.methods.withdrawFunds, [], from);
        }

        async transferOwnership(newOwner, from = this.from) {
            return await this._send(this.contract.methods.transferOwnership, [newOwner], from);
        }
    };
}
