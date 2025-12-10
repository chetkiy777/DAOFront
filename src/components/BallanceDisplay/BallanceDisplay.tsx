
import type {Address} from "viem";
import {useAccount, useBalance} from "wagmi";
import {CONTRACT_ADDRESSES, CONTRACTS} from "../../contracts";


export function BallanceDisplay() {

    const {address} = useAccount();

    const {data: nativeBalance, refetch: refetchNative} = useBalance({
        address: address as Address,
    })


    const {data: govToken, refetch: refetchGovToken} = useBalance({
        address: address as Address,
        token: CONTRACT_ADDRESSES[CONTRACTS.TOKEN_CONTRACT]
    })


    console.log(nativeBalance);
    console.log(govToken);



    return(
        <>
            <div>
                {nativeBalance && <span>Native Ballance: {nativeBalance.formatted}</span>}
            </div>

            <div>
                {govToken && <span>Token Ballance: {govToken.formatted}</span>}
            </div>
        </>
    )
}