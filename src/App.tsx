import './App.css'
import {createAppKit} from "@reown/appkit";

import {wagmiAdapter} from "./config";
import {generalConfig} from "./config/appConfig";
import {AppKitProvider} from "./utils/AppKitProvider";
import {Dashboard} from "./components/Dashboard/Dashboard";
import {DAPPLayout} from "./layouts/DAPPLayout.tsx";
import {WalletConnection} from "./components/WalletConnection.tsx";


createAppKit({
    adapters: [wagmiAdapter],
    ...generalConfig
})

function App() {

    return (
        <div className={"app-container"}>
            <AppKitProvider>
                <WalletConnection />
                <DAPPLayout>
                    <Dashboard />
                </DAPPLayout>
            </AppKitProvider>
        </div>
    )
}

export default App
