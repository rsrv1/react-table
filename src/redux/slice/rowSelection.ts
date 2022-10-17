import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export type KeyedIds = { [key: string]: boolean }

type initialState = {
    all: boolean
    except: KeyedIds

    only: KeyedIds
    addAllCurrentPageRows: boolean
}

const initialState: initialState = {
    all: false,
    except: {},

    only: {},
    addAllCurrentPageRows: false,
}

export const rowSelection = createSlice({
    name: 'rowSelection',
    initialState,
    reducers: {
        selectAll: state => {
            state.all = true
            state.only = {}
            state.except = {}
        },
        selectCurrentPageAll: (state, action: PayloadAction<string[]>) => {
            state.all = false
            state.except = {}

            state.only = action.payload.reduce((acc, id) => Object.assign({}, acc, { [id]: true }), {})
        },
        selectAllCurrentPageRows: (state, action: PayloadAction<boolean>) => {
            state.addAllCurrentPageRows = action.payload
        },

        addToOnly: (state, action: PayloadAction<string>) => {
            state.only[action.payload] = true
        },
        removeFromOnly: (state, action: PayloadAction<string>) => {
            delete state.only[action.payload]
        },

        addToExcept: (state, action: PayloadAction<string>) => {
            state.except[action.payload] = true
        },
        removeFromExcept: (state, action: PayloadAction<string>) => {
            delete state.except[action.payload]
        },

        reset: state => {
            state.all = false
            state.only = {}
            state.except = {}
            state.addAllCurrentPageRows = false
        },
    },
})

export const { selectAll, addToExcept, removeFromExcept, selectCurrentPageAll, addToOnly, removeFromOnly, selectAllCurrentPageRows, reset } =
    rowSelection.actions

type isSelectedGetter = {
    (id: string): boolean
}

export const isSelected = (state: RootState): isSelectedGetter => {
    const { all, only, except } = state.rowSelection

    return (id: string) => {
        if (Object.keys(only).length > 0) {
            return only[id]
        }

        if (all) {
            return !except[id]
        }

        return false
    }
}

type totalSelectionCountGetter = {
    (total: number): number
}
export const selectionCount = (state: RootState): totalSelectionCountGetter => {
    const { all, only, except } = state.rowSelection
    const totalOnly = Object.keys(only).length
    const totalExcept = Object.keys(except).length

    return (total: number) => {
        if (totalOnly) {
            return totalOnly
        }

        if (all) {
            return total - totalExcept
        }

        return 0
    }
}

type selectedAllRows = {
    all: boolean
    except: string[]
}
type selectedSomeRows = {
    ids: string[]
}

export type selectedRows = selectedAllRows | selectedSomeRows

export const getSelectedRows = (state: RootState): selectedRows => {
    const { all, only, except } = state.rowSelection
    const allOnly = Object.keys(only)

    if (all) {
        return { all: true, except: Object.keys(except) }
    }

    return { ids: allOnly }
}

export default rowSelection.reducer
