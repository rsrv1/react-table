import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Status } from '../../../data/fetchData'
import type { RootState } from '../store'

type initialState = {
    age: number | 'ALL'
    status: Status[]
}

const initialState: initialState = {
    age: 'ALL',
    status: Object.values(Status),
}

export const filters = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filterByAge: (state, action: PayloadAction<initialState['age']>) => {
            state.age = action.payload
        },
        filterByStatuses: (state, action: PayloadAction<initialState['status']>) => {
            state.status = action.payload
        },

        reset: state => {
            state.age = 'ALL'
            state.status = Object.values(Status)
        },
    },
})

export const { filterByAge, filterByStatuses, reset } = filters.actions

export const getFiltered = (state: RootState): string | null => {
    const entries = Object.entries(state.filters)
    if (entries.length === 0) return null

    return entries.map(([key, value]) => (Array.isArray(value) ? `${key}=[${value.join(',')}]` : `${key}=${value}`)).join('&')
}

export default filters.reducer
