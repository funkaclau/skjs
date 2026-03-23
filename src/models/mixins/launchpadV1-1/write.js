

export function LaunchpadV11WriteMixin(Base) {
  return class extends Base {
    // ---- v1 base actions (copy from v1) ----
    async buy(amount, from = this.from)               { return this._send(this.contract.methods.buy, [amount], from); }
    async claimTokens(from = this.from)               { return this._send(this.contract.methods.claimTokens, [], from); }
    async refund(from = this.from)                    { return this._send(this.contract.methods.refund, [], from); }
    async finalize(from = this.from)                  { return this._send(this.contract.methods.finalize, [], from); }
    async cancelPresale(from = this.from)             { return this._send(this.contract.methods.cancelPresale, [], from); }
    async withdrawFunds(from = this.from)             { return this._send(this.contract.methods.withdrawFunds, [], from); }
    async withdrawUnsoldTokens(from = this.from)      { return this._send(this.contract.methods.withdrawUnsoldTokens, [], from); }
    async transferOwnership(newOwner, from = this.from){ return this._send(this.contract.methods.transferOwnership, [newOwner], from); }
    async setupPresale(startTime, durationDays, name, description, telegram, twitter, website, burnUnsoldTokens, from = this.from) {
      return this._send(this.contract.methods.setupPresale,
        [startTime, durationDays, name, description, telegram, twitter, website, burnUnsoldTokens],
        from
      );
    }

    // ---- v1.1 whitelist extras ----
    async setWhitelistEnabled(enabled, from = this.from) {
      return this._send(this.contract.methods.setWhitelistEnabled, [enabled], from);
    }

    async setWhitelist(address_, approved, from = this.from) {
      return this._send(this.contract.methods.setWhitelist, [address_, approved], from);
    }

    async setWhitelistBatch(addresses, approved, from = this.from) {
      return this._send(this.contract.methods.setWhitelistBatch, [addresses, approved], from);
    }
  };
}
