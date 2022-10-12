import React from 'react'
import { createColumnHelper, Row, Table } from '@tanstack/react-table'
import { Person } from './data/fetchData'
import IndeterminateCheckbox from './components/IndeterminateCheckbox'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { RootState } from './redux/store'
import {
    selectAll,
    reset,
    selectAllCurrentPageRows,
    addToOnly,
    removeFromOnly,
    isSelected,
    addToExcept,
    removeFromExcept,
} from './redux/slice/rowSelection'
import useTotalRowSelectionCount from './useTotalRowSelectionCount'
import { Response } from '../pages/api/persons'
import Select from './components/Select'

const columnHelper = createColumnHelper<Person>()

function useColumns(data: undefined | Response) {
    const dispatch = useAppDispatch()
    const { all } = useAppSelector((state: RootState) => state.rowSelection)
    const isSelectedGetter = useAppSelector(isSelected)
    const [bulkSelectionType, setBulkSelectionType] = React.useState('_')
    const totalSelectionCount = useTotalRowSelectionCount(data)

    // takes care of the select all page rows click
    const handleSelectAll = () => {
        dispatch(reset())
        dispatch(selectAll())
    }

    // takes care of all rows selection of the current page
    const handleSelectAllCurrentPage = () => {
        dispatch(reset())
        dispatch(selectAllCurrentPageRows(true)) // enable the flag
    }

    // row item check/uncheck
    const handleCellSelectChange = (event: React.FormEvent<HTMLInputElement>, id: string) => {
        const isChecked = (event.target as HTMLInputElement).checked

        if (all) {
            if (isChecked) dispatch(removeFromExcept(id))
            else dispatch(addToExcept(id))

            return
        }

        if (isChecked) dispatch(addToOnly(id))
        else dispatch(removeFromOnly(id))
    }

    const handleBulkSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value
        setBulkSelectionType(selected)

        if (selected === 'all') {
            return handleSelectAll()
        }

        if (selected === 'current') {
            return handleSelectAllCurrentPage()
        }

        dispatch(reset())
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
                        }}
                    />
                ),
                header: ({ table }) => (
                    <Select className="py-1 pl-2 pr-5 font-normal" value={bulkSelectionType} onChange={handleBulkSelectionChange}>
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
        [data, totalSelectionCount]
    )

    return columns
}

export default useColumns
