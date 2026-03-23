export function StashReadMixin(Base) {
    return class extends Base {
        async tokenCreator() {
            return await this.contract.methods.tokenCreator().call();
        }

        async getLocks(lockerAddress) {
            const locks = await this.contract.methods.getLocks(lockerAddress).call();
            return locks.map(lock => ({
                amount: lock.amount,
                unlockTime: lock.unlockTime,
                label: lock.label
            }));
        }
    };
}
