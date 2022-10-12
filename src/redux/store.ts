import { configureStore, Reducer, AnyAction } from '@reduxjs/toolkit'
import columnSorting from './slice/columnSorting'
import filters from './slice/filters'
import rowSelection from './slice/rowSelection'

const store = configureStore({
    reducer: {
        rowSelection: rowSelection,
        columnSorting: columnSorting,
        filters: filters,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
