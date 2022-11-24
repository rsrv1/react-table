import { ColumnOrderState, ColumnSizingState } from '@tanstack/react-table'

interface PersistentStorage<T> {
    prefix: string
    save(value: T): void
    read(): T
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

    save(value: ColumnSizingState) {
        if (Object.keys(value).length > 0) {
            localStorage.setItem(this.getKey(), JSON.stringify(Object.assign({}, this.read(), value)))
        }
    }

    read(): ColumnSizingState {
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

    save(value: ColumnOrderState) {
        if (value.length > 0) {
            localStorage.setItem(this.getKey(), JSON.stringify(value))
        }
    }

    read(): ColumnOrderState {
        const value = localStorage.getItem(this.getKey())
        if (!value) return []

        return JSON.parse(value)
    }

    flush(): void {
        localStorage.removeItem(this.getKey())
    }
}

export { StoreColumnSize, StoreColumnOrder }
