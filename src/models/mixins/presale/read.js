export function PresaleReadMixin(Base) {
    return class extends Base {
        async token() { return await this.contract.methods.token().call(); }
        async owner() { return await this.contract.methods.owner().call(); }
        async cap() { return await this.contract.methods.cap().call(); }
        async rate() { return await this.contract.methods.rate().call(); }
        async startTime() { return await this.contract.methods.startTime().call(); }
        async deadline() { return await this.contract.methods.deadline().call(); }
        async cooldown() { return await this.contract.methods.cooldown().call(); }
        async cooldownPeriod() { return await this.contract.methods.cooldownPeriod().call(); }
        async maxPerPurchase() { return await this.contract.methods.maxPerPurchase().call(); }
        async maxPerAccount() { return await this.contract.methods.maxPerAccount().call(); }
        async tokensSold() { return await this.contract.methods.tokensSold().call(); }

        async getAllBuyers() {
            return await this.contract.methods.getAllBuyers().call();
        }

        async getBuyersAndAmounts() {
            const [buyers, amounts] = await this.contract.methods.getBuyersAndAmounts().call();
            return buyers.map((buyer, i) => ({ buyer, amount: amounts[i] }));
        }

        async lastPurchaseTime(address) {
            return await this.contract.methods.lastPurchaseTime(address).call();
        }

        async getTokensPurchasedByAddress(address) {
            return await this.contract.methods.getTokensPurchasedByAddress(address).call();
        }
    };
}
