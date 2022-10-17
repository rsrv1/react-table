import React from 'react'
import { SWRConfig } from 'swr'
import Table from './table'
import Provider from './table/provider'

function App() {
    return (
        <SWRConfig value={{ refreshInterval: 5000 }}>
            <Provider>
                <Table />
            </Provider>
        </SWRConfig>
    )
}

export default App
