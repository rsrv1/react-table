import { configureStore, Reducer, AnyAction } from '@reduxjs/toolkit'
import columnSorting from './slice/columnSorting'
import filters from './slice/filters'
import request from './slice/request'
import rowSelection from './slice/rowSelection'

const store = configureStore({
    reducer: {
        rowSelection: rowSelection,
        columnSorting: columnSorting,
        filters: filters,
        request: request,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
