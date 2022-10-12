import React from 'react'
import Age from './filters/age'
import StatusFilter from './filters/status'

function Filters() {
    return (
        <div className="flex justify-between items-start mb-5">
            <div className="basis-1/2">
                <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Search"
                />
            </div>
            <div className="flex items-center space-x-5">
                <div className="flex items-center w-28">
                    <details>
                        <summary className="text-xs cursor-pointer">Status:</summary>
                        <StatusFilter />
                    </details>
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="filter-age" className="text-xs cursor-pointer">
                        Age:{' '}
                    </label>
                    <Age id="filter-age" />
                </div>
            </div>
        </div>
    )
}

export default Filters
