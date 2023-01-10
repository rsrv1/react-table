import React from 'react'
import { Person, Status } from '../data/fetchData'
import Age from './age'
import StatusFilter from './status'
import { Table } from '@tanstack/react-table'

function Filters({ table, loading }: { table: Table<Person>; loading: boolean }) {
    return (
        <div className="flex justify-between items-start mb-5">
            <div className="basis-1/2"></div>
            <div className="flex items-center space-x-5">
                <div className="flex items-center w-28">
                    <details>
                        <summary className="text-xs cursor-pointer">Status:</summary>
                        <StatusFilter table={table} />
                    </details>
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="filter-age" className="text-xs cursor-pointer">
                        Age:{' '}
                    </label>
                    <Age table={table} id="filter-age" loading={loading} />
                </div>
            </div>
        </div>
    )
}

export default React.memo(Filters)
