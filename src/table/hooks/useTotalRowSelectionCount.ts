import React from 'react'
import { selectionCount } from '../context/reducer/rowSelection'
import { useRowSelectionState } from '../context/tableContext'
import { Response } from './useTableData'

function useTotalRowSelectionCount<T>(data: undefined | Response<T>): number {
    const rowSelection = useRowSelectionState()
    const totalSelectionCountGetter = React.useMemo(() => selectionCount(rowSelection), [rowSelection])

    const totalSelectionCount = React.useMemo(() => {
        if (!data) return 0

        return totalSelectionCountGetter(data.total)
    }, [totalSelectionCountGetter, data])

    return totalSelectionCount
}

export default useTotalRowSelectionCount
