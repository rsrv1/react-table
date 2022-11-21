import React from 'react'
import { isSelected } from '../context/reducer/rowSelection'
import { useDispatch, useRowSelectionState } from '../context/tableContext'
import { actionType } from '../context/reducer/rowSelection'
import { actionType as requestActionType } from '../context/reducer/request'
import { sortDirection } from '../context/reducer/columnSort'
import { NextRouter, useRouter } from 'next/router'
import useRouteKey from './useRouteKey'

function useTableHandlers() {
    const dispatch = useDispatch()
    const router = useRouter()
    const getRouteKey = useRouteKey()
    const rowSelection = useRowSelectionState()

    const isSelectedGetter = React.useMemo(() => isSelected(rowSelection), [rowSelection])

    const resetRowSelection = React.useCallback(() => {
        dispatch.rowSelection({ type: actionType.RESET })
    }, [dispatch])

    // takes care of the select all page rows click
    const handleSelectAll = React.useCallback(() => {
        dispatch.rowSelection({ type: actionType.RESET })
        dispatch.rowSelection({ type: actionType.SELECT_ALL })
    }, [dispatch])

    // takes care of all rows selection of the current page
    const handleSelectAllCurrentPage = React.useCallback(() => {
        dispatch.rowSelection({ type: actionType.RESET })
        dispatch.rowSelection({ type: actionType.WANT_CURRENT_PAGE, payload: true }) // enable the flag
    }, [dispatch])

    const handleRemoveFromExcept = React.useCallback(
        (id: string) => {
            dispatch.rowSelection({ type: actionType.REMOVE_FROM_EXCEPT, payload: id })
        },
        [dispatch]
    )

    const handleAddToExcept = React.useCallback(
        (id: string) => {
            dispatch.rowSelection({ type: actionType.ADD_TO_EXCEPT, payload: id })
        },
        [dispatch]
    )

    const handleAddToOnly = React.useCallback(
        (id: string) => {
            dispatch.rowSelection({ type: actionType.ADD_TO_ONLY, payload: id })
        },
        [dispatch]
    )
    const handleRemoveFromOnly = React.useCallback(
        (id: string) => {
            dispatch.rowSelection({ type: actionType.REMOVE_FROM_ONLY, payload: id })
        },
        [dispatch]
    )

    const stopColumnPositioning = React.useCallback(() => {
        dispatch.settings({ type: requestActionType.COLUMN_RE_POSITIONING, payload: false })
    }, [dispatch])

    const resetSortUrlQuery = React.useCallback(
        (columns: { [key: string]: sortDirection }) => {
            if (Object.keys(columns).length === 0) {
                router.push({ query: Object.assign({}, router.query, { [getRouteKey('page')]: 0, [getRouteKey('sort')]: '' }) }, undefined, {
                    shallow: true,
                })
                return
            }

            router.push(
                {
                    query: Object.assign({}, router.query, {
                        [getRouteKey('page')]: 0,
                        [getRouteKey('sort')]: Object.keys(columns)
                            .map(column => `${columns[column] === sortDirection.ASC ? '' : '-'}${column}`)
                            .join(','),
                    }),
                },
                undefined,
                { shallow: true }
            )
        },
        [router, getRouteKey]
    )

    return {
        resetRowSelection,
        isSelectedGetter,
        handleSelectAll,
        handleSelectAllCurrentPage,
        handleRemoveFromExcept,
        handleAddToExcept,
        handleAddToOnly,
        handleRemoveFromOnly,
        stopColumnPositioning,
        resetSortUrlQuery,
    }
}

export default useTableHandlers
