import {
    BATCH_ABI,
    TAG,
    VoucherManager,
    TokenFactoryABI,
    VAULT_FACTORY_ABI,
    stashABI,
    PresaleABI,
    TOKEN_ABI,
    AUCTION_ABI,
    STAKING_ABI,
    NFT_STAKING_ABI, 
    VAULT_V1_ABI,
        LAUNCHPAD_FACTORY,
    NFT_STAKE_FACTORY_ABI
} from "./abi";



export const CONTRACTS = {
    Stash: "0x5B73743d6e99E911e6C412C0BcA9a702475F0595",
    BatchShi20: "0x1AD0D74967d8c91d88D88aA229a5DAf3e46538B6",
    BatchShido: "0xA7E6a9fA8847Fbad72477e63704008AFF8E3e385",
    PreSale: "0xdD75c1a25C3bc4874C00f33C8639316dc819F34c",
    KIDDO: "0x2835Ad9a421C14E1C571a5Bb492B86b7E8f5873A",
    KIDDOTEST: "0x5FbDB2315678afecb367f032d93F642f64180aa3", //"0x786aC56E85AA21E705077BB87482525595972920",
    Analytics: "0xC9898Ae6FDbDDC63330d16D3AD8880A2FD6C2B93",
    StakingOG: "0xbf2019c320AD99F7A84664c72599D772C225eF62",
    TokenFactory: "0xF60eBeF686B75Aa397BD46c2bad1D98a49D74990",
    VoucherManager: "0x3418EE09d1C34092E5901616BAbDD8B51c215065",
    TagBattle: "0x5cA771A8cB1a51251174A9dfC2f06182d84914F6",
    //AH: "0x872f4C987e136fea7BC7E07A94180C94E7b8d952",
    AH: "0x9a7D76dbdE5c60862c34e9A3D067ced2B651E18b",
    VaultFactory: "0x8477E66463B61945798898e0f93674a841c05FA1",
    VaultV1: "",
    PTF: "0xB0B228476Fa26140e6C8D04d437Cd38f47003fCC",
    NFTStaking: "0xE8aB4aa3ADF86c53C42109ba8f9e06923CF0022f",
    NFTStakeFactory: "0xcAC35320F45f316482B9A42dF1fd054f4476eB4e",
};

export const WHITELISTED_TOKENS = {
    "0x2835Ad9a421C14E1C571a5Bb492B86b7E8f5873A": "KIDDO",
    "0xeE1Fc22381e6B6bb5ee3bf6B5ec58DF6F5480dF8": "USDC",
    "0x8cbafFD9b658997E7bf87E98FEbF6EA6917166F7": "WSHIDO",
    "0xfB889425B72c97C5b4484cF148AE2404AB7A13e7": "KENSEI",
    "0x37385e458bb1b19c614C238E5109E59ac605DF7a": "CHICK",
    "0xF7B264B723059a05fBf13E32783F88db33A24365": "SDS",
    "0x796F48d17d38E5f0A7aFe7966448828bdc13e8B1": "0xded",
    "0x27027Eb11c456d690DEA785905C1915D6b444bCe": "SALT",
    "0x1f5b6F4126575835c23D1b6c38535FA215df03c5": "MSMOON",
};

export const ABIS = {
    Stash: stashABI,
    BatchShi20: BATCH_ABI,
    TagBattle: TAG,
    PreSale: PresaleABI,
    KIDDO: TOKEN_ABI,
    KIDDOTEST: TOKEN_ABI,
    Analytics: "0xC9898Ae6FDbDDC63330d16D3AD8880A2FD6C2B93",
    StakingOG: STAKING_ABI,
    TokenFactory: TokenFactoryABI,
    VoucherManager: VoucherManager,
    AH: AUCTION_ABI,
    VaultFactory: VAULT_FACTORY_ABI,
    NFTStaking: NFT_STAKING_ABI,
    VaultV1: VAULT_V1_ABI,
        LaunchpadFactory: LAUNCHPAD_FACTORY,
    NFTStakeFactory: NFT_STAKE_FACTORY_ABI
};

