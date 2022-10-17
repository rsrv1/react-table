import React from 'react'
import { SWRConfig } from 'swr'
import Table from './table'
import Provider from './table/provider'
import { Provider as ReduxProvider } from 'react-redux'
import store from './redux/store'

function App() {
    return (
        <SWRConfig value={{ refreshInterval: 5000 }}>
            {/* user provided redux provider */}
            <ReduxProvider store={store}>
                <Provider>
                    <Table />
                </Provider>
            </ReduxProvider>
        </SWRConfig>
    )
}

export default App
