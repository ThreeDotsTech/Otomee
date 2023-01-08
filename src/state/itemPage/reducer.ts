import { createReducer } from "@reduxjs/toolkit";
import { OrderWrapperInterface } from "stateswap/orders/types";
import { NftInterface } from "types/nft";
import { updateNFT, updateOrderIntention, updateOrder } from "./actions";

/**
* State used on the Item page (src\pages\Items\index.tsx)
*/
export interface ItemPageState {
    OrderIntention: OrderIntention | null
    order: OrderWrapperInterface | null
    nft: NftInterface | null
}

//Represents what the user wants to do
//with the order
export enum OrderIntention {
    CANCEL,
    MATCH,
    TRANSFER
}

export const initialState: ItemPageState = {
    OrderIntention: null,
    order: null,
    nft: null
}

export default createReducer(initialState, (builder) =>
    builder
        .addCase(updateOrderIntention, (state, action) => {
            state.OrderIntention = action.payload.orderIntention
        })
        .addCase(updateOrder, (state, action) => {
            state.order = action.payload.order
        })
        .addCase(updateNFT, (state, action) => {
            state.nft = action.payload.nft
        })
)