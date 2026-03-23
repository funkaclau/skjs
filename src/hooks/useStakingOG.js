import { useEffect, useState, useCallback } from "react";
import { getStakingOG } from "../utils/getContract";
import { handleApproveAndRun } from "../utils/approvals";
import { SC_METADATA } from "../config";

export const useStakingOG = (web3, account) => {
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [data, setData] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  const isAdmin = (account || "").toLowerCase() === "0x062f444E491016dd87a46009798956C910108E40".toLowerCase();

  const toETH = (val) => web3.utils.fromWei(val.toString(), "ether");

  const fetchGlobalData = useCallback(async () => {
    if (!web3) return;
    try {
      const { stakingContract, kiddoContractInstance } = await getStakingOG(web3);
      setContract(stakingContract);
      setTokenContract(kiddoContractInstance);

      const [
        totalStakedRaw,
        maxStakeableRaw,
        apy,
        startTime,
        endTime,
        rewardPoolRaw,
        accumulatedFeesRaw,
        stakeFeeRaw,
        claimFeeRaw,
        unstakeFeeRaw,
        remainingRaw
      ] = await Promise.all([
        stakingContract.totalStaked(),
        stakingContract.maxStakeable(),
        stakingContract.apy(),
        stakingContract.startTime(),
        stakingContract.endTime(),
        stakingContract.rewardBalance(),
        stakingContract.accumulatedFees(),
        stakingContract.stakeFee(),
        stakingContract.claimFee(),
        stakingContract.unstakeFee(),
        stakingContract.getRemainingRewards(),
      ]);

      const totalStaked = parseFloat(toETH(totalStakedRaw)).toFixed(0);
      const maxStakeable = parseFloat(toETH(maxStakeableRaw)).toFixed(0);

      setData(prev => ({
        ...prev,
        totalStaked,
        maxStakeable,
        apy,
        startTime,
        endTime,
        rewardPool: parseFloat(toETH(rewardPoolRaw)).toFixed(0),
        accumulatedFees: toETH(accumulatedFeesRaw),
        stakeFee: toETH(stakeFeeRaw),
        claimFee: toETH(claimFeeRaw),
        unstakeFee: toETH(unstakeFeeRaw),
        remainingRewards: toETH(remainingRaw),
        stakingHasStarted: parseInt(startTime) <= Math.floor(Date.now() / 1000),
        currentMaxStakeable: (parseFloat(toETH(maxStakeableRaw)) - parseFloat(toETH(totalStakedRaw))).toFixed(0)
      }));
    } catch (err) {
      console.error("Global staking data error", err);
    }
  }, [web3]);

  const fetchUserData = useCallback(async () => {
    if (!account || !web3.utils.isAddress(account) || !contract || !tokenContract) return;
    try {
      const [
        balanceRaw,
        allowanceRaw,
        rewardsRaw,
        userStakeRaw
      ] = await Promise.all([
        tokenContract.balanceOf(account),
        tokenContract.allowance(account, SC_METADATA.StakingOG.ca),
        contract.getClaimableRewards(account),
        contract.stakes(account)
      ]);

      setData(prev => ({
        ...prev,
        userBalance: toETH(balanceRaw),
        allowance: toETH(allowanceRaw),
        claimableRewards: toETH(rewardsRaw),
        userStake: toETH(userStakeRaw.amount)
      }));
    } catch (error) {
      console.error("User staking data error", error);
      setStatusMessage("Failed to fetch user data.");
    }
  }, [web3, account, contract, tokenContract]);

  const handleStake = async (amount) => {
    if (!amount || parseFloat(amount) <= 0) return;
    contract.setSender(account);
    console.log(contract)
    console.log(amount)
    await handleApproveAndRun({
      tokenContract,
      account,
      spender: SC_METADATA.StakingOG.ca,
      amount,
      onAction: async () => {
        await contract.stake(amount);
        fetchUserData();
        setStatusMessage("Tokens staked successfully!");
      }
    });
  };

  const handleClaim = async () => {
    
    contract.setSender(account);
    console.log(contract.getSender())
    try {
        await contract.claimRewards();
        fetchUserData();
        setStatusMessage("Tokens claimed successfully!");
    } catch (err) {
        setStatusMessage("Reward claim failed!");
        alert("Claim Reward Failed!");
        console.log("Claim Reward Failed: ", err);
    }
    
  };

  const handleUnstake = async () => {

    await contract.unstake(account);
    fetchUserData();
    setStatusMessage("Tokens unstaked successfully!");
  };

  const handleAddRewards = async (amount) => {
    
    await handleApproveAndRun({
      web3,
      tokenAddress: tokenContract._address,
      tokenMetadata: { decimals: BigInt(18) },
      account,
      spender: SC_METADATA.StakingOG.ca,
      amount,
      onAction: async () => {
        contract.setSender(account);
        await contract.addRewards(web3.utils.toWei(amount, "ether"));
        fetchUserData();
        setStatusMessage("Rewards added successfully!");
      }
    });
  };

  const handleWithdrawFees = async () => {
    contract.setSender(account);
    await contract.withdrawFees()
    fetchUserData();
    setStatusMessage("Fees withdrawn successfully!");
  };

  const handleWithdrawExcessRewards = async () => {
    contract.setSender(account);
    await contract.withdrawExcessRewards()
    fetchUserData();
    setStatusMessage("Excess rewards withdrawn successfully!");
  };

  useEffect(() => { fetchGlobalData(); }, [fetchGlobalData]);
  useEffect(() => { if (contract && tokenContract && account) fetchUserData(); }, [contract, tokenContract, account, fetchUserData]);

  return {
    contract,
    tokenContract,
    isAdmin,
    statusMessage,
    data,
    fetchGlobalData,
    fetchUserData,
    handleStake,
    handleClaim,
    handleUnstake,
    handleAddRewards,
    handleWithdrawFees,
    handleWithdrawExcessRewards
  };
};
