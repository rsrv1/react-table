import React from 'react'
import { getCoreRowModel, ColumnOrderState, useReactTable, PaginationState, TableMeta, ColumnDef } from '@tanstack/react-table'
import { Response } from './useTableData'

let firstRenderPagination = true

type Args<T> = {
    data: Response<T> | undefined
    lastData: React.MutableRefObject<Response<T>>
    pagination: PaginationState
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    columns: ColumnDef<T, any>[]
    filter: string | null
    searchTerm: string
    pageSize: number
    meta?: TableMeta<T> | undefined
}

function useTable<T>({ data, lastData, pagination, setPagination, columns, filter, searchTerm, pageSize, meta }: Args<T>) {
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnPinning, setColumnPinning] = React.useState({})
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
        ...{
            ...(process.env.NODE_ENV !== 'production' && {
                debugTable: true,
                debugHeaders: true,
                debugColumns: true,
            }),
        },
        meta,
    })

    React.useEffect(() => {
        if (firstRenderPagination) {
            firstRenderPagination = false
            return
        }

        table.resetPagination()
    }, [filter, searchTerm, pageSize])

    return { table, columnOrder, resetColumnOrder }
}

export default useTable
