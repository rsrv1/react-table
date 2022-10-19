import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Person } from './data/fetchData'
import IndeterminateCheckbox from './components/IndeterminateCheckbox'
import Select from './components/Select'
import { Response } from './table/hooks/useTableData'

type Args = {
    resetRowSelection: () => void
    handleSelectAll: () => void
    isSelectedGetter: (id: string) => boolean
    handleSelectAllCurrentPage: () => void
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
    resetRowSelection,
    handleSelectAll,
    isSelectedGetter,
    handleSelectAllCurrentPage,
    handleRemoveFromExcept,
    handleAddToExcept,
    handleAddToOnly,
    handleRemoveFromOnly,
    data,
    loading,
    allRowSelected,
    rowSelectionCount,
}: Args): ColumnDef<Person, any>[] {
    const [bulkSelectionType, setBulkSelectionType] = React.useState('_')

    const handleBulkSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value
        setBulkSelectionType(selected)

        if (selected === 'all') {
            return handleSelectAll()
        }

        if (selected === 'current') {
            return handleSelectAllCurrentPage()
        }

        resetRowSelection()
    }

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

    const columns: ColumnDef<Person>[] = React.useMemo(
        () => [
            {
                accessorKey: 'id',
                id: 'id',
                cell: ({ getValue, row, column: { id }, table }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: isSelectedGetter(getValue()),
                            indeterminate: false,
                            onChange: e => handleCellSelectChange(e, getValue()),
                            disabled: loading,
                        }}
                    />
                ),
                header: ({ table }) => (
                    <Select className="!pl-2 !pr-5 font-normal" value={bulkSelectionType} onChange={handleBulkSelectionChange} disabled={loading}>
                        <option value="_">select</option>
                        <option value="all">all</option>
                        <option value="current">this page</option>
                    </Select>
                ),
            },
            {
                accessorKey: '_expand',
                id: '_expand',
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
