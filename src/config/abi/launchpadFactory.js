export const LAUNCHPAD_FACTORY = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_voucherManager",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_erc20",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_splitter",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "FailedCall",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "FailedDeployment",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "implementation",
				"type": "address"
			}
		],
		"name": "ImplementationAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"name": "ImplementationStatusChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nativeFee",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "erc20Fee",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "version",
				"type": "string"
			}
		],
		"name": "ImplementationUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "implementationId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "launchpad",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "label",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "finalFee",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "paidInNative",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "voucher",
				"type": "string"
			}
		],
		"name": "LaunchpadCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "impl",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nativeFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "erc20Fee",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "version",
				"type": "string"
			}
		],
		"name": "addImplementation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allLaunchpads",
		"outputs": [
			{
				"internalType": "address",
				"name": "launchpad",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "label",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "version",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "implId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "paidInNative",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "finalFee",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "implId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "initData",
				"type": "bytes"
			},
			{
				"internalType": "string",
				"name": "label",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "voucher",
				"type": "string"
			}
		],
		"name": "createWithERC20",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "implId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "initData",
				"type": "bytes"
			},
			{
				"internalType": "string",
				"name": "label",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "voucher",
				"type": "string"
			}
		],
		"name": "createWithNative",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "erc20Payment",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllLaunchpads",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "launchpad",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "label",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "version",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "implId",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "paidInNative",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "finalFee",
						"type": "uint256"
					}
				],
				"internalType": "struct LaunchpadFactory.LaunchpadMetadata[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "offset",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "limit",
				"type": "uint256"
			}
		],
		"name": "getAllLaunchpadsSlice",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "launchpad",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "label",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "version",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "implId",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "paidInNative",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "finalFee",
						"type": "uint256"
					}
				],
				"internalType": "struct LaunchpadFactory.LaunchpadMetadata[]",
				"name": "out",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getCounts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "allCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "userCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getUniqueUsers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserLaunchpads",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "launchpad",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "label",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "version",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "implId",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "paidInNative",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "finalFee",
						"type": "uint256"
					}
				],
				"internalType": "struct LaunchpadFactory.LaunchpadMetadata[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "offset",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "limit",
				"type": "uint256"
			}
		],
		"name": "getUserLaunchpadsSlice",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "launchpad",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "label",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "createdAt",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "version",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "implId",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "paidInNative",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "finalFee",
						"type": "uint256"
					}
				],
				"internalType": "struct LaunchpadFactory.LaunchpadMetadata[]",
				"name": "out",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "implementationCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "implementations",
		"outputs": [
			{
				"internalType": "address",
				"name": "implementation",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "nativeFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "erc20Fee",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "version",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isTracked",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "implId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"name": "setImplementationStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "splitter",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalLaunchpads",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "uniqueUsers",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "implId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newNativeFee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newErc20Fee",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "newVersion",
				"type": "string"
			}
		],
		"name": "updateImplementation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "usedLabels",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userLaunchpads",
		"outputs": [
			{
				"internalType": "address",
				"name": "launchpad",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "label",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "version",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "implId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "paidInNative",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "finalFee",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "voucherManager",
		"outputs": [
			{
				"internalType": "contract VoucherManager",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];