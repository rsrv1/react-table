import React from 'react'
import { SWRConfig } from 'swr'
import Table from './table'
import { Provider as ReduxProvider } from 'react-redux'
import store from './redux/store'

function Main() {
    return (
        <ReduxProvider store={store}>
            <SWRConfig value={{ refreshInterval: 3000 }}>
                <Table />
            </SWRConfig>
        </ReduxProvider>
    )
}

export default Main
