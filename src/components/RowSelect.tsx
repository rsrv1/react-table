import React from 'react'
import Select from './Select'

type Args = {
    loading: boolean
    resetRowSelection: () => void
    handleSelectAll: () => void
    handleSelectAllCurrentPage: () => void
}

function RowSelect({ loading, resetRowSelection, handleSelectAll, handleSelectAllCurrentPage }: Args) {
    const [bulkSelectionType, setBulkSelectionType] = React.useState('_')

    const handleBulkSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value
        setBulkSelectionType(selected)

        if (selected === 'all') {
            return handleSelectAll()
        }

        if (selected === 'current') {
            return handleSelectAllCurrentPage()
        }

        resetRowSelection()
    }

    return (
        <Select className="!pl-2 !pr-5 font-normal w-28 mb-3" value={bulkSelectionType} onChange={handleBulkSelectionChange} disabled={loading}>
            <option value="_">select</option>
            <option value="all">all</option>
            <option value="current">this page</option>
        </Select>
    )
}

export default RowSelect
