import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { ERC20ReadMixin, ERC20WriteMixin } from '../mixins/token';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawERC20 extends BaseContract {
    // optionally define ERC20-only logic here
}

const IERC20 = applyMixins(
    RawERC20,
    [
        ERC20ReadMixin, ERC20WriteMixin
    ]
);

export default IERC20;
