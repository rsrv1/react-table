export type state = {
    loading: boolean
    validating: boolean
    columnRePositioning: boolean
    total: number
}

export enum actionType {
    LOADING = 'LOADING',
    VALIDATING = 'VALIDATING',
    COLUMN_RE_POSITIONING = 'COLUMN_RE_POSITIONING',
    SET_RESULT_TOTAL = 'SET_RESULT_TOTAL',
}

export type actions =
    | { type: actionType.LOADING; payload: boolean }
    | { type: actionType.VALIDATING; payload: boolean }
    | { type: actionType.COLUMN_RE_POSITIONING; payload: boolean }
    | { type: actionType.SET_RESULT_TOTAL; payload: number }

export default function reducer(state: state, action: actions) {
    switch (action.type) {
        case actionType.LOADING:
            return _g(state, { loading: action.payload })

        case actionType.VALIDATING:
            console.log('VALIDATING', action.payload)

            return _g(state, { validating: action.payload })

        case actionType.COLUMN_RE_POSITIONING:
            return _g(state, { columnRePositioning: action.payload })

        case actionType.SET_RESULT_TOTAL:
            return _g(state, { total: action.payload })

        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

function _g(state: state, modifications: Partial<state>) {
    return Object.assign({}, state, modifications)
}
