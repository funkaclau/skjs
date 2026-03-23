export function VoucherManagerReadMixin(Base) {
    return class extends Base {
        async owner() {
            return await this.contract.methods.owner().call();
        }

        async authorizedFactories(factoryAddr) {
            return await this.contract.methods.authorizedFactories(factoryAddr).call();
        }

        async getVoucher(code) {
            const [discount, remainingUses] = await this.contract.methods.getVoucher(code).call();
            return { discount, remainingUses };
        }

        async vouchers(code) {
            const voucher = await this.contract.methods.vouchers(code).call();
            return { discount: voucher.discount, remainingUses: voucher.remainingUses };
        }

        async getTotalDiscountGiven() {
            return await this.contract.methods.getTotalDiscountGiven().call();
        }

        async totalDiscountGiven() {
            return await this.contract.methods.totalDiscountGiven().call();
        }
    };
}
