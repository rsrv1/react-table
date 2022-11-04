import clsx from 'clsx'
import React from 'react'
import Spinner from '../components/Spinner'
import { useTableState } from './context/tableContext'
import { actionType } from './context/reducer/request'
import { useRouter } from 'next/router'
import { Table } from '@tanstack/react-table'

type Props<T> = {
    table: Table<T>
    value?: string
    debounce?: number
    className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

let queryParamToHydrated = false

function Search<T>({ table, value: initialValue = '', debounce = 900, className, ...rest }: Props<T>) {
    const router = useRouter()
    const { request } = useTableState()
    const { searchTerm, lastSearchTerm, loading } = request.state
    const [searching, setSearching] = React.useState(false)
    const [value, setValue] = React.useState(initialValue)
    const termDiff = React.useMemo(() => searchTerm !== lastSearchTerm, [searchTerm, lastSearchTerm])
    const inputRef = React.useRef<HTMLInputElement>(null)
    const lastDebounceTimer = React.useRef<null | NodeJS.Timeout>(null)

    const setQuerySearchTerm = (term: string) => {
        router.push(
            {
                query: Object.assign({}, router.query, { search: term }),
            },
            undefined,
            { shallow: true }
        )
    }
    const removeQuerySearchTerm = () => {
        delete router.query.search

        router.push(
            {
                query: router.query,
            },
            undefined,
            { shallow: true }
        )
    }

    React.useEffect(() => {
        if (termDiff && loading) {
            setSearching(true)
            return
        }

        setSearching(false)
    }, [loading, termDiff])

    /** useful when initially hydrating from url param */
    React.useEffect(() => {
        if (queryParamToHydrated) return
        if (!router.query?.search || router.query?.search === '') return

        queryParamToHydrated = true
        setValue(router.query.search as string)
        request.dispatch({ type: actionType.SET_SEARCH_TERM, payload: router.query.search as string })
    }, [router.query.search])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuerySearchTerm(e.target.value)
        setValue(e.target.value)

        if (e.target.value.trim() === '') {
            // no debounce wants immediate clear
            request.dispatch({ type: actionType.SET_SEARCH_TERM, payload: '' })
            table.resetPageIndex()
            return
        }

        lastDebounceTimer.current && clearTimeout(lastDebounceTimer.current)
        lastDebounceTimer.current = setTimeout(() => {
            request.dispatch({ type: actionType.SET_SEARCH_TERM, payload: e.target.value.trim() })
            table.resetPageIndex()
        }, debounce)
    }

    const handleClear = () => {
        removeQuerySearchTerm()
        setValue('')
        request.dispatch({ type: actionType.SET_SEARCH_TERM, payload: '' })
        table.resetPageIndex()
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
