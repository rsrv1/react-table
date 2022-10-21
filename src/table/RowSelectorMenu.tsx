import React from 'react'
import { MenuButton } from '@szhsin/react-menu'
import { useTableState } from './context/tableContext'
import { Menu, MenuItem } from './Menu'
import DownArrowIcon from '../components/DownArrowIcon'
import useTableHandlers from './hooks/useTableHandlers'

function RowSelectorMenu<T>({ rowSelectionCount }: { rowSelectionCount: number }) {
    const { rowSelection } = useTableState()
    const { all } = rowSelection.state
    const { resetRowSelection, handleSelectAll, handleSelectAllCurrentPage } = useTableHandlers()

    return (
        <Menu
            transition={true}
            direction={'bottom'}
            align={'end'}
            viewScroll={'auto'}
            overflow={'auto'}
            position={'auto'}
            menuButton={
                <MenuButton className="flex items-center rounded-full group hover:bg-gray-200/80 p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                    <DownArrowIcon className="w-5 h-5 fill-gray-400 group-hover:fill-gray-700" />
                </MenuButton>
            }>
            <MenuItem onClick={resetRowSelection} disabled={rowSelectionCount === 0}>
                de-select all
            </MenuItem>
            <MenuItem onClick={handleSelectAll}>{all && '✔'} Select Everything</MenuItem>
            <MenuItem onClick={handleSelectAllCurrentPage}>{!all && rowSelectionCount > 0 && '✔'}Select Current Page</MenuItem>
        </Menu>
    )
}

export default RowSelectorMenu
