import React from 'react'
import { useAppSelector } from '../redux/hooks'
import { selectionCount } from '../redux/slice/rowSelection'
import { Response } from './useTableData'

function useTotalRowSelectionCount<T>(data: undefined | Response<T>): number {
    const totalSelectionCountGetter = useAppSelector(selectionCount)

    const totalSelectionCount = React.useMemo(() => {
        if (!data) return 0

        return totalSelectionCountGetter(data.total)
    }, [totalSelectionCountGetter, data])

    return totalSelectionCount
}

export default useTotalRowSelectionCount
