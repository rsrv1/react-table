function _shuffle(list: string[]) {
    return list.sort(() => Math.random() - 0.5)
}

const range = (len: number) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

export { _shuffle, range }
