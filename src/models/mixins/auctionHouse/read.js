// AuctionReadMixin.js
export function AuctionReadMixin(Base) {
    return class extends Base {
        async getAuction(auctionId) {
            return await this.contract.methods.getAuction(auctionId).call();
        }

        async getAuctionStatus(auctionId) {
            return await this.contract.methods.getAuctionStatus(auctionId).call();
        }

        async getActiveAuctionIdForNFT(collection, tokenId) {
            return await this.contract.methods.getActiveAuctionIdForNFT(collection, tokenId).call();
        }

        async getActiveAuctionIdsPaginated(start, count) {
            return await this.contract.methods.getActiveAuctionIdsPaginated(start, count).call();
        }

        async getAuctionsByIds(ids) {
            return await this.contract.methods.getAuctionsByIds(ids).call();
        }

        async getAllAuctionIdsForNFT(nft, tokenId) {
            return await this.contract.methods.getAllAuctionIdsForNFT(nft, tokenId).call();
        }

        async nftClaimed(auctionId) {
            return await this.contract.methods.nftClaimed(auctionId).call();
        }

        async getCurrentHighestBid(auctionId) {
            return await this.contract.methods.getCurrentHighestBid(auctionId).call();
        }

        async getHighestBidder(auctionId) {
            return await this.contract.methods.getHighestBidder(auctionId).call();
        }

        async getSellerAddress(auctionId) {
            return await this.contract.methods.getSellerAddress(auctionId).call();
        }

        async getClaimableBalances(user) {
            return await this.contract.methods.getClaimableBalances(user).call();
        }

        async getUserAuctionCount(user) {
            return await this.contract.methods.getUserAuctionCount(user).call();
        }

        async getUserAuctions(user, start = 0, limit = 50) {
            return await this.contract.methods.getUserAuctions(user, start, limit).call();
        }

        async getUserOutbidAuctions(user, start = 0, limit = 50) {
            return await this.contract.methods.getUserOutbidAuctions(user, start, limit).call();
        }

        async getUserStats(user) {
            return await this.contract.methods.getUserStats(user).call();
        }

        async getUserStatsByCollection(user, collection) {
            return await this.contract.methods.getUserStatsByCollection(user, collection).call();
        }

        async getUserBidAmount(auctionId, bidder) {
            return await this.contract.methods.getUserBidAmount(auctionId, bidder).call();
        }

        async getCollectionStats(collection) {
            return await this.contract.methods.getCollectionStats(collection).call();
        }
        async getCollectionStatsBatch(collections) {
            return await this.contract.methods.getCollectionStatsBatch(collections).call();
        }

        

        async getCollectionAuctions(collection, start = 0, count = 50) {
            return await this.contract.methods.getCollectionAuctions(collection, start, count).call();
        }

        async getCollectionAuctionCount(collection) {
            return await this.contract.methods.getCollectionAuctionCount(collection).call();
        }

        async getCollectionsAuctioned() {
            return await this.contract.methods.getCollectionsAuctioned().call();
        }

        async getCollectionRoyalties(collection) {
            return await this.contract.methods.getCollectionRoyalties(collection).call();
        }

        async getCollectionOwner(collection) {
            return await this.contract.methods.collectionOwner(collection).call();
        }

        async getGlobalStats() {
            return await this.contract.methods.getGlobalStats().call();
        }

        async globalServiceFee() {
            return await this.contract.methods.globalServiceFee().call();
        }

        async feeReceiver() {
            return await this.contract.methods.feeReceiver().call();
        }

        async owner() {
            return await this.contract.methods.owner().call();
        }
        
        async pendingRoyaltyRequests(collection) {
            return await this.contract.methods.pendingRoyaltyRequests(collection).call();
        }

        async userClaimableNFTs(address, index) {
            return await this.contract.methods.userClaimableNFTs(address, index).call();
        }
    };
}
