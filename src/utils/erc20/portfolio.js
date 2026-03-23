// src/utils/erc20/portfolio.js
import Web3 from "web3";
import { TOKEN_ABI } from "../../config";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const wait = (ms) => new Promise(res => setTimeout(res, ms));
/**
 * Fetches all unique ERC20 tokens a user has interacted with and their current balances.
 */
export async function fetchERC20Holdings(account, web3, opts = {}) {
    const { signal, delayMs = 200 } = opts;
    const acc = String(account || "").toLowerCase();
    if (!acc || !web3) return [];

    // 1. Get List of all ERC20 transactions for this user
    // This identifies which tokens they potentially hold.
    const url = `https://shidoscan.net/api?module=account&action=tokentx&address=${acc}&page=1&offset=1000&sort=desc`;
    
    try {
        const response = await fetch(url, { signal });
        const data = await response.json();
        
        if (data.status !== "1" || !Array.isArray(data.result)) return [];

        // 2. Extract unique contract addresses and basic metadata
        const tokenMap = new Map();
        data.result.forEach(tx => {
            const addr = web3.utils.toChecksumAddress(tx.contractAddress);
            if (!tokenMap.has(addr)) {
                tokenMap.set(addr, {
                    address: addr,
                    symbol: tx.tokenSymbol,
                    name: tx.tokenName,
                    decimals: parseInt(tx.tokenDecimal)
                });
            }
        });

        const holdings = [];

        // 3. Batch fetch current balances
        // We do this because the transaction list doesn't show the *current* balance
        for (const [address, info] of tokenMap.entries()) {
            if (signal?.aborted) break;

            try {
                const contract = new web3.eth.Contract(TOKEN_ABI, address);
                const rawBalance = await contract.methods.balanceOf(acc).call();
                
                if (BigInt(rawBalance) > 0n) {
                    holdings.push({
                        ...info,
                        balanceRaw: rawBalance,
                        balanceHuman: Number(web3.utils.fromWei(rawBalance, 'ether')) // adjust based on info.decimals if not 18
                    });
                }
                await wait(50);
            } catch (err) {
                console.error(`Failed to fetch balance for ${address}`, err);
            }
            
            // Avoid hitting RPC limits
            if (delayMs) await sleep(delayMs);
        }

        return holdings;
    } catch (error) {
        console.error("Failed to fetch portfolio:", error);
        return [];
    }
}