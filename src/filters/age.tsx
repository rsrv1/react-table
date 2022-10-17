import React from 'react'
import Select from '../components/Select'
import { useAppDispatch } from '../redux/hooks'
import { filterByAge } from '../redux/slice/filters'

type props = {
    id: string
    loading: boolean
    className?: string
}

function Age({ id, loading }: props) {
    const dispatch = useAppDispatch()
    const [age, setAge] = React.useState<number | 'ALL'>('ALL')

    const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
        setAge(value)

        dispatch(filterByAge(value))
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
