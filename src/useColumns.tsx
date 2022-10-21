import React from 'react'
import { ColumnDef, Table, Row } from '@tanstack/react-table'
import { Person } from './data/fetchData'
import IndeterminateCheckbox from './table/IndeterminateCheckbox'
import { Response } from './table/hooks/useTableData'
import ArrowDown from './components/ArrowDown'
import ArrowRight from './components/ArrowRight'

type Args = {
    isSelectedGetter: (id: string) => boolean
    handleRemoveFromExcept: (id: string) => void
    handleAddToExcept: (id: string) => void
    handleAddToOnly: (id: string) => void
    handleRemoveFromOnly: (id: string) => void
    data: Response<Person> | undefined
    loading: boolean
    allRowSelected: boolean
    rowSelectionCount: number
}

function useColumns({
    isSelectedGetter,
    handleRemoveFromExcept,
    handleAddToExcept,
    handleAddToOnly,
    handleRemoveFromOnly,
    data,
    loading,
    allRowSelected,
    rowSelectionCount,
}: Args): ColumnDef<Person, any>[] {
    const handleCellSelectChange = (event: React.FormEvent<HTMLInputElement>, id: string) => {
        const isChecked = (event.target as HTMLInputElement).checked

        if (allRowSelected) {
            if (isChecked) handleRemoveFromExcept(id)
            else handleAddToExcept(id)

            return
        }

        if (isChecked) handleAddToOnly(id)
        else handleRemoveFromOnly(id)
    }

    const handleRowExpand = (table: Table<Person>, row: Row<Person>) => {
        table.resetColumnPinning() // so that expanded row don't break the ui
        row.getToggleExpandedHandler()()
    }

    const columns: ColumnDef<Person>[] = React.useMemo(
        () => [
            {
                accessorKey: 'id',
                id: 'id',
                cell: ({ getValue, row, column: { id }, table }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: isSelectedGetter(getValue() as string),
                            indeterminate: false,
                            onChange: e => handleCellSelectChange(e, getValue() as string),
                            disabled: loading,
                        }}
                    />
                ),
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
                            console.log('clicked', index, getValue, id)
                        }}
                        type="button">
                        call
                    </button>
                ),
            },
        ],
        [data, rowSelectionCount, loading]
    )

    return columns
}

export default useColumns
