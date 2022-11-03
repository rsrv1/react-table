import { useRouter } from 'next/router'
import React from 'react'

function Test() {
    const router = useRouter()

    const handlePrefetch = () => {
        const query = {
            page: 1,
            search: 'tom',
            perPage: 20,
            sort: 'firstName,-age',
            'filter[age]': 20,
            'filter[status]': encodeURIComponent('In Relationship, Single'),
        }

        const queryParam = Object.entries(query)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&')

        console.log('prefetching', queryParam)

        router.prefetch(`/${queryParam}`)
    }

    const handleClick = () => {
        router.push({
            pathname: '/',
            query: {
                page: 1,
                search: 'tom',
                perPage: 20,
                sort: 'firstName,-age',
                'filter[age]': 20,
                'filter[status]': encodeURIComponent('In Relationship, Single'),
            },
        })
    }

    return (
        <div className="flex space-x-6">
            <button onClick={handleClick} type="button" className="border-gray-100 px-2 py-0.5">
                Goto Table
            </button>
            <button onMouseOver={handlePrefetch} type="button" className="border-gray-100 px-2 py-0.5">
                Prefetch
            </button>
        </div>
    )
}

export default Test
