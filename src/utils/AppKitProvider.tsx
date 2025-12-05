import {WagmiProvider} from "wagmi";
import {wagmiAdapter} from "../config";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "../config/appConfig";

export function AppKitProvider({children}: {children: React.ReactNode}) {
    return(
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}
