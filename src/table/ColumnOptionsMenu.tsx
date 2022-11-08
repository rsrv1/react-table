import React from 'react'
import { MenuButton, MenuDivider } from '@szhsin/react-menu'
import { Header } from '@tanstack/react-table'
import { useColumnSortState, useDispatch, useSettingsState } from './context/tableContext'
import { actionType, sortDirection } from './context/reducer/columnSort'
import { actionType as requestActionType } from './context/reducer/request'
import { Menu, MenuItem } from './Menu'
import useTableHandlers from './hooks/useTableHandlers'
import { buttonClassName, Icon } from './ColumnMenuButton'

export type ColumnOptionsDropdownType<T> = {
    unsortable: boolean
    header: Header<T, unknown>
    name: string
}

function ColumnOptionsDropdown<T>({ unsortable, header, name }: ColumnOptionsDropdownType<T>) {
    const dispatch = useDispatch()
    const columnSort = useColumnSortState()
    const { columnRePositioning } = useSettingsState()
    const { resetSortUrlQuery } = useTableHandlers()
    const columns = columnSort.column
    const canPin = !header.isPlaceholder && header.column.getCanPin()

    const handlePinRight = React.useCallback(() => {
        if (header.column.getIsPinned() === 'right') return

        header.column.pin('right')
    }, [header])

    const handlePinLeft = React.useCallback(() => {
        if (header.column.getIsPinned() === 'left') return

        header.column.pin('left')
    }, [header])

    const handleUnpin = React.useCallback(() => {
        header.column.pin(false)
    }, [header])

    const sortAsc = React.useCallback(() => {
        resetSortUrlQuery(Object.assign({}, columnSort.column, { [name]: sortDirection.ASC }))
        dispatch.columnSort({ type: actionType.MUTATE, payload: { column: name, direction: sortDirection.ASC } })
    }, [name, dispatch, resetSortUrlQuery, columnSort.column])

    const sortDesc = React.useCallback(() => {
        resetSortUrlQuery(Object.assign({}, columnSort.column, { [name]: sortDirection.DESC }))
        dispatch.columnSort({ type: actionType.MUTATE, payload: { column: name, direction: sortDirection.DESC } })
    }, [name, dispatch, resetSortUrlQuery, columnSort.column])

    const unsort = React.useCallback(() => {
        let clonedColumnState = { ...columnSort.column }
        delete clonedColumnState[name]
        resetSortUrlQuery(clonedColumnState)

        dispatch.columnSort({ type: actionType.REMOVE, payload: name })
    }, [name, dispatch, resetSortUrlQuery, columnSort.column])

    const startColumnRepositioning = React.useCallback(() => {
        dispatch.settings({ type: requestActionType.COLUMN_RE_POSITIONING, payload: true })
    }, [dispatch])

    const hide = React.useCallback(
        (e: React.MouseEvent<HTMLInputElement>) => {
            header.column.toggleVisibility(false)
        },
        [header]
    )

    return (
        <Menu
            transition={true}
            direction={'bottom'}
            align={'end'}
            viewScroll={'auto'}
            overflow={'auto'}
            position={'auto'}
            menuButton={<MenuButton className={buttonClassName}>{Icon}</MenuButton>}>
            {unsortable || (
                <>
                    <MenuItem disabled={!columns[name]} onClick={unsort}>
                        Unsort
                    </MenuItem>
                    <MenuItem disabled={columns[name] === sortDirection.ASC} onClick={sortAsc}>
                        Sort by ASC
                    </MenuItem>
                    <MenuItem disabled={columns[name] === sortDirection.DESC} onClick={sortDesc}>
                        Sort by DESC
                    </MenuItem>{' '}
                    <MenuDivider className="h-px bg-gray-200 mx-2.5 my-1.5" />
                </>
            )}
            {canPin && (
                <>
                    <MenuItem disabled={header.column.getIsPinned() === 'right'} onClick={handlePinRight}>
                        Pin to right
                    </MenuItem>
                    <MenuItem disabled={header.column.getIsPinned() === 'left'} onClick={handlePinLeft}>
                        Pin to left
                    </MenuItem>
                    <MenuItem disabled={!header.column.getIsPinned()} onClick={handleUnpin}>
                        Unpin
                    </MenuItem>{' '}
                    <MenuDivider className="h-px bg-gray-200 mx-2.5 my-1.5" />
                </>
            )}

            <MenuItem disabled={columnRePositioning} onClick={startColumnRepositioning}>
                Reposition
            </MenuItem>
            <MenuItem type="checkbox" checked={header.column.getIsVisible()} onClick={hide}>
                Hide
            </MenuItem>
        </Menu>
    )
}

export default ColumnOptionsDropdown
