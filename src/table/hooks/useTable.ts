import React from 'react'
import { getCoreRowModel, ColumnOrderState, useReactTable, PaginationState, TableMeta, ColumnDef } from '@tanstack/react-table'
import { Response } from './useTableData'
import { useTableState } from '../context/tableContext'

let renderCount = 0

type Args<T> = {
    data: Response<T> | undefined
    lastData: React.MutableRefObject<Response<T>>
    pagination: PaginationState
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    columns: ColumnDef<T, any>[]
    filter: string | null
    pageSize: number
    meta?: TableMeta<T> | undefined
}

function useTable<T>({ data, lastData, pagination, setPagination, columns, filter, pageSize, meta }: Args<T>) {
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnPinning, setColumnPinning] = React.useState({})
    const {
        request: {
            state: { searchTerm },
        },
        columnSort: {
            state: { column },
        },
    } = useTableState()
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
        columns.map(column => column.id as string) //must start out with populated columnOrder so we can splice
    )
    const resetColumnOrder = React.useCallback(() => setColumnOrder(columns.map(column => column.id as string)), [columns])

    const table = useReactTable({
        data: data?.rows ?? lastData.current.rows,
        columns,
        pageCount: data?.pageCount ?? lastData.current.pageCount,
        state: {
            columnVisibility,
            columnOrder,
            pagination,
            columnPinning,
        },
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        onColumnPinningChange: setColumnPinning,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: row => true,
        ...(process.env.NODE_ENV !== 'production' && {
            debugTable: true,
            debugHeaders: true,
            debugColumns: true,
        }),

        meta,
    })

    /** if filter / search term / per page / sorting changes then reset page to first */
    React.useEffect(() => {
        if (renderCount < 2) {
            renderCount++
            return
        }

        table.resetPageIndex()
    }, [filter, searchTerm, pageSize, column])

    return { table, columnOrder, resetColumnOrder }
}

export default useTable
