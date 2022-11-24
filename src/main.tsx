import React from 'react'
import useTableData, { Query, Response } from './table/hooks/useTableData'
import useTableHandlers from './table/hooks/useTableHandlers'
import useColumns from './useColumns'
import useTable from './table/hooks/useTable'
import { ColumnOrderState, Table } from '@tanstack/react-table'
import { KeyedMutator, SWRResponse } from 'swr'
import { fetchData, Person } from './data/fetchData'
import { useRouter } from 'next/router'
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
    const router = useRouter()
    const age = getFilterQueryKey(URI_QUERY_PREFIX, 'age')
    const status = getFilterQueryKey(URI_QUERY_PREFIX, 'status')

    const ageFilterValue = router.query[age]
    const statusFilterValue = router.query[status]

    const filter = React.useMemo(() => {
        if (!router.query[getQueryKey(URI_QUERY_PREFIX, 'filter')]) return undefined

        return (router.query[getQueryKey(URI_QUERY_PREFIX, 'filter')] as string)
            .split(',')
            .reduce(
                (acc: { [k: string]: string }, key: string) =>
                    Object.assign({}, acc, { [key]: router.query[getFilterQueryKey(URI_QUERY_PREFIX, key)] }),
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
        lastData,
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
