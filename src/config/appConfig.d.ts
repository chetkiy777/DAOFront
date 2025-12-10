import { QueryClient } from "@tanstack/react-query";
export declare const queryClient: QueryClient;
export declare const generalConfig: {
    projectId: any;
    networks: [import("@reown/appkit-common").AppKitNetwork, ...import("@reown/appkit-common").AppKitNetwork[]];
    metadata: {
        name: string;
        description: string;
        url: string;
        icons: string[];
    };
    themeMode: "light";
    themeVariables: {
        '--w3m-accent': string;
    };
};
