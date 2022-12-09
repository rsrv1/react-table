import clsx from 'clsx'
import React from 'react'
import styles from './loader.module.css'

function LineProgress() {
    return (
        <div className={clsx(styles.progressbar, styles.b1)}>
            <div className={clsx(styles.olbqgf, 'scale-x-100')}></div>
            <div className={clsx(styles.BOyz9e, styles.mvzy7, 'scale-x-0')}>
                <span className={clsx(styles.SB3qXd, 'bg-blue-500')}></span>
            </div>
            <div className={clsx(styles.BOyz9e, styles.hOWNzc)}>
                <span className={clsx(styles.SB3qXd, 'bg-blue-500')}></span>
            </div>
        </div>
    )
}

export default LineProgress
