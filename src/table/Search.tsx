import clsx from 'clsx'
import React from 'react'
import Spinner from '../components/Spinner'
import { useLoadingState } from './context/tableContext'
import { NextRouter, useRouter } from 'next/router'
import { Table } from '@tanstack/react-table'
import useRouteKey from './hooks/useRouteKey'

type Props<T> = {
    table: Table<T>
    validating: boolean
    value?: string
    debounce?: number
    className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

let queryParamToHydrated = false

const setQuerySearchTerm = (getKey: (k: string) => string, router: NextRouter, term: string) => {
    router.push(
        {
            query: Object.assign({}, router.query, { [getKey('page')]: 0, [getKey('search')]: term }),
        },
        undefined,
        { shallow: true }
    )
}
const removeQuerySearchTerm = (getKey: (k: string) => string, router: NextRouter) => {
    router.push(
        {
            query: Object.assign({}, router.query, { [getKey('page')]: 0, [getKey('search')]: '' }),
        },
        undefined,
        { shallow: true }
    )
}

function Search<T>({ table, validating, value: initialValue = '', debounce = 900, className, ...rest }: Props<T>) {
    const router = useRouter()
    const getRouteKey = useRouteKey()
    const loading = useLoadingState()
    const [searching, setSearching] = React.useState(false)
    const [value, setValue] = React.useState(initialValue)
    const searchRouteValue = router.query[getRouteKey('search')]
    const inputRef = React.useRef<HTMLInputElement>(null)
    const lastDebounceTimer = React.useRef<null | NodeJS.Timeout>(null)

    React.useEffect(() => {
        setSearching(true)
    }, [searchRouteValue])

    React.useEffect(() => {
        if (!searching) return
        if (loading || validating) return

        setSearching(false)
    }, [loading, validating, searching])

    /** useful when initially hydrating from url param */
    React.useEffect(() => {
        if (queryParamToHydrated) return
        if (!searchRouteValue || searchRouteValue === '') return

        queryParamToHydrated = true
        setValue(searchRouteValue as string)
    }, [searchRouteValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setValue(value)

        if (value === '') {
            // no debounce wants immediate clear
            setQuerySearchTerm(getRouteKey, router, value)
            table.resetPageIndex()
            return
        }

        lastDebounceTimer.current && clearTimeout(lastDebounceTimer.current)
        lastDebounceTimer.current = setTimeout(() => {
            setQuerySearchTerm(getRouteKey, router, value)
            table.resetPageIndex()
        }, debounce)
    }

    const handleClear = () => {
        removeQuerySearchTerm(getRouteKey, router)
        setValue('')
        table.resetPageIndex()
        inputRef.current?.focus()
    }

    return (
        <div className="relative mt-1 flex items-center bg-transparent">
            <input
                type="text"
                name="table_search"
                ref={inputRef}
                value={value}
                onChange={handleChange}
                className={clsx(
                    'block h-full w-full bg-transparent border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm',
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
