'use client'

import React from 'react'
import useTableData, { Query, Response } from './table/hooks/useTableData'
import useTableHandlers from './table/hooks/useTableHandlers'
import useColumns from './useColumns'
import useTable from './table/hooks/useTable'
import { ColumnOrderState, Table } from '@tanstack/react-table'
import { KeyedMutator, SWRResponse } from 'swr'
import { fetchData, Person } from './data/fetchData'
import { useSearchParams } from 'next/navigation'
import { getFilterQueryKey, getQueryKey } from './table/utils'

export type RenderProps<T> = {
    table: Table<T>
    resetColumnOrder: () => void
    isColumnPositioning: boolean
    stopColumnPositioning: () => void
    rowSelectionCount: number
    mutate: KeyedMutator<Response<T>>
    total: number
    loading: boolean
    options: Query | null
}

export type Props = {
    children: (args: RenderProps<Person>) => JSX.Element
}

export const URI_QUERY_PREFIX = 'person'

function useHydrateFiltersFromRouteQuery() {
    const searchParams = useSearchParams()

    const age = getFilterQueryKey(URI_QUERY_PREFIX, 'age')
    const status = getFilterQueryKey(URI_QUERY_PREFIX, 'status')

    const ageFilterValue = searchParams.get(age)
    const statusFilterValue = searchParams.get(status)

    const filter = React.useMemo(() => {
        if (!searchParams.get(getQueryKey(URI_QUERY_PREFIX, 'filter'))) return undefined

        return (searchParams.get(getQueryKey(URI_QUERY_PREFIX, 'filter')) as string)
            .split(',')
            .reduce(
                (acc: { [k: string]: string }, key: string) =>
                    Object.assign({}, acc, { [key]: searchParams.get(getFilterQueryKey(URI_QUERY_PREFIX, key)) }),
                {}
            )
    }, [ageFilterValue, statusFilterValue])

    return filter
}

function Main({ children }: Props) {
    const filter = useHydrateFiltersFromRouteQuery()

    const fetcher = React.useCallback((args: Query): Promise<Response<Person>> => {
        return fetchData(args)
    }, [])

    const { setPagination, pagination, rowSelectionCount, isColumnPositioning, dataQuery, lastData, loading, options } = useTableData<Person>({
        filter,
        fetcher,
    })

    const { stopColumnPositioning, resetTableUrlQuery } = useTableHandlers()

    const columns = useColumns({
        data: dataQuery.data,
    })

    const { table, resetColumnOrder } = useTable<Person>({
        data: dataQuery.data,
        pagination,
        setPagination,
        columns,
        meta: {
            customFn: (rowIndex, columnId, value) => {
                console.log('customFn', rowIndex, columnId, value)
            },
        },
    })

    return (
        <>
            {children({
                table,
                resetColumnOrder,
                isColumnPositioning,
                stopColumnPositioning,
                rowSelectionCount,
                mutate: dataQuery.mutate,
                total: dataQuery.data?.total || 0,
                loading,
                options,
            })}
        </>
    )
}

export default Main
