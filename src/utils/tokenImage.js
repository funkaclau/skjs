import { TOKEN_IMAGE_MAP } from "../config/config.js";

const FALLBACK_SYMBOL_IMAGE = {
  WSHIDO: "/assets/wshido.png",
  SHIDO: "/assets/wshido.png",
  USDC: "/assets/usdc.png",
  KIDDO: "/assets/kiddo.png",
  SHDX: "/assets/shdx.png",
  CAT: "/assets/cat.jpg",
  CWK: "/assets/chinawok.jpg",
  ENQI: "/assets/enerqi.png",
  RAKUN: "/assets/rakun.png",
  ILCFNBR: "/assets/ilcfnbr.png",
  DWS: "/assets/dws.png",
  KENSEI: "/assets/kensei.png",
  NERD: "/assets/nerd.png",
  CHICK: "/assets/chick.png",
  SDS: "/assets/shidoshi.png",
  BUSHIDO: "/assets/bushido.png",
  HODLJEET: "/assets/hodljeet.png",
  BOOBIES: "/assets/boobies.png",
  MSMoon: "/assets/msmoon.png",
  MSMOON: "/assets/msmoon.png",
  KSN: "/assets/kitsune.png",
  KITSUNE: "/assets/kitsune.png",
  SALT: "/assets/salt.png",
  IPN: "/assets/ippon.png",
  DESHI: "/assets/deshi.png",
  CHILL: "/assets/chillcat.png",
  NINJA: "/assets/ninja.png",
  MANGA: "/assets/manga.png",
  sASTER: "/assets/saster.png",
  SASTER: "/assets/saster.png",
  MYCROFT: "/assets/mycroft.png",
  BB: "/assets/bb.png",
  BOOJO: "/assets/boojo.png",
  PCOFFEE: "/assets/premcoffee.png",
  NGEN: "/assets/nanogen.png",
  GNUS: "/assets/gnus.png",
  QBN: "/assets/qbn.png",
  "0XDED": "/assets/0xdead.png",
  SHIDOCOFFEE: "/assets/shidocoffee.png",
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

