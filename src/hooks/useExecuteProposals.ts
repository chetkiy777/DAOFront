import {CONTRACTS, getContractInfo} from "../contracts";
import {useChainId, useWriteContract} from "wagmi";
import toast from "react-hot-toast";
import {savePendingTx} from "../helpers/txStorage.ts";

const TOAST_MESSAGE = {
    LOADING: "Sign the transaction in your wallet…",
    ERROR: "Failed to execute proposal",
};

// Note: functionName and args must match the contract's "ExecuteProposal" function signature
const functionName = "executeProposal";

type WriteResult = string | { data?: string; hash?: string; [key: string]: unknown };

interface useExecuteProposalsReturn {
    handleExecuteProposal: (args: unknown[]) => Promise<string | null>;
    txHash?: string | undefined;
    isSigning: boolean;
    error: unknown | null;
}

export const useExecuteProposal = (): useExecuteProposalsReturn => {
    const contractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT);
    const chainId = useChainId();

    const { writeContractAsync, data: txHash, error: writeError, isPending: isSigning } = useWriteContract();

    async function handleExecuteProposal(args: unknown[]): Promise<string | null> {
        try {
            toast.loading(TOAST_MESSAGE.LOADING);

            const result = (await writeContractAsync({
                abi: contractInfo.abi,
                address: contractInfo.address as `0x${string}`,
                functionName,
                args,
            })) as WriteResult;

            let newTxHash: string | null = null;

            if (typeof result === "string") {
                newTxHash = result;
            } else if (result && typeof result.data === "string") {
                newTxHash = result.data;
            } else if (result && typeof result.hash === "string") {
                newTxHash = result.hash;
            }

            if (newTxHash) {
                savePendingTx({
                    hash: newTxHash,
                    chainId,
                    contract: contractInfo.address as string,
                    tag: functionName,
                    timestamp: Date.now(),
                });

                toast.dismiss();
                console.log("hash", newTxHash);
                return newTxHash;
            }

            return null;
        } catch (e: unknown) {
            const message =
                e && typeof e === "object" && "message" in e ? String((e as any).message) : TOAST_MESSAGE.ERROR;
            toast.error(message);
            return null;
        }
    }

    return {
        handleExecuteProposal,
        txHash: txHash as unknown as string | undefined,
        isSigning: Boolean(isSigning),
        error: writeError ?? null,
    };
};
