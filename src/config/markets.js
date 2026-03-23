
export const RPC_URL = "https://evm.shidoscan.net/";

// Core tokens (you gave these)
export const WSHIDO_ADDR = "0x8cbafFD9b658997E7bf87E98FEbF6EA6917166F7";
export const USDC_ADDR   = "0xeE1Fc22381e6B6bb5ee3bf6B5ec58DF6F5480dF8";

// Quoter/Router (keep if used elsewhere)
export const QUOTER_V2 = "0xFcCBDe0ffbaba6533787d1b930a06d1aca9e9727";
export const SWAP_ROUTER_V3 = "0x1c5316BA88a99a5c35389053D987aFfa502bfa8f";

// Primary oracle anchor pool
export const WSHIDO_USDC_POOL = "0x7cf3600309337c77453123fb2e695c508c61ed12";

/* =========================================================
   Images / symbol normalization
   ========================================================= */

export const EXPLICIT_MAP = {
  // example: "0xded" logo key used in your UI
  "0xded": "0xdead.png",
  SASTER: "shi-aster.png",
  ILCFNBR: "ilcfnbr.png"
};

export const SYMBOL_OVERRIDE = {
  "I LEARNT CHINESE FOR NEXT BULL RUN": "ILCFNBR",
  "I learnt Chinese for next bull run": "ILCFNBR",
  "I LEARNED CHINESE FOR NEXT BULL RUN": "ILCFNBR",
  "我学中文是为了下一次牛市": "ILCFNBR",
  "sAster": "sASTER",
  "Saster": "sASTER",
  "saster": "sASTER",
};

export const prettySymbol = (s) =>
  SYMBOL_OVERRIDE[(s || "").trim()] || (s || "").trim();

/* =========================================================
   “Never consider” pools
   ========================================================= */

// Pools that exist on-chain but should never be considered for price discovery.
// Put dead / dust / discontinued / malicious pools here.
export const AVOID_POOLS = [
  // "0x0000000000000000000000000000000000000000", // example
];

/* =========================================================
   “Don’t show token at all”
   ========================================================= */

// If you ever want to hide a token from MarketsLanding entirely.
export const DELISTED_TOKENS = [
  // "0x...", // token address
];

/* =========================================================
   Main pools (from your big JSON list)
   ========================================================= */

