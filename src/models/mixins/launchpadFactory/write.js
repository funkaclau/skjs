export function LaunchpadFactoryWriteMixin(Base) {
  return class extends Base {
    async addImplementation(impl, nativeFee, erc20Fee, version, from = this.from) {
      return await this._send(this.contract.methods.addImplementation, [impl, nativeFee, erc20Fee, version], from);
    }

    async updateImplementation(implId, newNativeFee, newErc20Fee, newVersion, from = this.from) {
      return await this._send(this.contract.methods.updateImplementation, [implId, newNativeFee, newErc20Fee, newVersion], from);
    }

    async setImplementationStatus(implId, active, from = this.from) {
      return await this._send(this.contract.methods.setImplementationStatus, [implId, active], from);
    }
    
    async createWithERC20(implId, initData, label, voucher, from = this.from) {
      return this.contract.methods
        .createWithERC20(implId, initData, label, voucher)
        .send({ from });

    }

    async createWithNative(implId, initData, label, voucher, value = "0", from = this.from) {
      return this.contract.methods
        .createWithNative(implId, initData, label, voucher)
        .send({ from, value });

    }

    async transferOwnership(newOwner, from = this.from) {
      return await this._send(this.contract.methods.transferOwnership, [newOwner], from);
    }

    async renounceOwnership(from = this.from) {
      return await this._send(this.contract.methods.renounceOwnership, [], from);
    }
  };
}
