import BaseContract from './base.js';
import { applyMixins } from '../utils/mixinTools.js';
import { VaultFactoryReadMixin, VaultFactoryWriteMixin } from '../mixins/vaultFactory';
//import { OwnableMixin } from './mixins/OwnableMixin.js';

class RawVaultFactory extends BaseContract {
    // optionally define VaultFactory-only logic here
}

const IVaultFactory = applyMixins(
    RawVaultFactory,
    [
        VaultFactoryReadMixin, VaultFactoryWriteMixin
    ]
);

export default IVaultFactory;
