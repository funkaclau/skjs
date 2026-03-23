import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { LaunchpadV1ReadMixin, LaunchpadV1WriteMixin } from '../mixins/launchpadV1';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawLaunchpadV1 extends BaseContract {
    // optionally define VaultFactory-only logic here
}

const ILaunchpadV1 = applyMixins(
    RawLaunchpadV1,
    [
        LaunchpadV1ReadMixin, LaunchpadV1WriteMixin
    ]
);

export default ILaunchpadV1;
