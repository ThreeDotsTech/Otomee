import { Id } from "@reduxjs/toolkit/dist/query/tsHelpers";
import { BannedContracts } from "constants/BannedHotCollections";
import {
    GET_ERC1155_TOKENS_FROM_AN_ACCOUNT,
    GET_ERC1155_TOKENS_FROM_A_CONTRACT,
    GET_ERC721_TOKENS_FROM_AN_ACCOUNT,
    GET_ERC721_TOKENS_FROM_A_CONTRACT,
    GET_EXACT_ERC1155_TOKEN,
    GET_EXACT_ERC721_TOKEN,
    GET_LATEST_ERC1155_TRANSFERS,
    GET_LATEST_ERC721_TRANSFERS,
    GET_NUMBER_OF_ERC721_TRANSFERS_TO_ADDRESS
} from "constants/queries";
import { EIP1155_SUBGRAPH_ENDPOINTS, EIP721_SUBGRAPH_ENDPOINTS } from "constants/subgraphEndpoints";
import { BigNumber } from "ethers";
import { id } from "ethers/lib/utils";
import { stringify } from "querystring";
import { useEffect, useMemo, useState } from "react";
import { Erc1155transfer, Erc721transfer } from "types/queryResponses";
import { CombinedError, OperationContext, useQuery, UseQueryResponse } from "urql";
import { useActiveWeb3React } from "./web3";

export function useGetErc721TokensFromContract(address: string, first: number, skip: number): {
    erc721Data: any,
    erc721Fetching: boolean,
    erc721Error: CombinedError | undefined,
    executeErc721Query: (opts?: Partial<OperationContext> | undefined) => void
} {
    const { chainId } = useActiveWeb3React()

    const [{ data, fetching, error }, executeQuery] = useQuery({
        context: useMemo(() => ({ url: EIP721_SUBGRAPH_ENDPOINTS[chainId ?? 1] }), [chainId]),
        query: GET_ERC721_TOKENS_FROM_A_CONTRACT,
        variables: { address: address.toLowerCase(), first: first, skip: skip }
    });

    return useMemo(() => ({
        erc721Data: data,
        erc721Fetching: fetching,
        erc721Error: error,
        executeErc721Query: executeQuery
    }), [data, fetching, error, executeQuery])
}

export function useGetErc1155TokensFromContract(address: string, first: number, skip: number): {
    erc1155Data: any,
    erc1155Fetching: boolean,
    erc1155Error: CombinedError | undefined,
    executeErc1155Query: (opts?: Partial<OperationContext> | undefined) => void
} {
    const { chainId } = useActiveWeb3React()

    const [{ data, fetching, error }, executeQuery] = useQuery({
        context: useMemo(() => ({ url: EIP1155_SUBGRAPH_ENDPOINTS[chainId ?? 1] }), [chainId]),
        query: GET_ERC1155_TOKENS_FROM_A_CONTRACT,
        variables: { address: address.toLowerCase(), first: first, skip: skip }
    });

    return useMemo(() => ({
        erc1155Data: data,
        erc1155Fetching: fetching,
        erc1155Error: error,
        executeErc1155Query: executeQuery
    }), [data, fetching, error, executeQuery])
}

export function useERC721ExactTokenInfo(address: string, id: string): {
    erc721owner: string | undefined,
    erc721transfers: any | undefined,
    erc721fetching: boolean,
    erc721error: any,
    erc721executeQuery: (opts?: Partial<OperationContext> | undefined) => void
} {
    const { chainId } = useActiveWeb3React()
    const idAsHex = BigNumber.from(id)._hex
    const [result, executeQuery] = useQuery({
        context: useMemo(() => ({ url: EIP721_SUBGRAPH_ENDPOINTS[chainId ?? 1] }), [chainId]),
        query: GET_EXACT_ERC721_TOKEN, variables: { id: (address.toLowerCase() + '/') + idAsHex.replace('0x0', '0x') }
    });
    return useMemo(() => ({
        erc721owner: result.data?.erc721Token?.owner.id ?? undefined,
        erc721transfers: result.data?.erc721Token?.transfers ?? undefined,
        erc721fetching: result.fetching,
        erc721error: result.error,
        erc721executeQuery: executeQuery
    }), [result.data, result.fetching, executeQuery, result.error])
}

