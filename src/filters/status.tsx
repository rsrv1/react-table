import React from 'react'
import { useDispatch } from 'react-redux'
import { Status } from '../data/fetchData'
import { useAppSelector } from '../table/redux/hooks'
import { filterByStatuses } from '../table/redux/slice/filters'
import { RootState } from '../table/redux/store'

function StatusFilter() {
    const dispatch = useDispatch()
    const { status } = useAppSelector((state: RootState) => state.filters)

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