export const SC_METADATA = {
    Stash: { ca: CONTRACTS.Stash, abi: ABIS.Stash },
    BatchShi20: { ca: CONTRACTS.BatchShi20, abi: ABIS.BatchShi20 },
    VoucherManager: { ca: CONTRACTS.VoucherManager, abi: ABIS.VoucherManager },
    TokenFactory: { ca: CONTRACTS.TokenFactory, abi: ABIS.TokenFactory },
    VaultFactory: { ca: CONTRACTS.VaultFactory, abi: ABIS.VaultFactory },
    TagBattle: { ca: CONTRACTS.TagBattle, abi: ABIS.TagBattle },
    PreSale: { ca: CONTRACTS.PreSale, abi: ABIS.PreSale },
    KIDDO: { ca: CONTRACTS.KIDDO, abi: ABIS.KIDDO },
    KIDDOTEST: { ca: CONTRACTS.KIDDOTEST, abi: ABIS.KIDDOTEST },
    AH: { ca: CONTRACTS.AH, abi: ABIS.AH },
    StakingOG: { ca: CONTRACTS.StakingOG, abi: ABIS.StakingOG },
    NFTStaking: {ca: CONTRACTS.NFTStaking, abi: ABIS.NFTStaking},
    VaultV1: {ca: CONTRACTS.VaultV1, abi: ABIS.VaultV1},
        LaunchpadFactory: {ca: CONTRACTS.LaunchpadFactory, abi: ABIS.LaunchpadFactory},
    NFTStakeFactory: {ca: CONTRACTS.NFTStakeFactory, abi: ABIS.NFTStakeFactory}
};
export const KIDDO_ADDRESSES = {
    "0x232F": CONTRACTS.KIDDOTEST, // Testnet
    "0x2330": CONTRACTS.KIDDO, // Mainnet
    "0x7a69": CONTRACTS.KIDDOTEST
};

export const WHITELISTED_COLLECTIONS = {
    //"0x706c3a3ed9670Ce0c53Be41Ba74759EFb0EC445e": "FUNK",
    "0xB0B228476Fa26140e6C8D04d437Cd38f47003fCC": "PixelTycoons Founders",
    //"0x1dDe51d24e8c46B8eCC19526d35CDC93b4BAA956": "Genesis NFT",
    "0x5782fDaA53bAB4625B2ABf51aE73eb6228Bf6Ec8": "Shidoshi Ninja's",
    "0xDcA08690dEFA9Bbbb0FA21103a5F9E10B545e613": "Trash Mafia",
    "0xba10879b62d829ddd541bb9aee9654cfa11c8429": "Shinobi Warriors",
    "0xb65ef0BDb1822f875f10AfE9BEC3bE674d38B11A": "test"
};

export const GATEWAYS = {
    "0xB0B228476Fa26140e6C8D04d437Cd38f47003fCC": "https://maroon-normal-parrotfish-989.mypinata.cloud/ipfs/",
    //"0x1dDe51d24e8c46B8eCC19526d35CDC93b4BAA956": "https://cyan-warm-llama-412.mypinata.cloud/ipfs/"
}

