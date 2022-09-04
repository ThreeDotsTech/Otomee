import { createReducer } from '@reduxjs/toolkit'
import { SupportedLocale } from '../../constants/locales'

import { DEFAULT_DEADLINE_FROM_NOW } from '../../constants/misc'
import { updateVersion } from '../global/actions'
import {
  updateMatchesDarkMode,
  updateUserDarkMode,
  updateUserDeadline,
  updateUserLocale,
} from './actions'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  lastUpdateVersionTimestamp?: number// the timestamp of the last updateVersion action
  matchesDarkMode: boolean // whether the dark mode media query matches
  userDarkMode: boolean | null // the user's choice for dark mode or light mode
  userLocale: SupportedLocale | null
  // deadline set by user in minutes, used in all txns
  userDeadline: number

  timestamp: number
  URLWarningVisible: boolean
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
  matchesDarkMode: false,
  userDarkMode: null,
  userLocale: null,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateVersion, (state) => {
      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (
        typeof state.userDeadline !== 'number' ||
        !Number.isInteger(state.userDeadline) ||
        state.userDeadline < 60 ||
        state.userDeadline > 180 * 60
      ) {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserDarkMode, (state, action) => {
      state.userDarkMode = action.payload.userDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateMatchesDarkMode, (state, action) => {
      state.matchesDarkMode = action.payload.matchesDarkMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserLocale, (state, action) => {
      state.userLocale = action.payload.userLocale
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline
      state.timestamp = currentTimestamp()
    })
)
