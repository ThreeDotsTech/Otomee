import { SupportedNFTInterfaces } from "constants/ERC165";
import { useMemo } from "react";
import { useSingleCallResult, useSingleContractMultipleData } from "state/multicall/hooks";
import { useERC165Contract } from "./useContract";

export function useERC165(address: string, data: SupportedNFTInterfaces[]) {
    const interfaceArgument = useMemo(() => (data.map((identifier) => [identifier])), [data])
    const erc165Contract = useERC165Contract(address)
    return useSingleContractMultipleData(erc165Contract, 'supportsInterface', interfaceArgument)
}