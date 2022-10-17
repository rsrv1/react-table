import clsx from 'clsx'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setSearchTerm } from '../redux/slice/request'
import { RootState } from '../redux/store'
import Spinner from './Spinner'

type Props = {
    value?: string
    debounce?: number
    className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

function Search({ value: initialValue = '', debounce = 500, className, ...rest }: Props) {
    const dispatch = useAppDispatch()
    const { searchTerm, lastSearchTerm } = useAppSelector((state: RootState) => state.request)
    const loading = useAppSelector((state: RootState) => state.request.loading)
    const [searching, setSearching] = React.useState(false)
    const [value, setValue] = React.useState(initialValue)
    const termDiff = React.useMemo(() => searchTerm !== lastSearchTerm, [searchTerm, lastSearchTerm])
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        if (termDiff && loading) {
            setSearching(true)
            return
        }

        setSearching(false)
    }, [loading, termDiff])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(setSearchTerm(value))
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleClear = () => {
        setValue('')
        inputRef.current?.focus()
    }

    return (
        <div className="relative mt-1 flex items-center">
            <input
                type="text"
                name="table_search"
                ref={inputRef}
                value={value}
                onChange={handleChange}
                className={clsx(
                    'block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
                    className
                )}
                {...rest}
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                {searching ? (
                    <span className="inline-flex items-center rounded pr-1.5 text-sm font-sans font-medium">
                        <Spinner className="w-5 h-5 text-gray-200 fill-gray-500" />
                    </span>
                ) : (
                    value && (
                        <button
                            onClick={handleClear}
                            type="button"
                            className="inline-flex items-center rounded px-2 text-sm font-sans font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer">
                            &times;
                        </button>
                    )
                )}
            </div>
        </div>
    )
}

export default Search