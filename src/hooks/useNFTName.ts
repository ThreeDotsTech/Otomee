import { BigNumber } from "ethers"
import { useMemo } from "react"
import { useSingleCallResult } from "state/multicall/hooks"
import { useERC721Contract } from "./useContract"

export function useERC721Data(
    contractAddress: string | undefined,
): { name?: string | undefined ; supply?: BigNumber; loading: boolean } {
    const contract = useERC721Contract(contractAddress)
    const name = useSingleCallResult(contract, 'name') //TODO SetNeverReload
    const supply = useSingleCallResult(contract, 'totalSupply')
    return useMemo(
        () => ({
            name: name.result?.[0],
            supply: supply.result?.[0],
            loading: name.loading || supply.loading
        }),
        [name.loading, name.result, supply.loading, supply.result]
    )
}