import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export enum sortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

type initialState = {
    column: {
        [name: string]: sortDirection
    }
}

const initialState: initialState = {
    column: {},
}

export const columnSorting = createSlice({
    name: 'columnSorting',
    initialState,
    reducers: {
        /** takes care of both add & update */
        mutate: (state, action: PayloadAction<{ column: string; direction: sortDirection }>) => {
            state.column[action.payload.column] = action.payload.direction
        },
        remove: (state, action: PayloadAction<string>) => {
            delete state.column[action.payload]
        },

        reset: state => {
            state.column = {}
        },
    },
})

export const { mutate, remove, reset } = columnSorting.actions

export const getSorted = (state: RootState): string => {
    const entries = Object.entries(state.columnSorting.column)
    if (entries.length === 0) return ''

    return entries.map(([col, direction]) => (direction === sortDirection.DESC ? `-${col}` : col)).join(',')
}

export default columnSorting.reducer
