import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/router'
import React from 'react'
import Select from '../components/Select'
import { Person } from '../data/fetchData'
import { useAppDispatch } from '../redux/hooks'
import { filterByAge } from '../redux/slice/filters'

type props = {
    table: Table<Person>
    id: string
    loading: boolean
    className?: string
}

function Age({ table, id, loading }: props) {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [age, setAge] = React.useState<number | 'ALL'>('ALL')

    const valueInUrl = React.useMemo(() => router.query['filter[age]'], [router.query])
    React.useEffect(() => {
        let value: number | 'ALL' = valueInUrl === 'ALL' ? 'ALL' : Number(valueInUrl)
        setAge(value)
    }, [valueInUrl])

    const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)

        router.push({ query: Object.assign({}, router.query, { 'filter[age]': value }) }, undefined, { shallow: true })

        setAge(value)

        dispatch(filterByAge(value))
        table.resetPageIndex()
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
