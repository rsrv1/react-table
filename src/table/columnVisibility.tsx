import { Column, Table } from '@tanstack/react-table'
import React from 'react'
import { _shuffle } from './utils'
import { Reorder } from 'framer-motion'
import { DotsNine } from 'phosphor-react'
import { MenuButton, MenuDivider } from '@szhsin/react-menu'
import { Menu, MenuItem } from './Menu'
import { Gear } from 'phosphor-react'
import { useTableState } from './context/tableContext'
import { actionType as requestActionType } from './context/reducer/request'

function ColumnVisibility<T>({ table, onResetColumnOrder }: { table: Table<T>; onResetColumnOrder?: () => void }) {
    const { request } = useTableState()

    const randomizeColumns = () => {
        table.setColumnOrder(_shuffle(table.getAllLeafColumns().map(d => d.id)))
    }

    const reOrderHandler = (data: Column<T>[]) => {
        request.dispatch({ type: requestActionType.COLUMN_RE_POSITIONING, payload: true })

        table.setColumnOrder(data.map((c: Column<T>) => c.id))
    }

    return (
        <div>
            <Menu
                className="px-3 min-w-[10rem]"
                menuButton={
                    <MenuButton>
                        <Gear weight="regular" className="w-5 h-5 hover:text-gray-700" aria-hidden="true" />
                    </MenuButton>
                }
                direction={'bottom'}
                align={'end'}
                viewScroll={'auto'}
                overflow={'auto'}
                position={'auto'}
                transition>
                <MenuItem
                    className="!p-0"
                    onClick={(e: any) => {
                        e.stopPropagation = true
                        e.keepOpen = true
                    }}>
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
                </MenuItem>
                <MenuDivider className="h-px bg-gray-200 mx-2.5 my-1.5" />
                <MenuItem onClick={onResetColumnOrder} className="hover:bg-gray-100 hover:text-gray-700 px-3 py-1">
                    Reset Order
                </MenuItem>
            </Menu>

            {/* <div className="flex flex-wrap gap-2">
                <button onClick={randomizeColumns} className="border p-1">
                    Reorder Columns
                </button>
            </div> */}
        </div>
    )
}

export default ColumnVisibility
