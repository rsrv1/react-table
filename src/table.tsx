import React from 'react'
import { flexRender, Table as TanstackTable, Row } from '@tanstack/react-table'
import Pagination from './table/pagination'
import Filters from './filters'
import ColumnVisibility from './table/columnVisibility'
import RowSelectionMessage from './components/rowSelectionMessage'
import ColumnHeader from './table/ColumnHeader'
import renderSubComponent from './components/RowSubExpand'
import Main from './main'
import { Person } from './data/fetchData'
import RowSelect from './components/RowSelect'

function TableRenderer({ table, position }: { table: TanstackTable<Person>; position?: 'left' | 'center' | 'right' }) {
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
        <table className="border-2 border-black">
            <thead>
                {getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header =>
                            ['id', '_expand'].includes(header.id) ? (
                                <th key={header.id}></th>
                            ) : (
                                <ColumnHeader<Person>
                                    key={header.id}
                                    header={header}
                                    table={table}
                                    unsortable={header.id.startsWith('_') || ['id'].includes(header.id)}
                                    name={header.id}
                                    className="whitespace-nowrap">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </ColumnHeader>
                            )
                        )}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <React.Fragment key={row.id}>
                        <tr>
                            {/* first row is a normal row */}
                            {getCells(row).map(cell => {
                                return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            })}
                        </tr>
                        {row.getIsExpanded() && (
                            <tr>
                                {/* 2nd row is a custom 1 cell row */}
                                <td colSpan={getCells(row).length}>{renderSubComponent({ row })}</td>
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
        <Main>
            {({
                table,
                columnOrder,
                resetColumnOrder,
                handleSelectAll,
                handleSelectAllCurrentPage,
                rowSelectionCount,
                selectedRows,
                resetRowSelection,
                dataQuery,
                loading,
                options,
            }) => (
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

                    <RowSelect
                        loading={loading}
                        resetRowSelection={resetRowSelection}
                        handleSelectAll={handleSelectAll}
                        handleSelectAllCurrentPage={handleSelectAllCurrentPage}
                    />

                    {/* table */}
                    <div className="flex gap-4">
                        <TableRenderer table={table} position="left" />
                        <TableRenderer table={table} position="center" />
                        <TableRenderer table={table} position="right" />
                    </div>
                    {/* table */}
                    <div>
                        {rowSelectionCount} of {dataQuery.data?.total} Total Rows Selected
                    </div>
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
