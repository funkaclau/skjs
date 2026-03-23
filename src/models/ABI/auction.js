export const AUCTION_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "collection",
				"type": "address"
			}
		],
		"name": "approveCollection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_kiddo",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AlreadyApproved",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "AlreadyRegistered",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "AuctionAlreadyEnded",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "AuctionAlreadyEndedDirect",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "AuctionHasBids",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "AuctionNotEnded",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "BidTooLow",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "BlacklistedCollection",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "BuyNowBelowStartPrice",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "CollectionNotApproved",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "CollectionNotWhitelisted",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "FeeTooHigh",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidAuctionStatus",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidDuration",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "provided",
				"type": "uint256"
			}
		],
		"name": "InvalidPaginationLimit",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidRoyaltyReceiver",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidStartPrice",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "MustBeERC721",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NoFees",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NoProceeds",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NoRefundAvailable",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NoRoyalties",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotAuctionSeller",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotClaimParticipant",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotCollectionOwner",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotFeeReceiver",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotRoyaltyReceiver",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotTokenOwner",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NothingToClaim",
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
		"inputs": [],
		"name": "SellerCannotBid",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "TransferFailed",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "ZeroAddress",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "AuctionCanceled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			}
		],
		"name": "AuctionCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "AuctionFinalized",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "claimer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "auctionIds",
				"type": "uint256[]"
			}
		],
		"name": "BatchNFTClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BidPlaced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "BuyItNowExecuted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "cancelAuction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract IERC20",
				"name": "token",
				"type": "address"
			}
		],
		"name": "claimAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "claimNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimNFTs",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimProceeds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimRefund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimRoyalties",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint96",
				"name": "feeBps",
				"type": "uint96"
			}
		],
		"name": "CollectionApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "collection",
				"type": "address"
			}
		],
		"name": "CollectionRejected",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyItNowPrice",
				"type": "uint256"
			}
		],
		"name": "createAuction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint96",
				"name": "feeBps",
				"type": "uint96"
			}
		],
		"name": "CustomCollectionFeeSet",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previous",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newReceiver",
				"type": "address"
			}
		],
		"name": "FeeReceiverUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FeesClaimed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "finalizeAndClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "finalizeAuction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "NFTClaimed",
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
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bidAmount",
				"type": "uint256"
			}
		],
		"name": "placeBid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ProceedsClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RefundClaimed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint96",
				"name": "bps",
				"type": "uint96"
			}
		],
		"name": "registerCollectionForRoyalties",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "collection",
				"type": "address"
			}
		],
		"name": "rejectCollection",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "rescueERC20",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "rescueERC721",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RoyaltiesClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousReceiver",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newReceiver",
				"type": "address"
			}
		],
		"name": "RoyaltyReceiverUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint96",
				"name": "feeBps",
				"type": "uint96"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "RoyaltyRegistrationRequested",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"internalType": "uint96",
				"name": "feeBps",
				"type": "uint96"
			}
		],
		"name": "setCustomCollectionFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newReceiver",
				"type": "address"
			}
		],
		"name": "setFeeReceiver",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "newReceiver",
				"type": "address"
			}
		],
		"name": "updateRoyaltyReceiver",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "canFinalizeAndClaim",
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
			}
		],
		"name": "claimables",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "proceeds",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "royalties",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "fees",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "refund",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "collectionOwner",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "collectionRoyalties",
		"outputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint96",
				"name": "royaltyFee",
				"type": "uint96"
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
		"name": "collectionStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalVolume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBids",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBidVolume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "auctionsFinished",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ongoingAuctions",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nftsAuctioned",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyItNowCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyItNowVolume",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "customCollectionFee",
		"outputs": [
			{
				"internalType": "uint96",
				"name": "",
				"type": "uint96"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeReceiver",
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
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getActiveAuctionIdForNFT",
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
				"name": "collection",
				"type": "address"
			}
		],
		"name": "getActiveAuctionIdsForCollection",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "getActiveAuctionIdsForCollectionRange",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "startId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "limit",
				"type": "uint256"
			}
		],
		"name": "getActiveAuctionIdsPaginated",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "nft",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getAllAuctionIdsForNFT",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "getAuction",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "auctionId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "startPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "buyItNowPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "highestBid",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "highestBidder",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "finalizedAt",
						"type": "uint256"
					},
					{
						"internalType": "enum AuctionHistory.AuctionStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct AuctionHistory.Auction",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "collection",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "getAuctionHistoryForNFTPaginated",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			}
		],
		"name": "getAuctionsByIds",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "auctionId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "nftAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "startPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "buyItNowPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "highestBid",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "highestBidder",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "finalizedAt",
						"type": "uint256"
					},
					{
						"internalType": "enum AuctionHistory.AuctionStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct AuctionHistory.Auction[]",
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
				"name": "startId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "limit",
				"type": "uint256"
			}
		],
		"name": "getCanceledAuctionIdsPaginated",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
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
		"name": "getClaimableBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
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
				"name": "collection",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getCollectionAuctionByIndex",
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
				"name": "collection",
				"type": "address"
			}
		],
		"name": "getCollectionAuctionCount",
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
				"name": "collection",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "getCollectionAuctions",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getCollectionByIndex",
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
				"internalType": "address",
				"name": "collection",
				"type": "address"
			}
		],
		"name": "getCollectionOwner",
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
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "getCollectionsPaginated",
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
				"name": "collection",
				"type": "address"
			}
		],
		"name": "getCollectionStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "volume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bids",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bidVolume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "finished",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ongoing",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nfts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyItNowCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyItNowVolume",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "collections",
				"type": "address[]"
			}
		],
		"name": "getCollectionStatsBatch",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "totalVolume",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalBids",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalBidVolume",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "auctionsFinished",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "ongoingAuctions",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "nftsAuctioned",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "buyItNowCount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "buyItNowVolume",
						"type": "uint256"
					}
				],
				"internalType": "struct AuctionStats.CollectionStats[]",
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
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "getCurrentHighestBid",
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
				"name": "startId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "limit",
				"type": "uint256"
			}
		],
		"name": "getFinalizedAuctionIdsPaginated",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getGlobalStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "volume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bids",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bidVolume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "finished",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ongoing",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nfts",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyItNowCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyItNowVolume",
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
				"name": "collection",
				"type": "address"
			}
		],
		"name": "getRoyaltyInfo",
		"outputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint96",
				"name": "bps",
				"type": "uint96"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalCollections",
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
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserAuctionCount",
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
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "limit",
				"type": "uint256"
			}
		],
		"name": "getUserAuctions",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			}
		],
		"name": "getUserBidAmount",
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
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserFinancialStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "salesVolume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "earnings",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "spent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "refundAmount",
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
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "getUserOutbidAuctions",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
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
		"name": "getUserStats",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "totalBidsPlaced",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalAmountBid",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "auctionsWon",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "auctionsCreated",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalSalesVolume",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "effectiveEarnings",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalSpentOnPurchases",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalRefundsReceived",
						"type": "uint256"
					}
				],
				"internalType": "struct UserStatsTracker.UserStats",
				"name": "",
				"type": "tuple"
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
				"internalType": "address",
				"name": "collection",
				"type": "address"
			}
		],
		"name": "getUserStatsByCollection",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "totalBidsPlaced",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalAmountBid",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "auctionsWon",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "auctionsCreated",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalSalesVolume",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "effectiveEarnings",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalSpentOnPurchases",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalRefundsReceived",
						"type": "uint256"
					}
				],
				"internalType": "struct UserStatsTracker.UserStats",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "globalServiceFee",
		"outputs": [
			{
				"internalType": "uint96",
				"name": "",
				"type": "uint96"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "globalStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalVolume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBids",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBidVolume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "auctionsFinished",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ongoingAuctions",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nftsAuctioned",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyItNowCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "buyItNowVolume",
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
		"name": "isActiveAuction",
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
				"internalType": "uint256",
				"name": "auctionId",
				"type": "uint256"
			}
		],
		"name": "isAuctionEnded",
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
			}
		],
		"name": "isBlacklisted",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "isCanceledAuction",
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
				"name": "collection",
				"type": "address"
			}
		],
		"name": "isERC721",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "isFinalizedAuction",
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
			}
		],
		"name": "isWhitelistedCollection",
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
		"name": "kiddo",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "nftClaimed",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "onERC721Received",
		"outputs": [
			{
				"internalType": "bytes4",
				"name": "",
				"type": "bytes4"
			}
		],
		"stateMutability": "pure",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "pendingRoyaltyRequests",
		"outputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint96",
				"name": "royaltyFee",
				"type": "uint96"
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
		"name": "userClaimableNFTs",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "userStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalBidsPlaced",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalAmountBid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "auctionsWon",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "auctionsCreated",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalSalesVolume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "effectiveEarnings",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalSpentOnPurchases",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalRefundsReceived",
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
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userStatsByCollection",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalBidsPlaced",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalAmountBid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "auctionsWon",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "auctionsCreated",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalSalesVolume",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "effectiveEarnings",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalSpentOnPurchases",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalRefundsReceived",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
