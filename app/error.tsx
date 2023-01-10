'use client'

import React from 'react'

export default function Error({ error, reset }: any) {
    React.useEffect(() => {
        console.log('logging error:', error)
    }, [error])

    return (
        <div>
            <div className="space-y-4">
                <div className="text-sm text-vercel-pink">
                    <strong className="font-bold">Error:</strong> {error?.message}
                </div>
                <div>
                    <button type="button" onClick={() => reset()}>
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    )
}
