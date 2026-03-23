import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { LaunchpadFactoryReadMixin, LaunchpadFactoryWriteMixin } from '../mixins/launchpadFactory';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawLaunchpadFactory extends BaseContract {
    // optionally define VaultFactory-only logic here
}

const ILaunchpadFactory = applyMixins(
    RawLaunchpadFactory,
    [
        LaunchpadFactoryReadMixin, LaunchpadFactoryWriteMixin
    ]
);

export default ILaunchpadFactory;
