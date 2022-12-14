import React from 'react'
import RequestReducer, { actions as requestActions, actionType, state as requestState } from './reducer/request'
import ColumnSortReducer, { actions as columnSortActions, state as columnSortState, sortDirection } from './reducer/columnSort'
import RowSelectionReducer, {
    initialState as initialRowSelectionState,
    actions as rowSelectionActions,
    state as rowSelectionState,
} from './reducer/rowSelection'

type LoadingContext = {
    loading: boolean
    validating: boolean
}
type SettingsContext = {
    uriQueryPrefix: string
    columnRePositioning: boolean
}
type ResultContext = {
    total: number
}
type DispatcherContext = {
    loading: React.Dispatch<requestActions>
    settings: React.Dispatch<requestActions>
    result: React.Dispatch<requestActions>
    columnSort: React.Dispatch<columnSortActions>
    rowSelection: React.Dispatch<rowSelectionActions>
}

export type TableProviderProps = {
    prefix: string
    children: React.ReactNode
}

const LoadingContext = React.createContext<LoadingContext | undefined>(undefined)
const SettingsContext = React.createContext<SettingsContext | undefined>(undefined)
const ColumnSortContext = React.createContext<columnSortState | undefined>(undefined)
const RowSelectionContext = React.createContext<rowSelectionState | undefined>(undefined)
const ResultContext = React.createContext<ResultContext | undefined>(undefined)
const DispatcherContext = React.createContext<DispatcherContext | undefined>(undefined)

function TableProvider({ prefix, children }: TableProviderProps) {
    const [requestState, requestDispatch] = React.useReducer(RequestReducer, {
        loading: false,
        validating: false,
        columnRePositioning: false,
        total: 0,
    })

    const [columnSortState, columnSortDispatch] = React.useReducer(ColumnSortReducer, {
        column: {},
    })
    const [rowSelectionState, rowSelectionDispatch] = React.useReducer(RowSelectionReducer, initialRowSelectionState)

    const diapatcherValue = React.useMemo(
        () => ({
            loading: requestDispatch,
            settings: requestDispatch,
            result: requestDispatch,
            columnSort: columnSortDispatch,
            rowSelection: rowSelectionDispatch,
        }),
        []
    )

    const SettingsContextValue = React.useMemo(
        () => ({ uriQueryPrefix: prefix, columnRePositioning: requestState.columnRePositioning }),
        [prefix, requestState.columnRePositioning]
    )

    const resultContextValue = React.useMemo(() => ({ total: requestState.total }), [requestState.total])
    const loadingContextValue = React.useMemo(
        () => ({ loading: requestState.loading, validating: requestState.validating }),
        [requestState.loading, requestState.validating]
    )
    const rowSelectionContextValue = React.useMemo(() => rowSelectionState, [rowSelectionState])
    const columnSortContextValue = React.useMemo(() => ({ column: columnSortState.column }), [columnSortState.column])

    return (
        <DispatcherContext.Provider value={diapatcherValue}>
            <LoadingContext.Provider value={loadingContextValue}>
                <SettingsContext.Provider value={SettingsContextValue}>
                    <ResultContext.Provider value={resultContextValue}>
                        <ColumnSortContext.Provider value={columnSortContextValue}>
                            <RowSelectionContext.Provider value={rowSelectionContextValue}>{children}</RowSelectionContext.Provider>
                        </ColumnSortContext.Provider>
                    </ResultContext.Provider>
                </SettingsContext.Provider>
            </LoadingContext.Provider>
        </DispatcherContext.Provider>
    )
}

function useLoadingState() {
    const loading = React.useContext(LoadingContext)

    if (loading === undefined) {
        throw new Error('useLoadingState should be called within LoadingContext.Provider')
    }

    return loading
}
function useDispatch() {
    const dispatch = React.useContext(DispatcherContext)

    if (dispatch === undefined) {
        throw new Error('useDispatch should be called within DispatcherContext.Provider')
    }

    return dispatch
}
function useSettingsState() {
    const setting = React.useContext(SettingsContext)

    if (setting === undefined) {
        throw new Error('useSettingsState should be called within SettingsContext.Provider')
    }

    return setting
}
function useColumnSortState() {
    const sort = React.useContext(ColumnSortContext)

    if (sort === undefined) {
        throw new Error('useColumnSortState should be called within ColumnSortContext.Provider')
    }

    return sort
}
function useRowSelectionState() {
    const selection = React.useContext(RowSelectionContext)

    if (selection === undefined) {
        throw new Error('useRowSelectionState should be called within RowSelectionContext.Provider')
    }

    return selection
}
function useResultState() {
    const result = React.useContext(ResultContext)

    if (result === undefined) {
        throw new Error('useResultState should be called within ResultContext.Provider')
    }

    return result
}

export { TableProvider, useLoadingState, useDispatch, useSettingsState, useColumnSortState, useRowSelectionState, useResultState }
