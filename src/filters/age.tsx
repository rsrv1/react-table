import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import React from 'react'
import Select from '../components/Select'
import { Person } from '../data/fetchData'

type props = {
    table: Table<Person>
    id: string
    loading: boolean
    className?: string
}

let urlQuerToHydrated = false

function Age({ table, id, loading }: props) {
    const router = useRouter()
    const [age, setAge] = React.useState<number | 'ALL'>('ALL')

    const valueInUrl = React.useMemo(() => router.query['filter[age]'], [router.query])
    React.useEffect(() => {
        if (urlQuerToHydrated) return
        if (!valueInUrl) return

        let value: number | 'ALL' = valueInUrl === 'ALL' ? 'ALL' : Number(valueInUrl)
        setAge(value)
        urlQuerToHydrated = true
    }, [valueInUrl])

    const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
        table.resetPageIndex()

        router.push(
            {
                query: Object.assign({}, router.query, {
                    page: 0,
                    filter: router.query?.filter ? [...new Set([...decodeURIComponent(router.query?.filter).split(','), 'age'])].join(',') : 'age',
                    'filter[age]': value,
                }),
            },
            undefined,
            { shallow: true }
        )

        setAge(value)
    }

    return (
        <Select id={id} className="!pl-2 !pr-7 !text-xs" value={age} onChange={handleAgeChange} disabled={loading}>
            <option value="ALL">any</option>
            <option value="20"> {'>'} 20</option>
            <option value="40"> {'>'} 40</option>
        </Select>
    )
}

export default Age
