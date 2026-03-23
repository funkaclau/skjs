import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { AuctionReadMixin, AuctionWriteMixin } from '../mixins/auctionHouse';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawAuctionHouse extends BaseContract {
    // optionally define AuctionHouse-only logic here
}

const IAuctionHouse = applyMixins(
    RawAuctionHouse,
    [
        AuctionReadMixin,
        AuctionWriteMixin
    ]
);

export default IAuctionHouse;
