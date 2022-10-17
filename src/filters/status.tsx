import React from 'react'
import { useAppDispatch } from '../redux/hooks'
import { Status } from '../data/fetchData'
import { useAppSelector } from '../redux/hooks'
import { filterByStatuses } from '../redux/slice/filters'
import { RootState } from '../redux/store'

function StatusFilter() {
    const dispatch = useAppDispatch()
    /** TODO: NEEDS CHANGE */
    // const { status } = useAppSelector((state: RootState) => state.filters)
    const status = []

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, option: Status) => {
        if (e.target.checked) {
            dispatch(filterByStatuses(status.concat(option)))
            return
        }

        dispatch(filterByStatuses(status.filter(o => o !== option)))
    }

    return (
        <ul className="w-60">
            {Object.values(Status).map(option => (
                <li key={option} className="flex items-center space-x-2 text-xs py-0.5">
                    <input
                        id={`status:${option}`}
                        type="checkbox"
                        onChange={e => handleChange(e, option)}
                        checked={status.includes(option)}
                        className="pr-2"
                    />{' '}
                    <label htmlFor={`status:${option}`} className="cursor-pointer">
                        {option}
                    </label>
                </li>
            ))}
        </ul>
    )
}

export default StatusFilter
