import React from 'react'

function DownArrowIcon({ className, ...rest }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} {...rest}>
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 14l-4-4h8z" />
        </svg>
    )
}

export default DownArrowIcon
