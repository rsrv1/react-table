import React from 'react'
import { flexRender, getCoreRowModel, ColumnOrderState, useReactTable, PaginationState } from '@tanstack/react-table'
import useSWR from 'swr'
import { fetchData, Person, Query, Status } from './data/fetchData'
import renderSubComponent from './components/RowSubExpand'
import useColumns from './useColumns'
import { RootState } from './redux/store'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { getSelectedRows } from './redux/slice/rowSelection'
import useCurrentPageRowSelectionListener from './useCurrentPageRowSelectionListener'
import { reset } from './redux/slice/rowSelection'
import useTotalRowSelectionCount from './useTotalRowSelectionCount'
import SortTrigger from './components/SortTrigger'
import { getSorted } from './redux/slice/columnSorting'
import { getFiltered } from './redux/slice/filters'
import Pagination from './pagination'
import Filters from './filters'
import ColumnVisibility from './columnVisibility'
import RowSelectionMessage from './rowSelectionMessage'
import { setLoading } from './redux/slice/request'
import { Response } from '../pages/api/persons'

let firstRenderPagination = true

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

    const lastData = React.useRef<Response>({ rows: [], pageCount: 0, total: 0 })

    const dataQuery = useSWR(fetchDataOptions, fetchData)
    useCurrentPageRowSelectionListener(dataQuery.data)
    const columns = useColumns(dataQuery.data)

    const totalSelectionCount = useTotalRowSelectionCount(lastData.current)

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    /** keeping the last data as - when SWR fetches the current data becomes undefined (to avoid the flickering) */
    React.useEffect(() => {
        if (dataQuery.data) lastData.current = dataQuery.data
    }, [dataQuery.data])

    /** track loading state */
    React.useEffect(() => {
        if (!dataQuery.data && !dataQuery.error) {
            dispatch(setLoading(true))
            return
        }

        dispatch(setLoading(false))
    }, [dataQuery])

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

    /** when any filtering happens then reset the pagination */
    React.useEffect(() => {
        if (firstRenderPagination) {
            firstRenderPagination = false
            return
        }

        table.resetPagination()
    }, [filter])

    return (
        <div className="p-2">
            <ColumnVisibility table={table} />

            <Filters />

            {totalSelectionCount > 0 && <RowSelectionMessage count={totalSelectionCount} />}

            <table className="w-full">
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
            <Pagination table={table} />

            {/* debug interaction */}
            <div className="mt-10">
                <span className="font-medium text-indigo-500">Selected rows:</span> {JSON.stringify(selectedRows)}
            </div>
            <hr />
            <div>
                <span className="font-medium text-indigo-500">Query:</span> {JSON.stringify(fetchDataOptions)}
            </div>
        </div>
    )
}

export default Table
