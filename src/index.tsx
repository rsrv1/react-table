import React from 'react'
import { SWRConfig } from 'swr'
import Table from './table'
import { Provider as ReduxProvider } from 'react-redux'
import store from './redux/store'
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
            {/* user provided redux provider */}
            <ReduxProvider store={store}>
                <TableProvider>
                    <Table />
                </TableProvider>
            </ReduxProvider>
        </SWRConfig>
    )
}

export default App
