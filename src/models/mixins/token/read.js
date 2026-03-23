export function ERC20ReadMixin(Base) {
    return class extends Base {
        async name() { return await this.contract.methods.name().call(); }
        async symbol() { return await this.contract.methods.symbol().call(); }
        async decimals() { return await this.contract.methods.decimals().call(); }
        async totalSupply() { return await this.contract.methods.totalSupply().call(); }
        async totalMinted() { return await this.contract.methods.totalMinted().call(); }
        async maxSupply() { return await this.contract.methods.maxSupply().call(); }
        async owner() { return await this.contract.methods.owner().call(); }

        async balanceOf(address) {
            return await this.contract.methods.balanceOf(address).call();
        }

        async allowance(owner, spender) {
            return await this.contract.methods.allowance(owner, spender).call();
        }
    };
}
