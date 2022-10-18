import React from 'react'
import { PaginationState, Table, ColumnDef } from '@tanstack/react-table'
import useSWR, { SWRResponse } from 'swr'
import { RootState } from '../redux/store'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getSelectedRows, selectAllCurrentPageRows, selectCurrentPageAll, selectedRows } from '../redux/slice/rowSelection'
import useTotalRowSelectionCount from './useTotalRowSelectionCount'
import { getSorted } from '../redux/slice/columnSorting'
import { filtersToString } from '../utils'
import { useTableState } from '../context/tableContext'
import { actionType } from '../context/reducer/request'

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

export type TableData<T> = {
    fetcher: (args: Query) => Promise<Response<T>>
    filters?: {
        [key: string]: unknown | unknown[]
    }
}

function useTableData<T extends { id: string }>({ filters, fetcher }: TableData<T>) {
    const dispatch = useAppDispatch()
    const { request } = useTableState()
    const selectedRows = useAppSelector(getSelectedRows)
    const sort = useAppSelector(getSorted)
    const filter = React.useMemo(() => filtersToString(filters), [filters])
    const { searchTerm, loading } = request.state
    const { all } = useAppSelector((state: RootState) => state.rowSelection)
    const addAllCurrentPageRows = useAppSelector((state: RootState) => state.rowSelection.addAllCurrentPageRows)
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
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
            dispatch(selectCurrentPageAll(dataQuery.data.rows.map((row: T) => row.id)))
            dispatch(selectAllCurrentPageRows(false)) // disable the flag
        }
    }, [addAllCurrentPageRows, dataQuery.data])

    return {
        pagination,
        setPagination,
        pageSize,
        searchTerm,
        rowSelectionCount,
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
