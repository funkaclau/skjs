import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { TokenFactoryReadMixin, TokenFactoryWriteMixin } from '../mixins/tokenFactory';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawTokenFactory extends BaseContract {
    // optionally define TokenFactory-only logic here
}

const ITokenFactory = applyMixins(
    RawTokenFactory,
    [
        TokenFactoryReadMixin, TokenFactoryWriteMixin
    ]
);

export default ITokenFactory;
