import { Column, Table } from '@tanstack/react-table'
import React from 'react'
import { _shuffle } from './utils'
import { Reorder } from 'framer-motion'

function ColumnVisibility<T>({ table, onResetColumnOrder }: { table: Table<T>; onResetColumnOrder?: () => void }) {
    const randomizeColumns = () => {
        table.setColumnOrder(_shuffle(table.getAllLeafColumns().map(d => d.id)))
    }

    const reOrderHandler = (data: Column<T>[]) => table.setColumnOrder(data.map((c: Column<T>) => c.id))

    return (
        <>
            <details className="w-40">
                <summary className="cursor-pointer">Column Visibility:</summary>

                <div className="inline-block border border-black shadow rounded">
                    <div className="px-1 border-b border-black">
                        <label>
                            <input
                                {...{
                                    type: 'checkbox',
                                    checked: table.getIsAllColumnsVisible(),
                                    onChange: table.getToggleAllColumnsVisibilityHandler(),
                                }}
                            />{' '}
                            Toggle All
                        </label>
                    </div>

                    <Reorder.Group values={table.getAllLeafColumns()} onReorder={reOrderHandler} className="">
                        {table.getAllLeafColumns().map(column => {
                            return (
                                <Reorder.Item transition={{ damping: 0 }} key={column.id} value={column}>
                                    <div className="px-1">
                                        <label>
                                            <input
                                                {...{
                                                    type: 'checkbox',
                                                    checked: column.getIsVisible(),
                                                    onChange: column.getToggleVisibilityHandler(),
                                                }}
                                            />{' '}
                                            {column.id}
                                        </label>
                                    </div>
                                </Reorder.Item>
                            )
                        })}
                    </Reorder.Group>
                </div>

                <div className="h-4" />
                <div className="flex flex-wrap gap-2">
                    <button onClick={randomizeColumns} className="border p-1">
                        Reorder Columns
                    </button>

                    <button onClick={onResetColumnOrder} className="border p-1">
                        Reset Order
                    </button>
                </div>
            </details>

            <div className="h-4" />
        </>
    )
}

export default ColumnVisibility
