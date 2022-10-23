import React from 'react'
import { flexRender, Table as TanstackTable, Row, PaginationState } from '@tanstack/react-table'
import Pagination from './table/pagination'
import Filters from './filters'
import ColumnVisibility from './table/columnVisibility'
import RowSelectionMessage from './components/rowSelectionMessage'
import ColumnHeader from './table/ColumnHeader'
import renderSubComponent from './components/RowSubExpand'
import Main from './main'
import { Person } from './data/fetchData'
import clsx from 'clsx'
import ColumnRepositionConfirm from './components/ColumnRepositionConfirm'

function TableRenderer({
    table,
    rowSelectionCount,
    position,
}: {
    table: TanstackTable<Person>
    rowSelectionCount: number
    position?: 'left' | 'center' | 'right'
}) {
    const getHeaderGroups = () => {
        if (position === 'left') return table.getLeftHeaderGroups()
        if (position === 'right') return table.getRightHeaderGroups()
        if (position === 'center') return table.getCenterHeaderGroups()
        return table.getHeaderGroups()
    }

    const getCells = (row: Row<Person>) => {
        if (position === 'left') return row.getLeftVisibleCells()
        if (position === 'right') return row.getRightVisibleCells()
        if (position === 'center') return row.getCenterVisibleCells()
        return row.getVisibleCells()
    }

    return (
        <table className={clsx('divide-y divide-gray-300', position === 'center' || 'shadow bg-gray-100/80')}>
            <thead className="bg-gray-50">
                {getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header =>
                            ['_expand'].includes(header.id) ? (
                                <th key={header.id}></th>
                            ) : (
                                <ColumnHeader<Person>
                                    key={header.id}
                                    header={header}
                                    table={table}
                                    unsortable={header.id.startsWith('_') || ['id'].includes(header.id)}
                                    rowSelector={header.id === 'id'}
                                    rowSelectionCount={rowSelectionCount}
                                    name={header.id}
                                    className="whitespace-nowrap">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </ColumnHeader>
                            )
                        )}
                    </tr>
                ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map(row => (
                    <React.Fragment key={row.id}>
                        <tr>
                            {getCells(row).map(cell => {
                                return (
                                    <td key={cell.id} className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                )
                            })}
                        </tr>
                        {row.getIsExpanded() && getHeaderGroups()[0].headers.length > 0 && (
                            <tr>
                                <td colSpan={getCells(row).length}>
                                    {(position === 'center' || position === undefined) && renderSubComponent({ row })}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    )
}

function Table() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
                    <p className="mt-2 text-sm text-gray-700">A table of placeholder stock market data that does not make any sense.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
                        Export
                    </button>
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"></div>
                        <Main>
                            {({
                                table,
                                columnOrder,
                                resetColumnOrder,
                                resetRowSelection,
                                rowSelectionCount,
                                isColumnPositioning,
                                stopColumnPositioning,
                                selectedRows,
                                dataQuery,
                                loading,
                                options,
                            }) => (
                                <div className="max-w-2xl">
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

                                    <div className="flex justify-between items-center mb-3">
                                        <div></div>

                                        {isColumnPositioning && (
                                            <ColumnRepositionConfirm<Person>
                                                table={table}
                                                stopColumnPositioning={stopColumnPositioning}
                                                resetColumnPositioning={resetColumnOrder}
                                            />
                                        )}
                                    </div>

                                    <div className="flex space-x-1 mx-auto">
                                        <div className="overflow-x-scroll">
                                            <TableRenderer rowSelectionCount={rowSelectionCount} table={table} position="left" />
                                        </div>
                                        <div className="overflow-x-auto">
                                            <TableRenderer rowSelectionCount={rowSelectionCount} table={table} position="center" />
                                        </div>
                                        <div className="overflow-x-scroll">
                                            <TableRenderer rowSelectionCount={rowSelectionCount} table={table} position="right" />
                                        </div>
                                    </div>

                                    <div className="py-4">total {dataQuery.data?.total} results</div>

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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Table
