export enum sortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export type state = {
    column: {
        [key: string]: sortDirection
    }
}

export enum actionType {
    BULK_SET = 'BULK_SET',
    MUTATE = 'MUTATE',
    REMOVE = 'REMOVE',
    RESET = 'RESET',
}

export type actions =
    | { type: actionType.BULK_SET; payload: { [column: string]: sortDirection } }
    | { type: actionType.MUTATE; payload: { column: string; direction: sortDirection } }
    | { type: actionType.REMOVE; payload: string }
    | { type: actionType.RESET }

export default function reducer(state: state, action: actions) {
    switch (action.type) {
        case actionType.BULK_SET:
            return _g(state, {
                column: Object.assign(state.column, action.payload),
            })

        case actionType.MUTATE:
            return _g(state, {
                column: Object.assign(state.column, {
                    [action.payload.column]: action.payload.direction,
                }),
            })

        case actionType.REMOVE:
            const column = { ...state.column }
            delete column[action.payload]

            return _g(state, { column })

        case actionType.RESET:
            return _g(state, { column: {} })

        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

export const getSorted = (state: state): string => {
    const entries = Object.entries(state.column)
    if (entries.length === 0) return ''

    return entries.map(([col, direction]) => (direction === sortDirection.DESC ? `-${col}` : col)).join(',')
}

function _g(state: state, modifications: Partial<state>) {
    return Object.assign({}, state, modifications)
}
