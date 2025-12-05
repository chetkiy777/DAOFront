// 0. Додати queryClient

import {QueryClient} from "@tanstack/react-query";
import {networks, metadata, projectId} from "../config";

export const queryClient = new QueryClient()

// 2. Додати generalConfig який буде використаний у createAppKit.
// Ці налаштування будуть застосовані глобально до AppKit.
export const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'light' as const,
  themeVariables: {
	'--w3m-accent': '#000000',
  }
}
