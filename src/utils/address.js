export const shortenAddress = (address, start = 6, end = 4) => {
    if (!address) return "";
    return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Address copied!");
};
