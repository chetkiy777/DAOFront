
import type {Address} from "viem";
import {useAccount, useBalance} from "wagmi";
import {CONTRACT_ADDRESSES, CONTRACTS} from "../../contracts";


export function BallanceDisplay() {

    const {address} = useAccount();

    const {data: nativeBalance} = useBalance({
        address: address as Address,
    })


    const {data: govToken} = useBalance({
        address: address as Address,
        token: CONTRACT_ADDRESSES[CONTRACTS.TOKEN_CONTRACT]
    })


    return(
        <div style={{width: "100%", display: 'flex', flexDirection: 'column', alignItems: "flex-start", gap: '10px', marginTop: '20px'}}>
            <div>
                <span><strong>Native Ballance</strong>: {nativeBalance ? nativeBalance.formatted : 0}</span>
            </div>

            <div>
                <span><strong>Token Ballance (GIV):</strong> {govToken ? govToken.formatted : 0}</span>
            </div>
        </div>
    )
}