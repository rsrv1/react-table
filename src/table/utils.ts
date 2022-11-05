import { sortDirection } from './context/reducer/columnSort'

function _shuffle(list: string[]) {
    return list.sort(() => Math.random() - 0.5)
}

function _isObjEmpty(obj: object) {
    return Object.keys(obj).length === 0
}

const filtersToString = (filters: undefined | { [key: string]: unknown | unknown[] }): string | null => {
    if (!filters) return null

    const entries = Object.entries(filters)
    if (entries.length === 0) return null

    return entries.map(([key, value]) => (Array.isArray(value) ? `${key}=[${value.join(',')}]` : `${key}=${value}`)).join('&')
}

const routeQueryToColumnsortState = (query: string): { [column: string]: sortDirection } => {
    const columns = query.split(',')
    return columns.reduce(
        (acc, col) =>
            Object.assign(acc, {
                [col.replace(/^-/, '')]: col.startsWith('-') ? sortDirection.DESC : sortDirection.ASC,
            }),
        {}
    )
}

const range = (len: number) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

export { _shuffle, range, filtersToString, _isObjEmpty, routeQueryToColumnsortState }
