import { Table } from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import Select from '../components/Select'
import useRouteKey from './hooks/useRouteKey'
import urlcat from 'urlcat'

function Pagination<T>({ table, loading }: { table: Table<T>; loading: boolean }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const getRouteKey = useRouteKey()
    const { pageIndex, pageSize } = table.getState().pagination

    const syncPaginationUrlQuery = (params: { page?: number; perPage?: number }) => {
        router.push(urlcat('', '/', Object.assign({}, Object.fromEntries(searchParams.entries()), params)))
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <button
                className="border rounded p-1"
                onClick={() => {
                    table.setPageIndex(0)
                    syncPaginationUrlQuery({ [getRouteKey('page')]: 0 })
                }}
                disabled={!table.getCanPreviousPage() || loading}>
                {'<<'}
            </button>
            <button
                className="border rounded p-1"
                onClick={() => {
                    table.previousPage()
                    syncPaginationUrlQuery({ [getRouteKey('page')]: pageIndex - 1 })
                }}
                disabled={!table.getCanPreviousPage() || loading}>
                {'<'}
            </button>
            <button
                className="border rounded p-1"
                onClick={() => {
                    table.nextPage()
                    syncPaginationUrlQuery({ [getRouteKey('page')]: pageIndex + 1 })
                }}
                disabled={!table.getCanNextPage() || loading}>
                {'>'}
            </button>
            <button
                className="border rounded p-1"
                onClick={() => {
                    table.setPageIndex(table.getPageCount() - 1)
                    syncPaginationUrlQuery({ [getRouteKey('page')]: table.getPageCount() - 1 })
                }}
                disabled={!table.getCanNextPage() || loading}>
                {'>>'}
            </button>
            <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </strong>
            </span>
            <span className="flex items-center gap-1">
                | Go to page:
                <input
                    type="number"
                    aria-label="enter page number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        table.setPageIndex(page)
                        syncPaginationUrlQuery({ [getRouteKey('page')]: page })
                    }}
                    className="border border-gray-300 p-1 rounded w-10 text-sm py-0.5"
                    disabled={loading}
                />
            </span>
            <Select
                className="!w-24 pr-6"
                value={table.getState().pagination.pageSize}
                disabled={loading}
                onChange={e => {
                    table.setPagination({ pageIndex: 0, pageSize: Number(e.target?.value) })
                    syncPaginationUrlQuery({ [getRouteKey('perPage')]: Number(e.target?.value), [getRouteKey('page')]: 0 })
                }}>
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                    </option>
                ))}
            </Select>
        </div>
    )
}

export default Pagination
