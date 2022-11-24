import React from 'react'
import { SWRConfig } from 'swr'
import { URI_QUERY_PREFIX } from './main'
import Table from './table'
import { TableProvider } from './table/context/tableContext'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
    return (
        <SWRConfig
            value={{
                onError: (error, key) => {
                    if (error.status !== 403 && error.status !== 404) {
                        // We can send the error to Sentry,
                        // or show a notification UI.
                    }
                },
            }}>
            <TableProvider prefix={URI_QUERY_PREFIX}>
                <DndProvider backend={HTML5Backend}>
                    <Table />
                </DndProvider>
            </TableProvider>
        </SWRConfig>
    )
}

export default App
