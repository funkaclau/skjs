export function TagContractReadMixin(Base) {
    return class extends Base {
        async currentMessage() { return await this.contract.methods.currentMessage().call(); }
        async currentMessageId() { return await this.contract.methods.currentMessageId().call(); }
        async currentLikes() { return await this.contract.methods.currentLikes().call(); }
        async currentSeason() { return await this.contract.methods.currentSeason().call(); }
        async currentSender() { return await this.contract.methods.currentSender().call(); }
        async totalMessages() { return await this.contract.methods.totalMessages().call(); }
        async totalLikes() { return await this.contract.methods.totalLikes().call(); }
        async totalKiddoEarned() { return await this.contract.methods.totalKiddoEarned().call(); }
        async totalShidoEarned() { return await this.contract.methods.totalShidoEarned().call(); }
        async totalKiddoDistributed() { return await this.contract.methods.totalKiddoDistributed().call(); }
        async totalShidoDistributed() { return await this.contract.methods.totalShidoDistributed().call(); }

        async cooldownDuration() { return await this.contract.methods.cooldownDuration().call(); }
        async cooldownEndTime() { return await this.contract.methods.cooldownEndTime().call(); }
        async creatorSharePercentage() { return await this.contract.methods.creatorSharePercentage().call(); }

        async likeKiddoFee() { return await this.contract.methods.likeKiddoFee().call(); }
        async likeShidoFee() { return await this.contract.methods.likeShidoFee().call(); }
        async kiddoFee() { return await this.contract.methods.kiddoFee().call(); }
        async shidoFee() { return await this.contract.methods.shidoFee().call(); }

        async owner() { return await this.contract.methods.owner().call(); }
        async kiddoToken() { return await this.contract.methods.kiddoToken().call(); }
        async blacklistContract() { return await this.contract.methods.blacklistContract().call(); }

        async globalLikesReceived(address) {
            return await this.contract.methods.globalLikesReceived(address).call();
        }

        async seasonalLikesReceived(seasonId, address) {
            return await this.contract.methods.seasonalLikesReceived(seasonId, address).call();
        }

        async messageCount(address) {
            return await this.contract.methods.messageCount(address).call();
        }

        async hasLiked(address) {
            return await this.contract.methods.hasLiked(address).call();
        }

        async kiddoLikeEarnings(address) {
            return await this.contract.methods.kiddoLikeEarnings(address).call();
        }

        async shidoLikeEarnings(address) {
            return await this.contract.methods.shidoLikeEarnings(address).call();
        }
    };
}
