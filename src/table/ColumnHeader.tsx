import React, { Suspense } from 'react'
import clsx from 'clsx'
import { useColumnSortState, useDispatch, useLoadingState, useRowSelectionState, useSettingsState } from './context/tableContext'
import { actionType, sortDirection, state as columnSortStateType } from './context/reducer/columnSort'
import { Column, ColumnOrderState, Header, Table } from '@tanstack/react-table'
import { useDrag, useDrop } from 'react-dnd'
import { ArrowsDownUp, DotsNine, SortAscending, SortDescending } from 'phosphor-react'
import IndeterminateCheckbox from './IndeterminateCheckbox'
import useTableHandlers from './hooks/useTableHandlers'
import RowSelectorMenu from './RowSelectorMenu'
import { FakeColumnMenuButton } from './ColumnMenuButton'
import dynamic from 'next/dynamic'

type Props<T> = {
    table: Table<T>
    header: Header<T, unknown>
    name: string
    unsortable: boolean
    rowSelector?: boolean
    rowSelectionCount: number
    children: React.ReactNode
    position?: 'left' | 'center' | 'right'
    className?: string
}

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
    columnOrder.splice(columnOrder.indexOf(targetColumnId), 0, columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string)
    return [...columnOrder]
}

const ColumnOptionsMenu = dynamic(() => import('./ColumnOptionsMenu'), {
    suspense: true,
})

const IconNotSorting = () => (
    <div className="hover:bg-slate-200 p-1.5 inline-flex rounded-full text-gray-300 hover:text-gray-600">
        <ArrowsDownUp size={16} className="font-medium" />
    </div>
)
const IconDescending = () => (
    <div className="bg-sky-50 hover:bg-sky-100 p-1 inline-flex w-6 rounded-full">
        <SortDescending size={18} weight="bold" className="font-medium text-sky-500" />
    </div>
)
const IconAscending = () => (
    <div className="bg-sky-50 p-1 inline-flex w-6 rounded-full">
        <SortAscending size={18} weight="bold" className="font-medium text-sky-500" />
    </div>
)

function ColumnHeader<T>({ table, position, header, name, unsortable, rowSelector, rowSelectionCount, children, className }: Props<T>) {
    const dispatcher = useDispatch()
    const columnSort = useColumnSortState()
    const rowSelection = useRowSelectionState()
    const loading = useLoadingState()
    const { columnRePositioning } = useSettingsState()
    const { resetRowSelection, handleSelectAllCurrentPage, resetSortUrlQuery } = useTableHandlers()
    const dispatch = dispatcher.columnSort
    const columns = columnSort.column as columnSortStateType['column']
    const [showColumnOptionsMenu, setShowColumnOptionsMenu] = React.useState(false)
    const { all: allRowSelected, except } = rowSelection
    const pagination = table.getState().pagination

    const { getState, setColumnOrder } = table
    const { columnOrder } = getState()
    const { column } = header

    const [{ isOver, canDrop }, dropRef] = useDrop({
        accept: 'column',
        canDrop: () => !rowSelector,
        drop: (draggedColumn: Column<T>) => {
            const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder)
            setColumnOrder(newColumnOrder)
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    })

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => column,
        type: 'column',
    })

    const handleSort = () => {
        table.resetPageIndex()

        if (!columns[name]) {
            resetSortUrlQuery(Object.assign({}, columnSort.column, { [name]: sortDirection.ASC }))
            dispatch({ type: actionType.MUTATE, payload: { column: name, direction: sortDirection.ASC } })
            return
        }

        if (columns[name] === sortDirection.ASC) {
            resetSortUrlQuery(Object.assign({}, columnSort.column, { [name]: sortDirection.DESC }))
            dispatch({ type: actionType.MUTATE, payload: { column: name, direction: sortDirection.DESC } })
            return
        }

        let clonedColumnState = { ...columnSort.column }
        delete clonedColumnState[name]
        resetSortUrlQuery(clonedColumnState)
        dispatch({ type: actionType.REMOVE, payload: name })
    }

    const isRowSelectionIndeterminate = React.useMemo(
        () =>
            (!allRowSelected && rowSelectionCount > 0 && pagination.pageIndex === 0 && rowSelectionCount < pagination.pageSize) ||
            (!allRowSelected && rowSelectionCount > 0 && pagination.pageIndex > 0 && rowSelectionCount > pagination.pageSize) ||
            (allRowSelected && Object.keys(except).length > 0),
        [allRowSelected, rowSelectionCount, pagination.pageIndex, pagination.pageSize, except]
    )

    const handleBulkRowSelectionChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            resetRowSelection()
            if (isRowSelectionIndeterminate || e.target.checked) {
                handleSelectAllCurrentPage()
                return
            }
        },
        [isRowSelectionIndeterminate, resetRowSelection, handleSelectAllCurrentPage]
    )

    return (
        <th
            ref={dropRef}
            colSpan={header.colSpan}
            onMouseEnter={() => setShowColumnOptionsMenu(true)}
            className={clsx(
                className,
                'relative whitespace-nowrap lg:px-2 py-2.5 text-left text-sm font-semibold text-gray-400',
                isDragging && 'opacity-[0.8] bg-cyan-50 text-cyan-700'
            )}>
            {isOver && !isDragging && (
                <div
                    className={clsx(
                        canDrop ? 'border-sky-200 border-x-sky-500' : 'text-red-700 border-red-200 border-y-red-500',
                        'border-2 absolute inset-0'
                    )}
                />
            )}
            <div ref={previewRef} className={clsx(!rowSelector && 'justify-between items-center', 'flex')}>
                <div className={clsx(!rowSelector && 'flex items-center justify-between')}>
                    <span>
                        {rowSelector ? (
                            <IndeterminateCheckbox
                                {...{
                                    checked: rowSelectionCount > 0 && !isRowSelectionIndeterminate,
                                    className: 'ml-4',
                                    indeterminate: isRowSelectionIndeterminate,
                                    onChange: handleBulkRowSelectionChange,
                                    disabled: loading,
                                }}
                            />
                        ) : (
                            children
                        )}
                    </span>

                    <button
                        onClick={handleSort}
                        disabled={unsortable || columnRePositioning}
                        type="button"
                        className={clsx('flex px-2 ml-1 text-base sm:text-sm')}>
                        {!columns[name] && !unsortable && <IconNotSorting />}
                        {columns[name] && <>{columns[name] === sortDirection.DESC ? <IconDescending /> : <IconAscending />}</>}
                    </button>
                </div>

                <div>
                    {columnRePositioning ? (
                        rowSelector || (position && ['left', 'right'].includes(position)) ? null : (
                            <button ref={dragRef} title="re-position" type="button" className="cursor-grabbing hover:bg-gray-200/80 p-1">
                                <DotsNine weight="regular" className="w-5 h-5 text-gray-600 hover:text-gray-800" aria-hidden="true" />
                            </button>
                        )
                    ) : (
                        <>
                            {rowSelector && <RowSelectorMenu rowSelectionCount={rowSelectionCount} />}
                            {!rowSelector && !showColumnOptionsMenu && <FakeColumnMenuButton />}

                            {!rowSelector && showColumnOptionsMenu && (
                                <Suspense fallback={<FakeColumnMenuButton />}>
                                    <ColumnOptionsMenu<T> unsortable={unsortable} name={name} header={header} />
                                </Suspense>
                            )}
                        </>
                    )}
                </div>
            </div>
        </th>
    )
}

export default ColumnHeader
