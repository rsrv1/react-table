import React from 'react'
import { flexRender, Table as TanstackTable, Row } from '@tanstack/react-table'
import ColumnHeader from './ColumnHeader'
import clsx from 'clsx'

type tablePosition = 'left' | 'center' | 'right'

const getHeaderGroups = <T,>(position: tablePosition, table: TanstackTable<T>) => {
    if (position === 'left') return table.getLeftHeaderGroups()
    if (position === 'right') return table.getRightHeaderGroups()
    if (position === 'center') return table.getCenterHeaderGroups()
    return table.getHeaderGroups()
}

function Renderer<T>({
    table,
    validating,
    loading,
    children,
    position = 'center',
}: {
    table: TanstackTable<T>
    validating: boolean
    loading: boolean
    children: React.ReactNode
    position?: tablePosition
}) {
    const [refreshing, setRefreshing] = React.useState(false)

    /** handling swr validating state UI */
    React.useEffect(() => {
        if (validating && !loading) {
            setRefreshing(true)
        }
    }, [validating, loading])

    React.useEffect(() => {
        if (!refreshing) return

        const timer = setTimeout(() => {
            setRefreshing(false)
        }, 550)

        return () => {
            clearTimeout(timer)
        }
    }, [refreshing])
    /** handling swr validating state UI */

    return (
        <table className={clsx('divide-y divide-gray-300 table-fixed', position === 'center' || 'shadow bg-gray-100/80')}>
            <thead className={clsx(refreshing ? 'bg-white' : 'bg-gray-50')}>
                {getHeaderGroups(position, table).map(headerGroup => (
                    <tr key={headerGroup.id} className="relative">
                        {headerGroup.headers.map(header =>
                            ['_expand'].includes(header.id) ? (
                                <th key={header.id}></th>
                            ) : (
                                <ColumnHeader<T>
                                    key={header.id}
                                    position={position}
                                    header={header}
                                    table={table}
                                    unsortable={header.id.startsWith('_') || ['id'].includes(header.id)}
                                    rowSelector={header.id === 'id'}
                                    name={header.id}
                                    className={clsx(header.id === 'firstName' && 'min-w-[20rem]', 'whitespace-nowrap')}>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </ColumnHeader>
                            )
                        )}
                        <th
                            className={clsx(
                                'absolute inset-0',
                                refreshing ? 'transition-[width] duration-700 ease-in-out w-full bg-slate-300/20' : 'w-0 bg-transparent'
                            )}
                        />
                    </tr>
                ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
        </table>
    )
}

export default Renderer
