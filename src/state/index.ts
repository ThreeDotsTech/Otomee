import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import logs from './logs/slice'

import { multicall } from './multicall/instance'
import transactions from './transactions/reducer'
import user from './user/reducer'

import sale from './sale/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    multicall: multicall.reducer,
    logs,
    sale
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false })
      .concat(save({ states: PERSISTED_KEYS, debounce: 1000 })),
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: process.env.NODE_ENV === 'test' }),
})

store.dispatch(updateVersion())

setupListeners(store.dispatch)

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
