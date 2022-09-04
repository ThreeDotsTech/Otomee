export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.RINKEBY
]

export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.RINKEBY
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

export interface L1ChainInfo {
  readonly blockWaitMsBeforeWarning?: number
  readonly docs: string
  readonly explorer: string
  readonly infoLink: string
  readonly label: string
  readonly logoUrl?: string
  readonly rpcUrls?: string[]
  readonly nativeCurrency: {
    name: string // 'Goerli ETH',
    symbol: string // 'gorETH',
    decimals: number //18,
  }
}


export type ChainInfo = { readonly [chainId: number]: L1ChainInfo } &
  { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

export const CHAIN_INFO: ChainInfo = {
  [SupportedChainId.MAINNET]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ethereum',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  [SupportedChainId.RINKEBY]: {
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://rinkeby.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ethereum (Rinkeby)',
    nativeCurrency: { name: 'Rinkeby ETH', symbol: 'rinkETH', decimals: 18 },
  }
}