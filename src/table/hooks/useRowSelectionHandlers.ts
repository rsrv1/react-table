import React from 'react'
import { useDispatch } from '../context/tableContext'
import { actionType } from '../context/reducer/rowSelection'

function useRowSelectionHandlers() {
    const dispatch = useDispatch()

    const resetRowSelection = () => {
        dispatch.rowSelection({ type: actionType.RESET })
    }

    // takes care of the select all page rows click
    const handleSelectAll = () => {
        dispatch.rowSelection({ type: actionType.RESET })
        dispatch.rowSelection({ type: actionType.SELECT_ALL })
    }

    // takes care of all rows selection of the current page
    const handleSelectAllCurrentPage = () => {
        dispatch.rowSelection({ type: actionType.RESET })
        dispatch.rowSelection({ type: actionType.WANT_CURRENT_PAGE, payload: true }) // enable the flag
    }

    const handleRemoveFromExcept = (id: string) => {
        dispatch.rowSelection({ type: actionType.REMOVE_FROM_EXCEPT, payload: id })
    }

    const handleAddToExcept = (id: string) => {
        dispatch.rowSelection({ type: actionType.ADD_TO_EXCEPT, payload: id })
    }

    const handleAddToOnly = (id: string) => {
        dispatch.rowSelection({ type: actionType.ADD_TO_ONLY, payload: id })
    }
    const handleRemoveFromOnly = (id: string) => {
        dispatch.rowSelection({ type: actionType.REMOVE_FROM_ONLY, payload: id })
    }

    return {
        resetRowSelection,
        handleSelectAll,
        handleSelectAllCurrentPage,
        handleRemoveFromExcept,
        handleAddToExcept,
        handleAddToOnly,
        handleRemoveFromOnly,
    }
}

export default useRowSelectionHandlers
