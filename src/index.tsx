import React from 'react'
import { SWRConfig } from 'swr'
import Table from './table'

function Main() {
    return (
        <SWRConfig value={{ refreshInterval: 3000 }}>
            <Table />
        </SWRConfig>
    )
}

export default Main
