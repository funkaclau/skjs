import { TOKEN_IMAGE_MAP } from "../config";

const FALLBACK_SYMBOL_IMAGE = {
  WSHIDO: "/assets/wshido.png",
  SHIDO: "/assets/wshido.png",
  USDC: "/assets/usdc.png",
  KIDDO: "/assets/kiddo.png",
  SHDX: "/assets/shdx.png",
};

/**
 * Resolve token image URL by address, with optional symbol fallback.
 * Returns null when no image can be resolved.
 */
export function resolveTokenImageByAddress(address, symbol = "") {
  const key = String(address || "").toLowerCase();
  if (key && TOKEN_IMAGE_MAP?.[key]) {
    return TOKEN_IMAGE_MAP[key];
  }

  const sym = String(symbol || "").trim().toUpperCase();
  if (sym && FALLBACK_SYMBOL_IMAGE[sym]) {
    return FALLBACK_SYMBOL_IMAGE[sym];
  }

  return null;
}

