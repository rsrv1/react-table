import React from 'react'
import { useDispatch } from '../context/tableContext'
import { actionType } from '../context/reducer/rowSelection'

function useRowSelectionHandlers() {
    const dispatch = useDispatch()

    const resetRowSelection = React.useCallback(() => {
        dispatch.rowSelection({ type: actionType.RESET })
    }, [dispatch])

    // takes care of the select all page rows click
    const handleSelectAll = React.useCallback(() => {
        dispatch.rowSelection({ type: actionType.RESET })
        dispatch.rowSelection({ type: actionType.SELECT_ALL })
    }, [dispatch])

    // takes care of all rows selection of the current page
    const handleSelectAllCurrentPage = React.useCallback(() => {
        dispatch.rowSelection({ type: actionType.RESET })
        dispatch.rowSelection({ type: actionType.WANT_CURRENT_PAGE, payload: true }) // enable the flag
    }, [dispatch])

    const handleRemoveFromExcept = React.useCallback(
        (id: string) => {
            dispatch.rowSelection({ type: actionType.REMOVE_FROM_EXCEPT, payload: id })
        },
        [dispatch]
    )

    const handleAddToExcept = React.useCallback(
        (id: string) => {
            dispatch.rowSelection({ type: actionType.ADD_TO_EXCEPT, payload: id })
        },
        [dispatch]
    )

    const handleAddToOnly = React.useCallback(
        (id: string) => {
            dispatch.rowSelection({ type: actionType.ADD_TO_ONLY, payload: id })
        },
        [dispatch]
    )
    const handleRemoveFromOnly = React.useCallback(
        (id: string) => {
            dispatch.rowSelection({ type: actionType.REMOVE_FROM_ONLY, payload: id })
        },
        [dispatch]
    )

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
