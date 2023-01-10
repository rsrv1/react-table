'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { URI_QUERY_PREFIX } from '../../lib/main'
import { getFilterQueryKey, getQueryKey } from '../../lib/table/utils'
import Link from 'next/link'

function Test() {
    const router = useRouter()
    /** because here I dont have internal context access that I'll fugure out the prefix, so this has to be manual */
    const getURIKey = (key: string) => getQueryKey(URI_QUERY_PREFIX, key)
    const getFilterURIKey = (key: string) => getFilterQueryKey(URI_QUERY_PREFIX, key)

    const query = {
        [getURIKey('page')]: 1,
        [getURIKey('search')]: 'tom',
        [getURIKey('perPage')]: 20,
        [getURIKey('sort')]: 'firstName,-age',
        [getURIKey('filter')]: 'status,age',
        [getFilterURIKey('age')]: 20,
        [getFilterURIKey('status')]: encodeURIComponent('In Relationship, Single'),
    }

    const handlePrefetch = () => {
        const queryParam = Object.entries(query)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&')

        console.log('prefetching', queryParam)

        router.prefetch(`?${queryParam}`)
    }

    return (
        <div className="flex space-x-6">
            <Link
                href={{
                    pathname: '/',
                    query,
                }}
                className="border-gray-100 px-2 py-0.5">
                Goto Table
            </Link>

            <button onMouseOver={handlePrefetch} type="button" className="border-gray-100 px-2 py-0.5">
                Prefetch
            </button>
        </div>
    )
}

export default Test
