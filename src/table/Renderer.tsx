import React from 'react'
import { flexRender, Table as TanstackTable, Row } from '@tanstack/react-table'
import ColumnHeader from './ColumnHeader'
import clsx from 'clsx'
import ValidatingIndicator from './ValidatingIndicator'

type tablePosition = 'left' | 'center' | 'right'

const getHeaderGroups = <T,>(position: tablePosition, table: TanstackTable<T>) => {
    if (position === 'left') return table.getLeftHeaderGroups()
    if (position === 'right') return table.getRightHeaderGroups()
    if (position === 'center') return table.getCenterHeaderGroups()
    return table.getHeaderGroups()
}

function Renderer<T>({
    table,
    children,
    className,
    position = 'center',
}: {
    table: TanstackTable<T>
    children: React.ReactNode
    className?: string
    position?: tablePosition
}) {
    const headerGroups = getHeaderGroups(position, table)
    const resetPageIndex = React.useCallback(() => table.resetPageIndex(), [])
    const setColumnOrder = React.useMemo(() => table.setColumnOrder, [])
    const pagination = table.getState().pagination
    const columnOrder = table.getState().columnOrder

    return headerGroups.length === 0 ? null : (
        <table className={clsx('divide-y divide-gray-300 table-fixed ', position === 'center' ? 'w-full' : 'shadow bg-gray-100/80', className)}>
            <thead className="bg-gray-50">
                {headerGroups.map(headerGroup => (
                    <tr key={headerGroup.id} className="relative">
                        {headerGroup.headers.map(header =>
                            ['_expand'].includes(header.id) ? (
                                <th key={header.id} className="w-9"></th>
                            ) : (
                                <ColumnHeader<T>
                                    key={header.id}
                                    position={position}
                                    header={header}
                                    pagination={pagination}
                                    columnOrder={columnOrder}
                                    setColumnOrder={setColumnOrder}
                                    resetPageIndex={resetPageIndex}
                                    unsortable={header.id.startsWith('_') || ['id'].includes(header.id)}
                                    rowSelector={header.id === 'id'}
                                    name={header.id}
                                    className="whitespace-nowrap">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </ColumnHeader>
                            )
                        )}
                    </tr>
                ))}
                <ValidatingIndicator />
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
        </table>
    )
}

export default Renderer
