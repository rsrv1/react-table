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
    isSelectedGetter,
    position,
}: {
    table: TanstackTable<Person>
    rowSelectionCount: number
    isSelectedGetter: (id: string) => boolean
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

    const isRowSelected = (row: Row<Person>) => {
        const idCell = getCells(row).filter(cell => cell.column.id === 'id')

        if (idCell.length === 0) return false

        return isSelectedGetter(idCell[0].getValue() as string)
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
                                    position={position}
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
                        <tr className={clsx(isRowSelected(row) && 'bg-gray-50')}>
                            {getCells(row).map(cell => {
                                return (
                                    <td
                                        key={cell.id}
                                        className={clsx(cell.column.id === 'id' && 'relative', 'whitespace-nowrap px-2 py-2 text-sm text-gray-500')}>
                                        {isRowSelected(row) && cell.column.id === 'id' && (
                                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                        )}
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
        <div className="px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all the users in your account including their name, title, email and role.</p>
                </div>
            </div>

            <Main>
                {({
                    table,
                    columnOrder,
                    isSelectedGetter,
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
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                            <div className="inline-block py-2 align-middle md:px-6 lg:px-8">
                                <ColumnVisibility<Person> table={table} onResetColumnOrder={resetColumnOrder} />

                                <Filters loading={loading} />

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
                                <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg max-w-3xl">
                                    <div className="flex space-x-1 mx-auto">
                                        <TableRenderer
                                            isSelectedGetter={isSelectedGetter}
                                            rowSelectionCount={rowSelectionCount}
                                            table={table}
                                            position="left"
                                        />
                                        <div className="overflow-x-auto relative">
                                            {rowSelectionCount > 0 && (
                                                <RowSelectionMessage<Person>
                                                    mutate={dataQuery.mutate}
                                                    loading={loading}
                                                    count={rowSelectionCount}
                                                    resetRowSelection={resetRowSelection}
                                                    selectedRows={selectedRows}
                                                />
                                            )}
                                            <TableRenderer
                                                isSelectedGetter={isSelectedGetter}
                                                rowSelectionCount={rowSelectionCount}
                                                table={table}
                                                position="center"
                                            />
                                        </div>
                                        <TableRenderer
                                            isSelectedGetter={isSelectedGetter}
                                            rowSelectionCount={rowSelectionCount}
                                            table={table}
                                            position="right"
                                        />
                                    </div>

                                    {rowSelectionCount > 0 && (
                                        <div className="text-sm text-sky-700 bg-sky-100 px-4 py-2 mb-2">
                                            {rowSelectionCount} row{rowSelectionCount > 1 && 's'} selected
                                        </div>
                                    )}
                                </div>
                                <div className="py-4">total {dataQuery.data?.total} results</div>

                                {/* pagination */}
                                <Pagination table={table} loading={loading} />
                            </div>
                        </div>
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
    )
}

export default Table
