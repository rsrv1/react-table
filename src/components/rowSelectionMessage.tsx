import React from 'react'
import { KeyedMutator } from 'swr'
import { selectedRows } from '../table/context/reducer/rowSelection'
import { Response } from '../table/hooks/useTableData'
import Select from './Select'

type Props<T> = {
    loading: boolean
    mutate: KeyedMutator<Response<T>>
    count: number
    resetRowSelection: () => void
    selectedRows: selectedRows
}

function RowSelectionMessage<T>({ mutate, loading, count, selectedRows, resetRowSelection }: Props<T>) {
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

            resetRowSelection()
            setAction('')
            return
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
        <div className="absolute z-10 left-0 flex h-12 items-center bg-gray-100 sm:left-16 px-3 mr-3">
            <Select
                value={action}
                disabled={loading}
                className="rounded border border-gray-300 bg-white py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 mr-3"
                onChange={e => {
                    setAction(e.target.value)
                }}>
                <option value="">action</option>
                <option value="update">update</option>
                <option value="delete">delete</option>
            </Select>
            {action === '' ? (
                <button
                    type="button"
                    onClick={resetRowSelection}
                    className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">
                    de-select all
                </button>
            ) : (
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
    )
}

export default RowSelectionMessage
