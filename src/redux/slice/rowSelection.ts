import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

type initialState = {
    all: boolean
    except: string[]

    only: string[]
    addAllCurrentPageRows: boolean
}

const initialState: initialState = {
    all: false,
    except: [],

    only: [],
    addAllCurrentPageRows: false,
}

export const rowSelection = createSlice({
    name: 'rowSelection',
    initialState,
    reducers: {
        selectAll: state => {
            state.all = true
            state.only = []
            state.except = []
        },
        selectCurrentPageAll: (state, action: PayloadAction<string[]>) => {
            state.all = false
            state.except = []
            state.only = action.payload
        },
        selectAllCurrentPageRows: (state, action: PayloadAction<boolean>) => {
            state.addAllCurrentPageRows = action.payload
        },

        addToOnly: (state, action: PayloadAction<string>) => {
            state.only = [...state.only, action.payload]
        },
        removeFromOnly: (state, action: PayloadAction<string>) => {
            state.only = state.only.filter(id => id !== action.payload)
        },

        addToExcept: (state, action: PayloadAction<string>) => {
            state.except = [...state.except, action.payload]
        },
        removeFromExcept: (state, action: PayloadAction<string>) => {
            state.except = state.except.filter(id => id !== action.payload)
        },

        reset: state => {
            state.all = false
            state.only = []
            state.except = []
        },
    },
})

export const { selectAll, addToExcept, removeFromExcept, selectCurrentPageAll, addToOnly, removeFromOnly, selectAllCurrentPageRows, reset } =
    rowSelection.actions

interface isSelectedGetter {
    (id: string): boolean
}

export const isSelected = (state: RootState): isSelectedGetter => {
    const { all, only, except } = state.rowSelection

    return (id: string) => {
        if (only.length > 0) {
            return only.includes(id)
        }

        if (all) {
            return !except.includes(id)
        }

        return false
    }
}

export default rowSelection.reducer