// export const STAKING_POOLS = {
//       "0x796F48d17d38E5f0A7aFe7966448828bdc13e8B1": "0x7dA3929506D2584B7ECFA29163F75Ee1789b460E", // 0xDED
//   "0x2835Ad9a421C14E1C571a5Bb492B86b7E8f5873A": "0x1535A275c26Fa8157094683a049A3F8bF40609B3", // KIDDO
//   "0x4b0cBcad61c5584EdE3ca9fd45eF1feBB2215311": "0x081A03Ddd7A1a82786483EA91C73502EFA0b6760", // NERD
//   "0x37385e458bb1b19c614C238E5109E59ac605DF7a": "0xB85e0a135c133804f70b40eE7A6C3a25F754919D", // CHICK
//   "0xF7B264B723059a05fBf13E32783F88db33A24365": "0xE8268B6685Ea58a100BA920a31DbC9488A0cf254", // SDS
//   "0xfB889425B72c97C5b4484cF148AE2404AB7A13e7": "0x5678F993b23d25F9d184E6B58D29Eb9E9D7A96A6", // Kensei
//   "0xa907bE8aEFF41D593dC33A29C0CBAbEbD8beC03B": "0x24DCf77fb076758a6A7D4A30204E1D74D711f31e", // ILCFNBR
//   "0xfaD12E07590f06d4135c9A4FE018e44D50b83292": "0xFA56A35783698cB52E47948cBF8Ab8c3629cAee1", // Bushido
//   "0xe5420222bd4464B214551A0D81389C9a6C8aa42a": "0x970335D7eBb5495aDf34654f1977de38a4e89D47", // Hodljeet
//   "0x302c63d7A90770B3Fb374893E9325988Fa68B12A": "0x9C9fB83dCc559190b599208746A90cd30534059D", // DWS
//   "0x56009A137Ed6D56E0133A52363a78063F429Ece4": "0x4499110A6174735FB2103eD47BBFD4f280924972", // Rakun
//   "0x598cC037889bdE8bC77672AF9a1bA0fe6CCa255C": "0xCD15de3b8F6134D175c40ADe7aD20493De25d4cB", // Boobies
//   "0x1f5b6F4126575835c23D1b6c38535FA215df03c5": "0x3274fc6746FaD673645f8a1141135280809f3c47", // MsMoon 
//   "0x72fDEc5fc6B92EFC2451529f52C66f34150f54a7": "",
//   "0x27027Eb11c456d690DEA785905C1915D6b444bCe": "0x59EA5a7085dC36336761Fa7Deefe872B1b56febb", // Salt
//   "0x1B22b06eF38140064004cA050b3A67348B94A220": "",
//   "0xC1837b743Bc80e2fe20D96BdC5E336ca641A4eDe": "0x4d7f26419053348d64Deb3B4D8A8DcE0d1eD916B", // Deshi
//   "0x37081847db8eA6bD103E686CBe7ab150D829FF76": "0x3C6571BF9d9Eab921a8BF4E28DC175FA8D917E1d", // Chillcat
//   "0x5ac082F693160eB2136d81AA9E772101109c11c4": "",
//   "0x2987D36a348F5D9b94B1A21B956D7E936Bd5Ba13": "",
//   "0xc95e6e74f40cA62218DC09b9D21ad6dEa9255616": "",
//   "0x65f1Ed90e4e41417B38b1f8098c4FE257353C96F": "",
//   "0x1601a36D71B7cE53d947330ecd2171fE469d7C79": "",
//   "0xb5B466ADcCc67BE5347C9C943A4AB504635a71eF": "",
//   "0x5287B6B6232305aed784CD0454bB20926f691b5A": "",
//   "0xF84B713c7a6e3DA38a96049A4E94dA751e536a83": "",
//   "0x9ccE1FD369E92004f2985035Ba5F319013D1Eff7": "",
//   "0xe550Bde2F0898552B38a41635d7a8DDB1Fd81276": "0xC4802A4F8B590c0D15D48c76c1E2A7289876E4B2", // SHDX
//   "0xc3a8815291af5a506308D5efBeF337a914CDb452": "0x573a0eECa92Ba68b484f3f4762D776F1BEd2A8ba", // QBN
// }
export const STAKING_POOLS = {
  "0x796F48d17d38E5f0A7aFe7966448828bdc13e8B1": { default: "0x7dA3929506D2584B7ECFA29163F75Ee1789b460E" }, // DED
  "0x2835Ad9a421C14E1C571a5Bb492B86b7E8f5873A": { default: "0x1535A275c26Fa8157094683a049A3F8bF40609B3" }, // KIDDO
  "0x4b0cBcad61c5584EdE3ca9fd45eF1feBB2215311": { default: "0x081A03Ddd7A1a82786483EA91C73502EFA0b6760" }, // NERD
  "0x37385e458bb1b19c614C238E5109E59ac605DF7a": { default: "0xB85e0a135c133804f70b40eE7A6C3a25F754919D" }, // CHICK
  "0xF7B264B723059a05fBf13E32783F88db33A24365": { default: "0xE8268B6685Ea58a100BA920a31DbC9488A0cf254" }, // SDS
  "0xfB889425B72c97C5b4484cF148AE2404AB7A13e7": { default: "0x5678F993b23d25F9d184E6B58D29Eb9E9D7A96A6" }, // Kensei
  "0xa907bE8aEFF41D593dC33A29C0CBAbEbD8beC03B": { default: "0x24DCf77fb076758a6A7D4A30204E1D74D711f31e" }, // ILCFNBR
  "0xfaD12E07590f06d4135c9A4FE018e44D50b83292": { default: "0xFA56A35783698cB52E47948cBF8Ab8c3629cAee1" }, // Bushido
  "0xe5420222bd4464B214551A0D81389C9a6C8aa42a": { default: "0x970335D7eBb5495aDf34654f1977de38a4e89D47" }, // Hodljeet
  "0x302c63d7A90770B3Fb374893E9325988Fa68B12A": { default: "0x9C9fB83dCc559190b599208746A90cd30534059D" }, // DWS
  "0x56009A137Ed6D56E0133A52363a78063F429Ece4": { default: "0x4499110A6174735FB2103eD47BBFD4f280924972", bubble: "0x2309ec495DB9672eEe39544e4006Ba1f1a865602" }, // Rakun
  "0x598cC037889bdE8bC77672AF9a1bA0fe6CCa255C": { default: "0xCD15de3b8F6134D175c40ADe7aD20493De25d4cB" }, // Boobies
  "0x1f5b6F4126575835c23D1b6c38535FA215df03c5": { default: "0x3274fc6746FaD673645f8a1141135280809f3c47" }, // MsMoon
  "0x72fDEc5fc6B92EFC2451529f52C66f34150f54a7": {},
  "0x27027Eb11c456d690DEA785905C1915D6b444bCe": { default: "0x59EA5a7085dC36336761Fa7Deefe872B1b56febb" }, // Salt
  "0x1B22b06eF38140064004cA050b3A67348B94A220": {},
  "0xC1837b743Bc80e2fe20D96BdC5E336ca641A4eDe": { default: "0x4d7f26419053348d64Deb3B4D8A8DcE0d1eD916B" }, // Deshi
  "0x37081847db8eA6bD103E686CBe7ab150D829FF76": { default: "0x3C6571BF9d9Eab921a8BF4E28DC175FA8D917E1d" }, // Chillcat
  "0x5ac082F693160eB2136d81AA9E772101109c11c4": {},
  "0x2987D36a348F5D9b94B1A21B956D7E936Bd5Ba13": {},
  "0xc95e6e74f40cA62218DC09b9D21ad6dEa9255616": {},
  "0x65f1Ed90e4e41417B38b1f8098c4FE257353C96F": {},
  "0x1601a36D71B7cE53d947330ecd2171fE469d7C79": {},
  "0xb5B466ADcCc67BE5347C9C943A4AB504635a71eF": {},
  "0x5287B6B6232305aed784CD0454bB20926f691b5A": {},
  "0xF84B713c7a6e3DA38a96049A4E94dA751e536a83": {},
  "0x9ccE1FD369E92004f2985035Ba5F319013D1Eff7": {},
  "0x8442768f6B50Ff7cA855EC3405B2a9A535088aEA": {default: "0x3412BB63757cbc459E8AF96845837fB9CAe9FdB7", bubble: "0x0F5f707e9389d0312269E1E6048D9D134f6dc981"},
  "0xe550Bde2F0898552B38a41635d7a8DDB1Fd81276": { default: "0xC4802A4F8B590c0D15D48c76c1E2A7289876E4B2" }, // SHDX
  "0xc3a8815291af5a506308D5efBeF337a914CDb452": { default: "0x573a0eECa92Ba68b484f3f4762D776F1BEd2A8ba" }, // QBN
};
// 1. Move your images from /src/assets/ to /public/assets/
// 2. Update the map to use lowercase keys and root-relative paths:

