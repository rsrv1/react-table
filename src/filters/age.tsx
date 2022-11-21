import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import React from 'react'
import Select from '../components/Select'
import { Person } from '../data/fetchData'
import { URI_QUERY_PREFIX } from '../main'
import useRouteFilter from '../table/hooks/useRouteFilter'
import { getFilterQueryKey } from '../table/utils'

type props = {
    table: Table<Person>
    id: string
    loading: boolean
    className?: string
}

let urlQuerToHydrated = false

function Age({ table, id, loading }: props) {
    const router = useRouter()
    const dispatch = useRouteFilter()
    const [age, setAge] = React.useState<number | 'ALL'>('ALL')

    const valueInUrl = React.useMemo(() => router.query[getFilterQueryKey(URI_QUERY_PREFIX, 'age')], [router.query])
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

        dispatch('age', value as string)

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
