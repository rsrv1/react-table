import { Row } from '@tanstack/react-table'
import { Person } from './../data/fetchData'

const renderSubComponent = ({ row }: { row: Row<Person> }) => {
    return (
        <pre className="text-xs">
            <code>{JSON.stringify(row.original, null, 2)}</code>
        </pre>
    )
}

export default renderSubComponent
