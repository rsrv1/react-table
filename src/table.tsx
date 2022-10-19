import React from 'react'
import { flexRender } from '@tanstack/react-table'
import Pagination from './table/pagination'
import Filters from './filters'
import ColumnVisibility from './table/columnVisibility'
import RowSelectionMessage from './components/rowSelectionMessage'
import ColumnHeader from './table/ColumnHeader'
import renderSubComponent from './components/RowSubExpand'
import Main from './main'
import { Person } from './data/fetchData'

function Table() {
    return (
        <Main>
            {({ table, columnOrder, resetColumnOrder, rowSelectionCount, selectedRows, resetRowSelection, dataQuery, loading, options }) => (
                <div className="p-2">
                    <ColumnVisibility<Person> table={table} onResetColumnOrder={resetColumnOrder} />

                    <Filters loading={loading} />

                    {rowSelectionCount > 0 && (
                        <RowSelectionMessage<Person>
                            mutate={dataQuery.mutate}
                            loading={loading}
                            count={rowSelectionCount}
                            resetRowSelection={resetRowSelection}
                            selectedRows={selectedRows}
                        />
                    )}

                    <table className="w-full">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <ColumnHeader<Person>
                                            key={header.id}
                                            header={header}
                                            table={table}
                                            unsortable={header.id.startsWith('_') || ['id'].includes(header.id)}
                                            name={header.id}
                                            className="whitespace-nowrap">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </ColumnHeader>
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
        </Main>
    )
}

export default Table
