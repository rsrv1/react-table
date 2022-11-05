import React from 'react'
import { PaginationState, Table, ColumnOrderState } from '@tanstack/react-table'
import useSWR, { SWRResponse } from 'swr'
import useTotalRowSelectionCount from './useTotalRowSelectionCount'
import { useTableState } from '../context/tableContext'
import { actionType } from '../context/reducer/request'
import { getSorted, sortDirection, actionType as columnSortActionType, state as columnSortStateType } from '../context/reducer/columnSort'
import { actionType as rowSelectionActionType, getSelectedRows } from '../context/reducer/rowSelection'
import { useRouter } from 'next/router'
import { routeQueryToColumnsortState } from '../utils'

export type Response<T> = {
    rows: T[]
    pageCount: number
    total: number
}

export type Query = {
    page: number | string
    perPage: number | string
    search: string
    filter: undefined | { [key: string]: unknown | unknown[] }
    sort?: string
}

export type TableData<T> = {
    fetcher: (args: Query) => Promise<Response<T>>
    filter: undefined | { [col: string]: string }
}

const DEFAULT_PERPAGE = 10

let initialQueryParamRead = false

function useTableData<T extends { id: string }>({ filter, fetcher }: TableData<T>) {
    const router = useRouter()
    const { request, columnSort, rowSelection } = useTableState()
    const [fallbackInitialQueryParamRead, setFallbackInitialQueryParamRead] = React.useState(false)
    const { page = 0, perPage = DEFAULT_PERPAGE, search = '' } = router.query as { page?: number; perPage?: number; search?: string }
    const selectedRows = React.useMemo(() => getSelectedRows(rowSelection.state), [rowSelection.state])
    const { searchTerm, loading, columnRePositioning } = request.state
    const { all, addAllCurrentPageRows } = rowSelection.state
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: Number(page),
        pageSize: Number(perPage),
    })

    const fetcherOptions: Query = {
        page: Number(page),
        perPage: Number(perPage),
        search,
        sort: router.query?.sort ? getSorted({ column: routeQueryToColumnsortState(router.query?.sort as string) }) : '',
        filter,
    }

    const lastData = React.useRef<Response<T>>({ rows: [], pageCount: 0, total: 0 })

    const dataQuery = useSWR(initialQueryParamRead || fallbackInitialQueryParamRead ? fetcherOptions : null, fetcher)

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

        /**sorting match with initial router query - effective if hard url reload with query params */
        if (router.query?.sort) {
            const sorted = routeQueryToColumnsortState(router.query?.sort as string)

            columnSort.dispatch({ type: columnSortActionType.BULK_SET, payload: sorted })
        }

        if (Object.keys(router.query).some(item => ['page', 'perPage', 'search', 'sort'].includes(item) || item.startsWith('filter')))
            initialQueryParamRead = true
    }, [router.query])

    /** as a fallback if nothing present in url, so first query can happen atleast after 500 ms*/
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (initialQueryParamRead) return
            setFallbackInitialQueryParamRead(true)
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, [])

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
        options: fetcherOptions,
    }
}

export default useTableData
