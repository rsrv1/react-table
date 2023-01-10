import React from 'react'

function useDebounce<T>(value: T, deounce: number, cb?: (debouncedValue: T) => void) {
    const debouncedValue = React.useRef(value)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            debouncedValue.current = value
            cb?.(value)
        }, deounce)

        return () => {
            clearTimeout(timer)
        }
    }, [value, deounce, cb])

    return debouncedValue.current
}

export default useDebounce
