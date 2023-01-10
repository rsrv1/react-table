import clsx from 'clsx'
import React from 'react'
import Spinner from '../components/Spinner'
import { useLoadingState } from './context/tableContext'
import { useRouter, useSearchParams } from 'next/navigation'
import useRouteKey from './hooks/useRouteKey'
import urlcat from 'urlcat'

type Props<T> = {
    resetPageIndex: (defaultState?: boolean | undefined) => void
    value?: string
    debounce?: number
    className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

let queryParamToHydrated = false

function Search<T>({ resetPageIndex, value: initialValue = '', debounce = 900, className, ...rest }: Props<T>) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const getRouteKey = useRouteKey()
    const { loading, validating } = useLoadingState()
    const [searching, setSearching] = React.useState(false)
    const [value, setValue] = React.useState(initialValue)
    const searchRouteValue = searchParams.get(getRouteKey('search'))
    const inputRef = React.useRef<HTMLInputElement>(null)
    const lastDebounceTimer = React.useRef<null | NodeJS.Timeout>(null)

    const setQuerySearchTerm = (term: string) => {
        router.push(
            urlcat(
                '',
                '/',
                Object.assign({}, Object.fromEntries(searchParams.entries()), { [getRouteKey('page')]: 0, [getRouteKey('search')]: term })
            )
        )
    }
    const removeQuerySearchTerm = () => {
        router.push(
            urlcat('', '/', Object.assign({}, Object.fromEntries(searchParams.entries()), { [getRouteKey('page')]: 0, [getRouteKey('search')]: '' }))
        )
    }

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
            setQuerySearchTerm(value)
            resetPageIndex()
            return
        }

        lastDebounceTimer.current && clearTimeout(lastDebounceTimer.current)
        lastDebounceTimer.current = setTimeout(() => {
            setQuerySearchTerm(value)
            resetPageIndex()
        }, debounce)
    }

    const handleClear = () => {
        removeQuerySearchTerm()
        setValue('')
        resetPageIndex()
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
