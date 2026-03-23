const RPC_URL  = "https://evm.shidoscan.net/";
const QUOTER_V2 = "0xFcCBDe0ffbaba6533787d1b930a06d1aca9e9727";
const SWAP_ROUTER_V3 = "0x1c5316BA88a99a5c35389053D987aFfa502bfa8f";
const WSHIDO_USDC_POOL = "0x7cf3600309337c77453123FB2e695c508C61Ed12";



const EXPLICIT_MAP = {
  0xded: "0xdead.png",
  SASTER: "shi-aster.png",
  ILCFNBR: "ilcfnbr.png",
};

const FULL_TOKEN_LIST = [
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
  { address: "0xc3a8815291af5a506308d5efbef337a914cdb452", symbol: "0QBN", name: "Qubiton", decimals: 18 },
  { address: "0x9ccE1FD369E92004f2985035Ba5F319013D1Eff7", symbol: "GNUS", name: "GNUS", decimals: 18 },
    { address: "0xF84B713c7a6e3DA38a96049A4E94dA751e536a83", symbol: "NGEN", name: "NanoGen", decimals: 18 },
  {address: "0x8442768f6B50Ff7cA855EC3405B2a9A535088aEA", symbol: "ENQI", name: "Enerqi", decimals: 18},
  
];
// { address: "", symbol: "", name: "", decimals: 18 },


/* Whitelisted pools shown in the dropdown */
const PRESET_POOLS = [
  { label: "KIDDO / WSHIDO — 1%",   address: "0x76F2562B8826B14e0F0362724eC3887fbc62FB74" },
  //{ label: "KIDDO / USDC — 1%",     address: "0x26FcCF369656A30Dd792A40037875E55C937e8a8" },
  { label: "KIDDO / NERD — 1%", address: "0x23B1Ba5F070253bEc76F1db8a890A67842662fA8" },
  { label: "WSHIDO / USDC — 0.30%", address: WSHIDO_USDC_POOL },
  { label: "WSHIDO / KENSEI — 1%",  address: "0x2f4cdf4ad2203d5bca9ccb5485727d89603e2e39" },
  { label: "WSHIDO / SHDX — 1%",    address: "0x0cd72bfeed75ea4e1a7c5928aa9d9ba40312a876" },
  { label: "SALT / WSHIDO — 1%",    address: "0xfac4551574954b503adf7f352c10f5ffa39e6449" },
  { label: "NERD / WSHIDO — 1%",    address: "0x0fb5fa84d8ee3d94d08ec428da98e10977a0aff3" },
  //{ label: "NERD / ILCFNBR — 1%",   address: "0x41aEFa3248D3fBc4Cb7C1d92E5e70870fa923135" },
  { label: "WSHIDO / ILCFNBR — 1%", address: "0xf5c547c7821ee9b836e2a5a6d08ce74b15f94d47" },
  { label: "ILCFNBR / SHDX — 1%",   address: "0x8ca407c543c120aa0a12474ba50aaa937e682df7" },
  { label: "WSHIDO / SDS — 1%",     address: "0x258b4Bd56428c97EcAC4903C1cBa6303254d1c48" },
  { label: "CHICK / WSHIDO — 1%",   address: "0x600c9561b00E3Bc569211dbb47aC134fD46D6746" },
  { label: "0xded / WSHIDO — 1%",   address: "0x2ace39961c52d513ae0893891cf22efb2173d78b" },
  { label: "BOOBIES / WSHIDO — 1%", address: "0x00bb70ea350dc26df93ea8beda9a5d3e4768ce89" },
  { label: "MSMOON / WSHIDO — 1%",  address: "0x053a0d96ef36433f2ba01b7ffa0d2ec3b9effd9e" },
  { label: "sASTER / WSHIDO — 1%",  address: "0x406fcb19a0f44a77c007b378e83162f016b00303" },
  { label: "BUSHIDO / WSHIDO — 0.05%", address: "0x89a2b65b168677aea07cc7146e6d0b2c911927a0" },
  { label: "ILCFNBR / sASTER — 1%", address: "0xc2a122fcc3991edee3e573b168f060d5c76fe884" },
  { label: "BUSHIDO / ILCFNBR - 1%", address: "0x8ebe9435b60bea828870ed62a5e62d9faf7482de"},
  { label: "CWK / ILCFNBR - 1%", address: "0x5248D7Aa35AeCaDF0f3282B3AA3b272C636D400e"},
  
  //{ label: "ILCFNBR / IPN - 1%", address: "0xb5a9efd0da7f7c50419dee016a30f81ddad43564"},
  //{ label: "ILCFNBR / HODLJEET - 1%", address: "0xac14f719c2ccdfca3759a6ad2f51b10b5bc91046"},
  //{ label: "0xded / ILCFNBR - 1%", address: "0x7c447e5bdac8f5c14112dec1b5102654da38a936"},
  { label: "SALT / ILCFNBR - 1%", address: "0x76f933337dea9a638eb9b3adf94c21d1832d7ece"},
  { label: "CHICK / ILCFNBR - 1%", address: "0x209a1d69249c984d85aa5d5e333eb65d2e2aed7c"},
  { label: "WSHIDO / HODLJEET - 1%", address: "0xfe0043be9b3f16a54416635cc8f6bf9a2696a0a4"},
  { label: "IPN / WSHIDO - 1%", address: "0x2dcb26ff2954c8797864b91dba3c4b8f9d294b21"},
  { label: "NINJA / WSHIDO - 1%", address: "0x7ad1bbee1e2486c0af8377c6de00daa8210c75d8"},

];

