// Writes aligned to NFT_STAKE_FACTORY_ABI
export function NftStakingFactoryWriteMixin(Base) {
  return class extends Base {
    /** -------------------- owner/admin -------------------- */

    /**
     * addImplementation(impl, version, initSig, nativeFee, erc20Fee)
     */
    async addImplementation(impl, version, initSig, nativeFee, erc20Fee, from = this.from) {
      return this._send(this.contract.methods.addImplementation, [impl, version, initSig, nativeFee, erc20Fee], from);
    }

    /**
     * updateImplementation(id, impl, sig, nativeFee, erc20Fee)
     */
    async updateImplementation(id, impl, sig, nativeFee, erc20Fee, from = this.from) {
      return this._send(this.contract.methods.updateImplementation, [id, impl, sig, nativeFee, erc20Fee], from);
    }

    async removeImplementation(id, from = this.from) {
      return this._send(this.contract.methods.removeImplementation, [id], from);
    }

    async transferOwnership(newOwner, from = this.from) {
      return this._send(this.contract.methods.transferOwnership, [newOwner], from);
    }

    async renounceOwnership(from = this.from) {
      return this._send(this.contract.methods.renounceOwnership, [], from);
    }

    /** -------------------- pool creation -------------------- */

    /**
     * createPoolWithERC20(implId, initData, label, voucherCode)
     * NOTE: User must approve factory to spend `paymentToken`
     */
    async createPoolWithERC20(implId, initData, label, voucherCode, from = this.from) {
      return this._send(this.contract.methods.createPoolWithERC20, [implId, initData, label, voucherCode], from);
    }

    /**
     * createPoolWithNative(implId, initData, label, voucherCode)
     * @param {string|number} value - fee in wei (must include discount logic client-side or overpay and rely on refund)
     */
    async createPoolWithNative(implId, initData, label, voucherCode, value = "0", from = this.from) {
      return this.contract.methods
        .createPoolWithNative(implId, initData, label, voucherCode)
        .send({ from, value });
    }
  };
}
