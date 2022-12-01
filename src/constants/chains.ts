export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.MAINNET,
  SupportedChainId.GOERLI
]

export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.GOERLI
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
    docs: 'https://ethereum.org/en/',
    explorer: 'https://etherscan.io/',
    infoLink: 'https://info.otomee.com/#/',
    label: 'Ethereum',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  },
  [SupportedChainId.GOERLI]: {
    docs: 'https://goerli.net/',
    explorer: 'https://goerli.etherscan.io/',
    infoLink: 'https://info.otomee.com/#/',
    label: 'Ethereum (Görli)',
    nativeCurrency: { name: 'Goerli ETH', symbol: 'gorETH', decimals: 18 },
  }
}