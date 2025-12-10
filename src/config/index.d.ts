import { AppKitNetwork } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
export declare const projectId: any;
export declare const metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
};
export declare const networks: [AppKitNetwork, ...AppKitNetwork[]];
export declare const wagmiAdapter: WagmiAdapter;
