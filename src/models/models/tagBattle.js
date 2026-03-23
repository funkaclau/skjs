import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { TagContractReadMixin, TagContractWriteMixin } from '../mixins/tagBattle';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawTagBattle extends BaseContract {
    // optionally define TagBattle-only logic here
}

const ITagBattle = applyMixins(
    RawTagBattle,
    [
        TagContractReadMixin, TagContractWriteMixin
    ]
);

export default ITagBattle;
