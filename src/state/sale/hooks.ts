import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { OrderWrapperInterface } from "stateswap/orders/types";
import { updateAction, updateOrder } from "./actions";
import { SaleAction } from "./reducer";



export function useSaleAction(): SaleAction | null {
    const state = useAppSelector((state) => state.sale)
    return state.action
}

export function useSaleOrder(): OrderWrapperInterface | null {
    const state = useAppSelector((state) => state.sale)
    return state.order
}

export function useSaleActionManager(): [SaleAction | null, (newAction: SaleAction | null) => void] {
    const dispatch = useAppDispatch()
    const action = useSaleAction()

    const setAction = useCallback(
        (newAction: SaleAction | null) => {
            dispatch(updateAction({ action: newAction }))
        },
        [dispatch]
    )

    return [action, setAction]
}

export function useSaleOrderManager(): [OrderWrapperInterface | null, (newOrder: OrderWrapperInterface | null) => void] {
    const dispatch = useAppDispatch()
    const order = useSaleOrder()

    const setAction = useCallback(
        (newOrder: OrderWrapperInterface | null) => {
            dispatch(updateOrder({ order: newOrder }))
        },
        [dispatch]
    )

    return [order, setAction]
}