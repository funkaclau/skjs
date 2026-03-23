export function VaultV1WriteMixin(Base) {
    return class extends Base {
        async deposit(amount, duration, label, from) {
            return await this.contract.methods.deposit(amount, duration, label).send({ from });
        }

        async addToLock(index, amount, from) {
            return await this.contract.methods.addToLock(index, amount).send({ from });
        }

        async extendUnlockTime(index, additionalTime, from) {
            return await this.contract.methods.extendUnlockTime(index, additionalTime).send({ from });
        }

        async withdraw(index, amount, from) {
            return await this.contract.methods.withdraw(index, amount).send({ from });
        }

        async updateLabel(index, newLabel, from) {
            return await this.contract.methods.updateLabel(index, newLabel).send({ from });
        }

        async transferOwnership(newOwner, from) {
            return await this.contract.methods.transferOwnership(newOwner).send({ from });
        }

        async renounceOwnership(from) {
            return await this.contract.methods.renounceOwnership().send({ from });
        }

        async initialize(owner, vaultName, tokenAddress, from) {
            return await this.contract.methods.initialize(owner, vaultName, tokenAddress).send({ from });
        }
    };
}