export function useERC1155ExactTokenInfo(address: string, id: string): {
    totalSupply: number | undefined,
    erc1155transfers: any | undefined,
    erc1155fetching: boolean,
    erc1155error: any,
    erc1155executeQuery: (opts?: Partial<OperationContext> | undefined) => void
} {
    const { chainId } = useActiveWeb3React()
    const idAsHex = BigNumber.from(id)._hex
    const [result, executeQuery] = useQuery({
        context: useMemo(() => ({ url: EIP1155_SUBGRAPH_ENDPOINTS[chainId ?? 1] }), [chainId]),
        query: GET_EXACT_ERC1155_TOKEN, variables: { id: (address.toLowerCase() + '/') + idAsHex.replace('0x0', '0x') }
    });
    return useMemo(() => ({
        totalSupply: result.data?.erc1155Token?.totalSupply.valueExact ?? undefined,
        erc1155transfers: result.data?.erc1155Token?.transfers ?? undefined,
        erc1155fetching: result.fetching,
        erc1155error: result.error,
        erc1155executeQuery: executeQuery
    }), [result.data, result.fetching, executeQuery, result.error])
}

function useGetErc721TokensFromAccount(address: string, first: number, skip: number): {
    erc721Data: any,
    erc721Fetching: boolean,
    erc721Error: CombinedError | undefined,
    executeErc721Query: (opts?: Partial<OperationContext> | undefined) => void
} {
    const { chainId } = useActiveWeb3React()

    const [{ data, fetching, error }, executeQuery] = useQuery({
        context: useMemo(() => ({ url: EIP721_SUBGRAPH_ENDPOINTS[chainId ?? 1] }), [chainId]),
        query: GET_ERC721_TOKENS_FROM_AN_ACCOUNT,
        variables: { address: address.toLocaleLowerCase(), first: first, skip: skip }
    });

    return useMemo(() => ({
        erc721Data: data,
        erc721Fetching: fetching,
        erc721Error: error,
        executeErc721Query: executeQuery
    }), [data, fetching, error, executeQuery])
}

function useGetErc1155TokensFromAccount(address: string, first: number, skip: number): {
    erc1155Data: any,
    erc1155Fetching: boolean,
    erc1155Error: CombinedError | undefined,
    executeErc1155Query: (opts?: Partial<OperationContext> | undefined) => void
} {
    const { chainId } = useActiveWeb3React()

    const [{ data, fetching, error }, executeQuery] = useQuery({
        context: useMemo(() => ({ url: EIP1155_SUBGRAPH_ENDPOINTS[chainId ?? 1] }), [chainId]),
        query: GET_ERC1155_TOKENS_FROM_AN_ACCOUNT,
        variables: { address: address.toLocaleLowerCase(), first: first, skip: skip }
    });

    return useMemo(() => ({
        erc1155Data: data,
        erc1155Fetching: fetching,
        erc1155Error: error,
        executeErc1155Query: executeQuery
    }), [data, fetching, error, executeQuery])
}

export function useGetNFTsFromContract(address: string, first: number, skip = 0): {
    NFTs: any[],
    fetching: boolean,
    erc721Error: CombinedError | undefined,
    erc1155Error: CombinedError | undefined,
    executeQuery: () => void
} {
    const { erc721Data, erc721Fetching, erc721Error, executeErc721Query } = useGetErc721TokensFromContract(address.toLowerCase(), first, skip)
    const { erc1155Data, erc1155Fetching, erc1155Error, executeErc1155Query } = useGetErc1155TokensFromContract(address.toLowerCase(), first, skip)

    function executeQuery() {
        executeErc721Query({})
        executeErc1155Query()
    }
    return useMemo(() => {
        let erc721Tokens: any[] = []
        let erc1155Balances: any[] = []
        erc721Data?.erc721Tokens && (erc721Tokens = erc721Data.erc721Tokens)
        erc1155Data?.erc1155Tokens && (erc1155Balances = erc1155Data.erc1155Tokens)
        return ({
            NFTs: [...erc721Tokens, ...erc1155Balances],
            fetching: erc721Fetching || erc1155Fetching,
            erc721Error: erc721Error,
            erc1155Error: erc1155Error,
            executeQuery: executeQuery
        })
    }, [erc721Data, erc1155Data, erc721Fetching, erc1155Fetching, erc721Error, erc1155Error, executeErc721Query, executeErc1155Query])
}

