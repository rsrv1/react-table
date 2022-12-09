import { Column, Table } from '@tanstack/react-table'
import React, { Suspense } from 'react'
import { _shuffle } from '../utils'
import { MenuButton, MenuDivider } from '@szhsin/react-menu'
import { Menu, MenuItem } from '../components/Menu'
import { Gear } from 'phosphor-react'
import dynamic from 'next/dynamic'
import { useSettingsState } from '../context/tableContext'
import { StoreColumnSize } from '../PersistPreference'

const MotionReorderMenuGroup = dynamic(() => import(/* webpackPrefetch: true */ './MotionReorderMenuGroup'), {
    suspense: true,
})

function ColumnVisibility<T>({ table, onResetColumnOrder }: { table: Table<T>; onResetColumnOrder?: () => void }) {
    const { uriQueryPrefix } = useSettingsState()
    const randomizeColumns = () => {
        table.setColumnOrder(_shuffle(table.getAllLeafColumns().map(d => d.id)))
    }

    const resetColumnSizing = () => {
        const store = new StoreColumnSize(uriQueryPrefix)
        store.flush()
        table.resetColumnSizing()
    }

    const [showColumnOptionsMenu, setShowColumnOptionsMenu] = React.useState(false)

    return (
        <div>
            <Menu
                className="px-3 min-w-[10rem]"
                menuButton={
                    <MenuButton
                        onMouseEnter={() => setShowColumnOptionsMenu(true)}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
                    {showColumnOptionsMenu && (
                        <Suspense fallback={'loading'}>
                            <MotionReorderMenuGroup<T> table={table} />
                        </Suspense>
                    )}
                </MenuItem>
                <MenuDivider className="h-px bg-gray-200 mx-2.5 my-1.5" />
                <MenuItem onClick={onResetColumnOrder} className="hover:bg-gray-100 hover:text-gray-700 px-3 py-1">
                    Reset Order
                </MenuItem>
                <MenuItem onClick={resetColumnSizing} className="hover:bg-gray-100 hover:text-gray-700 px-3 py-1">
                    Reset Column Sizes
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