// These are the “main pools” you sent in priceInfo.poolAddress.
// We treat them as the best baseline for markets landing.
export const FULL_TOKEN_LIST = [
  { address: "0x8cbafFD9b658997E7bf87E98FEbF6EA6917166F7", symbol: "WSHIDO", name: "Wrapped Shido", decimals: 18 },
  { address: "0xe550Bde2F0898552B38a41635d7a8DDB1Fd81276", symbol: "SHDX", name: "Shido Dex", decimals: 18 },
  { address: "0xeE1Fc22381e6B6bb5ee3bf6B5ec58DF6F5480dF8", symbol: "USDC", name: "USDC", decimals: 6 },
    { address: "0x56009a137ed6d56e0133a52363a78063f429ece4", symbol: "RAKUN", name: "Rakun", decimals: 18 },
  { address: "0xdB798cF512Af4F7E41AE4Bf4b7f20CDF74Bc21f9", symbol: "CWK", name: "chinawok ", decimals: 18 },
  { address: "0xa907bE8aEFF41D593dC33A29C0CBAbEbD8beC03B", symbol: "ILCFNBR", name: "我学中文是为了下一次牛市", decimals: 18 },
    { address: "0x302c63d7A90770B3Fb374893E9325988Fa68B12A", symbol: "DWS", name: "DOGWIFSUIT", decimals: 18 },
  { address: "0xfb889425b72c97c5b4484cf148ae2404ab7a13e7", symbol: "KENSEI", name: "Kensei", decimals: 18 },
  { address: "0x8442768f6B50Ff7cA855EC3405B2a9A535088aEA", symbol: "ENQI", name: "Enerqi", decimals: 18 },
    { address: "0x2835Ad9a421C14E1C571a5Bb492B86b7E8f5873A", symbol: "KIDDO", name: "ShidoKid", decimals: 18 },
  { address: "0x72fDEc5fc6B92EFC2451529f52C66f34150f54a7", symbol: "KSN", name: "Kitsune", decimals: 18 },
  { address: "0x37385e458bb1b19c614C238E5109E59ac605DF7a", symbol: "CHICK", name: "Crazy-Chicken", decimals: 18 },
    { address: "0x4b0cBcad61c5584EdE3ca9fd45eF1feBB2215311", symbol: "NERD", name: "NERD", decimals: 18 },
  { address: "0xe5420222bd4464B214551A0D81389C9a6C8aa42a", symbol: "HODLJEET", name: "HodlJeet", decimals: 18 },
  { address: "0x1f5b6F4126575835c23D1b6c38535FA215df03c5", symbol: "MSMOON", name: "MSMoon", decimals: 18 },
    { address: "0xF7B264B723059a05fBf13E32783F88db33A24365", symbol: "SDS", name: "Shidoshi", decimals: 6 },
  { address: "0xC1837b743Bc80e2fe20D96BdC5E336ca641A4eDe", symbol: "DESHI", name: "Deshi", decimals: 18 },
  { address: "0x1B22b06eF38140064004cA050b3A67348B94A220", symbol: "IPN", name: "Ippon", decimals: 18 },
    { address: "0x27027Eb11c456d690DEA785905C1915D6b444bCe", symbol: "SALT", name: "Salt", decimals: 18 },
  { address: "0x37081847db8eA6bD103E686CBe7ab150D829FF76", symbol: "CHILL", name: "Chill Cat", decimals: 18 },
  { address: "0xfad12e07590f06d4135c9a4fe018e44d50b83292", symbol: "BUSHIDO", name: "Bushido", decimals: 18 },
    { address: "0x5ac082f693160eb2136d81aa9e772101109c11c4", symbol: "NINJA", name: "Shido Ninja", decimals: 18 },
  { address: "0x2987D36a348F5D9b94B1A21B956D7E936Bd5Ba13", symbol: "MANGA", name: "Manga Coin", decimals: 18 },
  { address: "0x796F48d17d38E5f0A7aFe7966448828bdc13e8B1", symbol: "0xded", name: "0xDead", decimals: 18 },
    { address: "0x65f1Ed90e4e41417B38b1f8098c4FE257353C96F", symbol: "MYCROFT", name: "Mycroft", decimals: 18 },
  { address: "0xb5b466adccc67be5347c9c943a4ab504635a71ef", symbol: "BOOJO", name: "GhostDojo", decimals: 18 },
  { address: "0x1601a36D71B7cE53d947330ecd2171fE469d7C79", symbol: "BB", name: "BubbleButt", decimals: 18 },
    { address: "0xc95e6e74f40ca62218dc09b9d21ad6dea9255616", symbol: "sAster", name: "Shi-Aster", decimals: 18 },
  { address: "0x5287b6b6232305aed784cd0454bb20926f691b5a", symbol: "PCOFFEE", name: "Prem. Coffee", decimals: 18 },
  { address: "0x01396a82Fa815a22b3b7B9C68C2B4A322C076c2B", symbol: "SHIDOCOFFEE", name: "Shido Coffee", decimals: 18 },
      { address: "0x598cC037889bdE8bC77672AF9a1bA0fe6CCa255C", symbol: "BOOBIES", name: "Boobies", decimals: 18 },
  { address: "0xc3a8815291af5a506308d5efbef337a914cdb452", symbol: "QBN", name: "Qubiton", decimals: 18 },
  { address: "0x9ccE1FD369E92004f2985035Ba5F319013D1Eff7", symbol: "GNUS", name: "GNUS", decimals: 18 },
    { address: "0xF84B713c7a6e3DA38a96049A4E94dA751e536a83", symbol: "NGEN", name: "NanoGen", decimals: 18 },
  {address: "0x8442768f6B50Ff7cA855EC3405B2a9A535088aEA", symbol: "ENQI", name: "Enerqi", decimals: 18}
];


