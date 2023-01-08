import { createAction } from '@reduxjs/toolkit'
import { OrderWrapperInterface } from 'stateswap/orders/types'
import { NftInterface } from 'types/nft'
import { OrderIntention } from './reducer'

export const updateOrderIntention = createAction<{ orderIntention: OrderIntention | null }>('sale/updateOrderIntention')
export const updateOrder = createAction<{ order: OrderWrapperInterface | null }>('sale/updateOrder')
export const updateNFT = createAction<{ nft: NftInterface | null }>('sale/updateNFT')
