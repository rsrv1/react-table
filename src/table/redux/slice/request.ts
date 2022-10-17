import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

type initialState = {
    loading: boolean
    lastSearchTerm: string
    searchTerm: string
}

const initialState: initialState = {
    loading: false,
    lastSearchTerm: '',
    searchTerm: '',
}

export const request = createSlice({
    name: 'request',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },

        storeLastSearchTerm: state => {
            if (state.lastSearchTerm !== state.searchTerm) state.lastSearchTerm = state.searchTerm
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload.trim()
        },
    },
})

export const { setLoading, storeLastSearchTerm, setSearchTerm } = request.actions

export default request.reducer