export const PRESET_POOLS = [
  // --- Oracles / anchors ---
  { label: "WSHIDO / USDC — 0.30% (oracle)", address: WSHIDO_USDC_POOL },

  // --- Core ecosystem / projects (main pools) ---
  { label: "DWS / WSHIDO — 1%",    address: "0x8508697be4e91eb0bcfcaf712d55204b8511fcb6" },
  { label: "KENSEI / WSHIDO — 1%", address: "0x2f4cdf4ad2203d5bca9ccb5485727d89603e2e39" },
  { label: "NINJA / WSHIDO — 1%",  address: "0x7ad1bbee1e2486c0af8377c6de00daa8210c75d8" },
  { label: "SALT / WSHIDO — 1%",   address: "0xfac4551574954b503adf7f352c10f5ffa39e6449" },
  { label: "KIDDO / WSHIDO — 1%",  address: "0x76F2562B8826B14e0F0362724eC3887fbc62FB74" },
  { label: "CHICK / WSHIDO — 1%",  address: "0x600c9561b00E3Bc569211dbb47aC134fD46D6746" },
  { label: "0xded / WSHIDO — 1%",  address: "0x2ace39961c52d513ae0893891cf22efb2173d78b" },
  { label: "SHDX / WSHIDO — 0.30%", address:"0x0cd72bfeed75ea4e1a7c5928aa9d9ba40312a876" },
  { label: "SDS / WSHIDO — 1%",    address: "0x258b4bd56428c97ecac4903c1cba6303254d1c48" },
  { label: "MSMOON / WSHIDO — 1%", address: "0x053a0d96ef36433f2ba01b7ffa0d2ec3b9effd9e" },
  { label: "IPN / WSHIDO — 1%",    address: "0x2dcb26ff2954c8797864b91dba3c4b8f9d294b21" },
  { label: "BOOBIES / WSHIDO — 1%", address:"0x00bb70ea350dc26df93ea8beda9a5d3e4768ce89" },
  { label: "NERD / WSHIDO — 1%",   address: "0x0fb5fa84d8ee3d94d08ec428da98e10977a0aff3" },
  { label: "PCOFFEE / WSHIDO — 1%", address:"0x2778ae652c46e4a9b6f797fce77f6e38ba2f2218" },
  { label: "sASTER / WSHIDO — 0.05%", address:"0x406fcb19a0f44a77c007b378e83162f016b00303" },
  { label: "QBN / WSHIDO — 0.30%", address:"0x4f968f8fbc3d97bf15c1e140b28192329d2173ee" },
  { label: "BUSHIDO / WSHIDO — 0.05%", address:"0x89a2b65b168677aea07cc7146e6d0b2c911927a0" },
  { label: "CHILL / WSHIDO — 1%",  address: "0x2cc8f2e3ad69b3d9f19f071eddf4d9bb278acee0" },
  { label: "ILCFNBR / WSHIDO — 1%", address:"0xf5c547c7821ee9b836e2a5a6d08ce74b15f94d47" },
  { label: "HODLJEET / WSHIDO — 1%", address:"0xfe0043be9b3f16a54416635cc8f6bf9a2696a0a4" },
  { label: "BOOJO / WSHIDO — 1%",  address: "0x321dac10ecfa586e445e960a5655b22a70e233a5" },
  { label: "MANGA / WSHIDO — 0.05%", address:"0xc4de8f6f37dce1877d299850e60790c91e7d03b8" },
  { label: "BB / WSHIDO — 1%",     address: "0xb90b42e75d5d355fd297b81d9e5282c4b53f6c56" },
  { label: "MYCROFT / WSHIDO — 1%", address:"0x4cbd9219072cd21b20588c7e39755e848c552783" },
  { label: "GNUS / WSHIDO — 0.05%", address:"0x55b751042a50c7a1e2e25d6a06a0caaef1c5534c" },
  { label: "KSN / WSHIDO — 0.05%", address:"0xd2586ca9a7d77136d6ae1a65b5c86ec763570183" },
  { label: "NGEN / WSHIDO — 0.05%", address:"0x8d29bf3fbcd621e64771e5bf24dda3fc66affa60" },

  // ODD POOLS
  { label: "DESHI / SDS — 1%",     address: "0x0AB9Ce663A304E1De114d6D1b75d37a68aCa2111" },
  { label: "CWK / ILCFNBR — 1%",     address: "0x5248D7Aa35AeCaDF0f3282B3AA3b272C636D400e" },
  { label: "RAKUN / KENSEI — 1%",  address: "0xf4206e9a6ee82b75e0ae201fff24b730c12bc513" },
  
  
  // From your earlier config + chat:
  { label: "KIDDO / NERD — 1% (secondary)", address: "0x23B1Ba5F070253bEc76F1db8a890A67842662fA8" },

  // CHINESE ONES

  //{ label: "CHICK / ILCFNBR — 1% (odd pair)", address: "0x209a1d69249c984d85aa5d5e333eb65d2e2aed7c" },
  { label: "ILCFNBR / SHDX — 1% (odd pair)", address: "0x8ca407c543c120aa0a12474ba50aaa937e682df7" },
  { label: "SALT / ILCFNBR — 1% (odd pair)", address: "0x76f933337dea9a638eb9b3adf94c21d1832d7ece" },
  { label: "BUSHIDO / ILCFNBR — 1% (odd pair)", address: "0x8ebe9435b60bea828870ed62a5e62d9faf7482de" },
  { label: "ILCFNBR / SDS — 1% (odd pair)", address: "0x02c211bda18babca1c1002296f55dd2eefffb45c" },
  { label: "sAster / ILCFNBR — 1% (odd pair)", address: "0xc2a122fcc3991edee3e573b168f060d5c76fe884" },
  // { label: "HODLJEET / ILCFNBR — 1% (odd pair)", address: "0xac14f719c2ccdfca3759a6ad2f51b10b5bc91046" },
  //{ label: "0xded / ILCFNBR — 1% (odd pair)", address: "0x7c447e5bdac8f5c14112dec1b5102654da38a936" },
  //{ label: "NERD / ILCFNBR — 1% (odd pair)", address: "0x41aefa3248d3fbc4cb7c1d92e5e70870fa923135" },
  //{ label: "IPN / ILCFNBR — 1% (odd pair)", address: "0xb5a9efd0da7f7c50419dee016a30f81ddad43564" },
  //{ label: "BOOJO / ILCFNBR — 1% (odd pair)", address: "0xfe524db8ad5fdc11cbaff72af104581625103526" },

  { label: " / — 1%", address: ""},
];
export const POOL_REGISTRY = PRESET_POOLS
  .filter(p => p.address && p.label)
  .map(p => {

    const pairPart = p.label.split("—")[0].trim(); 
    const [symbol0, symbol1] = pairPart.split("/").map(s => s.trim());

    const token0 = FULL_TOKEN_LIST.find(t => t.symbol === symbol0) || null;
    const token1 = FULL_TOKEN_LIST.find(t => t.symbol === symbol1) || null;

    return {
      label: p.label,
      address: p.address,

      token0Symbol: symbol0,
      token1Symbol: symbol1,

      token0,
      token1,

      token0Address: token0?.address || null,
      token1Address: token1?.address || null,

      token0Decimals: token0?.decimals ?? null,
      token1Decimals: token1?.decimals ?? null
    };
  });
