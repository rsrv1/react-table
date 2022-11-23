import React from 'react'
import useRowSelectionCount from './hooks/useRowSelectionCount'

function RowSelectionCountBadge() {
    const rowSelectionCount = useRowSelectionCount()

    if (rowSelectionCount === 0) return null

    return (
        <span className="absolute top-4 left-0 bg-indigo-50 h-[1.20rem] w-5 flex items-center px-1 text-[0.70rem] text-indigo-700 border border-r-transparent border-indigo-400">
            {rowSelectionCount}
        </span>
    )
}

export default RowSelectionCountBadge
