import React from 'react'
import { selectionCount } from '../context/reducer/rowSelection'
import { useResultState, useRowSelectionState } from '../context/tableContext'

function useRowSelectionCount() {
    const rowSelection = useRowSelectionState()
    const { total } = useResultState()
    const rowSelectionCount = total > 0 ? selectionCount(rowSelection, total) : 0

    return rowSelectionCount
}

export default useRowSelectionCount
