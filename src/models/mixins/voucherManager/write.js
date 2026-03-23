export function VoucherManagerWriteMixin(Base) {
    return class extends Base {
        async createVoucher(code, discount, maxUses, from = this.from) {
            return await this._send(this.contract.methods.createVoucher, [code, discount, maxUses], from);
        }

        async applyVoucher(code, originalFee, from = this.from) {
            return await this._send(this.contract.methods.applyVoucher, [code, originalFee], from);
        }

        async setFactoryAuthorization(factory, status, from = this.from) {
            return await this._send(this.contract.methods.setFactoryAuthorization, [factory, status], from);
        }

        async transferOwnership(newOwner, from = this.from) {
            return await this._send(this.contract.methods.transferOwnership, [newOwner], from);
        }

        async renounceOwnership(from = this.from) {
            return await this._send(this.contract.methods.renounceOwnership, [], from);
        }
    };
}
