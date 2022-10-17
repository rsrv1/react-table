function _shuffle(list: string[]) {
    return list.sort(() => Math.random() - 0.5)
}

const filtersToString = (filters: undefined | { [key: string]: unknown | unknown[] }): string | null => {
    if (!filters) return null

    const entries = Object.entries(filters)
    if (entries.length === 0) return null

    return entries.map(([key, value]) => (Array.isArray(value) ? `${key}=[${value.join(',')}]` : `${key}=${value}`)).join('&')
}

const range = (len: number) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

export { _shuffle, range, filtersToString }