export function useGetNFTsFromAccount(address: string, first: number, skip = 0): {
    NFTs: any,
    fetching: boolean,
    erc721Error: CombinedError | undefined,
    erc1155Error: CombinedError | undefined,
    executeQuery: () => void
} {
    const { erc721Data, erc721Fetching, erc721Error, executeErc721Query } = useGetErc721TokensFromAccount(address.toLowerCase(), first, skip)
    const { erc1155Data, erc1155Fetching, erc1155Error, executeErc1155Query } = useGetErc1155TokensFromAccount(address.toLowerCase(), first, skip)

    function executeQuery() {
        executeErc721Query()
        executeErc1155Query()
    }
    return useMemo(() => {
        let erc721Tokens: any[] = []
        let erc1155Balances: any[] = []
        erc721Data && (erc721Tokens = erc721Data.erc721Tokens)
        erc1155Data && (erc1155Balances = erc1155Data.erc1155Balances)
        return ({
            NFTs: [...erc721Tokens, ...erc1155Balances],
            fetching: erc721Fetching || erc1155Fetching,
            erc721Error: erc721Error,
            erc1155Error: erc1155Error,
            executeQuery: executeQuery
        })
    }, [erc721Data, erc1155Data, erc721Fetching, erc1155Fetching, erc721Error, erc1155Error, executeErc721Query, executeErc1155Query])
}

export function useGetExactTokenInfo(address: string, idString: string): {
    is721: boolean,
    is1155: boolean,
    owner: string,
    totalSupply: number,
    transfers: any[],
    fetchingSubgraph: boolean,
    erc721Error: CombinedError | undefined,
    erc1155Error: CombinedError | undefined,
    executeQuery: () => void
} {
    const { erc721owner, erc721transfers, erc721fetching, erc721error, erc721executeQuery } = useERC721ExactTokenInfo(address.toLowerCase(), idString)
    const { totalSupply, erc1155transfers, erc1155fetching, erc1155error, erc1155executeQuery } = useERC1155ExactTokenInfo(address.toLowerCase(), idString)

    function executeQuery() {
        erc721executeQuery()
        erc1155executeQuery()
    }
    return useMemo(() => {
        let _erc721transfers: any[] = []
        let _erc1155transfers: any[] = []
        erc721transfers && (_erc721transfers = erc721transfers)
        erc1155transfers && (_erc1155transfers = erc1155transfers)
        return ({
            is721: erc721owner ? true : false,
            is1155: totalSupply ? true : false,
            owner: erc721owner ?? '',
            totalSupply: totalSupply ?? 1,
            transfers: [..._erc721transfers, ..._erc1155transfers],
            fetchingSubgraph: erc721fetching || erc1155fetching,
            erc721Error: erc721error,
            erc1155Error: erc1155error,
            executeQuery: executeQuery
        })
    }, [erc721owner, totalSupply, erc721transfers, erc1155transfers, erc721fetching, erc1155fetching, erc721error, erc1155error, erc721executeQuery, erc1155executeQuery])
}
export function useGetNumberOfErc721Transfers(from: string, to: string): {
    numberOfErc721Transfers: number | undefined,
    numberOfErc721Transfersfetching: boolean,
    numberOfErc721Transferserror: CombinedError | undefined,
    numberOfErc721TransfersExecuteQuery: () => void,
} {
    const { chainId } = useActiveWeb3React()
    const [{ data, fetching, error }, executeQuery] = useQuery({
        query: GET_NUMBER_OF_ERC721_TRANSFERS_TO_ADDRESS,
        context: useMemo(() => ({ url: EIP721_SUBGRAPH_ENDPOINTS[chainId ?? 1] }), [chainId]),
        variables: { from: from.toLocaleLowerCase(), to: to.toLocaleLowerCase() }
    });

    return useMemo(() => ({
        numberOfErc721Transfers: data?.erc721Transfers.length,
        numberOfErc721Transfersfetching: fetching,
        numberOfErc721Transferserror: error,
        numberOfErc721TransfersExecuteQuery: executeQuery,
    }), [data?.erc721transfers, fetching, error, executeQuery])

}
function useGetLatestErc721Transfers(): {
    erc721transfers: Erc721transfer[] | undefined,
    erc721fetching: boolean,
    erc721error: CombinedError | undefined,
    erc721executeQuery: () => void,
} {
    const { chainId } = useActiveWeb3React()

    const [{ data, fetching, error }, executeQuery] = useQuery({
        query: GET_LATEST_ERC721_TRANSFERS,
        context: useMemo(() => ({ url: EIP721_SUBGRAPH_ENDPOINTS[chainId ?? 1] }), [chainId]),
    });

    return useMemo(() => ({
        erc721transfers: data?.erc1155Transfers,
        erc721fetching: fetching,
        erc721error: error,
        erc721executeQuery: executeQuery,
    }), [data?.erc721transfers, fetching, error, executeQuery])
}

