import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

type initialState = {
    loading: boolean
}

const initialState: initialState = {
    loading: false,
}

export const request = createSlice({
    name: 'request',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    },
})

export const { setLoading } = request.actions

export default request.reducer