/* =========================================================
   Optional: known “odd pairs” / secondary pools
   ========================================================= */

// Keep these separate so you can decide when/if MarketsLanding should include them.
// For now, you can manually merge these into PRESET_POOLS later if you want.
export const EXTRA_POOLS = [
  // From your earlier config + chat:
  { label: "KIDDO / NERD — 1% (secondary)", address: "0x23B1Ba5F070253bEc76F1db8a890A67842662fA8" },

  // Mentioned in your earlier list:
  // CHINESE ONES

  { label: "CHICK / ILCFNBR — 1% (odd pair)", address: "0x209a1d69249c984d85aa5d5e333eb65d2e2aed7c" },
  { label: "ILCFNBR / SHDX — 1% (odd pair)", address: "0x8ca407c543c120aa0a12474ba50aaa937e682df7" },
  { label: "SALT / ILCFNBR — 1% (odd pair)", address: "0x76f933337dea9a638eb9b3adf94c21d1832d7ece" },
  { label: "BUSHIDO / ILCFNBR — 1% (odd pair)", address: "0x8ebe9435b60bea828870ed62a5e62d9faf7482de" },
  { label: "ILCFNBR / SDS — 1% (odd pair)", address: "0x02c211bda18babca1c1002296f55dd2eefffb45c" },
  { label: "sAster / ILCFNBR — 1% (odd pair)", address: "0xc2a122fcc3991edee3e573b168f060d5c76fe884" },
  { label: "HODLJEET / ILCFNBR — 1% (odd pair)", address: "0xac14f719c2ccdfca3759a6ad2f51b10b5bc91046" },
  { label: "0xded / ILCFNBR — 1% (odd pair)", address: "0x7c447e5bdac8f5c14112dec1b5102654da38a936" },
  { label: "NERD / ILCFNBR — 1% (odd pair)", address: "0x41aefa3248d3fbc4cb7c1d92e5e70870fa923135" },
  { label: "IPN / ILCFNBR — 1% (odd pair)", address: "0xb5a9efd0da7f7c50419dee016a30f81ddad43564" },
  { label: "BOOJO / ILCFNBR — 1% (odd pair)", address: "0xfe524db8ad5fdc11cbaff72af104581625103526" },

];

