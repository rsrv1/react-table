import React from 'react'
import { isSelected } from '../context/reducer/rowSelection'
import { useTableState } from '../context/tableContext'
import { actionType } from '../context/reducer/rowSelection'

function useTableHandlers() {
    const { rowSelection } = useTableState()
    const dispatch = rowSelection.dispatch
    const isSelectedGetter = React.useMemo(() => isSelected(rowSelection.state), [rowSelection.state])

    const resetRowSelection = React.useCallback(() => {
        dispatch({ type: actionType.RESET })
    }, [])

    // takes care of the select all page rows click
    const handleSelectAll = React.useCallback(() => {
        dispatch({ type: actionType.RESET })
        dispatch({ type: actionType.SELECT_ALL })
    }, [])

    // takes care of all rows selection of the current page
    const handleSelectAllCurrentPage = React.useCallback(() => {
        dispatch({ type: actionType.RESET })
        dispatch({ type: actionType.WANT_CURRENT_PAGE, payload: true }) // enable the flag
    }, [])

    const handleRemoveFromExcept = (id: string) => {
        dispatch({ type: actionType.REMOVE_FROM_EXCEPT, payload: id })
    }

    const handleAddToExcept = (id: string) => {
        dispatch({ type: actionType.ADD_TO_EXCEPT, payload: id })
    }

    const handleAddToOnly = (id: string) => {
        dispatch({ type: actionType.ADD_TO_ONLY, payload: id })
    }
    const handleRemoveFromOnly = (id: string) => {
        dispatch({ type: actionType.REMOVE_FROM_ONLY, payload: id })
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
