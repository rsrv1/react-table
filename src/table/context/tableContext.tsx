import React from 'react'
import RequestReducer, { actions as requestActions, actionType, state as requestState } from './reducer/request'
import ColumnSortReducer, { actions as columnSortActions, state as columnSortState, sortDirection } from './reducer/columnSort'
import RowSelectionReducer, {
    initialState as initialRowSelectionState,
    actions as rowSelectionActions,
    state as rowSelectionState,
} from './reducer/rowSelection'
import { useRouter } from 'next/router'

export type TableContext = {
    request: { state: requestState; dispatch: React.Dispatch<requestActions> }
    columnSort: { state: columnSortState; dispatch: React.Dispatch<columnSortActions> }
    rowSelection: { state: rowSelectionState; dispatch: React.Dispatch<rowSelectionActions> }
}

export type TableProviderProps = {
    children: React.ReactNode
}

const TableContext = React.createContext<TableContext | undefined>(undefined)

function TableProvider({ children }: TableProviderProps) {
    const router = useRouter()

    const { search = '', sort } = router.query as { search?: string; sort?: string }
    const sortColumns = sort
        ? (router.query?.sort as string).split(',').reduce(
              (acc, col) =>
                  Object.assign(acc, {
                      [col.replace(/^-/, '')]: col.startsWith('-') ? sortDirection.DESC : sortDirection.ASC,
                  }),
              {}
          )
        : {}

    const [requestState, requestDispatch] = React.useReducer(RequestReducer, {
        loading: false,
        lastSearchTerm: '',
        searchTerm: search,
        columnRePositioning: false,
    })

    const [columnSortState, columnSortDispatch] = React.useReducer(ColumnSortReducer, {
        column: sortColumns,
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
