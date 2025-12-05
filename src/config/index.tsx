import {mainnet} from "@reown/appkit/networks";
import {hoodi} from "./customNetworks.js"
import {AppKitNetwork} from "@reown/appkit/networks";
import {WagmiAdapter} from "@reown/appkit-adapter-wagmi";

// 0. Додаємо projectId
export const projectId = import.meta.env.VITE_PROJECT_ID;

// 1. додаємо помилку якщо !projectId

if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not defined in environment variables');
}
// 2. metadata - щоб гаманцю було зрозуміло, хто ти та що саме просиш.
// metadata в AppKit/Web3Modal — це паспорт твого dApp, який летить у гаманець під час конекту
// через WalletConnect/адаптери.
export const metadata = {
  name: 'AppKit',
  description: 'Example',
  url: 'https://reown.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Прописуємо Networks які будемо використовувати
export const networks = [mainnet, hoodi] as [AppKitNetwork, ...AppKitNetwork[]]

// 4. Створити WagmiAdapter і передати в нього projectId та networks

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})
