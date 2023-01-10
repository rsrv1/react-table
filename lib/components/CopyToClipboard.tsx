import React, { ComponentProps, ReactElement, useCallback, useEffect, useState } from 'react'
import { Copy, CheckSquareOffset } from 'phosphor-react'

export const CopyToClipboard = ({
    value,
    ...props
}: {
    value: string
} & ComponentProps<'button'>): ReactElement => {
    const [isCopied, setCopied] = useState(false)

    useEffect(() => {
        if (!isCopied) return
        const timerId = setTimeout(() => {
            setCopied(false)
        }, 2000)

        return () => {
            clearTimeout(timerId)
        }
    }, [isCopied])

    const handleClick = useCallback<NonNullable<ComponentProps<'button'>['onClick']>>(async () => {
        setCopied(true)
        if (!navigator?.clipboard) {
            console.error('Access to clipboard rejected!')
        }
        try {
            await navigator.clipboard.writeText(value)
        } catch {
            console.error('Failed to copy!')
        }
    }, [value])

    const IconToUse = isCopied ? CheckSquareOffset : Copy

    return (
        <button onClick={handleClick} title="Copy code" tabIndex={0} {...props}>
            <IconToUse size={15} className="h-4 w-4" />
        </button>
    )
}
