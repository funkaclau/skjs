import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { PresaleReadMixin, PresaleWriteMixin } from '../mixins/presale';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawPresale extends BaseContract {
    // optionally define Presale-only logic here
}

const IPresale = applyMixins(
    RawPresale,
    [
        PresaleReadMixin, PresaleWriteMixin
    ]
);

export default IPresale;
