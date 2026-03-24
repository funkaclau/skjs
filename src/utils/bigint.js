// Format amount from smallest unit to readable string (e.g., wei → ETH)
/* global BigInt */
export function formatAmount(value, decimals = 18, { suffix = "" } = {}) {
    try {
        const bn = typeof value === "bigint" ? value : BigInt(value);
        const divisor = 10n ** BigInt(decimals);
        const whole = bn / divisor;
        const fraction = bn % divisor;

        const fractionStr = (fraction * 10_000n / divisor).toString().padStart(4, "0").replace(/0+$/, "");

        const formatted = `${whole}${fractionStr ? "." + fractionStr : ""}`;
        return `${addCommas(formatted)}${suffix ? " " + suffix : ""}`;
    } catch (err) {
        console.error("formatAmount error:", err);
        return "Invalid";
    }
}

// Add commas to a number string
function addCommas(value) {
    const parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

// Convert number/string to BigInt
export const toBI = (number) => {
    if (typeof number === "bigint") return number;
    if (typeof number === "number") return BigInt(Math.floor(number));
    if (typeof number === "string") return BigInt(number.includes('.') ? Math.floor(Number(number)) : number);
    throw new Error("Invalid input to toBI");
};

// Divide two bigints and return float (limited precision)
export const convertBigIntToFloat = (value, decimals = 18) => {
    const divisor = 10n ** BigInt(decimals);
    return Number(value) / Number(divisor);
};

// Calculate required SHIDO amount for purchase cap
export const calculateShidoForMaxPurchase = (maxPerPurchase, rate) => {
    const result = toBI(maxPerPurchase) / toBI(rate);
    return convertBigIntToFloat(result, 18);
};

// Parse float or string amount to WEI bigint
export const parseAmountToWei = (amount, decimals = 18) => {
    if (isNaN(amount) || Number(amount) <= 0) {
        throw new Error("Invalid amount.");
    }

    const [whole, fraction = ""] = amount.toString().split(".");
    const paddedFraction = (fraction + "0".repeat(decimals)).slice(0, decimals);
    return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(paddedFraction);
};

// Format numbers with commas (basic fallback)
export const formatNumberWithCommas = (num) => {
    if (!num) return "0";
    const [i, d] = num.toString().split(".");
    return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (d ? "." + d : "");
};

export const roundHumanBI = (value, decimals = 2) => {
  const num = parseFloat(value || 0);
  if (num === 0) return "0.00";
  const effectiveDecimals = num < 0.01 && decimals < 4 ? 4 : decimals;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: effectiveDecimals,
  }).format(num);
};
