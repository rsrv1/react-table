import React from 'react'
import { getCoreRowModel, ColumnOrderState, useReactTable, PaginationState, TableMeta, ColumnDef, ColumnSizingState } from '@tanstack/react-table'
import { Response } from './useTableData'
import useDebounce from './useDebounce'
import { useSettingsState } from '../context/tableContext'
import { StoreColumnOrder, StoreColumnSize } from '../PersistPreference'

type Args<T> = {
    data: Response<T> | undefined
    pagination: PaginationState
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    columns: ColumnDef<T, any>[]
    meta?: TableMeta<T> | undefined
}

function useTable<T>({ data, pagination, setPagination, columns, meta }: Args<T>) {
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnPinning, setColumnPinning] = React.useState({})
    const { uriQueryPrefix } = useSettingsState()
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(columns.map(column => column.id as string))
    const resetColumnOrder = React.useCallback(() => {
        new StoreColumnOrder(uriQueryPrefix).flush()
        setColumnOrder(columns.map(column => column.id as string))
    }, [columns, uriQueryPrefix])

    const table = useReactTable({
        data: data?.rows ?? [],
        columns,
        pageCount: data?.pageCount ?? 0,
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

    React.useLayoutEffect(() => {
        if (typeof window === 'undefined') return

        /** first mount hydrate column size preference */
        const store = new StoreColumnSize(uriQueryPrefix)
        table.setColumnSizing(store.read)

        /** first mount hydrate column order preference */
        const orderStore = new StoreColumnOrder(uriQueryPrefix)
        const preference = orderStore.read
        if (!preference || preference.length === 0) return

        setColumnOrder(preference)
    }, [uriQueryPrefix])

    const handleColumnSizingChange = React.useCallback(
        (columnSizing: ColumnSizingState) => {
            const store = new StoreColumnSize(uriQueryPrefix)
            store.save = columnSizing
        },
        [uriQueryPrefix]
    )

    /** store column resizing data */
    useDebounce(table.getState().columnSizing, 800, handleColumnSizingChange)

    return { table, resetColumnOrder }
}

export default useTable
