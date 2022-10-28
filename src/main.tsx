import React from 'react'
import useTableData, { initialPageState, Query, Response, TableData } from './table/hooks/useTableData'
import useTableHandlers from './table/hooks/useTableHandlers'
import useColumns from './useColumns'
import useTable from './table/hooks/useTable'
import { ColumnOrderState, PaginationState, Table } from '@tanstack/react-table'
import { SWRResponse } from 'swr'
import { fetchData, Person } from './data/fetchData'
import { useAppSelector } from './redux/hooks'
import { RootState } from './redux/store'
import { selectedRows } from './table/context/reducer/rowSelection'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export type RenderProps<T> = {
    table: Table<T>
    columnOrder: ColumnOrderState
    isSelectedGetter: (id: string) => boolean
    resetColumnOrder: () => void
    isColumnPositioning: boolean
    stopColumnPositioning: () => void
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
    const initialPageState: initialPageState = {
        page: 2,
        perPage: 20,
    }

    const fetcher = React.useCallback((args: Query): Promise<Response<Person>> => {
        return fetchData(args)
    }, [])

    const {
        setPagination,
        pagination,
        pageSize,
        searchTerm,
        rowSelectionCount,
        isColumnPositioning,
        allRowSelected,
        selectedRows,
        dataQuery,
        lastData,
        loading,
        filter,
        options,
    } = useTableData<Person>({ filters, initialPageState, fetcher })

    const {
        resetRowSelection,
        isSelectedGetter,
        handleSelectAll,
        handleSelectAllCurrentPage,
        handleRemoveFromExcept,
        handleAddToExcept,
        handleAddToOnly,
        handleRemoveFromOnly,
        stopColumnPositioning,
    } = useTableHandlers()

    const columns = useColumns({
        isSelectedGetter,
        handleRemoveFromExcept,
        handleAddToExcept,
        handleAddToOnly,
        handleRemoveFromOnly,
        data: dataQuery.data,
        loading,
        allRowSelected,
        rowSelectionCount,
    })

    const { table, columnOrder, resetColumnOrder } = useTable<Person>({
        data: dataQuery.data,
        lastData,
        pagination,
        setPagination,
        pageSize,
        columns,
        filter,
        meta: {
            customFn: (rowIndex, columnId, value) => {
                console.log('customFn', rowIndex, columnId, value)
            },
        },
    })

    return (
        <DndProvider backend={HTML5Backend}>
            {children({
                table,
                columnOrder,
                isSelectedGetter,
                resetColumnOrder,
                isColumnPositioning,
                stopColumnPositioning,
                rowSelectionCount,
                selectedRows,
                resetRowSelection,
                dataQuery,
                loading,
                options,
            })}
        </DndProvider>
    )
}

export default Main
