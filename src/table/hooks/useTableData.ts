import React from 'react'
import { PaginationState, Table, ColumnOrderState } from '@tanstack/react-table'
import useSWR, { SWRResponse } from 'swr'
import useTotalRowSelectionCount from './useTotalRowSelectionCount'
import { filtersToString } from '../utils'
import { useTableState } from '../context/tableContext'
import { actionType } from '../context/reducer/request'
import { getSorted } from '../context/reducer/columnSort'
import { actionType as rowSelectionActionType, getSelectedRows } from '../context/reducer/rowSelection'

export type Response<T> = {
    rows: T[]
    pageCount: number
    total: number
}

export type Query = {
    page: number | string
    perPage: number | string
    search: string
    filter: string | null
    sort?: string
}

export type initialPageState = {
    page?: number
    perPage?: number
}

export type TableData<T> = {
    fetcher: (args: Query) => Promise<Response<T>>
    initialPageState?: initialPageState
    filters?: {
        [key: string]: unknown | unknown[]
    }
}

function useTableData<T extends { id: string }>({ filters, initialPageState, fetcher }: TableData<T>) {
    const { request, columnSort, rowSelection } = useTableState()
    const selectedRows = React.useMemo(() => getSelectedRows(rowSelection.state), [rowSelection.state])
    const sort = React.useMemo(() => getSorted(columnSort.state), [columnSort.state])
    const filter = React.useMemo(() => filtersToString(filters), [filters])
    const { searchTerm, loading, columnRePositioning } = request.state
    const { all, addAllCurrentPageRows } = rowSelection.state
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: initialPageState?.page || 0,
        pageSize: initialPageState?.perPage || 10,
    })

    const fetcherOptions: Query = {
        page: pageIndex,
        perPage: pageSize,
        search: searchTerm,
        sort,
        filter,
    }

    const lastData = React.useRef<Response<T>>({ rows: [], pageCount: 0, total: 0 })

    const dataQuery = useSWR(fetcherOptions, fetcher)

    const rowSelectionCount = useTotalRowSelectionCount<T>(lastData.current)

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    /** keeping the last data as - when SWR fetches the current data becomes undefined (to avoid the flickering) */
    React.useEffect(() => {
        if (dataQuery.data) lastData.current = dataQuery.data
    }, [dataQuery.data])

    /** track loading state */
    React.useEffect(() => {
        if (!dataQuery.data && !dataQuery.error) {
            request.dispatch({ type: actionType.LOADING, payload: true })
            return
        }

        request.dispatch({ type: actionType.LOADING, payload: false })
    }, [dataQuery.data, dataQuery.error])

    /** when a request ends then set the last search term if applicable */
    React.useEffect(() => {
        dataQuery.data && request.dispatch({ type: actionType.STORE_LAST_SEARCH_TERM })
    }, [dataQuery.data])

    /** select all current page rows */
    React.useEffect(() => {
        if (dataQuery.data && addAllCurrentPageRows) {
            rowSelection.dispatch({ type: rowSelectionActionType.SELECT_CURRENT_PAGE, payload: dataQuery.data.rows.map((row: T) => row.id) })
            rowSelection.dispatch({ type: rowSelectionActionType.WANT_CURRENT_PAGE, payload: false }) // disable the flag
        }
    }, [addAllCurrentPageRows, dataQuery.data])

    return {
        pagination,
        setPagination,
        pageSize,
        searchTerm,
        rowSelectionCount,
        isColumnPositioning: columnRePositioning,
        allRowSelected: all,
        selectedRows,
        dataQuery,
        lastData,
        loading,
        filter,
        options: fetcherOptions,
    }
}

export default useTableData
