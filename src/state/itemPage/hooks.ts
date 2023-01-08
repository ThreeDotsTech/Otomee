import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { OrderWrapperInterface } from "stateswap/orders/types";
import { NftInterface } from "types/nft";
import { updateOrderIntention, updateOrder, updateNFT } from "./actions";
import { OrderIntention } from "./reducer";



export function useItemPageOrderIntention(): OrderIntention | null {
    const state = useAppSelector((state) => state.itemPage)
    return state.OrderIntention
}

export function useItemPageOrder(): OrderWrapperInterface | null {
    const state = useAppSelector((state) => state.itemPage)
    return state.order
}

export function useItemPageNFT(): NftInterface | null {
    const state = useAppSelector((state) => state.itemPage)
    return state.nft
}

export function useItemPageOrderIntentionManager(): [OrderIntention | null, (newAction: OrderIntention | null) => void] {
    const dispatch = useAppDispatch()
    const orderIntention = useItemPageOrderIntention()

    const setAction = useCallback(
        (newAction: OrderIntention | null) => {
            dispatch(updateOrderIntention({ orderIntention: newAction }))
        },
        [dispatch]
    )

    return [orderIntention, setAction]
}

export function useItemPageOrderManager(): [OrderWrapperInterface | null, (newOrder: OrderWrapperInterface | null) => void] {
    const dispatch = useAppDispatch()
    const order = useItemPageOrder()

    const setAction = useCallback(
        (newOrder: OrderWrapperInterface | null) => {
            dispatch(updateOrder({ order: newOrder }))
        },
        [dispatch]
    )

    return [order, setAction]
}

export function useItemPageNFTrManager(): [NftInterface | null, (newNFT: NftInterface | null) => void] {
    const dispatch = useAppDispatch()
    const nft = useItemPageNFT()

    const setAction = useCallback(
        (newNFT: NftInterface | null) => {
            dispatch(updateNFT({ nft: newNFT }))
        },
        [dispatch]
    )

    return [nft, setAction]
}


