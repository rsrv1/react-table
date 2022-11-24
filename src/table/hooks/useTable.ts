import React from 'react'
import { getCoreRowModel, ColumnOrderState, useReactTable, PaginationState, TableMeta, ColumnDef, ColumnSizingState } from '@tanstack/react-table'
import { Response } from './useTableData'
import useDebounce from './useDebounce'
import { useSettingsState } from '../context/tableContext'
import { StoreColumnOrder, StoreColumnSize } from '../PersistPreference'

type Args<T> = {
    data: Response<T> | undefined
    lastData: React.MutableRefObject<Response<T>>
    pagination: PaginationState
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    columns: ColumnDef<T, any>[]
    meta?: TableMeta<T> | undefined
}

function useTable<T>({ data, lastData, pagination, setPagination, columns, meta }: Args<T>) {
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnPinning, setColumnPinning] = React.useState({})
    const { uriQueryPrefix } = useSettingsState()
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(columns.map(column => column.id as string))
    const resetColumnOrder = React.useCallback(() => setColumnOrder(columns.map(column => column.id as string)), [columns])

    /** first mount hydrate column order preference */
    React.useLayoutEffect(() => {
        const store = new StoreColumnOrder(uriQueryPrefix)
        const preference = store.read()
        if (!preference || preference.length === 0) return

        setColumnOrder(preference)
    }, [uriQueryPrefix])

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
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: row => true,
        ...(process.env.NODE_ENV !== 'production' &&
            {
                // debugTable: true,
                // debugHeaders: true,
                // debugColumns: true,
            }),

        meta,
    })

    /** first mount hydrate column size preference */
    React.useLayoutEffect(() => {
        if (typeof window === 'undefined') return

        const store = new StoreColumnSize(uriQueryPrefix)
        table.setColumnSizing(store.read())
    }, [uriQueryPrefix])

    const handleColumnSizingChange = React.useCallback(
        (columnSizing: ColumnSizingState) => {
            const store = new StoreColumnSize(uriQueryPrefix)
            store.save(columnSizing)
        },
        [uriQueryPrefix]
    )

    /** store column resizing data */
    useDebounce(table.getState().columnSizing, 900, handleColumnSizingChange)

    return { table, columnOrder, resetColumnOrder }
}

export default useTable
