import React from 'react'
import { PaginationState } from '@tanstack/react-table'
import useSWR, { SWRResponse } from 'swr'
import useTotalRowSelectionCount from './useTotalRowSelectionCount'
import { useDispatch, useLoadingState, useRowSelectionState, useSearchState, useSettingsState } from '../context/tableContext'
import { actionType } from '../context/reducer/request'
import { getSorted, sortDirection, actionType as columnSortActionType, state as columnSortStateType } from '../context/reducer/columnSort'
import { actionType as rowSelectionActionType, getSelectedRows } from '../context/reducer/rowSelection'
import { useRouter } from 'next/router'
import { getQueryKey, routeQueryToColumnsortState } from '../utils'
import useRouteKey from './useRouteKey'

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
    const rowSelection = useRowSelectionState()
    const getRouteKey = useRouteKey()
    const dispatch = useDispatch()
    const [fallbackInitialQueryParamRead, setFallbackInitialQueryParamRead] = React.useState(false)
    const page = router.query[getRouteKey('page')] ?? 0
    const perPage = router.query[getRouteKey('perPage')] ?? DEFAULT_PERPAGE
    const search = router.query[getRouteKey('search')] ?? ''
    const selectedRows = React.useMemo(() => getSelectedRows(rowSelection), [rowSelection])
    const loading = useLoadingState()
    const { columnRePositioning, uriQueryPrefix } = useSettingsState()
    const { searchTerm } = useSearchState()
    const { all, addAllCurrentPageRows } = rowSelection
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: Number(page),
        pageSize: Number(perPage),
    })

    const fetcherOptions: Query = {
        page: Number(page),
        perPage: Number(perPage),
        search: String(search),
        sort: router.query[getRouteKey('sort')]
            ? getSorted({ column: routeQueryToColumnsortState(router.query[getRouteKey('sort')] as string) })
            : '',
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
        if (router.query[getRouteKey('page')] || router.query[getRouteKey('perPage')]) {
            setPagination(({ pageSize, pageIndex }) => ({
                pageSize: router.query[getRouteKey('perPage')] ? Number(router.query[getRouteKey('perPage')]) : pageSize,
                pageIndex: router.query[getRouteKey('page')] ? Number(router.query[getRouteKey('page')]) : pageIndex,
            }))
        }

        /**search match with initial router query - effective if hard url reload with query params */
        if (router.query[getRouteKey('search')]) {
            dispatch.search({ type: actionType.SET_SEARCH_TERM, payload: router.query[getRouteKey('search')] as string })
        }

        /**sorting match with initial router query - effective if hard url reload with query params */
        if (router.query[getRouteKey('sort')]) {
            const sorted = routeQueryToColumnsortState(router.query[getRouteKey('sort')] as string)

            dispatch.columnSort({ type: columnSortActionType.BULK_SET, payload: sorted })
        }

        if (
            Object.keys(router.query).some(
                item =>
                    [getRouteKey('page'), getRouteKey('perPage'), getRouteKey('search'), getRouteKey('sort')].includes(item) ||
                    item.startsWith(getQueryKey(uriQueryPrefix, 'filter'))
            )
        )
            initialQueryParamRead = true
    }, [router.query, dispatch])

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
            dispatch.loading({ type: actionType.LOADING, payload: true })
            return
        }

        dispatch.loading({ type: actionType.LOADING, payload: false })
    }, [dataQuery.data, dataQuery.error, dispatch])

    /** when a request ends then set the last search term if applicable */
    React.useEffect(() => {
        dataQuery.data && dispatch.search({ type: actionType.STORE_LAST_SEARCH_TERM })
    }, [dataQuery.data, dispatch])

    /** select all current page rows */
    React.useEffect(() => {
        if (dataQuery.data && addAllCurrentPageRows) {
            dispatch.rowSelection({ type: rowSelectionActionType.SELECT_CURRENT_PAGE, payload: dataQuery.data.rows.map((row: T) => row.id) })
            dispatch.rowSelection({ type: rowSelectionActionType.WANT_CURRENT_PAGE, payload: false }) // disable the flag
        }
    }, [addAllCurrentPageRows, dataQuery.data, dispatch])

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
