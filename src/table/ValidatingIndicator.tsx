import React from 'react'
import clsx from 'clsx'
import { useLoadingState } from './context/tableContext'

function ValidatingIndicator() {
    const { validating } = useLoadingState()
    const el = React.useRef<HTMLTableHeaderCellElement>(null)

    React.useEffect(() => {
        let addTimer: NodeJS.Timeout | null = null
        let removeTimer: NodeJS.Timeout | null = null

        if (validating) {
            el.current && el.current.classList.remove('validating-progress')
            addTimer && clearTimeout(addTimer)
            addTimer = setTimeout(() => {
                if (el.current === null) return
                el.current.classList.add('validating-progress')
            }, 0)
        }

        removeTimer && clearTimeout(removeTimer)
        removeTimer = setTimeout(() => {
            el.current && el.current.classList.remove('validating-progress')
        }, 500)

        return () => {
            addTimer && clearTimeout(addTimer)
            removeTimer && clearTimeout(removeTimer)
        }
    }, [validating])

    return (
        <tr className="relative overflow-hidden">
            <th ref={el} className="absolute inset-0" />
        </tr>
    )
}

export default ValidatingIndicator
