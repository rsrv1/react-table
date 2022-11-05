import React from 'react'
import { SWRConfig } from 'swr'
import Table from './table'
import { TableProvider } from './table/context/tableContext'

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
            <TableProvider>
                <Table />
            </TableProvider>
        </SWRConfig>
    )
}

export default App
