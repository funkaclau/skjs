// config/chains.js
export const CHAINS = {
  // --- your chains ---
  "0x2330": {
    chainId: "0x2330",
    chainName: "Shido Mainnet",
    rpcUrls: ["https://evm.shidoscan.net"],
    nativeCurrency: { name: "SHIDO", symbol: "SHIDO", decimals: 18 },
    blockExplorerUrls: ["https://shidoscan.net"],
  },
  "0x232f": {
    chainId: "0x232f",
    chainName: "Shido Testnet",
    rpcUrls: ["https://testnet.shidoscan.net"],
    nativeCurrency: { name: "SHIDO", symbol: "SHIDO", decimals: 18 },
    blockExplorerUrls: ["https://testnet.shidoscan.net"],
  },
  "0x7a69": {
    chainId: "0x7a69",
    chainName: "Hardhat",
    rpcUrls: ["http://127.0.0.1:8545"],
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: [],
  },

  // --- common EVMs (handy for name mapping + add-if-missing) ---
  "0x1": { // Ethereum Mainnet
    chainId: "0x1",
    chainName: "Ethereum",
    rpcUrls: ["https://rpc.ankr.com/eth"], // any public RPC is fine
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://etherscan.io"],
  },
  "0x38": { // BSC
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    blockExplorerUrls: ["https://bscscan.com"],
  },
  "0x89": { // Polygon
    chainId: "0x89",
    chainName: "Polygon",
    rpcUrls: ["https://polygon-rpc.com"],
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  "0xa86a": { // Avalanche C
    chainId: "0xa86a",
    chainName: "Avalanche",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
    blockExplorerUrls: ["https://snowtrace.io"],
  },
  "0xa4b1": { // Arbitrum One
    chainId: "0xa4b1",
    chainName: "Arbitrum One",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://arbiscan.io"],
  },
  "0x2105": { // Base
    chainId: "0x2105",
    chainName: "Base",
    rpcUrls: ["https://mainnet.base.org"],
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorerUrls: ["https://basescan.org"],
  },
};

export const CHAIN_NAMES = {
  "0x2330": "Shido Mainnet",
  "0x232f": "Shido Testnet  ",
  "0x7a69": "Hardhat",
  "0x1": "Ethereum",
  "0x38": "BNB Smart Chain",
  "0x89": "Polygon",
  "0xa86a": "Avalanche",
  "0xa4b1": "Arbitrum One",
  "0x2105": "Base",
};
