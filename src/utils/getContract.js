import {
    //STAKING_ABI, TAG, TOKEN_ABI, BATCH_ABI, stashABI, VAULT_FACTORY_ABI, AUCTION_ABI, 
    NFT_ABI,
    NFT_ENUMERABLE, //CONTRACTS,
    SC_METADATA
} from "../config";

import { IAuctionHouse, IBatchTransfer, IERC20, IStash, ITagBattle, IStakingOG, ITokenFactory, IVaultFactory, IVaultV1, ILaunchpadFactory, INftStakingFactory } from "../models"

export const getTokenSC = async (web3, ca = SC_METADATA.KIDDO.ca) => {
    const kiddo = new IERC20(web3, SC_METADATA.KIDDO.abi, ca);
   
    return kiddo;

};

export const getTagBattle = async (web3) => {
    const tagBattleContract = new ITagBattle(
        web3,
        SC_METADATA.TagBattle.abi,
        SC_METADATA.TagBattle.ca
    );
    const kiddoContractInstance = await getTokenSC(web3);
    return { tagBattleContract, kiddoContractInstance };


};


export const getStakingOG = async (web3) => {
    const stakingContract = new IStakingOG(
        web3,
        SC_METADATA.StakingOG.abi,
        SC_METADATA.StakingOG.ca
    );
    const kiddoContractInstance = await getTokenSC(web3);
    return { stakingContract, kiddoContractInstance };
};

export const getBatchTransfers = async (web3) => {
    const batch = new IBatchTransfer(
        web3, 
        SC_METADATA.BatchShi20.abi,
        SC_METADATA.BatchShi20.ca
    );
    return batch;
};

export const getStash = async (web3) => {
    const stash = new IStash(
        web3,
        SC_METADATA.Stash.abi,
        SC_METADATA.Stash.ca
    );
    return stash;
};

export const getTokenFactoryContract = async (web3) => {

    const stash = new ITokenFactory(
        web3,
        SC_METADATA.TokenFactory.abi,
        SC_METADATA.TokenFactory.ca
    );
    return stash;
};

export const getVaultFactoryContract = async (web3) => {

    const stash = new IVaultFactory(
        web3,
        SC_METADATA.VaultFactory.abi,
        SC_METADATA.VaultFactory.ca
    );
    return stash;
};

export const getVaultV1 = async (web3, ca) => {

    const stash = new IVaultV1(
        web3,
        SC_METADATA.VaultV1.abi,
        ca
    );
    return stash;
};





export const getAHContract = async (web3) => {
    const ah = new IAuctionHouse(web3, SC_METADATA.AH.abi, SC_METADATA.AH.ca);
    return ah;
};

export const getNFTContract = async (web3, contractAddress) => {
    const contract = new web3.eth.Contract(NFT_ABI, contractAddress);

    return contract;
};

export const getEnumerableNFTContract = async (web3, contractAddress) => {
    const contract = new web3.eth.Contract(NFT_ENUMERABLE, contractAddress);

    return contract;
}; 


export const getNftStakingFactoryContract = async (web3) => {
    const contract = new INftStakingFactory(web3, SC_METADATA.NFTStakeFactory.abi, SC_METADATA.NFTStakeFactory.ca)
    return contract;
}; 



export const getNftStakingPool = async (web3, ca) => {
    const contract = new INftStaking(web3, SC_METADATA.NFTStaking.abi, ca)
    return contract;
}; 



export const getLaunchpadFactoryContract = async (web3) => {
    const stash = new ILaunchpadFactory(
        web3,
        SC_METADATA.LaunchpadFactory.abi,
        SC_METADATA.LaunchpadFactory.ca
    );
    return stash;
};