import { configureStore, Reducer, AnyAction } from '@reduxjs/toolkit'
import rowSelection from './slice/rowSelection'

const store = configureStore({
    reducer: {
        rowSelection: rowSelection,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
