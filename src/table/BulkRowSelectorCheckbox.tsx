import { PaginationState } from '@tanstack/react-table'
import React from 'react'
import { selectionCount } from './context/reducer/rowSelection'
import { useLoadingState, useResultState, useRowSelectionState } from './context/tableContext'
import useRowSelectionCount from './hooks/useRowSelectionCount'
import useRowSelectionHandlers from './hooks/useRowSelectionHandlers'
import IndeterminateCheckbox from './IndeterminateCheckbox'

function BulkRowSelectorCheckbox({ pagination }: { pagination: PaginationState }) {
    const { loading } = useLoadingState()
    const rowSelection = useRowSelectionState()
    const { all: allRowSelected, except } = rowSelection
    const rowSelectionCount = useRowSelectionCount()
    const { resetRowSelection, handleSelectAllCurrentPage } = useRowSelectionHandlers()

    const isRowSelectionIndeterminate = React.useMemo(
        () =>
            (!allRowSelected && rowSelectionCount > 0 && pagination.pageIndex === 0 && rowSelectionCount < pagination.pageSize) ||
            (!allRowSelected && rowSelectionCount > 0 && pagination.pageIndex > 0 && rowSelectionCount > pagination.pageSize) ||
            (allRowSelected && Object.keys(except).length > 0),
        [allRowSelected, rowSelectionCount, pagination.pageIndex, pagination.pageSize, except]
    )

    const handleBulkRowSelectionChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            resetRowSelection()
            if (isRowSelectionIndeterminate || e.target.checked) {
                handleSelectAllCurrentPage()
                return
            }
        },
        [isRowSelectionIndeterminate, resetRowSelection, handleSelectAllCurrentPage]
    )

    return (
        <IndeterminateCheckbox
            {...{
                checked: rowSelectionCount > 0 && !isRowSelectionIndeterminate,
                className: 'ml-4',
                indeterminate: isRowSelectionIndeterminate,
                onChange: handleBulkRowSelectionChange,
                disabled: loading,
            }}
        />
    )
}

export default BulkRowSelectorCheckbox
