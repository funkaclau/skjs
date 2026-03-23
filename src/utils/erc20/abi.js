// src/utils/erc20/abi.js
export const STAKING_POOL_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getStakeInfo",
    "outputs": [
      { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "nextUnlockTime", "type": "uint256" },
      { "internalType": "uint256", "name": "availableRewards", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
