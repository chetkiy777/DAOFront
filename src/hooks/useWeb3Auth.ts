import {useCallback, useState} from "react";
import {useAccount, useSignMessage} from "wagmi";
import toast from "react-hot-toast";
import {getAuth, verify} from "../services/api.ts";
import {ethers} from "ethers";
import {SiweMessage} from "siwe";

const MESSAGES = {
    LOADING: 'Authenticating...',
    SUCCESS: 'Authenticated',
    WAITING: 'Waiting for signature...',
    REJECTED: 'Signature rejected or failed',
    FAILED: 'Failed to authenticate',
}

export async function signMessageWithEthers(message: string): Promise<string> {
    if (typeof window === "undefined" || !window?.ethereum) {
        throw new Error('No injected ethereum provider found');
    }
    // @ts-ignore
    const provider = new ethers.BrowserProvider(window?.ethereum);
    const signer = await provider.getSigner();
    return signer.signMessage(message)
}

export function useWeb3Auth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const { address , isConnected, chainId } = useAccount();
    const { signMessageAsync } = useSignMessage();


    const authenticate = useCallback(async () => {
        if(!address || !isConnected) return false;
        setLoading(true);

        try {
            const nonce = await getAuth();


            const message = new SiweMessage({
                address,
                nonce
            });


            try {
                const signature = await signMessageWithEthers(message.prepareMessage());

                const data = {
                    address,
                    signature,
                    nonce
                };

                const verifyResult = await verify(data);

                if (verifyResult && verifyResult.success === true) {
                    toast.success(verifyResult.message);
                    setIsAuthenticated(true);
                    return true;
                }

            } catch (e: any) {
                toast.error(e.message ?? MESSAGES.FAILED);
                setLoading(false);
                return false;
            }


            //         const message = new SiweMessage({
            //             domain: document.location.host,
            //             address,
            //             chainId,
            //             uri: document.location.origin,
            //             version: '1',
            //             statement: 'Sign in with Ethereum to the app.',
            //             nonce,
            //         });
            //
            //         let signature: string = "";
        } catch(e: any) {
            toast.error(e.message ?? MESSAGES.FAILED);
            setLoading(false);
            return false;
        }

    }, [isConnected, chainId, address, signMessageAsync]);



    return {
        authenticate,
        isAuthenticated,
        loading,
    };
}