import React from 'react'
import clsx from 'clsx'
import { useTableState } from './context/tableContext'
import { actionType, sortDirection } from './context/reducer/columnSort'
import { Column, ColumnOrderState, Header, Table, flexRender } from '@tanstack/react-table'
import { useDrag, useDrop } from 'react-dnd'

type Props<T> = {
    table: Table<T>
    header: Header<T, unknown>
    name: string
    unsortable: boolean
    children: React.ReactNode
    up?: JSX.Element
    down?: JSX.Element
    className?: string
}

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
    columnOrder.splice(columnOrder.indexOf(targetColumnId), 0, columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string)
    return [...columnOrder]
}

function ColumnHeader<T>({
    table,
    header,
    name,
    unsortable,
    children,
    className,
    up = <span>^</span>,
    down = <div className="transform rotate-180">^</div>,
}: Props<T>) {
    const { columnSort } = useTableState()
    const dispatch = columnSort.dispatch
    const columns = columnSort.state.column

    const { getState, setColumnOrder } = table
    const { columnOrder } = getState()
    const { column } = header

    const [, dropRef] = useDrop({
        accept: 'column',
        drop: (draggedColumn: Column<T>) => {
            const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder)
            setColumnOrder(newColumnOrder)
        },
    })

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => column,
        type: 'column',
    })

    const handleSort = () => {
        if (!columns[name]) {
            dispatch({ type: actionType.MUTATE, payload: { column: name, direction: sortDirection.ASC } })
            return
        }

        if (columns[name] === sortDirection.ASC) {
            dispatch({ type: actionType.MUTATE, payload: { column: name, direction: sortDirection.DESC } })
            return
        }

        dispatch({ type: actionType.REMOVE, payload: name })
    }

    return (
        <th ref={dropRef} colSpan={header.colSpan} className={clsx(isDragging && 'opacity-[0.5]')}>
            <div ref={previewRef} className="flex items-center justify-between space-x-2">
                <button onClick={handleSort} disabled={unsortable} type="button" className={clsx('flex justify-between items-center', className)}>
                    <span>{children}</span>

                    {columns[name] && <span className="px-2 ml-1 text-base sm:text-sm">{columns[name] === sortDirection.DESC ? up : down}</span>}
                </button>

                <button ref={dragRef}>🟰</button>

                {!header.isPlaceholder && header.column.getCanPin() && (
                    <div className="flex gap-1 justify-center">
                        {header.column.getIsPinned() !== 'left' ? (
                            <button
                                className="border rounded px-2"
                                onClick={() => {
                                    header.column.pin('left')
                                }}>
                                {'<='}
                            </button>
                        ) : null}
                        {header.column.getIsPinned() ? (
                            <button
                                className="border rounded px-2"
                                onClick={() => {
                                    header.column.pin(false)
                                }}>
                                X
                            </button>
                        ) : null}
                        {header.column.getIsPinned() !== 'right' ? (
                            <button
                                className="border rounded px-2"
                                onClick={() => {
                                    header.column.pin('right')
                                }}>
                                {'=>'}
                            </button>
                        ) : null}
                    </div>
                )}
            </div>
        </th>
    )
}

export default ColumnHeader
