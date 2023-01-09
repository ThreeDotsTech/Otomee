import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { OrderWrapperInterface } from "stateswap/orders/types";
import { NftInterface } from "types/nft";
import { updateModalIntention, updateOrder, updateNFT } from "./actions";
import { ModalIntention } from "./reducer";



export function useItemPageModalIntention(): ModalIntention | null {
    const state = useAppSelector((state) => state.itemPage)
    return state.modalIntention
}

export function useItemPageOrder(): OrderWrapperInterface | null {
    const state = useAppSelector((state) => state.itemPage)
    return state.order
}

export function useItemPageNFT(): NftInterface | null {
    const state = useAppSelector((state) => state.itemPage)
    return state.nft
}

export function useItemPageModalIntentionManager(): [ModalIntention | null, (newModalIntention: ModalIntention | null) => void] {
    const dispatch = useAppDispatch()
    const modalIntention = useItemPageModalIntention()

    const setAction = useCallback(
        (newModalIntention: ModalIntention | null) => {
            dispatch(updateModalIntention({ modalIntention: newModalIntention }))
        },
        [dispatch]
    )

    return [modalIntention, setAction]
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


