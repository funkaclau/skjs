import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { StashReadMixin, StashWriteMixin } from '../mixins/stash';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawStash extends BaseContract {
    // optionally define Stash-only logic here
}

const IStash = applyMixins(
    RawStash,
    [
        StashReadMixin, StashWriteMixin
    ]
);

export default IStash;