export const TOKEN_IMAGE_MAP = {
  "0x796f48d17d38e5f0a7afe7966448828bdc13e8b1": "/assets/0xdead.png",
  "0x2835ad9a421c14e1c571a5bb492b86b7e8f5873a": "/assets/kiddo.png",
  "0x4b0cbcad61c5584ede3ca9fd45ef1febb2215311": "/assets/nerd.png",
  "0x37385e458bb1b19c614c238e5109e59ac605df7a": "/assets/chick.png",
  "0xf7b264b723059a05fbf13e32783f88db33a24365": "/assets/shidoshi.png",
  "0xfb889425b72c97c5b4484cf148ae2404ab7a13e7": "/assets/kensei.png",
  "0xa907be8aeff41d593dc33a29c0cbabebd8bec03b": "/assets/ilcfnbr.png",
  "0xfad12e07590f06d4135c9a4fe018e44d50b83292": "/assets/bushido.png",
  "0xe5420222bd4464b214551a0d81389c9a6c8aa42a": "/assets/hodljeet.png",
  "0x302c63d7a90770b3fb374893e9325988fa68b12a": "/assets/dws.png",
  "0x56009a137ed6d56e0133a52363a78063f429ece4": "/assets/rakun.png",
  "0x598cc037889bde8bc77672af9a1ba0fe6cca255c": "/assets/boobies.png",
  "0x1f5b6f4126575835c23d1b6c38535fa215df03c5": "/assets/msmoon.png",
  "0x72fdec5fc6b92efc2451529f52c66f34150f54a7": "/assets/kitsune.png",
  "0x27027eb11c456d690dea785905c1915d6b444bce": "/assets/salt.png",
  "0x1b22b06ef38140064004ca050b3a67348b94a220": "/assets/ippon.png",
  "0xc1837b743bc80e2fe20d96bdc5e336ca641a4ede": "/assets/deshi.png",
  "0x37081847db8ea6bd103e686cbe7ab150d829ff76": "/assets/chillcat.png",
  "0x5ac082f693160eb2136d81aa9e772101109c11c4": "/assets/ninja.png",
  "0x2987d36a348f5d9b94b1a21b956d7e936bd5ba13": "/assets/manga.png",
  "0xc95e6e74f40ca62218dc09b9d21ad6dea9255616": "/assets/saster.png",
  "0x65f1ed90e4e41417b38b1f8098c4fe257353c96f": "/assets/mycroft.png",
  "0x1601a36d71b7ce53d947330ecd2171fe469d7c79": "/assets/bb.png",
  "0xb5b466adccc67be5347c9c943a4ab504635a71ef": "/assets/boojo.png",
  "0x5287b6b6232305aed784cd0454bb20926f691b5a": "/assets/premcoffee.png",
  "0xf84b713c7a6e3da38a96049a4e94da751e536a83": "/assets/nanogen.png",
  "0x9cce1fd369e92004f2985035ba5f319013d1eff7": "/assets/gnus.png",
  "0xe550bde2f0898552b38a41635d7a8ddb1fd81276": "/assets/shdx.png",
  "0x8cbaffd9b658997e7bf87e98febf6ea6917166f7": "/assets/wshido.png",
  "0xc3a8815291af5a506308d5efbef337a914cdb452": "/assets/qbn.png",
  "0x8442768f6B50Ff7cA855EC3405B2a9A535088aEA": "/assets/enerqi.png",
  "0xdB798cF512Af4F7E41AE4Bf4b7f20CDF74Bc21f9": "/assets/chinawok.jpg",
  "0xee1fc22381e6b6bb5ee3bf6b5ec58df6f5480df8": "/assets/usdc.png", // USDC
  "0x01396a82fa815a22b3b7b9c68c2b4a322c076c2b": "/assets/shidocoffee.png",
};

