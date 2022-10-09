export type Person = {
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: 'In Relationship' | 'Single' | 'Complicated'
}

export async function fetchData(options: { pageIndex: number; pageSize: number }) {
    return fetch(`/api/persons?page=${options.pageIndex}&perPage=${options.pageSize}`)
        .then(r => r.json())
        .then(result => result)
        .catch(e => ({
            error: 1,
            message: e.message,
        }))
}
