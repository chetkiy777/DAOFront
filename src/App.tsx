import './App.css'
import {createAppKit} from "@reown/appkit";

import {wagmiAdapter} from "./config";
import {generalConfig} from "./config/appConfig";
import {AppKitProvider} from "./utils/AppKitProvider";
import {Dashboard} from "./components/Dashboard/Dashboard";

// const ERC20_ABI = [
//     "function transfer(address to, uint256 amount) returns (bool)",
// ]

createAppKit({
    adapters: [wagmiAdapter],
    ...generalConfig
})

function App() {

    return (
        <div className={"app-container"}>
            <AppKitProvider>
                <Dashboard />
            </AppKitProvider>
        </div>
    )
}

export default App
