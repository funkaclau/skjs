export default class BaseContract {
    constructor(web3, abi, address, from = null) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(abi, address);
        this.address = address;
        this.abi = abi;
        this.from = from;
    }

    _requireSender(provided) {
        return provided || this.from || (() => { throw new Error("No sender address set."); })();
    }

    _send(method, args = [], from, type="0x0", value=0) {
        const sender = this._requireSender(from);
        console.log("Trying to send")
        return method(...args).send({ from: sender, type: type, value: value });
    }

    setSender(from) {
        this.from = from;
    }

    getSender() {
        return this.from;
    }
}
