import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { VaultV1ReadMixin, VaultV1WriteMixin } from '../mixins/vaultV1';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawVaultFactory extends BaseContract {
    // optionally define VaultFactory-only logic here
}

const IVaultV1 = applyMixins(
    RawVaultFactory,
    [
        VaultV1ReadMixin, VaultV1WriteMixin
    ]
);

export default IVaultV1;
