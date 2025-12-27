
export {}; // ensure module scope

declare global {
  interface Window {
	ethereum?: any;
  }
}

export type BalanceType = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}


export type ProposalType = {
    id: string;
    description: string;
    isExecuted: boolean;
    yesVotes: string;
    noVotes: string;
    createdAt: string;
    executedAt: string | null;
}
