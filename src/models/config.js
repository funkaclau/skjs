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
    VAULT_V1_ABI
    
} from "./ABI";

export const CONTRACTS = {
    Stash: "0x5B73743d6e99E911e6C412C0BcA9a702475F0595",
    BatchShi20: "0x1AD0D74967d8c91d88D88aA229a5DAf3e46538B6",
    BatchShido: "0xA7E6a9fA8847Fbad72477e63704008AFF8E3e385",
    PreSale: "0xdD75c1a25C3bc4874C00f33C8639316dc819F34c",
    KIDDO: "0x2835Ad9a421C14E1C571a5Bb492B86b7E8f5873A",
    KIDDOTEST: "0x786aC56E85AA21E705077BB87482525595972920",
    //Analytics: "0xC9898Ae6FDbDDC63330d16D3AD8880A2FD6C2B93",
    StakingOG: "0xbf2019c320AD99F7A84664c72599D772C225eF62",
    TokenFactory: "0xd0Fa771BeA7BCFECc28eb5b4a3E111A0D6A840E0",
    VoucherManager: "0x3418EE09d1C34092E5901616BAbDD8B51c215065",
    AH: "0x1BB1CE168DBB54aa0A302b5AB76C9b5FB8c19B25",
    VaultFactory: "0x8477E66463B61945798898e0f93674a841c05FA1"
};

export const ABIS = {
    Stash: stashABI,
    BatchShi20: BATCH_ABI,
    TagBattle: TAG,
    PreSale: PresaleABI,
    KIDDO: TOKEN_ABI,
    KIDDOTEST: TOKEN_ABI,
    //Analytics: "0xC9898Ae6FDbDDC63330d16D3AD8880A2FD6C2B93",
    StakingOG: STAKING_ABI,
    TokenFactory: TokenFactoryABI,
    VoucherManager: VoucherManager,
    AH: AUCTION_ABI,
    VaultFactory: VAULT_FACTORY_ABI,
    VaultV1: VAULT_V1_ABI
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
};
export const KIDDO_ADDRESSES = {
    "0x232F": CONTRACTS.KIDDOTEST, // Testnet
    "0x2330": CONTRACTS.KIDDO, // Mainnet
};