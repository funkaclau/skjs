// src/funcs/ownableActions.js
export async function transferOwnership({ contract, account, web3, onSuccess }) {
    if (!contract || !account) return;

    const newOwner = prompt("Enter the new owner's address:");
    if (!newOwner || !web3.utils.isAddress(newOwner)) {
        alert("Invalid address.");
        return;
    }

    try {
        contract.setSender(account);
        await contract.transferOwnership(newOwner);
        alert(`Ownership transferred to ${newOwner}`);
        if (onSuccess) onSuccess(); // trigger any refetch or UI update
    } catch (err) {
        console.error("Transfer ownership failed:", err);
        alert("Transfer failed. See console.");
    }
}

export async function renounceOwnership({ contract, account, onSuccess }) {
    if (!contract || !account) return;

    try {
        contract.setSender(account);
        await contract.renounceOwnership();
        alert("Ownership renounced!");
        if (onSuccess) onSuccess();
    } catch (err) {
        console.error("Renounce failed:", err);
        alert("Renounce failed. See console.");
    }
}