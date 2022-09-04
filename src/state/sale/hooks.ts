import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { OrderWrapper } from "types/orders";
import { updateAction, updateOrder } from "./actions";
import { SaleAction } from "./reducer";



export function useSaleAction(): SaleAction | null {
    const state = useAppSelector((state) => state.sale)
    return state.action
}

export function useSaleOrder(): OrderWrapper | null {
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

export function useSaleOrderManager(): [OrderWrapper | null, (newOrder: OrderWrapper | null) => void] {
    const dispatch = useAppDispatch()
    const order = useSaleOrder()

    const setAction = useCallback(
        (newOrder: OrderWrapper | null) => {
            dispatch(updateOrder({ order: newOrder }))
        },
        [dispatch]
    )

    return [order, setAction]
}