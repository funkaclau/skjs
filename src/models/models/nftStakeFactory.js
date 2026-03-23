import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { NftStakingFactoryReadMixin, NftStakingFactoryWriteMixin } from '../mixins/NFTStakeFactory';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawNftStakingFactory extends BaseContract {
    // optionally define VaultFactory-only logic here
}

const INftStakingFactory = applyMixins(
    RawNftStakingFactory,
    [
        NftStakingFactoryReadMixin, NftStakingFactoryWriteMixin
    ]
);

export default INftStakingFactory;
