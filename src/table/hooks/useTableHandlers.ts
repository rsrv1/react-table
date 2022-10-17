import React from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
    isSelected,
    reset as resetRowSelectionAction,
    selectAll,
    reset,
    selectAllCurrentPageRows,
    removeFromExcept,
    addToExcept,
    addToOnly,
    removeFromOnly,
} from '../redux/slice/rowSelection'

function useTableHandlers() {
    const dispatch = useAppDispatch()
    const isSelectedGetter = useAppSelector(isSelected)

    const resetRowSelection = React.useCallback(() => {
        dispatch(resetRowSelectionAction())
    }, [])

    // takes care of the select all page rows click
    const handleSelectAll = React.useCallback(() => {
        dispatch(reset())
        dispatch(selectAll())
    }, [])

    // takes care of all rows selection of the current page
    const handleSelectAllCurrentPage = React.useCallback(() => {
        dispatch(reset())
        dispatch(selectAllCurrentPageRows(true)) // enable the flag
    }, [])

    const handleRemoveFromExcept = (id: string) => {
        dispatch(removeFromExcept(id))
    }

    const handleAddToExcept = (id: string) => {
        dispatch(addToExcept(id))
    }

    const handleAddToOnly = (id: string) => {
        dispatch(addToOnly(id))
    }
    const handleRemoveFromOnly = (id: string) => {
        dispatch(removeFromOnly(id))
    }

    return {
        resetRowSelection,
        isSelectedGetter,
        handleSelectAll,
        handleSelectAllCurrentPage,
        handleRemoveFromExcept,
        handleAddToExcept,
        handleAddToOnly,
        handleRemoveFromOnly,
    }
}

export default useTableHandlers
