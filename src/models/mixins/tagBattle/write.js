export function TagContractWriteMixin(Base) {
    return class extends Base {
        async likeMessageWithKiddo(from = this.from) {
            return await this._send(this.contract.methods.likeMessageWithKiddo, [], from);
        }

        async likeMessageWithShido(from = this.from, value = 0) {
            const sender = this._requireSender(from);
            return await this.contract.methods.likeMessageWithShido().send({ from: sender, value });
        }

        async submitMessageWithKiddo(message, from = this.from) {
            return await this._send(this.contract.methods.submitMessageWithKiddo, [message], from);
        }

        async submitMessageWithShido(message, from = this.from, value = 0) {
            const sender = this._requireSender(from);
            return await this.contract.methods.submitMessageWithShido(message).send({ from: sender, value });
        }

        async startNewSeason(from = this.from) {
            return await this._send(this.contract.methods.startNewSeason, [], from);
        }

        async setBlacklistContract(addr, from = this.from) {
            return await this._send(this.contract.methods.setBlacklistContract, [addr], from);
        }

        async setCooldownDuration(val, from = this.from) {
            return await this._send(this.contract.methods.setCooldownDuration, [val], from);
        }

        async setCreatorSharePercentage(val, from = this.from) {
            return await this._send(this.contract.methods.setCreatorSharePercentage, [val], from);
        }

        async setKiddoFee(val, from = this.from) {
            return await this._send(this.contract.methods.setKiddoFee, [val], from);
        }

        async setKiddoToken(addr, from = this.from) {
            return await this._send(this.contract.methods.setKiddoToken, [addr], from);
        }

        async setLikeKiddoFee(val, from = this.from) {
            return await this._send(this.contract.methods.setLikeKiddoFee, [val], from);
        }

        async setLikeShidoFee(val, from = this.from) {
            return await this._send(this.contract.methods.setLikeShidoFee, [val], from);
        }

        async setShidoFee(val, from = this.from) {
            return await this._send(this.contract.methods.setShidoFee, [val], from);
        }

        async transferOwnership(newOwner, from = this.from) {
            return await this._send(this.contract.methods.transferOwnership, [newOwner], from);
        }

        async renounceOwnership(from = this.from) {
            return await this._send(this.contract.methods.renounceOwnership, [], from);
        }

        async withdrawKiddo(from = this.from) {
            return await this._send(this.contract.methods.withdrawKiddo, [], from);
        }

        async withdrawShido(from = this.from) {
            return await this._send(this.contract.methods.withdrawShido, [], from);
        }
    };
}
