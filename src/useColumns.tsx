import React from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { Person } from './data/fetchData'
import IndeterminateCheckbox from './components/IndeterminateCheckbox'

const columnHelper = createColumnHelper<Person>()

function useColumns() {
    const columns = [
        columnHelper.accessor('_check', {
            id: '_select',
            cell: ({ getValue, row, column: { id }, table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: row.getIsSelected(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                />
            ),
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
        }),
        columnHelper.accessor('_expand', {
            header: () => null,
            cell: ({ row }) => {
                return row.getCanExpand() ? (
                    <button
                        {...{
                            onClick: row.getToggleExpandedHandler(),
                            style: { cursor: 'pointer' },
                        }}>
                        {row.getIsExpanded() ? '👇' : '👉'}
                    </button>
                ) : (
                    '🔵'
                )
            },
        }),
        columnHelper.accessor('firstName', {
            cell: ({ row, getValue }) => (
                <div
                    style={{
                        paddingLeft: `${row.depth * 2}rem`,
                    }}>
                    {getValue()}
                </div>
            ),
        }),
        columnHelper.accessor(row => row.lastName, {
            id: 'lastName',
            cell: info => <i>{info.getValue()}</i>,
            header: () => <span>Last Name</span>,
        }),
        columnHelper.accessor('age', {
            header: () => 'Age',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
        }),
        columnHelper.accessor('progress', {
            header: 'Profile Progress',
            cell: info => (
                <span>
                    {info.row.original.lastName}-{info.row.original.age}
                </span>
            ),
        }),
        columnHelper.accessor('_action', {
            header: 'Action',
            cell: ({ getValue, row: { index }, column: { id }, table }) => (
                <button
                    onClick={() => {
                        table.options.meta?.customFn(index, id, getValue)
                        console.log('clicked', index, getValue, id)
                    }}
                    type="button">
                    call
                </button>
            ),
        }),
    ]

    return columns
}

export default useColumns
