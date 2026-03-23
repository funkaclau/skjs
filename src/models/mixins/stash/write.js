export function StashWriteMixin(Base) {
    return class extends Base {
        async lockTokens(amount, duration, label, from = this.from) {
            return await this._send(this.contract.methods.lockTokens, [amount, duration, label], from);
        }

        async unlockTokens(index, from = this.from) {
            return await this._send(this.contract.methods.unlockTokens, [index], from);
        }
    };
}
