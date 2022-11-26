import { createAction } from '@reduxjs/toolkit'
import { OrderWrapperInterface } from 'orders/orders'
import { SaleAction } from './reducer'

export const updateAction = createAction<{ action: SaleAction | null }>('sale/updateAction')
export const updateOrder = createAction<{ order: OrderWrapperInterface | null }>('sale/updateOrder')

