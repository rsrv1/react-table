import React from 'react'
import { isSelected } from './context/reducer/rowSelection'
import { useLoadingState, useRowSelectionState } from './context/tableContext'
import useRowSelectionHandlers from './hooks/useRowSelectionHandlers'
import IndeterminateCheckbox from './IndeterminateCheckbox'

function RowSelectionCheckbox({ value }: { value: string }) {
    const { loading } = useLoadingState()
    const rowSelection = useRowSelectionState()
    const { handleRemoveFromExcept, handleAddToExcept, handleAddToOnly, handleRemoveFromOnly } = useRowSelectionHandlers()
    const isSelectedGetter = React.useMemo(() => isSelected(rowSelection), [rowSelection])

    const handleCellSelectChange = (event: React.FormEvent<HTMLInputElement>, id: string) => {
        const isChecked = (event.target as HTMLInputElement).checked

        if (rowSelection.all) {
            if (isChecked) handleRemoveFromExcept(id)
            else handleAddToExcept(id)

            return
        }

        if (isChecked) handleAddToOnly(id)
        else handleRemoveFromOnly(id)
    }

    return (
        <IndeterminateCheckbox
            {...{
                checked: isSelectedGetter(value),
                className: 'absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500',
                indeterminate: false,
                onChange: e => handleCellSelectChange(e, value),
                disabled: loading,
            }}
        />
    )
}

export default React.memo(RowSelectionCheckbox)
