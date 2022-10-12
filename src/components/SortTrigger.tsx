import React from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from './../redux/hooks'
import { RootState } from './../redux/store'
import { mutate, remove, reset, sortDirection } from './../redux/slice/columnSorting'

type Props = {
    name: string
    unsortable: boolean
    children: React.ReactNode
    up?: JSX.Element
    down?: JSX.Element
    className?: string
}

function SortTrigger({ name, unsortable, children, up = <span>^</span>, down = <span>v</span>, className }: Props) {
    const dispatch = useAppDispatch()
    const columns = useAppSelector((state: RootState) => state.columnSorting.column)

    const handleSort = () => {
        if (!columns[name]) {
            dispatch(mutate({ column: name, direction: sortDirection.ASC }))
            return
        }

        if (columns[name] === sortDirection.ASC) {
            dispatch(mutate({ column: name, direction: sortDirection.DESC }))
            return
        }

        dispatch(remove(name))
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
