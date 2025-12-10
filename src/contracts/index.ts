import DaoContractABI from './abi/DaoContractABI.json';
import TokenContractABI from './abi/TokenABI.json';

export enum CONTRACTS {
    DAO_CONTRACT,
    TOKEN_CONTRACT,
}

export const CONTRACT_ADDRESSES = {
    [CONTRACTS.DAO_CONTRACT]: import.meta.env.VITE_DAO_CONTRACT,
    [CONTRACTS.TOKEN_CONTRACT]: import.meta.env.VITE_GOV_TOKEN_CONTRACT,
}

export const CONTRACT_ABIS = {
    [CONTRACTS.DAO_CONTRACT]: DaoContractABI,
    [CONTRACTS.TOKEN_CONTRACT]: TokenContractABI,
}


export function getContractInfo(name: keyof typeof CONTRACT_ADDRESSES) {
    return {
        address: CONTRACT_ADDRESSES[name],
        abi: CONTRACT_ABIS[name],
    }
}