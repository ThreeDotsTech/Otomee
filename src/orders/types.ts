import { Signature } from "ethers";
import { BytesLike } from "ethers/lib/utils";

export interface OrderInterface {
    expirationTime: number | undefined
    listingTime: number | undefined
    maker: string | undefined
    maximumFill: number | undefined
    registry: string | undefined
    salt: string | undefined
    staticExtradata: string | undefined
    staticSelector: string | undefined
    staticTarget: string | undefined
}

export interface OrderWrapperInterface {
    call: CallInterface | undefined
    collection: string | undefined
    hash: string | undefined
    maker: string | undefined
    order: OrderInterface | undefined
    price: string | undefined
    signature: Signature | undefined
    target: string | undefined
    type: OrderType | undefined
}

export enum OrderType {
    ERC20_FOR_ERC721,
    ERC20_FOR_ERC1155,
    ERC721_FOR_ERC20,
    ERC1155_FOR_ERC20,
    ERC721_FOR_ETH,
    ERC1155_FOR_ETH,
    ERC721_FOR_ETH_OR_WETH,
    ERC1155_FOR_ETH_OR_WETH
}

export interface CallInterface {
    data: BytesLike
    howToCall: number
    target: string
}