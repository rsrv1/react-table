import React from 'react'
import { getCoreRowModel, ColumnOrderState, useReactTable, PaginationState, Table, TableMeta, ColumnDef } from '@tanstack/react-table'
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
