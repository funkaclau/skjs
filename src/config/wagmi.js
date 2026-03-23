import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet, 
  rainbowWallet, 
  walletConnectWallet , injectedWallet
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';

export const shido = {
  id: 9008,
  name: 'Shido Mainnet',
  nativeCurrency: { name: 'Shido', symbol: 'SHIDO', decimals: 18 },
  rpcUrls: { default: { http: ['https://evm.shidoscan.net'] } },
  blockExplorers: { default: { name: 'ShidoScan', url: 'https://shidoscan.net' } },
};

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Authorized Wallets Only',
      wallets: [
        metaMaskWallet, // This uses MetaMask's specific RDNS "io.metamask"
        rainbowWallet,
        walletConnectWallet,
        injectedWallet
      ],
    },
  ],
  { appName: 'ShidoKid', projectId: 'YOUR_PROJECT_ID' }
);

export const config = createConfig({
  autoConnect: false,
  connectors,
  chains: [shido],
  // --- THIS IS THE MAGIC LINE ---
  // It tells the app: "Do not listen to any wallets that I didn't explicitly list above."
  multiInjectedProviderDiscovery: true, 
  transports: {
    [shido.id]: http(),
  },
});