
export const NetworkContextName = 'NETWORK'
export const IS_IN_IFRAME = window.parent !== window
// transaction popup dismisal amounts
export const DEFAULT_TXN_DISMISS_MS = 25000
// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30
export const DEFAULT_ENS_METADATA_URL_PREFIX = 'https://metadata.ens.domains/mainnet/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85/'
export const OPENSEA_METADATA_API_URL_PREFIX = 'https://api.opensea.io/api/v1/metadata/'
export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const NULL_SIG = {v: 27, r: ZERO_BYTES32, s: ZERO_BYTES32}