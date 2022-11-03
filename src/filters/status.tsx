import React from 'react'
import { useAppDispatch } from '../redux/hooks'
import { Person, Status } from '../data/fetchData'
import { useAppSelector } from '../redux/hooks'
import { filterByStatuses } from '../redux/slice/filters'
import { RootState } from '../redux/store'
import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/router'

function StatusFilter({ table }: { table: Table<Person> }) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { status } = useAppSelector((state: RootState) => state.filters)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, option: Status) => {
        table.resetPageIndex()

        if (e.target.checked) {
            router.push({ query: Object.assign({}, router.query, { 'filter[status]': status.concat(option).join(',') }) }, undefined, {
                shallow: true,
            })
            dispatch(filterByStatuses(status.concat(option)))
            return
        }

        router.push({ query: Object.assign({}, router.query, { 'filter[status]': status.filter(o => o !== option).join(',') }) }, undefined, {
            shallow: true,
        })
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