/* Dominant-token registry:
   - When any pool in a group is selected, we compute USD for the *same* token
     here and in its sibling pools. */
const DOMINANT_GROUPS = [
  {
    symbol: "KIDDO",
    pools: [
      "0x76F2562B8826B14e0F0362724eC3887fbc62FB74", // KIDDO/WSHIDO
      //"0x26FcCF369656A30Dd792A40037875E55C937e8a8", // KIDDO/USDC
      "0x23B1Ba5F070253bEc76F1db8a890A67842662fA8" // KIDDO/NERD
    ],
  },
  {
    symbol: "NERD",
    pools: [
      "0x0fb5fa84d8ee3d94d08ec428da98e10977a0aff3", // NERD/WSHIDO
      //"0x41aEFa3248D3fBc4Cb7C1d92E5e70870fa923135", // NERD/ILCFNBR
      "0x23B1Ba5F070253bEc76F1db8a890A67842662fA8" // KIDDO/NERD
    ],
  },
  {
    symbol: "SHDX",
    pools: [
      "0x0cd72bfeed75ea4e1a7c5928aa9d9ba40312a876", // WSHIDO/SHDX
      "0x8ca407c543c120aa0a12474ba50aaa937e682df7", // ILCFNBR/SHDX
    ],
  },
  {
    symbol: "sASTER",
    pools: [
      "0x406fcb19a0f44a77c007b378e83162f016b00303", // WSHIDO/sASTER
      "0xc2a122fcc3991edee3e573b168f060d5c76fe884", // ILCFNBR/sASTER
    ],
  },
  {
    symbol: "ILCFNBR",
    pools: [
      "0xf5c547c7821ee9b836e2a5a6d08ce74b15f94d47", // WSHIDO / ILC
      "0x8ebe9435b60bea828870ed62a5e62d9faf7482de", // ILC / Bushido
      "0x8ca407c543c120aa0a12474ba50aaa937e682df7", // ILC / SHDX
      //"0x41aefa3248d3fbc4cb7c1d92e5e70870fa923135",  // NERD
      "0xc2a122fcc3991edee3e573b168f060d5c76fe884", // sAster
      "0x8ebe9435b60bea828870ed62a5e62d9faf7482de", // Bushido
      //"0xb5a9efd0da7f7c50419dee016a30f81ddad43564", // IPN
      //"0xac14f719c2ccdfca3759a6ad2f51b10b5bc91046", // HODLJEET
      //"0x7c447e5bdac8f5c14112dec1b5102654da38a936", // 0xded
      "0x209a1d69249c984d85aa5d5e333eb65d2e2aed7c", // CHICK
      "0x76f933337dea9a638eb9b3adf94c21d1832d7ece", // SALT
      "0x5248D7Aa35AeCaDF0f3282B3AA3b272C636D400e", // CWK / ILC 
    ]
  },
  {
    symbol: "BUSHIDO",
    pools: [
      "0x8ebe9435b60bea828870ed62a5e62d9faf7482de", // ILC / Bushido
      "0x89a2b65b168677aea07cc7146e6d0b2c911927a0" // WSHIDO / BUSHIDO
    ]
  },
  {
    symbol: "CWK",
    pools: [
      "0x5248D7Aa35AeCaDF0f3282B3AA3b272C636D400e", // CWK / ILC 
    ]
  },
  {
    symbol: "Salt",
    pools: [
      "0x76f933337dea9a638eb9b3adf94c21d1832d7ece", // SALT / ILC 
    ]
  }
];

