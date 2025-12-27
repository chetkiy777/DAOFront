import {useAccount} from "wagmi";
import {useAppKitAccount} from "@reown/appkit/react";
import {useEffect, useRef} from "react";

interface DAPPLayoutProps {
    children: React.ReactNode;
}

export function DAPPLayout({ children }: DAPPLayoutProps) {
    // const { authenticate, isAuthenticated } = useWeb3Auth();
    const { chainId } = useAccount();
    const { address, isConnected } = useAppKitAccount();



    const previousChainId = useRef<number | undefined>(chainId);
    const previousAddress = useRef<string | undefined>(address);

    useEffect(() => {
        // const isSupportedChain = networks.some(net => net.id === chainId);
        //
        // const addressChanged = previousAddress.current !== address;
        // const chainChanged = previousChainId.current !== chainId;

        // if (isSupportedChain &&
        //     isConnected &&
        //     !document.hidden &&
        //     (!address || addressChanged || chainChanged)
        // ) {
        //     authenticate().then(res => {
        //         console.log(res);
        //     })
        // }

        previousChainId.current = chainId;
        previousAddress.current = address;


    }, [chainId, address, isConnected]);

    return <>
        {children}
    </>
};