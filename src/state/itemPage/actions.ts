import { createAction } from '@reduxjs/toolkit'
import { OrderWrapperInterface } from 'stateswap/orders/types'
import { NftInterface } from 'types/nft'
import { ModalIntention } from './reducer'

export const updateModalIntention = createAction<{ modalIntention: ModalIntention | null }>('sale/updateModalIntention')
export const updateOrder = createAction<{ order: OrderWrapperInterface | null }>('sale/updateOrder')
export const updateNFT = createAction<{ nft: NftInterface | null }>('sale/updateNFT')
