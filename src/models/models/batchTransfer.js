import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { BatchTransferReadMixin, BatchTransferWriteMixin } from '../mixins/batchTransfer';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawBatchTransfer extends BaseContract {
    // optionally define StakingOG-only logic here
}

const IBatchTransfer = applyMixins(
    RawBatchTransfer,
    [
        BatchTransferReadMixin,
        BatchTransferWriteMixin
    ]
);

export default IBatchTransfer;
