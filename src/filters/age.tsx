import React from 'react'
import { useDispatch } from 'react-redux'
import Select from '../components/Select'
import { useAppSelector } from '../table/redux/hooks'
import { filterByAge } from '../table/redux/slice/filters'
import { RootState } from '../table/redux/store'

type props = {
    id: string
    className?: string
}

function Age({ id }: props) {
    const dispatch = useDispatch()
    const [age, setAge] = React.useState<number | 'ALL'>('ALL')
    const loading = useAppSelector((state: RootState) => state.request.loading)

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
