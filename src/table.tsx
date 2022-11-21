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
import styles from './table/loader.module.css'
import { CaretDown, MagnifyingGlass } from 'phosphor-react'
import Search from './table/Search'

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

function TableRenderer({
    table,
    rowSelectionCount,
    isSelectedGetter,
    validating,
    loading,
    position = 'center',
}: {
    table: TanstackTable<Person>
    rowSelectionCount: number
    isSelectedGetter: (id: string) => boolean
    validating: boolean
    loading: boolean
    position?: tablePosition
}) {
    const [refreshing, setRefreshing] = React.useState(false)
    const isRowSelected = (row: Row<Person>) => {
        const idCell = getCells(position, row).filter(cell => cell.column.id === 'id')

        if (idCell.length === 0) return false

        return isSelectedGetter(idCell[0].getValue() as string)
    }

    /** handling swr validating state UI */
    React.useEffect(() => {
        if (validating && !loading) {
            setRefreshing(true)
        }
    }, [validating, loading])

    React.useEffect(() => {
        if (!refreshing) return

        const timer = setTimeout(() => {
            setRefreshing(false)
        }, 550)

        return () => {
            clearTimeout(timer)
        }
    }, [refreshing])
    /** handling swr validating state UI */

    return (
        <table
            className={clsx(
                'divide-y divide-gray-300 table-fixed',
                position === 'center' || 'shadow bg-gray-100/80',
                position !== 'center' && !table.getIsSomeColumnsPinned() && 'hidden'
            )}>
            <thead className={clsx(refreshing ? 'bg-white' : 'bg-gray-50')}>
                {getHeaderGroups(position, table).map(headerGroup => (
                    <tr key={headerGroup.id} className="relative">
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
                                    className={clsx(header.id === 'firstName' && 'min-w-[20rem]', 'whitespace-nowrap')}>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </ColumnHeader>
                            )
                        )}
                        <th
                            className={clsx(
                                'absolute inset-0',
                                refreshing ? 'transition-[width] duration-700 ease-in-out w-full bg-slate-300/20' : 'w-0 bg-transparent'
                            )}
                        />
                    </tr>
                ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map(row => (
                    <React.Fragment key={row.id}>
                        <tr className={clsx(isRowSelected(row) && 'bg-gray-50')}>
                            {getCells(position, row).map(cell => {
                                return (
                                    <td
                                        key={cell.id}
                                        className={clsx(
                                            cell.column.id === 'id' && 'relative',
                                            cell.column.id === 'firstName' && 'py-4 pr-3',
                                            'whitespace-nowrap px-2 py-2 text-sm text-gray-500'
                                        )}>
                                        {cell.column.id === 'id' ? (
                                            <div className="w-12 px-6 sm:w-16 sm:px-8">
                                                {isRowSelected(row) && <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />}
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
            </tbody>
        </table>
    )
}

function Table() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role. <a href="/test">Jump</a>
                    </p>
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
                                                            table={table}
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
                                                    Add Person
                                                    <CaretDown size={15} className="text-md mx-2 my-0.5 mt-0.5" aria-hidden="true" />
                                                </button>
                                                <ColumnVisibility<Person> table={table} onResetColumnOrder={resetColumnOrder} />
                                            </div>
                                        </div>
                                    </div>

                                    {loading && <div className={styles.loading}></div>}
                                    <div
                                        className={clsx(
                                            table.getIsSomeColumnsPinned() && 'flex space-x-1',
                                            'mx-auto overflow-x-auto lg:overflow-hidden'
                                        )}>
                                        <TableRenderer
                                            isSelectedGetter={isSelectedGetter}
                                            rowSelectionCount={rowSelectionCount}
                                            table={table}
                                            validating={dataQuery.isValidating}
                                            loading={!dataQuery.data && !dataQuery.error}
                                            position="left"
                                        />
                                        <div className={clsx(table.getIsSomeColumnsPinned() && 'overflow-x-auto max-w-2xl', 'relative')}>
                                            {/** set overflow-x-auto to make the column pinning work, to server better y overflow for inf pagination this setup is good for now */}
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
                                                validating={dataQuery.isValidating}
                                                loading={!dataQuery.data && !dataQuery.error}
                                                position="center"
                                            />
                                        </div>
                                        <TableRenderer
                                            isSelectedGetter={isSelectedGetter}
                                            rowSelectionCount={rowSelectionCount}
                                            table={table}
                                            validating={dataQuery.isValidating}
                                            loading={!dataQuery.data && !dataQuery.error}
                                            position="right"
                                        />
                                    </div>

                                    {rowSelectionCount > 0 && (
                                        <div className="text-sm text-indigo-700 bg-indigo-50 px-4 py-2">
                                            {rowSelectionCount} row{rowSelectionCount > 1 && 's'} selected
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="py-4">{loading ? <p>loading...</p> : <p>Total {dataQuery.data?.total} results</p>}</div>

                                    {/* pagination */}
                                    <Pagination<Person> table={table} loading={loading} />
                                </div>
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
