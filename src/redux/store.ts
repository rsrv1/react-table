import { configureStore } from '@reduxjs/toolkit'
import filters from './slice/filters'

const store = configureStore({
    reducer: {
        filters: filters,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
