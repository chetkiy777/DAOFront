// src/hooks/useVoteOnProposal.ts

import {useChainId, useWriteContract} from 'wagmi';
import { CONTRACTS, getContractInfo } from '../contracts';
import {savePendingTx} from "../helpers/txStorage.ts";
import toast from "react-hot-toast";
import {useRef} from "react";


interface useVoteProposalsReturn {
    vote: ({id, support}: {id: string, support: boolean}) => Promise<undefined | null>;
    txHash?: string | undefined;
    isSigning: boolean;
    error: unknown | null;
}


export function useVoteOnProposal(): useVoteProposalsReturn {
    const contractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT);

    const { data: hash, error: writeError, isPending: isSigning, writeContractAsync } = useWriteContract();

    const chainId = useChainId();
    const toastIdRef = useRef<string>("vote-proposal");

    const action = 'vote';

    async function vote({ id, support }: { id: string; support: boolean }) {
        try {
            toast.loading("Sign the transaction in your wallet…", { id: toastIdRef.current });

            const txHash = await writeContractAsync({
                address: contractInfo.address as `0x${string}`,
                abi: contractInfo.abi,
                functionName: action,
                args: [id, support],
            });
            if (txHash) {
                savePendingTx({
                    hash: txHash,
                    chainId,
                    contract: contractInfo.address as string,
                    tag: action,
                    timestamp: Date.now(),
                });

                toast.dismiss(toastIdRef.current)
            }
        } catch (error: any) {
            console.error(error)
            // Do not remove from storage here; could be pending or replaced. Let a restore sweep handle it.
            toast.error(error?.shortMessage || error?.message || "Failed to submit proposal", {
                id: toastIdRef.current,
            });
            return null;
        }
    }

    return {
        vote,
        txHash: hash,
        isSigning,
        error: writeError || null,
    };
}