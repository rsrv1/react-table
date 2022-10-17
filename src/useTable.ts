import React from 'react'
import { getCoreRowModel, ColumnOrderState, useReactTable, PaginationState, Table } from '@tanstack/react-table'

let firstRenderPagination = true

function useTable({ data, lastData, pagination, setPagination, columns, filter, searchTerm, pageSize, meta = {} }) {
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([])

    const table = useReactTable({
        data: data?.rows ?? lastData.current.rows,
        columns,
        pageCount: data?.pageCount ?? lastData.current.pageCount,
        state: {
            columnVisibility,
            columnOrder,
            pagination,
        },
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: row => true,
        meta,
    })

    React.useEffect(() => {
        if (firstRenderPagination) {
            firstRenderPagination = false
            return
        }

        table.resetPagination()
    }, [filter, searchTerm, pageSize])

    return table
}

export default useTable
