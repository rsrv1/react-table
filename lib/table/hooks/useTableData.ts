import React from 'react'
import { PaginationState } from '@tanstack/react-table'
import useSWR, { SWRResponse } from 'swr'
import { useDispatch, useLoadingState, useResultState, useRowSelectionState, useSettingsState } from '../context/tableContext'
import { actionType } from '../context/reducer/request'
import { getSorted, sortDirection, actionType as columnSortActionType, state as columnSortStateType } from '../context/reducer/columnSort'
import { actionType as rowSelectionActionType, getSelectedRows, selectionCount } from '../context/reducer/rowSelection'
import { useSearchParams } from 'next/navigation'
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
    const searchParams = useSearchParams()
    const searchParamString = searchParams.toString()

    const rowSelection = useRowSelectionState()
    const getRouteKey = useRouteKey()
    const dispatch = useDispatch()
    const [fallbackInitialQueryParamRead, setFallbackInitialQueryParamRead] = React.useState(false)
    const page = searchParams.get(getRouteKey('page')) ?? 0
    const perPage = searchParams.get(getRouteKey('perPage')) ?? DEFAULT_PERPAGE
    const search = searchParams.get(getRouteKey('search')) ?? ''
    const { loading } = useLoadingState()
    const { total } = useResultState()
    const { columnRePositioning, uriQueryPrefix } = useSettingsState()
    const { addAllCurrentPageRows } = rowSelection
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: Number(page),
        pageSize: Number(perPage),
    })

    const fetcherOptions: Query | null =
        initialQueryParamRead || fallbackInitialQueryParamRead
            ? {
                  page: Number(page),
                  perPage: Number(perPage),
                  search: String(search),
                  sort: searchParams.get(getRouteKey('sort'))
                      ? getSorted({ column: routeQueryToColumnsortState(searchParams.get(getRouteKey('sort')) as string) })
                      : '',
                  filter,
              }
            : null

    const dataQuery = useSWR(fetcherOptions, fetcher, { keepPreviousData: true })
    const isLoading = dataQuery.isLoading
    const isValidating = !isLoading && dataQuery.isValidating

    const rowSelectionCount = total > 0 ? selectionCount(rowSelection, total) : 0

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    /** total server response change keep track */
    React.useEffect(() => {
        dispatch.result({ type: actionType.SET_RESULT_TOTAL, payload: Number(dataQuery.data?.total) })
    }, [dataQuery.data?.total])

    /** first load set from url params */
    React.useEffect(() => {
        if (initialQueryParamRead) return

        /**set pagination */
        if (searchParams.get(getRouteKey('page')) || searchParams.get(getRouteKey('perPage'))) {
            setPagination(({ pageSize, pageIndex }) => ({
                pageSize: searchParams.get(getRouteKey('perPage')) ? Number(searchParams.get(getRouteKey('perPage'))) : pageSize,
                pageIndex: searchParams.get(getRouteKey('page')) ? Number(searchParams.get(getRouteKey('page'))) : pageIndex,
            }))
        }

        /**sorting match with initial router query - effective if hard url reload with query params */
        if (searchParams.get(getRouteKey('sort'))) {
            const sorted = routeQueryToColumnsortState(searchParams.get(getRouteKey('sort')) as string)

            dispatch.columnSort({ type: columnSortActionType.BULK_SET, payload: sorted })
        }

        if (
            Object.keys(searchParams.keys()).some(
                item =>
                    [getRouteKey('page'), getRouteKey('perPage'), getRouteKey('search'), getRouteKey('sort')].includes(item) ||
                    item.startsWith(getQueryKey(uriQueryPrefix, 'filter'))
            )
        )
            initialQueryParamRead = true
    }, [searchParamString, dispatch])

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

    /** track loading state */
    React.useEffect(() => {
        if (isLoading) {
            dispatch.loading({ type: actionType.LOADING, payload: true })
            return
        }

        dispatch.loading({ type: actionType.LOADING, payload: false })
    }, [isLoading, dispatch])

    /** track validating state */
    React.useEffect(() => {
        if (isValidating) {
            dispatch.loading({ type: actionType.VALIDATING, payload: true })
            return
        }

        dispatch.loading({ type: actionType.VALIDATING, payload: false })
    }, [isValidating, dispatch])

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
        rowSelectionCount,
        isColumnPositioning: columnRePositioning,
        dataQuery,
        loading,
        options: fetcherOptions,
    }
}

export default useTableData
