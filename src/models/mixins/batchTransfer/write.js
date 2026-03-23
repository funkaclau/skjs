export function BatchTransferWriteMixin(Base) {
    return class extends Base {
        async batchTransferNative(recipients, amounts, from = this.from, value = 0) {
            const sender = this._requireSender(from);
            return await this.contract.methods.batchTransferNative(recipients, amounts).send({ from: sender, value });
        }

        async batchTransferERC20(token, recipients, amounts, from = this.from) {
            return await this._send(
                this.contract.methods.batchTransferERC20,
                [token, recipients, amounts],
                from
            );
        }
    };
}