// Vault = 0x891B0B479C3184789B210cce9ec8011A9fE7B278
// Factorty = 0xde1728b9ed51AB0eC8F0C43F5DFC3D8D1F2E02a3



export const ABI = [
    {
        "inputs": [
            { "internalType": "contract IERC20", "name": "_token", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amountSpent", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "tokensReceived", "type": "uint256" }
        ],
        "name": "TokensPurchased",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "uint256", "name": "rate", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "cap", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "startTime", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "SeedRoundStageStarted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "cap",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "cooldownPeriod",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deadline",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "finalizeSeedRound",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    {
        "inputs": [],
        "name": "getAllBuyers",
        "outputs": [
            { "internalType": "address[]", "name": "", "type": "address[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBuyersAndAmounts",
        "outputs": [
            { "internalType": "address[]", "name": "", "type": "address[]" },
            { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_buyer", "type": "address" }],
        "name": "lastPurchaseTime",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_buyer", "type": "address" }],
        "name": "getTokensPurchasedByAddress",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxPerAccount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "cooldown",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "maxPerPurchase",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rate",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "startTime",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            { "internalType": "contract IERC20", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokensSold",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_rate", "type": "uint256" },
            { "internalType": "uint256", "name": "_cap", "type": "uint256" },
            { "internalType": "uint256", "name": "_startTime", "type": "uint256" },
            { "internalType": "uint256", "name": "_duration", "type": "uint256" }
        ],
        "name": "startSeedRoundStage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]








export const NFT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOperator",
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
        "name": "ERC721InvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721NonexistentToken",
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
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_fromTokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_toTokenId",
                "type": "uint256"
            }
        ],
        "name": "BatchMetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "MetadataUpdate",
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
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
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
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
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
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
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
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "tokenURI_",
                "type": "string"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
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
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
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
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenIdCounter",
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
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
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
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
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
    }
];

export const NFT_ENUMERABLE = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "ERC721IncorrectOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721InsufficientApproval",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidOperator",
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
        "name": "ERC721InvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC721InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ERC721NonexistentToken",
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
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            }
        ],
        "name": "mint",
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
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
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
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
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
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
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
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
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
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
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
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
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
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
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
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenIdCounter",
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
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "tokensOfOwner",
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
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
export const NFT2ME_721_ABI = [{ "inputs": [{ "internalType": "address payable", "name": "factoryAddress", "type": "address" }, { "internalType": "uint256", "name": "protocolFee", "type": "uint256" }], "stateMutability": "payable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }], "name": "AddressEmptyCode", "type": "error" }, { "inputs": [], "name": "ApprovalCallerNotOwnerNorApproved", "type": "error" }, { "inputs": [], "name": "ApprovalQueryForNonexistentToken", "type": "error" }, { "inputs": [], "name": "BalanceQueryForZeroAddress", "type": "error" }, { "inputs": [], "name": "CantLowerCurrentPercentages", "type": "error" }, { "inputs": [], "name": "CollectionSoldOut", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address", "name": "owner", "type": "address" }], "name": "ERC721IncorrectOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ERC721InsufficientApproval", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC721InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }], "name": "ERC721InvalidOperator", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "ERC721InvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC721InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC721InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ERC721NonexistentToken", "type": "error" }, { "inputs": [], "name": "FailedInnerCall", "type": "error" }, { "inputs": [], "name": "InvadlidCollectionSize", "type": "error" }, { "inputs": [], "name": "InvalidAmount", "type": "error" }, { "inputs": [], "name": "InvalidInitialization", "type": "error" }, { "inputs": [], "name": "InvalidInputSizesDontMatch", "type": "error" }, { "inputs": [], "name": "InvalidMintFee", "type": "error" }, { "inputs": [], "name": "InvalidMintingType", "type": "error" }, { "inputs": [], "name": "InvalidPercentageOrDiscountValues", "type": "error" }, { "inputs": [], "name": "InvalidPhaseWithoutDate", "type": "error" }, { "inputs": [], "name": "InvalidRevenueAddresses", "type": "error" }, { "inputs": [], "name": "InvalidRevenuePercentage", "type": "error" }, { "inputs": [], "name": "InvalidSignature", "type": "error" }, { "inputs": [], "name": "InvalidTokenId", "type": "error" }, { "inputs": [], "name": "MaxPerAddressExceeded", "type": "error" }, { "inputs": [], "name": "MetadataAlreadyFixed", "type": "error" }, { "inputs": [], "name": "MintToZeroAddress", "type": "error" }, { "inputs": [], "name": "MintZeroQuantity", "type": "error" }, { "inputs": [], "name": "NewBaseURICantBeEmpty", "type": "error" }, { "inputs": [], "name": "NonEditableTraitByTokenOwner", "type": "error" }, { "inputs": [], "name": "NonTransferrableSoulboundNFT", "type": "error" }, { "inputs": [], "name": "NotAllowlisted", "type": "error" }, { "inputs": [], "name": "NotEnoughAmountToMint", "type": "error" }, { "inputs": [], "name": "OnlyOnceTrait", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }], "name": "OperatorNotAllowed", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "inputs": [], "name": "OwnerQueryForNonexistentToken", "type": "error" }, { "inputs": [], "name": "PendingAffiliatesBalance", "type": "error" }, { "inputs": [], "name": "PlacerholderCantFreezeMetadata", "type": "error" }, { "inputs": [], "name": "PresaleInvalidMintingType", "type": "error" }, { "inputs": [], "name": "PresaleNotOpen", "type": "error" }, { "inputs": [], "name": "PublicSaleNotOpen", "type": "error" }, { "inputs": [], "name": "ReentrancyGuard", "type": "error" }, { "inputs": [], "name": "SaleFinished", "type": "error" }, { "inputs": [], "name": "SignatureMismatch", "type": "error" }, { "inputs": [], "name": "TraitValueUnchanged", "type": "error" }, { "inputs": [], "name": "TransferCallerNotOwnerNorApproved", "type": "error" }, { "inputs": [], "name": "TransferFromFailed", "type": "error" }, { "inputs": [], "name": "TransferFromIncorrectOwner", "type": "error" }, { "inputs": [], "name": "TransferToNonERC721ReceiverImplementer", "type": "error" }, { "inputs": [], "name": "TransferToZeroAddress", "type": "error" }, { "inputs": [], "name": "WaitUntilDropDate", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "affiliate", "type": "address" }], "name": "AffiliateSell", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "fromTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "toTokenId", "type": "uint256" }], "name": "BatchMetadataUpdate", "type": "event" }, { "anonymous": false, "inputs": [], "name": "ContractURIUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "traitKey", "type": "bytes32" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": false, "internalType": "bytes32", "name": "value", "type": "bytes32" }], "name": "ImmutableTrait", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Locked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [], "name": "TraitMetadataURIUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "traitKey", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": false, "internalType": "bytes32", "name": "traitValue", "type": "bytes32" }], "name": "TraitUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "traitKey", "type": "bytes32" }, { "indexed": false, "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }], "name": "TraitUpdatedList", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "traitKey", "type": "bytes32" }, { "indexed": false, "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }, { "indexed": false, "internalType": "bytes32", "name": "traitValue", "type": "bytes32" }], "name": "TraitUpdatedListUniformValue", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "traitKey", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "fromTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "toTokenId", "type": "uint256" }], "name": "TraitUpdatedRange", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "traitKey", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "fromTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "toTokenId", "type": "uint256" }, { "indexed": false, "internalType": "bytes32", "name": "traitValue", "type": "bytes32" }], "name": "TraitUpdatedRangeUniformValue", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Unlocked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint64", "name": "expires", "type": "uint64" }], "name": "UpdateUser", "type": "event" }, { "stateMutability": "payable", "type": "fallback" }, { "inputs": [{ "internalType": "address", "name": "affiliate", "type": "address" }], "name": "affiliateWithdraw", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "affiliate", "type": "address" }], "name": "affiliatesInfo", "outputs": [{ "internalType": "bool", "name": "enabled", "type": "bool" }, { "internalType": "uint16", "name": "affiliatePercentage", "type": "uint16" }, { "internalType": "uint16", "name": "userDiscount", "type": "uint16" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "to", "type": "address[]" }, { "internalType": "bytes32[]", "name": "customURICIDHash", "type": "bytes32[]" }, { "internalType": "bool", "name": "soulbound", "type": "bool" }], "name": "airdropCustomURI", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "to", "type": "address[]" }, { "internalType": "bool", "name": "soulbound", "type": "bool" }], "name": "airdropRandom", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "to", "type": "address[]" }, { "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }, { "internalType": "bool", "name": "soulbound", "type": "bool" }], "name": "airdropSpecify", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_wallet", "type": "address" }, { "internalType": "bytes32[]", "name": "_proof", "type": "bytes32[]" }], "name": "allowListed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "burnedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newErc20PaymentAddress", "type": "address" }], "name": "changeERC20PaymentAddress", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newMintPrice", "type": "uint256" }, { "internalType": "bool", "name": "isDynamic", "type": "bool" }], "name": "changeMintFee", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "newFee", "type": "uint16" }], "name": "changeRoyaltyFee", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "collectionSize", "outputs": [{ "internalType": "uint256", "name": "size", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "contractURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "currentPhase", "outputs": [{ "internalType": "enum IN2MCommonStorage.SalePhase", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "disableOperatorFilterRegistry", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "erc20PaymentAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTraitMetadataURI", "outputs": [{ "internalType": "string", "name": "labelsURI", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes32", "name": "traitKey", "type": "bytes32" }], "name": "getTraitValue", "outputs": [{ "internalType": "bytes32", "name": "traitValue", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes32[]", "name": "traitKeys", "type": "bytes32[]" }], "name": "getTraitValues", "outputs": [{ "internalType": "bytes32[]", "name": "traitValues", "type": "bytes32[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }, { "internalType": "uint256", "name": "mintPrice_", "type": "uint256" }, { "internalType": "bytes32", "name": "baseURICIDHash", "type": "bytes32" }, { "internalType": "bytes32", "name": "packedData", "type": "bytes32" }, { "internalType": "bytes", "name": "extraCollectionInformation", "type": "bytes" }], "name": "initialize008joDSK", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isMetadataFixed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isOpen", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isOperatorFilterRegistryEnabled", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "locked", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxPerAddress", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "merkleRoot", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes32[]", "name": "proof", "type": "bytes32[]" }], "name": "mintAllowlist", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "bytes32", "name": "customURICIDHash", "type": "bytes32" }, { "internalType": "bool", "name": "soulbound", "type": "bool" }], "name": "mintCustomURITo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mintFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mintRandomTo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "affiliate", "type": "address" }], "name": "mintRandomTo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }], "name": "mintSpecifyTo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }, { "internalType": "address", "name": "affiliate", "type": "address" }], "name": "mintSpecifyTo", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "toWihtExtra", "type": "bytes32" }, { "internalType": "uint256", "name": "customFee", "type": "uint256" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }, { "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }], "name": "mintWhitelist", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "mintingType", "outputs": [{ "internalType": "enum IN2MCommonStorage.MintingType", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "n2mVersion", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "collectionOwner", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ownerMaxRevenue", "outputs": [{ "internalType": "uint256", "name": "maxRevenue", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }], "name": "ownershipTransferred", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "pendingAffiliateBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pendingTotalAffiliatesBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "protocolFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "newCollectionSize", "type": "uint32" }], "name": "reduceCollectionSize", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes", "name": "signature", "type": "bytes" }, { "internalType": "uint256", "name": "fee", "type": "uint256" }, { "internalType": "address", "name": "feeReceiver", "type": "address" }], "name": "removeProtocolFee", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "amount", "type": "uint16" }], "name": "reserveTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "reservedTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "royaltyFee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "salePrice", "type": "uint256" }], "name": "royaltyInfo", "outputs": [{ "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "uint256", "name": "royaltyAmount", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "saleDates", "outputs": [{ "internalType": "uint256", "name": "dropDateTimestamp", "type": "uint256" }, { "internalType": "uint256", "name": "endDateTimestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "userDiscount", "type": "uint16" }, { "internalType": "uint16", "name": "affiliatePercentage", "type": "uint16" }, { "internalType": "address", "name": "affiliateAddress", "type": "address" }], "name": "setAffiliatesPercentageAndDiscount", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "baseURIString", "type": "string" }, { "internalType": "bytes32", "name": "baseURICIDHash", "type": "bytes32" }, { "internalType": "bool", "name": "isPlaceholder", "type": "bool" }, { "internalType": "bool", "name": "freezeMetadata", "type": "bool" }], "name": "setBaseURI", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "newContractURIMetadataCIDHash", "type": "bytes32" }], "name": "setContractURI", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "dropDateTimestamp", "type": "uint256" }, { "internalType": "uint256", "name": "endDateTimestamp", "type": "uint256" }], "name": "setDropAndEndDate", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "newMaxPerAddress", "type": "uint16" }], "name": "setMaxPerAddress", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "merkleRoot_", "type": "bytes32" }], "name": "setMerkleRoot", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "enum IN2MCommonStorage.SalePhase", "name": "newPhase", "type": "uint8" }], "name": "setPhase", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes32", "name": "traitKey", "type": "bytes32" }, { "internalType": "bytes32", "name": "value", "type": "bytes32" }], "name": "setTrait", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uri", "type": "string" }], "name": "setTraitMetadataURI", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "bytes32[]", "name": "ownerCanUpdateTraitKeys", "type": "bytes32[]" }, { "internalType": "bytes32[]", "name": "onlyOnceTraitKeys", "type": "bytes32[]" }], "name": "setTraitsPermissions", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint64", "name": "expires", "type": "uint64" }], "name": "setUser", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "amount", "type": "uint16" }], "name": "unreserveTokens", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "userExpires", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "userOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "operators", "type": "address[]" }], "name": "whitelistOperators", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "whitelistedOperators", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "erc20Address", "type": "address" }], "name": "withdrawERC20", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "withdrawnAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "withdrawnERC20Amount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];