/* =========================================================
   Convenience: quick “pool hints by symbol”
   ========================================================= */

// Your swap engine can use this to pre-suggest routing options in UI.
// Keep it lightweight; you can expand as needed.
export const ROUTE_HINTS_BY_SYMBOL = {
  WSHIDO: [WSHIDO_USDC_POOL],
  KIDDO: [
    "0x76F2562B8826B14e0F0362724eC3887fbc62FB74",
    "0x23B1Ba5F070253bEc76F1db8a890A67842662fA8",
  ],
  NERD: [
    "0x0fb5fa84d8ee3d94d08ec428da98e10977a0aff3",
    "0x23B1Ba5F070253bEc76F1db8a890A67842662fA8",
  ],
  ILCFNBR: [
    //"0xf5c547c7821ee9b836e2a5a6d08ce74b15f94d47",
    "0x8ca407c543c120aa0a12474ba50aaa937e682df7",
    //"0x209a1d69249c984d85aa5d5e333eb65d2e2aed7c",
    "0x76f933337dea9a638eb9b3adf94c21d1832d7ece", // SALT/ILCFNBR if you enable it
    "0x8ebe9435b60bea828870ed62a5e62d9faf7482de", // bushido /ILC
    "0xc2a122fcc3991edee3e573b168f060d5c76fe884", // saster/ilc
    "0x02c211bda18babca1c1002296f55dd2eefffb45c", //SDS
    "0xdB798cF512Af4F7E41AE4Bf4b7f20CDF74Bc21f9", // CWK
  ],

  CHICK: [
    //"0x209a1d69249c984d85aa5d5e333eb65d2e2aed7c", // china
    "0x600c9561b00E3Bc569211dbb47aC134fD46D6746"
  ],
  IPN: [
    //"0xb5a9efd0da7f7c50419dee016a30f81ddad43564", //ILC
    "0x2dcb26ff2954c8797864b91dba3c4b8f9d294b21"
  ]
};
