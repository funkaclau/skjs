const ERC165_ABI = [
  {
    constant: true,
    inputs: [{ name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

const ERC721_ID = "0x80ac58cd";
const ERC1155_ID = "0xd9b67a26";

const ERC721_TRANSFER_ABI = [
  {
    constant: false,
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    type: "function",
  },
];

const ERC1155_TRANSFER_ABI = [
  {
    constant: false,
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    type: "function",
  },
];

async function detectNftStandard(web3, collection) {
  const c = new web3.eth.Contract(ERC165_ABI, collection);
  try {
    if (await c.methods.supportsInterface(ERC721_ID).call()) return "ERC721";
  } catch {
    /* ignore */
  }
  try {
    if (await c.methods.supportsInterface(ERC1155_ID).call()) return "ERC1155";
  } catch {
    /* ignore */
  }
  return "ERC721";
}

/**
 * Wallet-signed `safeTransferFrom` for ERC-721 or ERC-1155 (single id).
 * @param {import("web3").default} web3
 * @param {string} account from address
 * @param {string} collection NFT contract
 * @param {string|number|bigint} tokenId
 * @param {string} to recipient
 * @param {string} [amount] ERC-1155 amount (default 1)
 */
export async function transferNft({ web3, account, collection, tokenId, to, amount = "1" }) {
  if (!web3 || !account) throw new Error("Wallet not connected");
  if (!collection) throw new Error("Missing collection");
  if (!to) throw new Error("Missing recipient");
  if (!web3.utils.isAddress(to)) throw new Error("Invalid recipient address");

  const standard = await detectNftStandard(web3, collection);

  if (standard === "ERC1155") {
    const c = new web3.eth.Contract(ERC1155_TRANSFER_ABI, collection);
    return await c.methods
      .safeTransferFrom(account, to, String(tokenId), String(amount), "0x")
      .send({ from: account });
  }

  const c = new web3.eth.Contract(ERC721_TRANSFER_ABI, collection);
  return await c.methods.safeTransferFrom(account, to, String(tokenId)).send({ from: account });
}
