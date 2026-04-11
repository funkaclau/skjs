/**
 * Collection banner images shipped inside skjs (`src/config/assets/nftCollections`).
 * Import paths are resolved by the consuming app’s bundler (Vite, webpack, etc.) to real asset URLs.
 */
import ccUrl from "./assets/nftCollections/cc.png";
import deadUrl from "./assets/nftCollections/dead.png";
import mangoUrl from "./assets/nftCollections/mango.png";
import nerdOperationsUrl from "./assets/nftCollections/nerdOps.jpg";
import ptfoundersUrl from "./assets/nftCollections/ptfounders.jpg";
import shidoshiUrl from "./assets/nftCollections/shidoshi.png";
import trashUrl from "./assets/nftCollections/trash.png";
import pixeltycoons1155Url from "./assets/nftCollections/pixeltycoons.jpg";

const L = (a) => String(a).toLowerCase();

/** @type {Map<string, string>} */
const BANNER_BY_ADDRESS_LOWER = new Map(
  [
    ["0xb0b228476fa26140e6c8d04d437cd38f47003fcc", ptfoundersUrl],
    ["0x5782fdaa53bab4625b2abf51ae73eb6228bf6ec8", shidoshiUrl],
    ["0xdca08690defa9bbbb0fa21103a5f9e10b545e613", trashUrl],
    ["0x4d39eac5e30a1f5559094a6afffe7b232055e632", deadUrl],
    ["0x5deeaaec8b51e80c2fee451bc4dc014e91f9ad4c", ccUrl],
    ["0xd79d58c8e02957add6ee40173db2a3488749d7cd", mangoUrl],
    ["0xcb5004f97de6734819b56a2f413c73d82632f0b2", mangoUrl],
    ["0x8782c1130fec668724c700380e1dade9b54f37d7", nerdOperationsUrl],
    ["0xF8Df8d12024B1f8fA0578Ae166534165EAF87a9C".toLowerCase(), pixeltycoons1155Url],
  ]
);

/**
 * Bundler-resolved banner URL for a collection contract, or null if none is shipped in skjs.
 * @param {string | null | undefined} address
 * @returns {string | null}
 */
export function getBundledNftCollectionBannerUrl(address) {
  if (address == null || address === "") return null;
  return BANNER_BY_ADDRESS_LOWER.get(L(address)) ?? null;
}
