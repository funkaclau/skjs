import {
  RPC_URL,
  QUOTER_V2,
  SWAP_ROUTER_V3,
  WSHIDO_USDC_POOL,
  EXPLICIT_MAP,
  FULL_TOKEN_LIST,
  PRESET_POOLS,
  DOMINANT_GROUPS,
  ROUTE_HINTS_BY_SYMBOL,
  SYMBOL_OVERRIDE,
  prettySymbol,
} from "./markets";

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

const Q96  = 2n ** 96n;
const Q192 = Q96 * Q96;

export {
  RPC_URL, QUOTER_V2, QUOTER_V2_ABI, SWAP_ROUTER_ABI, SWAP_ROUTER_V3,
  DOMINANT_GROUPS, POOL_ABI, ERC20_ABI, PRESET_POOLS, Q96, Q192,
  WSHIDO_USDC_POOL, ROUTE_HINTS_BY_SYMBOL, SYMBOL_OVERRIDE, prettySymbol, EXPLICIT_MAP, FULL_TOKEN_LIST
};
