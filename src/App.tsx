import './App.css'
import {createAppKit} from "@reown/appkit";

import {wagmiAdapter} from "./config";
import {generalConfig} from "./config/appConfig";
import {AppKitProvider} from "./utils/AppKitProvider";
import {Dashboard} from "./components/Dashboard/Dashboard";
import {BallanceDisplay} from "./components/BallanceDisplay/BallanceDisplay.tsx";


createAppKit({
    adapters: [wagmiAdapter],
    ...generalConfig
})

function App() {

    return (
        <div className={"app-container"}>
            <AppKitProvider>
                <Dashboard />
                <BallanceDisplay />
            </AppKitProvider>
        </div>
    )
}

export default App
