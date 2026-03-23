// src/utils/erc20/prices.js
const DEXHUB_URL = "https://dexhub.mavnode.io/api/v1/prices";
const DEXHUB_KEY = "key_MSGkDgSUFyqMIKhQCZgHNKdGjmHj1kXB";

export async function fetchDexHubPrices() {
  try {
    const r = await fetch(DEXHUB_URL, { 
      headers: { "X-API-Key": DEXHUB_KEY } 
    });
    const j = await r.json();

    if (!j?.success || !Array.isArray(j.data)) return {};

    // Return a flat object for easy state mapping
    return j.data.reduce((acc, item) => {
      if (item.address) {
        acc[item.address.toLowerCase()] = Number(item.usdPrice || 0);
      }
      return acc;
    }, {});
  } catch (err) {
    console.error("DexHub Price Fetch Failed:", err);
    return {};
  }
}