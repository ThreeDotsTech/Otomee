import { OPENSEA_SHARED_STOREFRONT_ADDRESS } from "constants/addresses"
import { OPENSEA_METADATA_API_URL_PREFIX } from "constants/misc"
import { BigNumber } from "ethers"
import { useMemo } from "react"
import { NEVER_RELOAD, useSingleCallResult } from "state/multicall/hooks"
import { useERC1155Contract, useERC721Contract } from "./useContract"

export function useERC721Uri(
    contractAddress: string | undefined,
    id: string | undefined,
    enforceOwnership: boolean
): { uri?: string; loading: boolean; owner?: string } {
    const idArgument = useMemo(() => [id], [id])
    const contract = useERC721Contract(contractAddress)
    const owner = useSingleCallResult(contract, 'ownerOf', idArgument)
    const uri = useSingleCallResult(contract, 'tokenURI', idArgument, NEVER_RELOAD)
    return useMemo(
        () => ({
            uri: !enforceOwnership ? uri.result?.[0] : undefined,
            loading: owner.loading || uri.loading,
            owner: owner.result?.[0]
        }),
        [enforceOwnership, owner.loading, owner.result, uri.loading, uri.result]
    )
}

export function useERC1155Uri(
    contractAddress: string | undefined,
    id: string | undefined,
    enforceOwnership: boolean
): { uri?: string; loading: boolean } {
    const idArgument = useMemo(() => [id], [id])
    const contract = useERC1155Contract(contractAddress)
    const uri = useSingleCallResult(contract, 'uri', idArgument, NEVER_RELOAD)
    return useMemo(
        () => ({
            uri: contractAddress?.toLowerCase() == '0x495f947276749ce646f68ac8c248420045cb7b5e' ?  //Opensea's uri method doesnt work
                OPENSEA_METADATA_API_URL_PREFIX + OPENSEA_SHARED_STOREFRONT_ADDRESS + '/' + id :
                (!enforceOwnership ? uri.result?.[0] : undefined),
            loading: uri.loading,
        }),
        [enforceOwnership, uri.loading, uri.result]
    )
}
