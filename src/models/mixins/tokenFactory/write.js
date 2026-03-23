export function TokenFactoryWriteMixin(Base) {
    return class extends Base {
        async addTokenImplementation(implementation, nativeFee, erc20Fee, from = this.from) {
            return await this._send(this.contract.methods.addTokenImplementation, [implementation, nativeFee, erc20Fee], from);
        }

        async createTokenWithERC20(tokenTypeId, name, symbol, initialSupply, decimals, voucherCode, from = this.from) {
            return await this._send(this.contract.methods.createTokenWithERC20, [tokenTypeId, name, symbol, initialSupply, decimals, voucherCode], from);
        }

        async createTokenWithNative(tokenTypeId, name, symbol, initialSupply, decimals, voucherCode, from = this.from) {
            return await this._send(this.contract.methods.createTokenWithNative, [tokenTypeId, name, symbol, initialSupply, decimals, voucherCode], from);
        }

        async removeTokenImplementation(id, from = this.from) {
            return await this._send(this.contract.methods.removeTokenImplementation, [id], from);
        }

        async transferOwnership(newOwner, from = this.from) {
            return await this._send(this.contract.methods.transferOwnership, [newOwner], from);
        }

        async updateSplitterContract(newSplitter, from = this.from) {
            return await this._send(this.contract.methods.updateSplitterContract, [newSplitter], from);
        }

        async updateVoucherManager(newManager, from = this.from) {
            return await this._send(this.contract.methods.updateVoucherManager, [newManager], from);
        }

        async updateTokenImplementation(id, newImpl, nativeFee, erc20Fee, from = this.from) {
            return await this._send(this.contract.methods.updateTokenImplementation, [id, newImpl, nativeFee, erc20Fee], from);
        }

        async renounceOwnership(from = this.from) {
            return await this._send(this.contract.methods.renounceOwnership, [], from);
        }
    };
}
