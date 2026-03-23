export function LaunchpadV1WriteMixin(Base) {
  return class extends Base {
    async buy(amount, from = this.from) {
      return await this._send(this.contract.methods.buy, [amount], from);
    }

    async claimTokens(from = this.from) {
      return await this._send(this.contract.methods.claimTokens, [], from);
    }

    async refund(from = this.from) {
      return await this._send(this.contract.methods.refund, [], from);
    }

    async finalize(from = this.from) {
      return await this._send(this.contract.methods.finalize, [], from);
    }

    async cancelPresale(from = this.from) {
      return await this._send(this.contract.methods.cancelPresale, [], from);
    }

    async withdrawFunds(from = this.from) {
      return await this._send(this.contract.methods.withdrawFunds, [], from);
    }

    async withdrawUnsoldTokens(from = this.from) {
      return await this._send(this.contract.methods.withdrawUnsoldTokens, [], from);
    }

    async transferOwnership(newOwner, from = this.from) {
      return await this._send(this.contract.methods.transferOwnership, [newOwner], from);
    }

    async setupPresale(
      startTime,
      durationDays,
      name,
      description,
      telegram,
      twitter,
      website,
      burnUnsoldTokens,
      from = this.from
    ) {
      return await this._send(
        this.contract.methods.setupPresale,
        [
          startTime,
          durationDays,
          name,
          description,
          telegram,
          twitter,
          website,
          burnUnsoldTokens
        ],
        from
      );
    }
  };
}
