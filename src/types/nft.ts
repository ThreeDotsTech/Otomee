import { SupportedNFTInterfaces } from "constants/ERC165"
export enum NftTypes {
    ERC721,
    ERC115,
    UNSUPPORTED_TYPE
}
export interface NftInterface {
    owner: string
    contractAddress: string,
    collectionName: string,
    name: string,
    id: string,
    imageURL: string,
    animationURL: string,
    description: string,
    type: NftTypes,
    attributesList?: any,
    loading: boolean
}