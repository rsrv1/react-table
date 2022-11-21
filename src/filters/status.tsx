import React from 'react'
import { Person, Status } from '../data/fetchData'
import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import useRouteFilter from '../table/hooks/useRouteFilter'
import { URI_QUERY_PREFIX } from '../main'
import { getFilterQueryKey } from '../table/utils'

let urlQuerToHydrated = false

function StatusFilter({ table }: { table: Table<Person> }) {
    const router = useRouter()
    const dispatch = useRouteFilter()
    const [statusFilters, setStatusFilters] = React.useState<Status[]>([])

    /** hydrate from router query */
    const valueInUrl = React.useMemo(() => router.query[getFilterQueryKey(URI_QUERY_PREFIX, 'status')], [router.query])
    React.useEffect(() => {
        if (urlQuerToHydrated) return
        if (!valueInUrl) return

        let value = decodeURIComponent(valueInUrl as string).split(',') as Status[]
        setStatusFilters(value.map(v => v.trim()))
        urlQuerToHydrated = true
    }, [valueInUrl])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, option: Status) => {
        table.resetPageIndex()

        if (e.target.checked) {
            dispatch('status', statusFilters.concat(option).join(','))

            setStatusFilters(s => s.concat(option))
            return
        }

        const selected = statusFilters.filter(o => o !== option)

        dispatch('status', selected.join(','))

        setStatusFilters(selected)
    }

    return (
        <ul className="w-60">
            {Object.values(Status).map(option => (
                <li key={option} className="flex items-center space-x-2 text-xs py-0.5">
                    <input
                        id={`status:${option}`}
                        type="checkbox"
                        onChange={e => handleChange(e, option)}
                        checked={statusFilters.includes(option)}
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
