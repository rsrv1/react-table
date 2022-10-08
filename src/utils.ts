function _shuffle(list: string[]) {
    return list.sort(() => Math.random() - 0.5)
}

export { _shuffle }
