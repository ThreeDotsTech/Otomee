import { createAction } from '@reduxjs/toolkit'
import { SupportedLocale } from '../../constants/locales'



export const updateMatchesDarkMode = createAction<{ matchesDarkMode: boolean }>('user/updateMatchesDarkMode')
export const updateUserDarkMode = createAction<{ userDarkMode: boolean }>('user/updateUserDarkMode')
export const updateUserLocale = createAction<{ userLocale: SupportedLocale }>('user/updateUserLocale')
export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline')
