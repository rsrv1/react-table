import React from 'react'
import { PaginationState, Table, ColumnOrderState } from '@tanstack/react-table'
import useSWR, { SWRResponse } from 'swr'
import useTotalRowSelectionCount from './useTotalRowSelectionCount'
import { filtersToString } from '../utils'
import { useTableState } from '../context/tableContext'
import { actionType } from '../context/reducer/request'
import { getSorted, sortDirection, actionType as columnSortActionType, state as columnSortStateType } from '../context/reducer/columnSort'
import { actionType as rowSelectionActionType, getSelectedRows } from '../context/reducer/rowSelection'
import { useRouter } from 'next/router'

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

const DEFAULT_PERPAGE = 10

let initialQueryParamRead = false

function useTableData<T extends { id: string }>({ filters, fetcher }: TableData<T>) {
    const router = useRouter()
    const { request, columnSort, rowSelection } = useTableState()
    const { page = 0, perPage = DEFAULT_PERPAGE } = router.query as { page?: number; perPage?: number }
    const selectedRows = React.useMemo(() => getSelectedRows(rowSelection.state), [rowSelection.state])
    const sort = React.useMemo(() => getSorted(columnSort.state), [columnSort.state])
    const filter = React.useMemo(() => filtersToString(filters), [filters])
    const { searchTerm, loading, columnRePositioning } = request.state
    const { all, addAllCurrentPageRows } = rowSelection.state
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: Number(page),
        pageSize: Number(perPage),
    })

    const fetcherOptions: Query = {
        page: pageIndex,
        perPage: pageSize,
        search: searchTerm,
        sort,
        filter,
    }

    const lastData = React.useRef<Response<T>>({ rows: [], pageCount: 0, total: 0 })

    const dataQuery = useSWR(initialQueryParamRead ? fetcherOptions : null, fetcher)

    const rowSelectionCount = useTotalRowSelectionCount<T>(lastData.current)

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    /** first load set from url params */
    React.useEffect(() => {
        if (initialQueryParamRead) return

        /**set pagination */
        if (router.query?.page || router.query?.perPage) {
            setPagination(({ pageSize, pageIndex }) => ({
                pageSize: router.query?.perPage ? Number(router.query.perPage) : pageSize,
                pageIndex: router.query?.page ? Number(router.query.page) : pageIndex,
            }))
        }

        /**search match with initial router query - effective if hard url reload with query params */
        if (router.query?.search) {
            request.dispatch({ type: actionType.SET_SEARCH_TERM, payload: router.query.search as string })
        }

        /**sorting  match with initial router query - effective if hard url reload with query params */
        if (router.query?.sort) {
            const columns = (router.query?.sort as string).split(',')
            const sorted = columns.reduce(
                (acc, col) =>
                    Object.assign(acc, {
                        [col.replace(/^-/, '')]: col.startsWith('-') ? sortDirection.DESC : sortDirection.ASC,
                    }),
                {}
            )

            columnSort.dispatch({ type: columnSortActionType.BULK_SET, payload: sorted })
        }

        if (Object.keys(router.query).some(item => ['page', 'perPage', 'search', 'sort'].includes(item) || item.startsWith('filter')))
            initialQueryParamRead = true
    }, [router.query])

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
