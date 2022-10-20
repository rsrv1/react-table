import { Column, Table } from '@tanstack/react-table'
import React from 'react'
import { _shuffle } from './utils'
import { Reorder } from 'framer-motion'
import { DotsNine } from 'phosphor-react'

function ColumnVisibility<T>({ table, onResetColumnOrder }: { table: Table<T>; onResetColumnOrder?: () => void }) {
    const randomizeColumns = () => {
        table.setColumnOrder(_shuffle(table.getAllLeafColumns().map(d => d.id)))
    }

    const reOrderHandler = (data: Column<T>[]) => table.setColumnOrder(data.map((c: Column<T>) => c.id))

    return (
        <>
            <details className="w-48">
                <summary className="cursor-pointer">Column Visibility:</summary>

                <div className="mt-2 inline-block border bg-white border-gray-100 shadow rounded py-2 w-full">
                    <div className="px-2 pb-2 border-b border-gray-100">
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
                                    <div className="px-2 flex justify-between space-y-1 items-center">
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
                                        <span className="p-1 cursor-grab bg-gray-100">
                                            <DotsNine weight="regular" className="w-4 h-4 text-gray-800" aria-hidden="true" />
                                        </span>
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
