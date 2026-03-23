import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { LaunchpadV11ReadMixin, LaunchpadV11WriteMixin } from '../mixins/launchpadV1-1';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawLaunchpadV1 extends BaseContract {
    // optionally define VaultFactory-only logic here
}

const ILaunchpadV11 = applyMixins(
    RawLaunchpadV1,
    [
        LaunchpadV11ReadMixin, LaunchpadV11WriteMixin
    ]
);

export default ILaunchpadV11;
