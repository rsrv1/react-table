import React from 'react'
import RequestReducer, { intialState as intialRequestState, actions as requestActions, state as requestState } from './reducer/request'

export type TableContext = {
    request: { state: requestState; dispatch: React.Dispatch<requestActions> }
}

export type TableProviderProps = {}

const TableContext = React.createContext<TableContext | undefined>(undefined)

function TableProvider({ children }: { children: React.ReactNode }) {
    const [requestState, requestDispatch] = React.useReducer(RequestReducer, intialRequestState)

    const value = React.useMemo(
        () => ({
            request: { state: requestState, dispatch: requestDispatch },
        }),
        [requestState]
    )

    return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}

function useTableState() {
    const table = React.useContext(TableContext)

    if (table === undefined) {
        throw new Error('useTableState should be called within TableProvider')
    }

    return table
}

export { TableProvider, useTableState }
