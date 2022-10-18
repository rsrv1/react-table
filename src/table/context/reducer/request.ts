export type state = {
    loading: boolean
    searchTerm: string
    lastSearchTerm: string
}

export enum actionType {
    LOADING = 'LOADING',
    SET_SEARCH_TERM = 'SET_SEARCH_TERM',
    STORE_LAST_SEARCH_TERM = 'STORE_LAST_SEARCH_TERM',
}

export type actions =
    | { type: actionType.LOADING; payload: boolean }
    | { type: actionType.SET_SEARCH_TERM; payload: string }
    | { type: actionType.STORE_LAST_SEARCH_TERM }

export const initialState: state = {
    loading: false,
    lastSearchTerm: '',
    searchTerm: '',
}

export default function reducer(state: state, action: actions) {
    switch (action.type) {
        case actionType.LOADING:
            return _g(state, { loading: action.payload })

        case actionType.SET_SEARCH_TERM:
            return _g(state, { searchTerm: action.payload.trim() })

        case actionType.STORE_LAST_SEARCH_TERM:
            if (state.searchTerm === state.lastSearchTerm) return state

            return _g(state, { lastSearchTerm: state.searchTerm })

        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

function _g(state: state, modifications: Partial<state>) {
    return Object.assign({}, state, modifications)
}
