import React from 'react'
import { flexRender, Table as TanstackTable, Row, PaginationState } from '@tanstack/react-table'
import Pagination from './table/Pagination'
import Filters from './filters'
import ColumnVisibility from './table/column-settings-menu/ColumnVisibility'
import TableRenderer from './table/Renderer'
import RowSelectionMessage from './components/RowSelectionMessage'
import renderSubComponent from './components/RowSubExpand'
import Main from './main'
import { Person } from './data/fetchData'
import clsx from 'clsx'
import ColumnRepositionConfirm from './components/ColumnRepositionConfirm'
import { CaretDown, MagnifyingGlass } from 'phosphor-react'
import Search from './table/Search'
import { useRowSelectionState } from './table/context/tableContext'
import { isSelected } from './table/context/reducer/rowSelection'
import LineProgress from './table/components/LineProgress'

type tablePosition = 'left' | 'center' | 'right'

const getHeaderGroups = (position: tablePosition, table: TanstackTable<Person>) => {
    if (position === 'left') return table.getLeftHeaderGroups()
    if (position === 'right') return table.getRightHeaderGroups()
    if (position === 'center') return table.getCenterHeaderGroups()
    return table.getHeaderGroups()
}

const getCells = (position: tablePosition, row: Row<Person>) => {
    if (position === 'left') return row.getLeftVisibleCells()
    if (position === 'right') return row.getRightVisibleCells()
    if (position === 'center') return row.getCenterVisibleCells()
    return row.getVisibleCells()
}

function TableBody({ table, position = 'center' }: { table: TanstackTable<Person>; position?: tablePosition }) {
    const rowSelection = useRowSelectionState()
    const isSelectedGetter = React.useMemo(() => isSelected(rowSelection), [rowSelection])

    const isRowSelected = (row: Row<Person>) => {
        const idCell = getCells(position, row).filter(cell => cell.column.id === 'id')

        if (idCell.length === 0) return false

        return isSelectedGetter(idCell[0].getValue() as string)
    }

    return (
        <>
            {table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                    <tr className={clsx(isRowSelected(row) && 'bg-gray-50')}>
                        {getCells(position, row).map(cell => {
                            return (
                                <td
                                    key={cell.id}
                                    style={{ width: cell.column.getSize() }}
                                    className={clsx(
                                        cell.column.id === 'id' && 'relative w-12',
                                        cell.column.id === 'firstName' && 'py-4 pr-3',
                                        'whitespace-nowrap px-2 py-2 text-sm text-gray-500 truncate'
                                    )}>
                                    {cell.column.id === 'id' ? (
                                        <div className="px-6 sm:w-16 sm:px-8">
                                            {isSelectedGetter(cell.getValue() as string) && (
                                                <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                            )}
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    ) : (
                                        flexRender(cell.column.columnDef.cell, cell.getContext())
                                    )}
                                </td>
                            )
                        })}
                    </tr>
                    {row.getIsExpanded() && getHeaderGroups(position, table)[0].headers.length > 0 && (
                        <tr>
                            <td colSpan={getCells(position, row).length}>
                                {(position === 'center' || position === undefined) && renderSubComponent({ row })}
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            ))}
        </>
    )
}

function Table() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role.{' '}
                        <a className="text-blue-500" href="/test">
                            Jump
                        </a>
                    </p>
                </div>
            </div>

            <Main>
                {({ table, resetColumnOrder, rowSelectionCount, isColumnPositioning, stopColumnPositioning, mutate, total, loading, options }) => (
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                            <div className="lg:inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <Filters table={table} loading={loading} />

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
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-md">
                                    <div className="px-2 py-2 bg-gray-50 border-b">
                                        <div className="flex justify-between px-2 lg:px-4 flex-col-reverse lg:flex-row">
                                            <div className="flex flex-1">
                                                <div className="flex w-full md:ml-0">
                                                    <label htmlFor="search-field" className="sr-only">
                                                        Search
                                                    </label>

                                                    <div className="relative w-full lg:w-96 text-gray-400 focus-within:text-gray-600">
                                                        <div
                                                            className="pointer-events-none absolute inset-y-0 left-0 top-1.5 flex items-center"
                                                            aria-hidden="true">
                                                            <MagnifyingGlass size={15} className="h-5 w-5" aria-hidden="true" />
                                                        </div>
                                                        <Search<Person>
                                                            resetPageIndex={table.resetPageIndex}
                                                            debounce={800}
                                                            placeholder="Search..."
                                                            className="block w-full rounded-md sm:text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-0 lg:ml-4">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                                    Filter
                                                </button>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                                    Refresh
                                                    <CaretDown size={15} className="text-md mx-2 my-0.5 mt-0.5" aria-hidden="true" />
                                                </button>
                                                <ColumnVisibility<Person> table={table} onResetColumnOrder={resetColumnOrder} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={clsx(loading || 'invisible', 'w-full relative')}>{loading && <LineProgress />}</div>

                                    <div
                                        className={clsx(table.getIsSomeColumnsPinned() ? 'flex space-x-1' : 'overflow-x-auto', 'lg:overflow-hidden')}>
                                        {table.getIsSomeColumnsPinned() && (
                                            <TableRenderer table={table} position="left">
                                                <TableBody table={table} position="left" />
                                            </TableRenderer>
                                        )}
                                        <div className={clsx(table.getIsSomeColumnsPinned() && 'overflow-x-auto', 'relative max-w-full')}>
                                            {rowSelectionCount > 0 && (
                                                <RowSelectionMessage<Person> mutate={mutate} loading={loading} count={rowSelectionCount} />
                                            )}
                                            <TableRenderer table={table} position="center">
                                                <TableBody table={table} position="center" />
                                            </TableRenderer>
                                        </div>
                                        {table.getIsSomeColumnsPinned() && (
                                            <TableRenderer table={table} position="right">
                                                <TableBody table={table} position="right" />
                                            </TableRenderer>
                                        )}
                                    </div>

                                    {rowSelectionCount > 0 && (
                                        <div className="text-sm text-indigo-700 bg-indigo-50 px-4 py-2">
                                            {rowSelectionCount} row{rowSelectionCount > 1 && 's'} selected
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="py-4">{loading ? <p>loading...</p> : <p>Total {total} results</p>}</div>

                                    {/* pagination */}
                                    <Pagination<Person> table={table} loading={loading} />
                                </div>
                            </div>
                        </div>
                        {/* debug interaction */}
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
