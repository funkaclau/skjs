import { GlobalStatsMixin } from './mixin/tagbattle/globals.js';
import { UserStatsMixin } from './mixin/tagbattle/user.js';
import { TagBattleWriteMixin } from './mixin/tagbattle/write.js';

class RawAuctionHouse {
    constructor(web3, abi, address) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(abi, address);
        this.address = address;
        this.abi = abi;
        this.from = from;
    }

    setSender(from) {
        this.from = from;
    }
    
    getSender() {
        return this.from;
    }

    _requireSender(providedSender) {
        return providedSender || this.from || (() => { throw new Error("No sender address set."); })();
    }

    _send(method, args = [], from) {
        const sender = this._requireSender(from);
        return method(...args).send({ from: sender, type: "0x0" });
    }
      
}

const IAuctionHouse = RawAuctionHouse;

export default IAuctionHouse;
