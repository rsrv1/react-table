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

export type TableProviderProps = {
    children: React.ReactNode
    search?: string
    sort?: {
        [k: string]: sortDirection
    }
    page?: number
    perPage?: number
}

const TableContext = React.createContext<TableContext | undefined>(undefined)

const DEFAULT_PERPAGE = 10

function TableProvider({ children, search, sort, page, perPage }: TableProviderProps) {
    const [requestState, requestDispatch] = React.useReducer(RequestReducer, {
        loading: false,
        lastSearchTerm: '',
        searchTerm: search ?? '',
        columnRePositioning: false,
        page: page || 0,
        perPage: perPage || DEFAULT_PERPAGE,
    })

    const [columnSortState, columnSortDispatch] = React.useReducer(ColumnSortReducer, {
        column: sort
            ? (Object.keys(sort) as Array<string>)
                  .filter(k => sort[k])
                  .reduce((acc: { [k: string]: sortDirection }, key) => Object.assign({}, acc, { [key]: sort[key] }), {})
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
