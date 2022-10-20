import { Table } from '@tanstack/react-table'
import React from 'react'

function ColumnRepositionConfirm<T>({
    table,
    stopColumnPositioning,
    resetColumnPositioning,
}: {
    table: Table<T>
    stopColumnPositioning(): void
    resetColumnPositioning(): void
}) {
    const savePosition = () => {
        const order = table.getState().columnOrder
        console.log('column order', order)

        stopColumnPositioning()
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <button onClick={savePosition} type="button" className="whitespace-nowrap text-sky-700 hover:text-sky-600 space-x-2">
                <span aria-hidden="true">✔</span> Save Position
            </button>
            <button onClick={stopColumnPositioning} type="button" className="whitespace-nowrap">
                <span aria-hidden="true">❌</span> Cancel
            </button>
            <button onClick={resetColumnPositioning} type="button" className="whitespace-nowrap px-2 bg-gray-50 hover:bg-gray-100 text-gray-700">
                Reset
            </button>
        </div>
    )
}

export default ColumnRepositionConfirm
