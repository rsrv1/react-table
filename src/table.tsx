import React from 'react'
import { flexRender, getCoreRowModel, ColumnOrderState, useReactTable, PaginationState } from '@tanstack/react-table'
import useSWR from 'swr'
import { fetchData, Person, Query, Status } from './data/fetchData'
import renderSubComponent from './components/RowSubExpand'
import useColumns from './useColumns'
import { _shuffle } from './utils'
import { RootState } from './redux/store'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { getSelectedRows } from './redux/slice/rowSelection'
import useCurrentPageRowSelectionListener from './useCurrentPageRowSelectionListener'
import { reset } from './redux/slice/rowSelection'
import useTotalRowSelectionCount from './useTotalRowSelectionCount'
import Select from './components/Select'
import SortTrigger from './components/SortTrigger'
import { getSorted } from './redux/slice/columnSorting'
import { getFiltered } from './redux/slice/filters'
import Age from './filters/age'
import StatusFilter from './filters/status'

function Table() {
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([])
    const dispatch = useAppDispatch()
    const selectedRows = useAppSelector(getSelectedRows)
    const sort = useAppSelector(getSorted)
    const filter = useAppSelector(getFiltered)
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const fetchDataOptions: Query = {
        page: pageIndex,
        perPage: pageSize,
        sort,
        filter,
    }

    const lastData = React.useRef<{ rows: Person[]; pageCount: number }>({ rows: [], pageCount: 0 })

    const dataQuery = useSWR(fetchDataOptions, fetchData)
    useCurrentPageRowSelectionListener(dataQuery.data)
    const columns = useColumns(dataQuery.data)

    const totalSelectionCount = useTotalRowSelectionCount(dataQuery.data)

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
        },
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
            <details>
                <summary className=" cursor-pointer">Column Visibility:</summary>

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
            </details>

            <div className="h-4" />
            <div className="flex flex-wrap gap-2">
                <button onClick={randomizeColumns} className="border p-1">
                    Reorder Columns
                </button>
            </div>
            <div className="h-4" />

            {totalSelectionCount > 0 && (
                <div className="rounded-md bg-sky-50 p-4">
                    <div className="flex">
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                            <p className="text-sm text-sky-700">{totalSelectionCount} rows selected</p>
                            <p className="mt-3 text-sm md:mt-0 md:ml-6">
                                <button
                                    onClick={deselectAllRows}
                                    type="button"
                                    className="whitespace-nowrap font-medium text-sky-700 hover:text-sky-600">
                                    <span aria-hidden="true">&times;</span> de-select all
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* filters */}
            <div className="flex justify-end space-x-5">
                <div className="flex items-center w-28">
                    <details>
                        <summary className="text-xs cursor-pointer">Status:</summary>
                        <StatusFilter />
                    </details>
                </div>
                <div className="flex items-center space-x-2">
                    <label for="filter-age" className="text-xs cursor-pointer">
                        Age:{' '}
                    </label>
                    <Age id="filter-age" />
                </div>
            </div>
            {/* filters */}

            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    <SortTrigger
                                        unsortable={header.id.startsWith('_') || ['id'].includes(header.id)}
                                        name={header.id}
                                        className="whitespace-nowrap">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </SortTrigger>
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

            {/* pagination */}
            <div className="flex items-center gap-2 text-sm">
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
                        className="border border-gray-300 p-1 rounded w-10 text-sm py-0.5"
                    />
                </span>
                <Select
                    className="!w-24"
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}>
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </Select>
                {!dataQuery.data && !dataQuery.error ? 'Loading...' : null}
            </div>

            {/* debug interaction */}
            <div className="mt-10">
                <button className="border rounded p-2 mb-2" onClick={() => console.info('rowSelection', selectedRows)}>
                    Log selectedRows
                </button>
            </div>
            <hr />
            <div>{JSON.stringify(fetchDataOptions)}</div>
        </div>
    )
}

export default Table
