export function ERC20WriteMixin(Base) {
    return class extends Base {
        async transfer(to, amount, from = this.from) {
            return await this._send(this.contract.methods.transfer, [to, amount], from);
        }

        async transferFrom(fromAddr, to, amount, from = this.from) {
            return await this._send(this.contract.methods.transferFrom, [fromAddr, to, amount], from);
        }

        async approve(spender, amount, from = this.from) {
            return await this._send(this.contract.methods.approve, [spender, amount], from);
        }

        async mint(to, amount, from = this.from) {
            return await this._send(this.contract.methods.mint, [to, amount], from);
        }

        async burn(amount, from = this.from) {
            return await this._send(this.contract.methods.burn, [amount], from);
        }

        async burnFromOwner(amount, from = this.from) {
            return await this._send(this.contract.methods.burnFromOwner, [amount], from);
        }

        async transferOwnership(newOwner, from = this.from) {
            return await this._send(this.contract.methods.transferOwnership, [newOwner], from);
        }

        async renounceOwnership(from = this.from) {
            return await this._send(this.contract.methods.renounceOwnership, [], from);
        }
    };
}
