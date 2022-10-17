import React from 'react'
import { SWRConfig } from 'swr'
import Table from './table'
import { Provider as ReduxProvider } from 'react-redux'
import store from './redux/store'
import { flexRender } from '@tanstack/react-table'
import Pagination from './pagination'
import Filters from './filters'
import ColumnVisibility from './columnVisibility'
import RowSelectionMessage from './rowSelectionMessage'
import SortTrigger from './components/SortTrigger'
import renderSubComponent from './components/RowSubExpand'
import { fetchData, Person, Query } from './data/fetchData'
import useTableData from './useTableData'
import useTableHandlers from './useTableHandlers'
import useColumns from './useColumns'
import useTable from './useTable'

function Main() {
    return (
        <SWRConfig value={{ refreshInterval: 5000 }}>
            <ReduxProvider store={store}>
                <Entry filters={{ key: 'val' }}>
                    {({ table, rowSelectionCount, selectedRows, resetRowSelection, dataQuery, loading, options }) => (
                        <div className="p-2">
                            <ColumnVisibility table={table} />

                            <Filters />

                            {rowSelectionCount > 0 && <RowSelectionMessage count={rowSelectionCount} resetRowSelection={resetRowSelection} />}

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
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                                                {rowSelectionCount} of {dataQuery.data?.total} Total Rows Selected
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className="h-4" />

                            {/* pagination */}
                            <Pagination table={table} loading={loading} />

                            <div className="h-5 my-2">{loading && <h4>loading...</h4>}</div>

                            {/* debug interaction */}
                            <div className="mt-10">
                                <span className="font-medium text-indigo-500">Selected rows:</span> {JSON.stringify(selectedRows)}
                            </div>
                            <hr />
                            <div>
                                <span className="font-medium text-indigo-500">Query:</span> {JSON.stringify(options)}
                            </div>
                        </div>
                    )}
                </Entry>
            </ReduxProvider>
        </SWRConfig>
    )
}

function Entry({ children, filters }) {
    const {
        setPagination,
        pagination,
        pageSize,
        searchTerm,
        rowSelectionCount,
        allRowSelected,
        selectedRows,
        dataQuery,
        lastData,
        loading,
        filter,
        options,
    } = useTableData({ filters, fetchData })

    const {
        resetRowSelection,
        isSelectedGetter,
        handleSelectAll,
        handleSelectAllCurrentPage,
        handleRemoveFromExcept,
        handleAddToExcept,
        handleAddToOnly,
        handleRemoveFromOnly,
    } = useTableHandlers()

    const columns = useColumns({
        resetRowSelection,
        handleSelectAll,
        isSelectedGetter,
        handleSelectAllCurrentPage,
        handleRemoveFromExcept,
        handleAddToExcept,
        handleAddToOnly,
        handleRemoveFromOnly,
        data: dataQuery.data,
        loading,
        allRowSelected,
        rowSelectionCount,
    })

    const table = useTable({
        data: dataQuery.data,
        lastData,
        pagination,
        setPagination,
        columns,
        filter,
        searchTerm,
        pageSize,
        meta: {
            customFn: (rowIndex, columnId, value) => {
                console.log('customFn', rowIndex, columnId, value)
            },
        },
    })

    return <>{children({ table, rowSelectionCount, selectedRows, resetRowSelection, dataQuery, loading, options })}</>
}

export default Main
