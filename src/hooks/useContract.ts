import { Contract } from '@ethersproject/contracts'
import ARGENT_WALLET_DETECTOR_ABI from 'abis/argent-wallet-detector.json'
import EIP_2612 from 'abis/eip_2612.json'
import ENS_PUBLIC_RESOLVER_ABI from 'abis/ens-public-resolver.json'
import ENS_ABI from 'abis/ens-registrar.json'
import ERC20_ABI from 'abis/erc20.json'
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json'
import ERC721_ABI from 'abis/erc721.json'
import ERC1155_ABI from 'abis/erc1155.json'
import ERC165_ABI from 'abis/erc165.json'
import WETH_ABI from 'abis/weth.json'
import REGISTRY_ABI from 'abis/otomee-registry.json'
import EXCHANGE_ABI from 'abis/otomee-exchange.json'
import ATOMIZICER_ABI from 'abis/otomee-atomicizer.json'
import STATIC_ABI from 'abis/otomee-static.json'

import MulticallABI from 'abis/uniswap-Interface-multicall.json'
import {
  ARGENT_WALLET_DETECTOR_ADDRESS,
  ENS_REGISTRAR_ADDRESSES,
  MULTICALL_ADDRESS,
  OTOMEE_REGISTRY_ADDRESSES,
  OTOMEE_EXCHANGE_ADDRESSES,
  OTOMEE_ATOMIZICER_ADDRESSES,
  OTOMEE_STATIC_ADDRESSES
} from '../constants/addresses'
import { useMemo } from 'react'
import { getContract } from '../utils'

import { ArgentWalletDetector, EnsPublicResolver, EnsRegistrar, Erc20, Erc721, Erc1155, Weth, UniswapInterfaceMulticall, Erc165, OtomeeRegistry, OtomeeExchange, OtomeeAtomicizer, OtomeeStatic } from '../abis/types'
import { useActiveWeb3React } from './web3'


// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}


export function useERC20Contract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  return useContract<Weth>(undefined, WETH_ABI, withSignerIfPossible)
}

export function useERC721Contract(nftAddress?: string) {
  return useContract<Erc721>(nftAddress, ERC721_ABI, true)
}

export function useERC1155Contract(nftAddress?: string) {
  return useContract<Erc1155>(nftAddress, ERC1155_ABI, false)
}

export function useArgentWalletDetectorContract() {
  return useContract<ArgentWalletDetector>(ARGENT_WALLET_DETECTOR_ADDRESS, ARGENT_WALLET_DETECTOR_ABI, false)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean) {
  return useContract<EnsRegistrar>(ENS_REGISTRAR_ADDRESSES, ENS_ABI, withSignerIfPossible)
}

export function useOtomeeRegistryContract(withSignerIfPossible?: boolean) {
  return useContract<OtomeeRegistry>(OTOMEE_REGISTRY_ADDRESSES, REGISTRY_ABI, withSignerIfPossible)
}

export function useOtomeeExchangeContract(withSignerIfPossible?: boolean) {
  return useContract<OtomeeExchange>(OTOMEE_EXCHANGE_ADDRESSES, EXCHANGE_ABI, withSignerIfPossible)
}

export function useOtomeeAtomizicerContract(withSignerIfPossible?: boolean) {
  return useContract<OtomeeAtomicizer>(OTOMEE_ATOMIZICER_ADDRESSES, ATOMIZICER_ABI, withSignerIfPossible)
}

export function useOtomeeStaticContract(withSignerIfPossible?: boolean) {
  return useContract<OtomeeStatic>(OTOMEE_STATIC_ADDRESSES, ATOMIZICER_ABI, withSignerIfPossible)
}


export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
  return useContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}


export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612, false)
}

export function useERC165Contract(address: string) {
  return useContract<Erc165>(address, ERC165_ABI, false)
}

export function useMulticall2Contract() {
  return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESS, MulticallABI, false) as UniswapInterfaceMulticall
}