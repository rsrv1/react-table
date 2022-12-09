import React from 'react'
import clsx from 'clsx'
import { useLoadingState } from './context/tableContext'
import styles from './components/loader.module.css'

function ValidatingIndicator() {
    const { validating } = useLoadingState()
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        if (validating) setShow(true)

        const timer = setTimeout(() => {
            setShow(false)
        }, 1200)

        return () => clearTimeout(timer)
    }, [validating])

    return (
        <tr className="relative">
            <th className={clsx('absolute inset-0', show ? styles.validatingTransition : 'bg-transparent')} />
        </tr>
    )
}

export default ValidatingIndicator
