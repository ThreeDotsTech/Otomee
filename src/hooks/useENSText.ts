import { namehash } from '@ethersproject/hash'
import { useMemo } from 'react'
import { safeNamehash } from 'utils/safeNamehash'
import { useSingleCallResult } from '../state/multicall/hooks'
import { isAddress } from '../utils'
import isZero from '../utils/isZero'
import { useENSRegistrarContract, useENSResolverContract } from './useContract'
import useDebounce from './useDebounce'
import useENSName from './useENSName'


export default function useENSText(
    address?: string,
    text?: string
): { text: string | null; loading: boolean } {
    const debouncedAddress = useDebounce(address, 200)
    const node = useMemo(() => {
        if (!debouncedAddress || !isAddress(debouncedAddress)) return undefined
        return namehash(`${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`)
    }, [debouncedAddress])

    const addressText = useTextFromNode(node, text)
    const ENSName = useENSName(address).ENSName
    const nameText = useTextFromNode(ENSName === null ? undefined : safeNamehash(ENSName), text)
    const textResult = addressText.text || nameText.text

    const changed = debouncedAddress !== address

    return useMemo(
        () => ({
            text: changed ? null : textResult ?? null,
            loading: changed || addressText.loading || nameText.loading,
        }),
        [addressText.loading, changed, nameText.loading]
    )

}

function useTextFromNode(node?: string, text?: string): { text?: string; loading: boolean } {
    const nodeArgument = useMemo(() => [node], [node])
    const textArgument = useMemo(() => [node, text], [node])
    const registrarContract = useENSRegistrarContract(false)
    const resolverAddress = useSingleCallResult(registrarContract, 'resolver', nodeArgument)
    const resolverAddressResult = resolverAddress.result?.[0]
    const resolverContract = useENSResolverContract(
        resolverAddressResult && !isZero(resolverAddressResult) ? resolverAddressResult : undefined,
        false
    )

    const textResult = useSingleCallResult(resolverContract, 'text', textArgument)

    return useMemo(
        () => ({
            text: textResult.result?.[0],
            loading: resolverAddress.loading || textResult.loading,
        }),
        [textResult.loading, resolverAddress.loading]
    )
}