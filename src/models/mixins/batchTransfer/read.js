export function BatchTransferReadMixin(Base) {
    return class extends Base {
        async getTotalTokens() {
            return await this.contract.methods.getTotalTokens().call();
        }

        async getTokenByID(tokenID) {
            return await this.contract.methods.getTokenByID(tokenID).call();
        }

        async getTotalUsers() {
            return await this.contract.methods.getTotalUsers().call();
        }

        async getUserByID(userID) {
            return await this.contract.methods.getUserByID(userID).call();
        }

        async getUserMetrics(userAddress) {
            const { userTransactions, userRecipients, userNativeSent, userTokensSent } =
                await this.contract.methods.getUserMetrics(userAddress).call();
            return { userTransactions, userRecipients, userNativeSent, userTokensSent };
        }
    };
}
