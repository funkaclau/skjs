import { useState, useEffect, useCallback, useReducer } from "react";
import Web3 from "web3";
import { getTagBattle, getTokenSC } from "../utils/getContract.js";
import { initialTagBattleState, tagBattleReducer } from "../reducers";
const KIDDO_TOKEN = "0x2835Ad9a421C14E1C571a5Bb492B86b7E8f5873A";

export function useTagBattleData(web3, account) {
  const [contract, setContract] = useState(null);
  const [kiddoToken, setKiddoToken] = useState(null);
  const [state, dispatch] = useReducer(tagBattleReducer, initialTagBattleState);

  const fetchGlobalData = useCallback(async () => {
    if (!web3) return;

    try {
      const sc_data = await getTagBattle(web3);
      setContract(sc_data.tagBattleContract);
      const myC = sc_data.tagBattleContract;
      const [
        currentMessage,
        totalMessages,
        totalLikes,
        totalKiddoEarned,
        totalShidoEarned,
        creatorSharePercentage,
        shidoFee,
        kiddoFee,
        shidoLikeFee,
        kiddoLikeFee,
        owner,
        cooldownDuration,
        cooldownEndTime,
        currentLikes,
        currentSeason,
        currentSender,
        totalKiddoDistributed,
        totalShidoDistributed,
      ] = await Promise.all([
        myC.currentMessage(),
        myC.totalMessages(),
        myC.totalLikes(),
        myC.totalKiddoEarned(),
        myC.totalShidoEarned(),
        myC.creatorSharePercentage(),
        myC.shidoFee(),
        myC.kiddoFee(),
        myC.likeShidoFee(),
        myC.likeKiddoFee(),
        myC.owner(),
        myC.cooldownDuration(),
        myC.cooldownEndTime(),
        myC.currentLikes(),
        myC.currentSeason(),
        myC.currentSender(),
        myC.totalKiddoDistributed(),
        myC.totalShidoDistributed(),
      ]);

      dispatch({
        currentMessage,
        totalMessages,
        totalLikes,
        totalKiddoEarned,
        totalShidoEarned,
        creatorSharePercentage,
        shidoFee: Web3.utils.fromWei(shidoFee, "ether"),
        kiddoFee: Web3.utils.fromWei(kiddoFee, "ether"),
        shidoLikeFee: Web3.utils.fromWei(shidoLikeFee, "ether"),
        kiddoLikeFee: Web3.utils.fromWei(kiddoLikeFee, "ether"),
        owner,
        cooldownDuration,
        cooldownEndTime,
        currentLikes,
        currentSeason,
        currentSender,
        totalKiddoDistributed: Web3.utils.fromWei(totalKiddoDistributed, "ether"),
        totalShidoDistributed: Web3.utils.fromWei(totalShidoDistributed, "ether"),
      });
      console.log(currentSender)
      const [kiddoLikeEarnings, shidoLikeEarnings, senderLikes, messageCount] = await Promise.all([
        myC.kiddoLikeEarnings(currentSender),
        myC.shidoLikeEarnings(currentSender),
        myC.globalLikesReceived(currentSender),
        myC.messageCount(currentSender),
      ]);

      dispatch({
        kiddoLikeEarnings: Web3.utils.fromWei(kiddoLikeEarnings, "ether"),
        shidoLikeEarnings: Web3.utils.fromWei(shidoLikeEarnings, "ether"),
        senderLikes,
        messageCount,
      });
    } catch (error) {
      console.error("Error fetching global contract data:", error);
    }
  }, [web3]);

  const fetchUserData = useCallback(async () => {
    if (!web3 || !contract || !account) return;
    try {
      const [userLikes, userKiddoLikeEarnings, userShidoLikeEarnings, hasLiked] = await Promise.all([
        contract.globalLikesReceived(account),
        contract.kiddoLikeEarnings(account),
        contract.shidoLikeEarnings(account),
        contract.hasLiked(account),
      ]);

      dispatch({
        userLikes,
        userKiddoLikeEarnings: Web3.utils.fromWei(userKiddoLikeEarnings, "ether"),
        userShidoLikeEarnings: Web3.utils.fromWei(userShidoLikeEarnings, "ether"),
        hasLiked,
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }, [web3, contract, account]);

  const getToken = useCallback(async () => {

    if (!web3) return;
    console.log("Let's Get Token")
    try {
      const kiddoToken = await getTokenSC(web3, KIDDO_TOKEN);
      setKiddoToken(kiddoToken);
    } catch (err) {
      console.error("Error fetching KIDDO:", err);
    }
  }, [getTokenSC, web3, KIDDO_TOKEN]);

  const refresh = async () => {
    await fetchGlobalData();
    await fetchUserData();
  };

  useEffect(() => {
    fetchGlobalData();
  }, [fetchGlobalData]);

  useEffect(() => {
    if (account && contract) {
      fetchUserData();
    }
  }, [account, contract, fetchUserData]);

  useEffect(() => {
    getToken()
  }, [getToken]);

  return {
    state,
    contract,
    refresh,
    kiddoToken
  };
}