function useGetLatestErc1155Transfers(): {
    erc1155transfers: Erc1155transfer[] | undefined,
    erc1155fetching: boolean,
    erc1155error: CombinedError | undefined,
    erc1155executeQuery: () => void,
} {
    const { chainId } = useActiveWeb3React()

    const [{ data, fetching, error }, executeQuery] = useQuery({
        query: GET_LATEST_ERC1155_TRANSFERS,
        context: useMemo(() => ({ url: EIP1155_SUBGRAPH_ENDPOINTS[chainId ?? 1] }), [chainId]),
    });

    return useMemo(() => ({
        erc1155transfers: data?.erc1155Transfers,
        erc1155fetching: fetching,
        erc1155error: error,
        erc1155executeQuery: executeQuery,
    }), [data?.erc1155transfers, fetching, error, executeQuery])
}

export function useMostPopularCollections(): {
    mostPopular: [string, number][],

    fetching: boolean
} {

    const { erc721transfers, erc721fetching, erc721error } = useGetLatestErc721Transfers()
    const { erc1155transfers, erc1155fetching, erc1155error } = useGetLatestErc1155Transfers()

    const erc721Ocurrences: Map<string, number> = new Map<string, number>()

    if (erc721transfers) {
        for (const contract of erc721transfers) {
            if (!BannedContracts.includes(contract.contract.id)) {
                const occurrences = Number(erc721Ocurrences.get(contract.contract.id))
                erc721Ocurrences.has(contract.contract.id) ? erc721Ocurrences.set(contract.contract.id, occurrences + 1) : erc721Ocurrences.set(contract.contract.id, 1)
            }
        }
    }

    const erc1155Ocurrences: Map<string, number> = new Map<string, number>()

    if (erc1155transfers) {
        for (const contract of erc1155transfers) {
            if (!BannedContracts.includes(contract.contract.id)) {
                const occurrences = Number(erc1155Ocurrences.get(contract.contract.id))
                erc1155Ocurrences.has(contract.contract.id) ? erc1155Ocurrences.set(contract.contract.id, occurrences + 1) : erc1155Ocurrences.set(contract.contract.id, 1)
            }
        }
    }

    const erc721OcurrencesSorted = [...erc721Ocurrences.entries()].sort((a, b) => b[1] - a[1])
    const erc1155OcurrencesSorted = [...erc1155Ocurrences.entries()].sort((a, b) => b[1] - a[1])


    const populaCollections = [...erc721OcurrencesSorted.slice(0, erc721OcurrencesSorted.length >= 10 ? 10 : erc721OcurrencesSorted.length),
    ...erc1155OcurrencesSorted.slice(0, erc1155OcurrencesSorted.length >= 10 ? 10 : erc1155OcurrencesSorted.length)].sort((a, b) => b[1] - a[1])

    return {
        mostPopular: populaCollections.slice(0, populaCollections.length >= 10 ? 10 : populaCollections.length),
        fetching: erc721fetching || erc1155fetching
    }

}