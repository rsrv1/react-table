import React from 'react'
import { createColumnHelper, Row, Table } from '@tanstack/react-table'
import { Person } from './data/fetchData'
import IndeterminateCheckbox from './components/IndeterminateCheckbox'
import Select from './components/Select'

const columnHelper = createColumnHelper<Person>()

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
}) {
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

    const columns = React.useMemo(
        () => [
            columnHelper.accessor('id', {
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
        ],
        [data, rowSelectionCount, loading]
    )

    return columns
}

export default useColumns
