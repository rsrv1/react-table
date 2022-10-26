import clsx from 'clsx'
import React from 'react'

type Props = {
    children: React.ReactNode
    className?: string
} & React.HTMLProps<HTMLSelectElement>

function Select({ children, className, ...rest }: Props) {
    return (
        <select
            className={clsx(
                'block rounded-md border-gray-300 py-0.5 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:opacity-30',
                className
            )}
            {...rest}>
            {children}
        </select>
    )
}

export default Select
