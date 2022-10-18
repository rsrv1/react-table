import React from 'react'
import clsx from 'clsx'
import { useTableState } from './context/tableContext'
import { actionType, sortDirection } from './context/reducer/columnSort'

type Props = {
    name: string
    unsortable: boolean
    children: React.ReactNode
    up?: JSX.Element
    down?: JSX.Element
    className?: string
}

function SortTrigger({ name, unsortable, children, up = <span>^</span>, down = <div className="transform rotate-180">^</div>, className }: Props) {
    const { columnSort } = useTableState()
    const dispatch = columnSort.dispatch
    const columns = columnSort.state.column

    const handleSort = () => {
        if (!columns[name]) {
            dispatch({ type: actionType.MUTATE, payload: { column: name, direction: sortDirection.ASC } })
            return
        }

        if (columns[name] === sortDirection.ASC) {
            dispatch({ type: actionType.MUTATE, payload: { column: name, direction: sortDirection.DESC } })
            return
        }

        dispatch({ type: actionType.REMOVE, payload: name })
    }

    if (unsortable) return <div className={className}>{children}</div>

    return (
        <button onClick={handleSort} type="button" className={clsx('flex justify-between items-center', className)}>
            <span>{children}</span>

            {columns[name] && <span className="px-2 ml-1 text-base sm:text-sm">{columns[name] === sortDirection.DESC ? up : down}</span>}
        </button>
    )
}

export default SortTrigger
