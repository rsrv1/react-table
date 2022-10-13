import { Table } from '@tanstack/react-table'
import React from 'react'
import { Person } from './data/fetchData'
import { _shuffle } from './utils'

function ColumnVisibility({ table }: { table: Table<Person> }) {
    const randomizeColumns = () => {
        table.setColumnOrder(_shuffle(table.getAllLeafColumns().map(d => d.id)))
    }

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
                    {table.getAllLeafColumns().map(column => {
                        return (
                            <div key={column.id} className="px-1">
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
                        )
                    })}
                </div>

                <div className="h-4" />
                <div className="flex flex-wrap gap-2">
                    <button onClick={randomizeColumns} className="border p-1">
                        Reorder Columns
                    </button>
                </div>
            </details>

            <div className="h-4" />
        </>
    )
}

export default ColumnVisibility
