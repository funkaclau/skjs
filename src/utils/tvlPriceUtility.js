const DEXHUB_URL = "https://dexhub.mavnode.io/api/v1/prices";
const DEXHUB_KEY = "key_MSGkDgSUFyqMIKhQCZgHNKdGjmHj1kXB";

/**
 * Calls DexHub for the tokens found in the Ark Factory 
 * and calculates the total USD TVL.
 */
export async function calculateUSDValueFromMap(perTokenMap) {
  if (!perTokenMap || perTokenMap.size === 0) return 0;

  try {
    // 1. Fetch all prices from DexHub
    const r = await fetch(DEXHUB_URL, { 
      headers: { "X-API-Key": DEXHUB_KEY } 
    });
    const j = await r.json();

    if (!j?.success || !Array.isArray(j.data)) {
        throw new Error("DexHub data unavailable");
    }

    // 2. Create a quick-lookup map for prices [Address -> USD]
    const priceLookup = new Map();
    j.data.forEach(item => {
        if (item.address) {
            priceLookup.set(item.address.toLowerCase(), Number(item.usdPrice || 0));
        }
    });

    let totalUSD = 0;

    // 3. Iterate through your Ark Factory tokens and apply the math
    for (let [address, data] of perTokenMap) {
      const price = priceLookup.get(address.toLowerCase()) || 0;
      
      // Math: (Raw BigInt / 10^Decimals) * Price
      const readableAmount = Number(data.lockedRaw) / (10 ** data.decimals);
      totalUSD += (readableAmount * price);
    }

    return totalUSD;
  } catch (err) {
    console.error("TVL Calculation Error:", err);
    return 0; // Fallback to 0 so the UI doesn't crash
  }
}