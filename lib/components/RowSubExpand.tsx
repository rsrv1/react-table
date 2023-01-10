import { Row } from '@tanstack/react-table'

const renderSubComponent = <T,>({ row }: { row: Row<T> }) => {
    return (
        <pre className="text-xs">
            <code>{JSON.stringify(row.original, null, 2)}</code>
        </pre>
    )
}

export default renderSubComponent
