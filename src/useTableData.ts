import React from 'react'
import { getCoreRowModel, ColumnOrderState, useReactTable, PaginationState, Table, ColumnDef } from '@tanstack/react-table'
import useSWR, { SWRResponse } from 'swr'
import { Person, Query } from './data/fetchData'
import useColumns from './useColumns'
import { RootState } from './redux/store'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { getSelectedRows, selectedRows } from './redux/slice/rowSelection'
import useCurrentPageRowSelectionListener from './useCurrentPageRowSelectionListener'
import useTotalRowSelectionCount from './useTotalRowSelectionCount'
import { getSorted } from './redux/slice/columnSorting'
import { setLoading, storeLastSearchTerm } from './redux/slice/request'
import { Response } from '../pages/api/persons'
import { filtersToString } from './utils'

type Props = {
    // columns: ColumnDef<Person, any>[]
    fetchData: (args: Query) => Promise<Response>
    filters?: {
        [key: string]: unknown | unknown[]
    }
}

function useTableData({ filters, fetchData }: Props) {
    const dispatch = useAppDispatch()
    const selectedRows = useAppSelector(getSelectedRows)
    const sort = useAppSelector(getSorted)
    const filter = React.useMemo(() => filtersToString(filters), [filters])
    const searchTerm = useAppSelector((state: RootState) => state.request.searchTerm)
    const loading = useAppSelector((state: RootState) => state.request.loading)
    const { all } = useAppSelector((state: RootState) => state.rowSelection)
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const fetchDataOptions: Query = {
        page: pageIndex,
        perPage: pageSize,
        search: searchTerm,
        sort,
        filter,
    }

    const lastData = React.useRef<Response>({ rows: [], pageCount: 0, total: 0 })

    const dataQuery = useSWR(fetchDataOptions, fetchData)
    useCurrentPageRowSelectionListener(dataQuery.data)

    const rowSelectionCount = useTotalRowSelectionCount(lastData.current)

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
            dispatch(setLoading(true))
            return
        }

        dispatch(setLoading(false))
    }, [dataQuery])

    /** when a request ends then set the last search term if applicable */
    React.useEffect(() => {
        dataQuery.data && dispatch(storeLastSearchTerm())
    }, [dataQuery.data])

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
        options: fetchDataOptions,
    }
}

export default useTableData
