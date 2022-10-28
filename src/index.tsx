import React from 'react'
import { SWRConfig } from 'swr'
import Table from './table'
import { Provider as ReduxProvider } from 'react-redux'
import store from './redux/store'
import { TableProvider } from './table/context/tableContext'
import { Person } from './data/fetchData'
import { sortDirection } from './table/context/reducer/columnSort'

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
                <TableProvider<Person> search="tom" sort={{ firstName: sortDirection.ASC, visits: sortDirection.DESC }}>
                    <Table />
                </TableProvider>
            </ReduxProvider>
        </SWRConfig>
    )
}

export default App
