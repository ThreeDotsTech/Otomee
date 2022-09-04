import { createAction } from '@reduxjs/toolkit'
import { OrderWrapper } from 'types/orders'
import { SaleAction } from './reducer'

export const updateAction = createAction<{ action: SaleAction | null }>('sale/updateAction')
export const updateOrder = createAction<{ order: OrderWrapper | null }>('sale/updateOrder')

