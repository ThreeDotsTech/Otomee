import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'


// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  if (parsed == AddressZero) return 'THE VOID'
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// account is not optional
function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isOdd(num: number) { return num % 2; }

export function isToday(someDate: Date) {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

export function ArrayToNumber(array:Uint8Array) {
  
  const buffer = Buffer.from(array);
  const hex:string[] = []
  buffer.forEach(function (i) {
    let h = i.toString(16);
    if (h.length % 2) { h = '0' + h; }
    hex.push(h);
  })
 
  const result =  BigNumber.from('0x' + hex.join(''));

  return result;
}