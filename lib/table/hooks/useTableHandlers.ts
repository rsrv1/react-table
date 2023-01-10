import React from 'react'
import { isSelected } from '../context/reducer/rowSelection'
import { useDispatch, useRowSelectionState, useSettingsState } from '../context/tableContext'
import { actionType as requestActionType } from '../context/reducer/request'
import { sortDirection } from '../context/reducer/columnSort'
import { useRouter, useSearchParams } from 'next/navigation'
import useRouteKey from './useRouteKey'
import { getFilterQueryKey } from '../utils'
import urlcat from 'urlcat'

function useTableHandlers() {
    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const router = useRouter()
    const getRouteKey = useRouteKey()
    const rowSelection = useRowSelectionState()
    const { uriQueryPrefix: prefix } = useSettingsState()

    const searchParamString = searchParams.toString()

    const isSelectedGetter = React.useMemo(() => isSelected(rowSelection), [rowSelection])

    const stopColumnPositioning = React.useCallback(() => {
        dispatch.settings({ type: requestActionType.COLUMN_RE_POSITIONING, payload: false })
    }, [dispatch])

    const resetSortUrlQuery = React.useCallback(
        (columns: { [key: string]: sortDirection }) => {
            if (Object.keys(columns).length === 0) {
                router.push(
                    urlcat(
                        '',
                        '/',
                        Object.assign({}, Object.fromEntries(searchParams.entries()), { [getRouteKey('page')]: 0, [getRouteKey('sort')]: '' })
                    )
                )

                return
            }

            router.push(
                urlcat(
                    '',
                    '/',
                    Object.assign({}, Object.fromEntries(searchParams.entries()), {
                        [getRouteKey('page')]: 0,
                        [getRouteKey('sort')]: Object.keys(columns)
                            .map(column => `${columns[column] === sortDirection.ASC ? '' : '-'}${column}`)
                            .join(','),
                    })
                )
            )
        },
        [router, getRouteKey, searchParamString]
    )

    const resetTableUrlQuery = React.useCallback(() => {
        const filter = (query: { [key: string]: string }) => {
            ;['page', 'search', 'perPage', 'sort'].forEach(k => {
                delete query[getRouteKey(k)]
            })

            const filters = query[getRouteKey('filter')]
            const currentFilters = filters ? decodeURIComponent(filters as string).split(',') : []

            currentFilters.forEach(filterName => {
                delete query[getFilterQueryKey(prefix, filterName)]
            })

            delete query[getRouteKey('filter')]

            return query
        }

        router.push(urlcat('', '/', filter(Object.fromEntries(searchParams.entries()) as { [key: string]: string })))
    }, [router, getRouteKey, prefix, searchParamString])

    return {
        isSelectedGetter,
        stopColumnPositioning,
        resetSortUrlQuery,
        resetTableUrlQuery,
    }
}

export default useTableHandlers
