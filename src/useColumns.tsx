import React from 'react'
import { ColumnDef, Table, Row } from '@tanstack/react-table'
import { Person } from './data/fetchData'
import { Response } from './table/hooks/useTableData'
import ArrowDown from './components/ArrowDown'
import ArrowRight from './components/ArrowRight'
import RowSelectionCheckbox from './table/RowSelectionCheckbox'

type Args = {
    data: Response<Person> | undefined
}

function useColumns({ data }: Args): ColumnDef<Person, any>[] {
    const handleRowExpand = (table: Table<Person>, row: Row<Person>) => {
        table.resetColumnPinning() // so that expanded row don't break the ui
        row.getToggleExpandedHandler()()
    }

    const columns: ColumnDef<Person>[] = React.useMemo(
        () => [
            {
                accessorKey: 'id',
                id: 'id',
                cell: ({ getValue, row, column: { id }, table }) => <RowSelectionCheckbox value={getValue() as string} />,
            },
            {
                accessorKey: '_expand',
                id: '_expand',
                header: () => null,
                cell: ({ row, table }) => {
                    return row.getCanExpand() ? (
                        <button
                            {...{
                                onClick: (e: React.MouseEvent<HTMLButtonElement>) => handleRowExpand(table, row),
                                style: { cursor: 'pointer' },
                            }}>
                            {row.getIsExpanded() ? <ArrowDown /> : <ArrowRight />}
                        </button>
                    ) : (
                        '🔵'
                    )
                },
            },
            {
                accessorKey: 'firstName',
                id: 'firstName',
                cell: ({ row, getValue }) => (
                    <div
                        style={{
                            paddingLeft: `${row.depth * 2}rem`,
                        }}>
                        {getValue()}
                    </div>
                ),
            },
            {
                accessorKey: 'lastName',
                id: 'lastName',
                cell: info => <i>{info.getValue()}</i>,
                header: () => <span>Last Name</span>,
            },
            {
                accessorKey: 'age',
                id: 'age',
                header: () => 'Age',
                cell: info => info.renderValue(),
            },
            {
                accessorKey: 'visits',
                id: 'visits',
                header: () => <span>Visits</span>,
            },
            {
                accessorKey: 'status',
                id: 'status',
                header: 'Status',
            },
            {
                accessorKey: 'progress',
                id: 'progress',
                header: 'Profile Progress',
                cell: info => (
                    <span>
                        {info.row.original.lastName}-{info.row.original.age}
                    </span>
                ),
            },
            {
                accessorFn: row => row.id,
                id: '_action',
                header: 'Action',
                cell: ({ getValue, row: { index }, column: { id }, table }) => (
                    <button
                        onClick={() => {
                            table.options.meta?.customFn(index, id, getValue)
                            console.log('clicked id', getValue())
                        }}
                        type="button">
                        call
                    </button>
                ),
            },
        ],
        []
    )

    return columns
}

export default useColumns
