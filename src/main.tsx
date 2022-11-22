import React from 'react'
import useTableData, { Query, Response } from './table/hooks/useTableData'
import useTableHandlers from './table/hooks/useTableHandlers'
import useColumns from './useColumns'
import useTable from './table/hooks/useTable'
import { ColumnOrderState, Table } from '@tanstack/react-table'
import { SWRResponse } from 'swr'
import { fetchData, Person } from './data/fetchData'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useRouter } from 'next/router'
import { getFilterQueryKey, getQueryKey } from './table/utils'

export type RenderProps<T> = {
    table: Table<T>
    columnOrder: ColumnOrderState
    resetColumnOrder: () => void
    isColumnPositioning: boolean
    stopColumnPositioning: () => void
    rowSelectionCount: number
    dataQuery: SWRResponse<Response<T>>
    loading: boolean
    options: Query
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

    const { setPagination, pagination, pageSize, rowSelectionCount, isColumnPositioning, dataQuery, lastData, loading, options } =
        useTableData<Person>({ filter, fetcher })

    const { stopColumnPositioning } = useTableHandlers()

    const columns = useColumns({
        data: dataQuery.data,
    })

    const { table, columnOrder, resetColumnOrder } = useTable<Person>({
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
        <DndProvider backend={HTML5Backend}>
            {children({
                table,
                columnOrder,
                resetColumnOrder,
                isColumnPositioning,
                stopColumnPositioning,
                rowSelectionCount,
                dataQuery,
                loading,
                options,
            })}
        </DndProvider>
    )
}

export default Main
