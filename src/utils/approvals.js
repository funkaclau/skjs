// utils/handleApproveAndRun.ts
/* global BigInt */

// approvals.js
export const parseUnits = (val, decimals = 18) => {
  if (typeof val === "bigint") return val;
  if (typeof val === "number") {
    if (!Number.isFinite(val)) throw new Error("Invalid number");
    val = val.toString();
  }
  if (typeof val !== "string") throw new Error("Amount must be string/number/bigint");

  const [i, f = ""] = val.split(".");
  const frac = (f + "0".repeat(decimals)).slice(0, decimals);
  // strip leading zeros for BigInt safety
  const intPart = i.replace(/^0+(?=\d)/, "") || "0";
  const rawStr = intPart + frac;
  return BigInt(rawStr);
};

export const handleApproveAndRunSafe = async ({
  tokenContract,    // REQUIRED: your IERC20 instance (not an address)
  account,
  spender,
  amount,           // human amount as string/number/bigint
  decimals = 18,
  onPreApprove,
  onPostApprove,
  onAction,
  setApproving,
}) => {
  try {
    setApproving?.(true);
    await onPreApprove?.();

    const amountParsed = parseUnits(amount, decimals);

    // web3 often returns decimal strings; normalize to BigInt
    const allowanceStr = await tokenContract.allowance(account, spender);
    const allowance = BigInt(allowanceStr.toString());

    if (allowance < amountParsed) {
      // if your IERC20 wrapper needs sender set, keep this:
      tokenContract.setSender?.(account);
      await tokenContract.approve(spender, amountParsed, account);
    }

    await onPostApprove?.();
    await onAction?.();

    alert("✅ Approved and action completed");
  } catch (err) {
    console.error("❌ handleApproveAndRunSafe failed:", err);
    alert(err?.message || "Approval failed");
  } finally {
    setApproving?.(false);
  }
};

// Web3-native variant: expects a standard web3.eth.Contract ERC20
export const handleApproveAndRunWeb3 = async ({
  tokenContract,    // REQUIRED: web3.eth.Contract for ERC20
  account,
  spender,
  amount,           // human amount as string/number/bigint
  decimals = 18,
  onPreApprove,
  onPostApprove,
  onAction,
  setApproving,
}) => {
  if (!tokenContract || !account || !spender) {
    throw new Error("handleApproveAndRunWeb3: missing tokenContract/account/spender");
  }
  try {
    setApproving?.(true);
    await onPreApprove?.();

    const amountParsed = parseUnits(amount, decimals);

    const allowanceStr = await tokenContract.methods
      .allowance(account, spender)
      .call();
    const allowance = BigInt(allowanceStr.toString());

    if (allowance < amountParsed) {
      const tx = tokenContract.methods.approve(spender, amountParsed.toString());
      await tx.send({ from: account });
    }

    await onPostApprove?.();
    await onAction?.();

    alert("✅ Approved and action completed");
  } catch (err) {
    console.error("❌ handleApproveAndRunWeb3 failed:", err);
    alert(err?.message || "Approval failed");
  } finally {
    setApproving?.(false);
  }
};


export const handleApproveAndRun = async ({
    tokenContract,    // REQUIRED: instance of IERC20
    account,
    spender,
    amount,           // raw number or string (1.25)
    decimals = 18,
    onPreApprove,
    onPostApprove,
    onAction,
    setApproving,
  }) => {
    try {
      if (setApproving) setApproving(true);
      if (onPreApprove) await onPreApprove();

      const amountParsed =
        typeof amount === "bigint"
          ? amount
          : BigInt(Math.floor(Number(amount) * 10 ** decimals));

      //const amountParsed = BigInt(amount * 10 ** decimals);
      console.log("token Contract", tokenContract)
      //tokenContract.setSender(account);
      const allowance = await tokenContract.allowance(account, spender);
      console.log("Allowance: ", allowance, "\nNeeds: ", amountParsed)
      if (allowance < amountParsed) {
        console.log("Needs approval")
        tokenContract.setSender(account)
        await tokenContract.approve(spender, amountParsed, account);
      }
      console.log("Sufficient Allowance")
      if (onPostApprove) await onPostApprove();
      if (onAction) await onAction();
  
      alert("✅ Approved and action completed");
    } catch (err) {
      console.error("❌ handleApproveAndRun failed:", err);
      alert("Approval failed");
    } finally {
      if (setApproving) setApproving(false);
    }
  };
  


  export const handleBidWithApproval = async ({
    tokenContract,      // ✅ Already-instantiated IERC20
    ahContract,         // ✅ Already-instantiated IAuctionHouse (or similar model)
    account,            // ✅ Sender wallet
    auctionId,          // ✅ ID of auction to bid on
    amount,             // ❗ Raw number/string like "1.25"
    tokenDecimals = 18, // 🧮 Needed to convert to wei
    setApproving,       // Optional UI state handler
  }) => {
    if (!tokenContract || !ahContract || !account || !auctionId || !amount) {
      throw new Error("Missing required arguments.");
    }
  
    try {
      if (setApproving) setApproving(true);
  
      const parsedAmount = BigInt(amount * 10 ** tokenDecimals);
  
      // Set sender
      tokenContract.setSender(account);
      ahContract.setSender(account);
  
      // Check current allowance
      const currentAllowance = await tokenContract.allowance(account, ahContract.address);
  
      // Approve only if needed
      if (BigInt(currentAllowance) < parsedAmount) {
        await tokenContract.approve(ahContract.address, parsedAmount);
      }
  
      // Place bid
      await ahContract.placeBid(auctionId, parsedAmount);
  
      alert("✅ Bid placed successfully!");
      return true;
  
    } catch (err) {
      console.error("❌ handleBidWithApproval failed:", err);
      alert("Something went wrong while bidding.");
      return false;
  
    } finally {
      if (setApproving) setApproving(false);
    }
  };