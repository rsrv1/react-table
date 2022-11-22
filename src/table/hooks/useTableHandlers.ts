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
        isSelectedGetter,
        stopColumnPositioning,
        resetSortUrlQuery,
    }
}

export default useTableHandlers
