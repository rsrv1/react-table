import React from 'react'
import RequestReducer, { actions as requestActions, state as requestState } from './reducer/request'
import ColumnSortReducer, { actions as columnSortActions, state as columnSortState, sortDirection } from './reducer/columnSort'
import RowSelectionReducer, {
    initialState as initialRowSelectionState,
    actions as rowSelectionActions,
    state as rowSelectionState,
} from './reducer/rowSelection'

export type TableContext = {
    request: { state: requestState; dispatch: React.Dispatch<requestActions> }
    columnSort: { state: columnSortState; dispatch: React.Dispatch<columnSortActions> }
    rowSelection: { state: rowSelectionState; dispatch: React.Dispatch<rowSelectionActions> }
}

export type TableProviderProps<T> = {
    children: React.ReactNode
    search?: string
    sort?: {
        [K in keyof T]?: sortDirection
    }
}

const TableContext = React.createContext<TableContext | undefined>(undefined)

function TableProvider<T>({ children, search, sort }: TableProviderProps<T>) {
    const [requestState, requestDispatch] = React.useReducer(RequestReducer, {
        loading: false,
        lastSearchTerm: '',
        searchTerm: search ?? '',
        columnRePositioning: false,
    })
    const [columnSortState, columnSortDispatch] = React.useReducer(ColumnSortReducer, {
        column: sort
            ? Object.keys(sort)
                  .filter(k => sort[k] !== undefined)
                  .reduce((acc: { [K in keyof T]?: sortDirection }, key) => Object.assign({}, acc, { [key]: sort[key] }), {})
            : {},
    })
    const [rowSelectionState, rowSelectionDispatch] = React.useReducer(RowSelectionReducer, initialRowSelectionState)

    const value = React.useMemo(
        () => ({
            request: { state: requestState, dispatch: requestDispatch },
            columnSort: { state: columnSortState, dispatch: columnSortDispatch },
            rowSelection: { state: rowSelectionState, dispatch: rowSelectionDispatch },
        }),
        [requestState, columnSortState, rowSelectionState]
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
