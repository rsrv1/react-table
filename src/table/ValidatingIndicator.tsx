import React from 'react'
import clsx from 'clsx'
import { useLoadingState } from './context/tableContext'

function ValidatingIndicator() {
    const { validating } = useLoadingState()

    return (
        <tr className="relative">
            <th
                className={clsx(
                    'absolute inset-0 transition-[width] duration-700 ease-in-out',
                    validating ? 'w-full bg-sky-400' : 'w-0 bg-transparent'
                )}
            />
        </tr>
    )
}

export default ValidatingIndicator
