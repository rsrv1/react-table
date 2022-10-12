export type Person = {
    id: string
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: 'In Relationship' | 'Single' | 'Complicated'
}

export type Query = {
    page: number | string
    perPage: number | string
    sort?: string
}

export async function fetchData(options: { page: number; perPage: number; sort: string }) {
    return fetch(`/api/persons?page=${options.page}&perPage=${options.perPage}&sort=${options.sort}`)
        .then(r => r.json())
        .then(result => result)
        .catch(e => ({
            error: 1,
            message: e.message,
        }))
}
