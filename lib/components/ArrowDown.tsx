import clsx from 'clsx'
import React from 'react'

function ArrowDown({ className, ...rest }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={clsx('w-5 h-5 fill-slate-400', className)} {...rest}>
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z" />
        </svg>
    )
}

export default ArrowDown
