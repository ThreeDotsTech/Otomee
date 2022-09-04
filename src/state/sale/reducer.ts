import { createReducer } from "@reduxjs/toolkit";
import { OrderWrapper } from "types/orders";
import { updateAction, updateOrder } from "./actions";

export enum SaleAction {
    CANCEL,
    MATCH,
    TRANSFER
}
export interface SaleState {
    action: SaleAction | null
    order: OrderWrapper | null
}

export const initialState: SaleState = {
    action: null,
    order: null
}

export default createReducer(initialState, (builder) =>
    builder
        .addCase(updateAction, (state, action) => {
            state.action = action.payload.action
        })
        .addCase(updateOrder, (state, action) => {
            state.order = action.payload.order
        })
)