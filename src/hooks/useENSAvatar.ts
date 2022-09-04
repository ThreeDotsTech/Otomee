import { namehash } from '@ethersproject/hash'
import { useEffect, useMemo, useState } from 'react'
import { safeNamehash } from '../utils/safeNamehash'
import uriToHttp from '../utils/uriToHttp'

import { useSingleCallResult } from '../state/multicall/hooks'
import { isAddress } from '../utils'
import isZero from '../utils/isZero'
import { useENSRegistrarContract, useENSResolverContract, useERC721Contract, useERC1155Contract } from './useContract'
import useDebounce from './useDebounce'
import useENSName from './useENSName'
import { useERC1155Uri, useERC721Uri } from './useNFTuri'

/**
 * Returns the ENS avatar URI, if available.
 * Spec: https://gist.github.com/Arachnid/9db60bd75277969ee1689c8742b75182.
 */
export default function useENSAvatar(
  address?: string,
  enforceOwnership = false
): { avatar: string | null; loading: boolean } {
  const debouncedAddress = useDebounce(address, 200)
  const node = useMemo(() => {
    if (!debouncedAddress || !isAddress(debouncedAddress)) return undefined
    return namehash(`${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`)
  }, [debouncedAddress])

  const addressAvatar = useAvatarFromNode(node)
  const ENSName = useENSName(address).ENSName
  const nameAvatar = useAvatarFromNode(ENSName === null ? undefined : safeNamehash(ENSName))
  let avatar = addressAvatar.avatar || nameAvatar.avatar

  const nftAvatar = useAvatarFromNFT(avatar, enforceOwnership)
  avatar = nftAvatar.avatar || avatar

  const http = avatar && uriToHttp(avatar)[0]

  const changed = debouncedAddress !== address
  return useMemo(
    () => ({
      avatar: changed ? null : http ?? null,
      loading: changed || addressAvatar.loading || nameAvatar.loading || nftAvatar.loading,
    }),
    [addressAvatar.loading, changed, http, nameAvatar.loading, nftAvatar.loading]
  )
}

function useAvatarFromNode(node?: string): { avatar?: string; loading: boolean } {
  const nodeArgument = useMemo(() => [node], [node])
  const textArgument = useMemo(() => [node, 'avatar'], [node])
  const registrarContract = useENSRegistrarContract(false)
  const resolverAddress = useSingleCallResult(registrarContract, 'resolver', nodeArgument)
  const resolverAddressResult = resolverAddress.result?.[0]
  const resolverContract = useENSResolverContract(
    resolverAddressResult && !isZero(resolverAddressResult) ? resolverAddressResult : undefined,
    false
  )
  const avatar = useSingleCallResult(resolverContract, 'text', textArgument)

  return useMemo(
    () => ({
      avatar: avatar.result?.[0],
      loading: resolverAddress.loading || avatar.loading,
    }),
    [avatar.loading, avatar.result, resolverAddress.loading]
  )
}

function useAvatarFromNFT(nftUri = '', enforceOwnership: boolean): { avatar?: string; loading: boolean } {
  const parts = nftUri.toLowerCase().split(':')
  const protocol = parts[0]
  // ignore the chain from eip155
  // TODO: when we are able, pull only from the specified chain
  const [, erc] = parts[1]?.split('/') ?? []
  const [contractAddress, id] = parts[2]?.split('/') ?? []
  const isERC721 = protocol === 'eip155' && erc === 'erc721'
  const isERC1155 = protocol === 'eip155' && erc === 'erc1155'
  const erc721 = useERC721Uri(isERC721 ? contractAddress : undefined, id, enforceOwnership)
  const erc1155 = useERC1155Uri(isERC1155 ? contractAddress : undefined, id, enforceOwnership)
  const uri = erc721.uri || erc1155.uri
  const http = uri && uriToHttp(uri)[0]

  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState(undefined)
  useEffect(() => {
    setAvatar(undefined)
    if (http) {
      //setLoading(true)
      fetch(http)
        .then(function (res) {
          return res.json()
        })
        .then(({ image, name, image_url }) => {
          image ? setAvatar(image) : setAvatar(image_url)
        })
        .catch(() => fetch('https://proxy.otomee.com/?' + http).then(function (res) { //Try again, this time with proxy
          return res.json()
        })
          .then(({ image, name, image_url }) => {
            image ? setAvatar(image) : setAvatar(image_url)
          })).catch((e) => console.warn(e))

    }
  }, [http])

  return useMemo(
    () => ({ avatar, loading: erc721.loading || erc1155.loading || loading }),
    [avatar, erc1155.loading, erc721.loading, loading]
  )
}

