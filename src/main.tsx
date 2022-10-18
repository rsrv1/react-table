import React from 'react'
import useTableData, { Query, Response, TableData } from './table/hooks/useTableData'
import useTableHandlers from './table/hooks/useTableHandlers'
import useColumns from './useColumns'
import useTable from './table/hooks/useTable'
import { Table } from '@tanstack/react-table'
import { SWRResponse } from 'swr'
import { fetchData, Person } from './data/fetchData'
import { useAppSelector } from './redux/hooks'
import { RootState } from './redux/store'
import { selectedRows } from './table/context/reducer/rowSelection'

export type RenderProps<T> = {
    table: Table<T>
    rowSelectionCount: number
    selectedRows: selectedRows
    resetRowSelection: () => void
    dataQuery: SWRResponse<Response<T>>
    loading: boolean
    options: Query
}

export type Props = {
    children: (args: RenderProps<Person>) => JSX.Element
}

function Main({ children }: Props) {
    const filters = useAppSelector((state: RootState) => state.filters)

    const fetcher = React.useCallback((args: Query): Promise<Response<Person>> => {
        return fetchData(args)
    }, [])

    const {
        setPagination,
        pagination,
        pageSize,
        searchTerm,
        rowSelectionCount,
        allRowSelected,
        selectedRows,
        dataQuery,
        lastData,
        loading,
        filter,
        options,
    } = useTableData<Person>({ filters, fetcher })

    const {
        resetRowSelection,
        isSelectedGetter,
        handleSelectAll,
        handleSelectAllCurrentPage,
        handleRemoveFromExcept,
        handleAddToExcept,
        handleAddToOnly,
        handleRemoveFromOnly,
    } = useTableHandlers()

    const columns = useColumns({
        resetRowSelection,
        handleSelectAll,
        isSelectedGetter,
        handleSelectAllCurrentPage,
        handleRemoveFromExcept,
        handleAddToExcept,
        handleAddToOnly,
        handleRemoveFromOnly,
        data: dataQuery.data,
        loading,
        allRowSelected,
        rowSelectionCount,
    })

    const table = useTable<Person>({
        data: dataQuery.data,
        lastData,
        pagination,
        setPagination,
        columns,
        filter,
        searchTerm,
        pageSize,
        meta: {
            customFn: (rowIndex, columnId, value) => {
                console.log('customFn', rowIndex, columnId, value)
            },
        },
    })

    return <>{children({ table, rowSelectionCount, selectedRows, resetRowSelection, dataQuery, loading, options })}</>
}

export default Main
