

import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { NftStakingImplReadMixin, NftStakingImplWriteMixin } from '../mixins/NFTStake';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawNftStaking extends BaseContract {
    // optionally define VaultFactory-only logic here
}

const INftStaking = applyMixins(
    RawNftStaking,
    [
        NftStakingImplReadMixin, NftStakingImplWriteMixin
    ]
);

export default INftStaking;
