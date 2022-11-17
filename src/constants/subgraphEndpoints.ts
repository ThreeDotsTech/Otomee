import { SupportedChainId } from './chains'


const REACT_APP_THE_GRAPH_KEY = process.env.REACT_APP_THE_GRAPH_KEY

if (typeof REACT_APP_THE_GRAPH_KEY === 'undefined') {
    throw new Error(`REACT_APP_THE_GRAPH_KEY must be a defined environment variable`)
}

type AddressMap = { [chainId: number]: string }


export const EIP721_SUBGRAPH_ENDPOINTS: AddressMap = {
    [SupportedChainId.MAINNET]: "https://gateway.thegraph.com/api/" + REACT_APP_THE_GRAPH_KEY + "/subgraphs/id/0x7859821024e633c5dc8a4fcf86fc52e7720ce525-0",
    [SupportedChainId.GOERLI]: 'https://api.studio.thegraph.com/query/17044/otomee-eip721-goerli/v0.0.1',
}


export const EIP1155_SUBGRAPH_ENDPOINTS: AddressMap = {
    [SupportedChainId.MAINNET]: "https://gateway.thegraph.com/api/" + REACT_APP_THE_GRAPH_KEY + "/subgraphs/id/0x7859821024e633c5dc8a4fcf86fc52e7720ce525-1",
    [SupportedChainId.GOERLI]: 'https://api.studio.thegraph.com/query/17044/otomee-eip1155-goerli/-v0.0.1',
}