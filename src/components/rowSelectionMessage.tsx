import React from 'react'
import { KeyedMutator } from 'swr'
import { Person } from '../data/fetchData'
import { selectedRows } from '../table/context/reducer/rowSelection'
import { Response } from '../table/hooks/useTableData'
import Select from './Select'

type Props = {
    loading: boolean
    mutate: KeyedMutator<Response<Person>>
    count: number
    resetRowSelection: () => void
    selectedRows: selectedRows
}

function RowSelectionMessage({ mutate, loading, count, selectedRows, resetRowSelection }: Props) {
    const [action, setAction] = React.useState('')

    const applyAction = () => {
        if (action === 'update') {
            // good spot to do a network request that dont block the next mutation

            mutate(
                data => {
                    if (!data) return

                    const updatedRows = [...data.rows].map(p => {
                        if ('ids' in selectedRows && selectedRows.ids.includes(p.id)) {
                            return { ...p, firstName: 'UPDATED' }
                        }

                        if ('except' in selectedRows && !selectedRows.except.includes(p.id)) {
                            return { ...p, firstName: 'UPDATED' }
                        }

                        return p
                    })

                    return Object.assign({}, data, { rows: updatedRows })
                },
                { revalidate: false }
            )
        }

        // probably action is delete
        mutate(
            data => {
                if (!data) return

                const updatedRows = [...data.rows].filter(p => {
                    if (
                        ('ids' in selectedRows && selectedRows.ids.includes(p.id)) ||
                        ('except' in selectedRows && !selectedRows.except.includes(p.id))
                    ) {
                        return false
                    }

                    return true
                })

                return Object.assign({}, data, { rows: updatedRows })
            },
            { revalidate: false }
        )

        resetRowSelection()
        setAction('')
    }

    const unsetActionSelection = () => {
        resetRowSelection()
        setAction('')
    }

    return (
        <div className="bg-sky-50 px-4 py-2 mb-2">
            <div className="flex">
                <div className="ml-3 flex-1 md:flex md:justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="text-sm text-sky-700">
                            {count} row{count > 1 && 's'} selected
                        </div>
                        <div className="flex items-center space-x-2">
                            <Select
                                value={action}
                                disabled={loading}
                                onChange={e => {
                                    setAction(e.target.value)
                                }}>
                                <option value="">action</option>
                                <option value="update">update</option>
                                <option value="delete">delete</option>
                            </Select>
                            {action !== '' && (
                                <>
                                    <button onClick={applyAction} className="p-1 text-xs" type="button">
                                        ✔
                                    </button>
                                    <button onClick={unsetActionSelection} className="p-1 text-xs" type="button">
                                        ❌
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <p className="mt-3 text-sm md:mt-0 md:ml-6">
                        <button onClick={resetRowSelection} type="button" className="whitespace-nowrap font-medium text-sky-700 hover:text-sky-600">
                            <span aria-hidden="true">&times;</span> de-select all
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RowSelectionMessage
