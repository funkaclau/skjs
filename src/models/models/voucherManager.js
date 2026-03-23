import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { VoucherManagerReadMixin, VoucherManagerWriteMixin } from '../mixins/voucherManager';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawVoucherManager extends BaseContract {
    // optionally define VoucherManager-only logic here
}

const IVoucherManager = applyMixins(
    RawVoucherManager,
    [
        VoucherManagerReadMixin, VoucherManagerWriteMixin
    ]
);

export default IVoucherManager;
