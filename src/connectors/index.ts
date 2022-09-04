import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'

import UNISWAP_LOGO_URL from '../assets/svg/logo.svg'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from '../constants/chains'
import getLibrary from '../utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'


export const NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: `https://eth-mainnet.gateway.pokt.network/v1/lb/62218a7249a710003b86c7ea`,
  [SupportedChainId.RINKEBY]: `https://eth-rinkeby.gateway.pokt.network/v1/lb/62218a7249a710003b86c7ea`,
}

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: 1,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})
/*
export const gnosisSafe = new SafeAppConnector()

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  qrcode: true,
})


// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[SupportedChainId.MAINNET],
  appName: 'Uniswap',
  appLogoUrl: UNISWAP_LOGO_URL,
})
*/