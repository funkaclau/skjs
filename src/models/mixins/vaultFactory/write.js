export function VaultFactoryWriteMixin(Base) {
    return class extends Base {
        async addImplementation(implementation, version, initSignature, from = this.from) {
            return await this._send(this.contract.methods.addImplementation, [implementation, version, initSignature], from);
        }

        async createVault(implementationId, initData, vaultName, from = this.from) {
            return await this._send(this.contract.methods.createVault, [implementationId, initData, vaultName], from);
        }

        async deactivateImplementation(id, from = this.from) {
            return await this._send(this.contract.methods.deactivateImplementation, [id], from);
        }

        async reactivateImplementation(id, from = this.from) {
            return await this._send(this.contract.methods.reactivateImplementation, [id], from);
        }

        async updateImplementation(id, implementation, initSignature, from = this.from) {
            return await this._send(this.contract.methods.updateImplementation, [id, implementation, initSignature], from);
        }

        async setOnlyEOAMode(status, from = this.from) {
            return await this._send(this.contract.methods.setOnlyEOAMode, [status], from);
        }

        async transferOwnership(newOwner, from = this.from) {
            return await this._send(this.contract.methods.transferOwnership, [newOwner], from);
        }

        async renounceOwnership(from = this.from) {
            return await this._send(this.contract.methods.renounceOwnership, [], from);
        }
    };
}