const ROUTE_HINTS_BY_SYMBOL = {
  ILCFNBR: [
    "0xf5c547c7821ee9b836e2a5a6d08ce74b15f94d47", // WSHIDO / ILC
      "0x8ebe9435b60bea828870ed62a5e62d9faf7482de", // ILC / Bushido
      "0x8ca407c543c120aa0a12474ba50aaa937e682df7", // ILC / SHDX
      //"0x41aefa3248d3fbc4cb7c1d92e5e70870fa923135",  // NERD
      "0xc2a122fcc3991edee3e573b168f060d5c76fe884", // sAster
      "0x8ebe9435b60bea828870ed62a5e62d9faf7482de", // Bushido
      //"0xb5a9efd0da7f7c50419dee016a30f81ddad43564", // IPN
      //"0xac14f719c2ccdfca3759a6ad2f51b10b5bc91046", // HODLJEET
      "0x7c447e5bdac8f5c14112dec1b5102654da38a936", // 0xded
      "0x209a1d69249c984d85aa5d5e333eb65d2e2aed7c", // CHICK
      "0x76f933337dea9a638eb9b3adf94c21d1832d7ece", // SALT
      "0x5248D7Aa35AeCaDF0f3282B3AA3b272C636D400e", // CWK / ILC 
  ],
  sASTER:  [ "0x406fcb19a0f44a77c007b378e83162f016b00303"], // sASTER/ILCFNBR
  SHDX: ["0x8ca407c543c120aa0a12474ba50aaa937e682df7", "0x0cd72bfeed75ea4e1a7c5928aa9d9ba40312a876"],
  KIDDO: ["0x76F2562B8826B14e0F0362724eC3887fbc62FB74", "0x23B1Ba5F070253bEc76F1db8a890A67842662fA8"],
  NERD: ["0x0fb5fa84d8ee3d94d08ec428da98e10977a0aff3", "0x23B1Ba5F070253bEc76F1db8a890A67842662fA8"]

};


/* =========================================================
   ABIs
   ========================================================= */
