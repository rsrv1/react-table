import React from 'react'
import RequestReducer, { initialState as initialRequestState, actions as requestActions, state as requestState } from './reducer/request'
import ColumnSortReducer, {
    initialState as initialColumnSortState,
    actions as columnSortActions,
    state as columnSortState,
} from './reducer/columnSort'

export type TableContext = {
    request: { state: requestState; dispatch: React.Dispatch<requestActions> }
    columnSort: { state: columnSortState; dispatch: React.Dispatch<columnSortActions> }
}

export type TableProviderProps = {}

const TableContext = React.createContext<TableContext | undefined>(undefined)

function TableProvider({ children }: { children: React.ReactNode }) {
    const [requestState, requestDispatch] = React.useReducer(RequestReducer, initialRequestState)
    const [columnSortState, columnSortDispatch] = React.useReducer(ColumnSortReducer, initialColumnSortState)

    const value = React.useMemo(
        () => ({
            request: { state: requestState, dispatch: requestDispatch },
            columnSort: { state: columnSortState, dispatch: columnSortDispatch },
        }),
        [requestState, columnSortState]
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
