import React from 'react'
import { createColumnHelper, Row, Table } from '@tanstack/react-table'
import { Person } from './data/fetchData'
import IndeterminateCheckbox from './components/IndeterminateCheckbox'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { RootState } from './redux/store'
import {
    selectAll,
    reset,
    selectCurrentPageAll,
    selectAllCurrentPageRows,
    addToOnly,
    removeFromOnly,
    isSelected,
    addToExcept,
    removeFromExcept,
} from './redux/slice/rowSelection'
import clsx from 'clsx'

const columnHelper = createColumnHelper<Person>()

function useColumns() {
    const dispatch = useAppDispatch()
    const { all, only } = useAppSelector((state: RootState) => state.rowSelection)
    const isSelectedGetter = useAppSelector(isSelected)

    // takes care of the select all page rows click
    const handleSelectAll = (table: Table<Person>) => {
        table.resetRowSelection(true)
        dispatch(reset())
        dispatch(selectAll())
    }

    // takes care of all rows selection of the current page
    const handleSelectAllCurrentPage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, table: Table<Person>) => {
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

    const columns = [
        // memoize
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
                <div className="flex items-center">
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected() || all,
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                    />
                    <div className="flex flex-col text-xs font-medium space-y-1 ml-1">
                        <button onClick={() => handleSelectAll(table)} type="button" className={clsx('border border-gray-400 px-1 py-0')}>
                            all
                        </button>
                        <button
                            onClick={event => handleSelectAllCurrentPage(event, table)}
                            type="button"
                            className={clsx('border border-gray-400 px-1 py-0')}>
                            this page select all
                        </button>
                    </div>
                </div>
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
