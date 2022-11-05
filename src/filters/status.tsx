import React from 'react'
import { Person, Status } from '../data/fetchData'
import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/router'

let urlQuerToHydrated = false

function StatusFilter({ table }: { table: Table<Person> }) {
    const router = useRouter()
    const [statusFilters, setStatusFilters] = React.useState<Status[]>([])

    const valueInUrl = React.useMemo(() => router.query['filter[status]'], [router.query])
    React.useEffect(() => {
        if (urlQuerToHydrated) return
        if (!valueInUrl) return

        let value = decodeURIComponent(valueInUrl as string).split(',') as Status[]
        setStatusFilters(value.map(v => v.trim()))
        urlQuerToHydrated = true
    }, [valueInUrl])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, option: Status) => {
        table.resetPageIndex()

        const uniqueFilterList = [...new Set([...decodeURIComponent(router.query?.filter).split(','), 'status'])].join(',')

        if (e.target.checked) {
            router.push(
                {
                    query: Object.assign({}, router.query, {
                        page: 0,
                        filter: router.query?.filter ? uniqueFilterList : 'status',
                        'filter[status]': statusFilters.concat(option).join(','),
                    }),
                },
                undefined,
                {
                    shallow: true,
                }
            )

            setStatusFilters(s => s.concat(option))
            return
        }

        const selected = statusFilters.filter(o => o !== option)
        const urlFilter = router.query?.filter ? uniqueFilterList : 'status'

        router.push(
            {
                query: Object.assign({}, router.query, {
                    page: 0,
                    filter: urlFilter,
                    'filter[status]': selected.join(','),
                }),
            },
            undefined,
            {
                shallow: true,
            }
        )

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
