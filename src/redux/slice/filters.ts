import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Status } from '../../data/fetchData'
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
            state.status = action.payload.map(s => s.trim()) as Status[]
        },

        reset: state => {
            state.age = 'ALL'
            state.status = Object.values(Status)
        },
    },
})

export const { filterByAge, filterByStatuses, reset } = filters.actions

export default filters.reducer
