import { ColumnOrderState, ColumnSizingState } from '@tanstack/react-table'

interface PersistentStorage<T> {
    prefix: string
    set save(value: T)
    get read(): T
    flush(): void
}

class StoreColumnSize implements PersistentStorage<ColumnSizingState> {
    prefix: string

    constructor(prefix: string) {
        this.prefix = prefix
    }

    private getKey() {
        return `table.${this.prefix}.colSize`
    }

    set save(value: ColumnSizingState) {
        if (Object.keys(value).length > 0) {
            localStorage.setItem(this.getKey(), JSON.stringify(Object.assign({}, this.read, value)))
        }
    }

    get read(): ColumnSizingState {
        const value = localStorage.getItem(this.getKey())
        if (!value) return {}

        return JSON.parse(value)
    }

    flush(): void {
        localStorage.removeItem(this.getKey())
    }
}

class StoreColumnOrder implements PersistentStorage<ColumnOrderState> {
    prefix: string

    constructor(prefix: string) {
        this.prefix = prefix
    }

    private getKey() {
        return `table.${this.prefix}.colOrder`
    }

    set save(value: ColumnOrderState) {
        if (value.length > 0) {
            localStorage.setItem(this.getKey(), JSON.stringify(value))
        }
    }

    get read(): ColumnOrderState {
        const value = localStorage.getItem(this.getKey())
        if (!value) return []

        return JSON.parse(value)
    }

    flush(): void {
        localStorage.removeItem(this.getKey())
    }
}

export { StoreColumnSize, StoreColumnOrder }
