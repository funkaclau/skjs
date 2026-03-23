import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { GlobalStatsMixin, WriteMixin } from '../mixins/stakingOG';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawStakingOG extends BaseContract {
    // optionally define StakingOG-only logic here
}

const IStakingOG = applyMixins(
    RawStakingOG,
    [
        GlobalStatsMixin,
        WriteMixin
    ]
);

export default IStakingOG;
