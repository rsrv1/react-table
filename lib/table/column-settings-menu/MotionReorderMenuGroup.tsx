import { Column, Table } from '@tanstack/react-table'
import React, { Suspense } from 'react'
import { _shuffle } from '../utils'
import { Reorder } from 'framer-motion'
import { DotsNine } from 'phosphor-react'
import { useDispatch } from '../context/tableContext'
import { actionType as requestActionType } from '../context/reducer/request'

function MotionReorderMenuGroup<T>({ table }: { table: Table<T> }) {
    const dispatch = useDispatch()

    const reOrderHandler = React.useCallback(
        (data: Column<T>[]) => {
            dispatch.settings({ type: requestActionType.COLUMN_RE_POSITIONING, payload: true })

            table.setColumnOrder(data.map((c: Column<T>) => c.id))
        },
        [dispatch, table]
    )

    return (
        <div className="inline-block bg-white rounded w-full">
            {/* <div className="border-b border-gray-100">
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
                        </div> */}

            <Reorder.Group values={table.getAllLeafColumns()} onReorder={reOrderHandler} className="space-y-2">
                {table.getAllLeafColumns().map(column => {
                    return (
                        <Reorder.Item transition={{ damping: 0 }} key={column.id} value={column} className="bg-slate-50">
                            <div className="flex justify-between space-y-1 items-center">
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
    )
}

export default MotionReorderMenuGroup
