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

export type Query = {
    page: number | string
    perPage: number | string
    filter: string | null
    sort?: string
}

export async function fetchData({ page, perPage, sort, filter }: Query) {
    return fetch(`/api/persons?page=${page}&perPage=${perPage}&sort=${sort}&${filter}`)
        .then(r => r.json())
        .then(result => result)
        .catch(e => ({
            error: 1,
            message: e.message,
        }))
}
