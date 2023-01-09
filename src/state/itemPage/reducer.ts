import { createReducer } from "@reduxjs/toolkit";
import { OrderWrapperInterface } from "stateswap/orders/types";
import { NftInterface } from "types/nft";
import { updateNFT, updateModalIntention, updateOrder } from "./actions";

/**
* State used on the Item page (src\pages\Items\index.tsx)
*/
export interface ItemPageState {
    modalIntention: ModalIntention | null
    order: OrderWrapperInterface | null
    nft: NftInterface | null
}

//Represents what the user wants to do
//with the order
export enum ModalIntention {
    CANCEL,
    MATCH,
    ACCEPT,
    TRANSFER
}

export const initialState: ItemPageState = {
    modalIntention: null,
    order: null,
    nft: null
}

export default createReducer(initialState, (builder) =>
    builder
        .addCase(updateModalIntention, (state, action) => {
            state.modalIntention = action.payload.modalIntention
        })
        .addCase(updateOrder, (state, action) => {
            state.order = action.payload.order
        })
        .addCase(updateNFT, (state, action) => {
            state.nft = action.payload.nft
        })
)