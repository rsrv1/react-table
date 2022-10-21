import clsx from 'clsx'
import React from 'react'

function ArrowRight({ className, ...rest }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={clsx('w-5 h-5 fill-slate-400', className)} {...rest}>
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12.172 12L9.343 9.172l1.414-1.415L15 12l-4.243 4.243-1.414-1.415z" />
        </svg>
    )
}

export default ArrowRight
