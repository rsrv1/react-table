import React from 'react'
import { Response } from '../pages/api/persons'
import { Person } from './data/fetchData'
import { RootState } from './redux/store'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { selectAllCurrentPageRows, selectCurrentPageAll } from './redux/slice/rowSelection'

function useCurrentPageRowSelectionListener(data: undefined | Response) {
    const dispatch = useAppDispatch()
    const addAllCurrentPageRows = useAppSelector((state: RootState) => state.rowSelection.addAllCurrentPageRows)

    React.useEffect(() => {
        if (data && addAllCurrentPageRows) {
            dispatch(selectCurrentPageAll(data.rows.map((row: Person) => row.id)))
            dispatch(selectAllCurrentPageRows(false)) // disable the flag
        }
    }, [addAllCurrentPageRows, data])
}

export default useCurrentPageRowSelectionListener
