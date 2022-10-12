import React from 'react'
import { useDispatch } from 'react-redux'
import Select from '../components/Select'
import { filterByAge } from '../redux/slice/filters'

type props = {
    id: string
    className?: string
}

function Age({ id }: props) {
    const dispatch = useDispatch()
    const [age, setAge] = React.useState<number | 'ALL'>('ALL')

    const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
        setAge(value)

        dispatch(filterByAge(value))
    }

    return (
        <Select id={id} className="py-0 pl-2 pr-7 !text-xs" value={age} onChange={handleAgeChange}>
            <option value="ALL">any</option>
            <option value="20"> {'>'} 20</option>
            <option value="40"> {'>'} 40</option>
        </Select>
    )
}

export default Age
