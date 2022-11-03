import { useRouter } from 'next/router'
import React from 'react'

function Test() {
    const router = useRouter()

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
        <div>
            <button onClick={handleClick} type="button">
                Goto Table
            </button>
        </div>
    )
}

export default Test
