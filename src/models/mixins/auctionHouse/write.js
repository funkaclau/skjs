// AuctionWriteMixin.js
export function AuctionWriteMixin(Base) {
    return class extends Base {
        
        async createAuction(nft, tokenId, startPrice, duration, binPrice=0, from = this.from) {
            return await this._send(
                this.contract.methods.createAuction, 
                [nft, tokenId, startPrice, duration, binPrice], from);
        }

        async cancelAuction(id, from = this.from) {
            return await this._send(this.contract.methods.cancelAuction, [id], from);
        }

        async finalizeAuction(id, from = this.from) {
            return await this._send(this.contract.methods.finalizeAuction, [id], from);
        }

        async finalizeAndClaim(id, from = this.from) {
            return await this._send(this.contract.methods.finalizeAndClaim, [id], from);
        }

        async placeBid(id, amount, from = this.from) {
            return await this._send(this.contract.methods.placeBid, [id, amount], from);
        }

        async claimNFT(id, from = this.from) {
            return await this._send(this.contract.methods.claimNFT, [id], from);
        }

        async claimNFTs( from = this.from) {
            return await this._send(this.contract.methods.claimNFTs, [], from);
        }

        async claimProceeds(from = this.from) {
            return await this._send(this.contract.methods.claimProceeds, [], from);
        }

        async claimRoyalties(from = this.from) {
            return await this._send(this.contract.methods.claimRoyalties, [], from);
        }

        async claimFees(from = this.from) {
            return await this._send(this.contract.methods.claimFees, [], from);
        }

        async claimRefund(from = this.from) {
            return await this._send(this.contract.methods.claimRefund, [], from);
        }

        async approveCollection(collection, from = this.from) {
            return await this._send(this.contract.methods.approveCollection, [collection], from);
        }

        async rejectCollection(collection, from = this.from) {
            return await this._send(this.contract.methods.rejectCollection, [collection], from);
        }

        async registerCollectionForRoyalties(collection, receiver, bps, from=this.from) {
            return await this._send(
                this.contract.methods.registerCollectionForRoyalties, 
                [collection, receiver, bps], 
                from
            );
        }
    };
}
