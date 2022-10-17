import { Query } from '../table/hooks/useTableData'

export enum Status {
    IN_RELATIONSHIP = 'In Relationship',
    SINGLE = 'Single',
    COMPLICATED = 'Complicated',
}

export type Person = {
    id: string
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: Status
}

export async function fetchData({ page, perPage, search, sort, filter }: Query) {
    // Simulate some network latency
    await new Promise(r => setTimeout(r, 500))

    return fetch(`/api/persons?page=${page}&perPage=${perPage}&sort=${sort}&${filter}&search=${search}`)
        .then(r => r.json())
        .then(result => result)
        .catch(e => ({
            error: 1,
            message: e.message,
        }))
}
