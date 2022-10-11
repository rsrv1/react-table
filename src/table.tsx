import React from 'react'
import { flexRender, getCoreRowModel, ColumnOrderState, useReactTable, PaginationState } from '@tanstack/react-table'
import useSWR from 'swr'
import { fetchData, Person } from './data/fetchData'
import IndeterminateCheckbox from './components/IndeterminateCheckbox'
import renderSubComponent from './components/RowSubExpand'
import useColumns from './useColumns'
import { _shuffle } from './utils'
import { RootState } from './redux/store'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { getSelectedRows, selectionCount } from './redux/slice/rowSelection'
import useCurrentPageRowSelectionListener from './useCurrentPageRowSelectionListener'
import { reset } from './redux/slice/rowSelection'

function Table() {
    const columns = useColumns()
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const dispatch = useAppDispatch()
    const totalSelectionCountGetter = useAppSelector(selectionCount)
    const selectedRows = useAppSelector(getSelectedRows)
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const fetchDataOptions = {
        pageIndex,
        pageSize,
    }

    const lastData = React.useRef<{ rows: Person[]; pageCount: number }>({ rows: [], pageCount: 0 })

    const dataQuery = useSWR(fetchDataOptions, fetchData)
    useCurrentPageRowSelectionListener(dataQuery.data)

    const totalSelectionCount = React.useMemo(() => {
        if (!dataQuery.data) return 0

        return totalSelectionCountGetter(dataQuery.data.total)
    }, [totalSelectionCountGetter, dataQuery.data])

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    React.useEffect(() => {
        if (dataQuery.data) lastData.current = dataQuery.data
    }, [dataQuery.data])

    const table = useReactTable({
        data: dataQuery.data?.rows ?? lastData.current.rows,
        columns,
        pageCount: dataQuery.data?.pageCount ?? lastData.current.pageCount,
        state: {
            columnVisibility,
            columnOrder,
            pagination,
            rowSelection,
        },
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getRowCanExpand: row => true,
        meta: {
            customFn: (rowIndex, columnId, value) => {
                console.log('customFn', rowIndex, columnId, value)
            },
        },
    })

    const randomizeColumns = () => {
        table.setColumnOrder(_shuffle(table.getAllLeafColumns().map(d => d.id)))
    }

    const deselectAllRows = () => {
        dispatch(reset())
    }

    return (
        <div className="p-2">
            <div className="inline-block border border-black shadow rounded">
                <div className="px-1 border-b border-black">
                    <label>
                        <input
                            {...{
                                type: 'checkbox',
                                checked: table.getIsAllColumnsVisible(),
                                onChange: table.getToggleAllColumnsVisibilityHandler(),
                            }}
                        />{' '}
                        Toggle All
                    </label>
                </div>
                {table.getAllLeafColumns().map(column => {
                    return (
                        <div key={column.id} className="px-1">
                            <label>
                                <input
                                    {...{
                                        type: 'checkbox',
                                        checked: column.getIsVisible(),
                                        onChange: column.getToggleVisibilityHandler(),
                                    }}
                                />{' '}
                                {column.id}
                            </label>
                        </div>
                    )
                })}
            </div>
            <div className="h-4" />
            <div className="flex flex-wrap gap-2">
                <button onClick={randomizeColumns} className="border p-1">
                    Reorder Columns
                </button>
            </div>
            <div className="h-4" />

            {totalSelectionCount > 0 && (
                <button onClick={deselectAllRows} type="button">
                    de-select {totalSelectionCount} selected rows
                </button>
            )}

            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    <div className="whitespace-nowrap">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <React.Fragment key={row.id}>
                            <tr>
                                {/* first row is a normal row */}
                                {row.getVisibleCells().map(cell => {
                                    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                })}
                            </tr>
                            {row.getIsExpanded() && (
                                <tr>
                                    {/* 2nd row is a custom 1 cell row */}
                                    <td colSpan={row.getVisibleCells().length}>{renderSubComponent({ row })}</td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td colSpan={20} className="pt-3">
                            <div>
                                {totalSelectionCount} of {dataQuery.data?.total} Total Rows Selected
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
            <div className="h-4" />
            <div className="flex items-center gap-2">
                <button className="border rounded p-1" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                    {'<<'}
                </button>
                <button className="border rounded p-1" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    {'<'}
                </button>
                <button className="border rounded p-1" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}>
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}>
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                {!dataQuery.data && !dataQuery.error ? 'Loading...' : null}
            </div>

            <hr />

            <div>
                <button className="border rounded p-2 mb-2" onClick={() => console.info('rowSelection', selectedRows)}>
                    Log `rowSelection` state
                </button>
            </div>
        </div>
    )
}

export default Table