const SWAP_ROUTER_ABI = [
  {
    inputs: [{
      components: [
        { internalType:"address", name:"tokenIn",  type:"address"},
        { internalType:"address", name:"tokenOut", type:"address"},
        { internalType:"uint24",  name:"fee",      type:"uint24"},
        { internalType:"address", name:"recipient",type:"address"},
        { internalType:"uint256", name:"amountIn", type:"uint256"},
        { internalType:"uint256", name:"amountOutMinimum", type:"uint256"},
        { internalType:"uint160", name:"sqrtPriceLimitX96", type:"uint160"},
      ],
      internalType:"struct IV3SwapRouter.ExactInputSingleParams", name:"params", type:"tuple"
    }],
    name:"exactInputSingle", outputs:[{internalType:"uint256",name:"amountOut",type:"uint256"}],
    stateMutability:"payable", type:"function"
  },
  {
    inputs: [{
      components: [
        { internalType:"address", name:"tokenIn",  type:"address"},
        { internalType:"address", name:"tokenOut", type:"address"},
        { internalType:"uint24",  name:"fee",      type:"uint24"},
        { internalType:"address", name:"recipient",type:"address"},
        { internalType:"uint256", name:"amountOut",type:"uint256"},
        { internalType:"uint256", name:"amountInMaximum", type:"uint256"},
        { internalType:"uint160", name:"sqrtPriceLimitX96", type:"uint160"},
      ],
      internalType:"struct IV3SwapRouter.ExactOutputSingleParams", name:"params", type:"tuple"
    }],
    name:"exactOutputSingle", outputs:[{internalType:"uint256",name:"amountIn",type:"uint256"}],
    stateMutability:"payable", type:"function"
  },
  {
  "inputs": [
    {
      "components": [
        { "internalType": "bytes", "name": "path", "type": "bytes" },
        { "internalType": "address", "name": "recipient", "type": "address" },
        //{ "internalType": "uint256", "name": "deadline", "type": "uint256" },
        { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
        { "internalType": "uint256", "name": "amountOutMinimum", "type": "uint256" }
      ],
      "internalType": "struct ISwapRouter.ExactInputParams",
      "name": "params",
      "type": "tuple"
    }
  ],
  "name": "exactInput",
  "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }],
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [
    {
      "components": [
        { "internalType": "bytes", "name": "path", "type": "bytes" },
        { "internalType": "address", "name": "recipient", "type": "address" },
        { "internalType": "uint256", "name": "deadline", "type": "uint256" },
        { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
        { "internalType": "uint256", "name": "amountInMaximum", "type": "uint256" }
      ],
      "internalType": "struct ISwapRouter.ExactOutputParams",
      "name": "params",
      "type": "tuple"
    }
  ],
  "name": "exactOutput",
  "outputs": [{ "internalType": "uint256", "name": "amountIn", "type": "uint256" }],
  "stateMutability": "payable",
  "type": "function"
}
];

const POOL_ABI = [
  { name:"token0", inputs:[], outputs:[{type:"address"}], stateMutability:"view", type:"function" },
  { name:"token1", inputs:[], outputs:[{type:"address"}], stateMutability:"view", type:"function" },
  { name:"fee",    inputs:[], outputs:[{type:"uint24"}],  stateMutability:"view", type:"function" },
  { name:"slot0",  inputs:[], outputs:[
    {name:"sqrtPriceX96", type:"uint160"},
    {name:"tick", type:"int24"},
    {type:"uint16"},{type:"uint16"},{type:"uint16"},{type:"uint8"},{type:"bool"},
  ], stateMutability:"view", type:"function" },
];

const ERC20_ABI = [
  { name:"decimals", inputs:[], outputs:[{type:"uint8"}], stateMutability:"view", type:"function" },
  { name:"symbol",   inputs:[], outputs:[{type:"string"}], stateMutability:"view", type:"function" },
];

const QUOTER_V2_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH9","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"quoteExactInput","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint160[]","name":"sqrtPriceX96AfterList","type":"uint160[]"},{"internalType":"uint32[]","name":"initializedTicksCrossedList","type":"uint32[]"},{"internalType":"uint256","name":"gasEstimate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct IQuoterV2.QuoteExactInputSingleParams","name":"params","type":"tuple"}],"name":"quoteExactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceX96After","type":"uint160"},{"internalType":"uint32","name":"initializedTicksCrossed","type":"uint32"},{"internalType":"uint256","name":"gasEstimate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"quoteExactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint160[]","name":"sqrtPriceX96AfterList","type":"uint160[]"},{"internalType":"uint32[]","name":"initializedTicksCrossedList","type":"uint32[]"},{"internalType":"uint256","name":"gasEstimate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct IQuoterV2.QuoteExactOutputSingleParams","name":"params","type":"tuple"}],"name":"quoteExactOutputSingle","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceX96After","type":"uint160"},{"internalType":"uint32","name":"initializedTicksCrossed","type":"uint32"},{"internalType":"uint256","name":"gasEstimate","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"amount0Delta","type":"int256"},{"internalType":"int256","name":"amount1Delta","type":"int256"},{"internalType":"bytes","name":"path","type":"bytes"}],"name":"uniswapV3SwapCallback","outputs":[],"stateMutability":"view","type":"function"}];

/* =========================================================
   Math & small utils
   ========================================================= */
const Q96  = 2n ** 96n;
const Q192 = Q96 * Q96;
const SYMBOL_OVERRIDE = {
  "I LEARNT CHINESE FOR NEXT BULL RUN": "ILCFNBR",
  "I learnt Chinese for next bull run": "ILCFNBR",
  "I LEARNED CHINESE FOR NEXT BULL RUN": "ILCFNBR",
  "sAster": "sASTER",
  "Saster": "sASTER",
  "saster": "sASTER",
};
const prettySymbol = s => SYMBOL_OVERRIDE[(s || "").trim()] || (s || "").trim();
export {
  RPC_URL, QUOTER_V2, QUOTER_V2_ABI, SWAP_ROUTER_ABI, SWAP_ROUTER_V3, 
  DOMINANT_GROUPS, POOL_ABI, ERC20_ABI, PRESET_POOLS, Q96, Q192, 
  WSHIDO_USDC_POOL, ROUTE_HINTS_BY_SYMBOL, SYMBOL_OVERRIDE, prettySymbol, EXPLICIT_MAP, FULL_TOKEN_LIST
};