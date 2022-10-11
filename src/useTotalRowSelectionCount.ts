import React from 'react'
import { Response } from '../pages/api/persons'
import { useAppSelector } from './redux/hooks'
import { selectionCount } from './redux/slice/rowSelection'

function useTotalRowSelectionCount(data: undefined | Response): number {
    const totalSelectionCountGetter = useAppSelector(selectionCount)

    const totalSelectionCount = React.useMemo(() => {
        if (!data) return 0

        return totalSelectionCountGetter(data.total)
    }, [totalSelectionCountGetter, data])

    return totalSelectionCount
}

export default useTotalRowSelectionCount
