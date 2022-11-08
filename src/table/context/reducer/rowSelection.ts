export type KeyedIds = { [key: string]: boolean }

export type state = {
    all: boolean
    except: KeyedIds

    only: KeyedIds
    addAllCurrentPageRows: boolean
}

export const initialState: state = {
    all: false,
    except: {},

    only: {},
    addAllCurrentPageRows: false,
}

export enum actionType {
    SELECT_ALL = 'SELECT_ALL',
    SELECT_CURRENT_PAGE = 'SELECT_CURRENT_PAGE',
    WANT_CURRENT_PAGE = 'WANT_CURRENT_PAGE',
    ADD_TO_ONLY = 'ADD_TO_ONLY',
    REMOVE_FROM_ONLY = 'REMOVE_FROM_ONLY',
    ADD_TO_EXCEPT = 'ADD_TO_EXCEPT',
    REMOVE_FROM_EXCEPT = 'REMOVE_FROM_EXCEPT',
    RESET = 'RESET',
}

export type actions =
    | { type: actionType.SELECT_ALL }
    | { type: actionType.SELECT_CURRENT_PAGE; payload: string[] }
    | { type: actionType.WANT_CURRENT_PAGE; payload: boolean }
    | { type: actionType.ADD_TO_ONLY; payload: string }
    | { type: actionType.REMOVE_FROM_ONLY; payload: string }
    | { type: actionType.ADD_TO_EXCEPT; payload: string }
    | { type: actionType.REMOVE_FROM_EXCEPT; payload: string }
    | { type: actionType.RESET }

export default function reducer(state: state, action: actions) {
    switch (action.type) {
        case actionType.SELECT_ALL:
            return _g(state, {
                all: true,
                only: {},
                except: {},
            })

        case actionType.SELECT_CURRENT_PAGE:
            return _g(state, {
                all: false,
                except: {},
                only: action.payload.reduce((acc, id) => Object.assign({}, acc, { [id]: true }), {}),
            })

        case actionType.WANT_CURRENT_PAGE:
            return _g(state, { addAllCurrentPageRows: action.payload })

        case actionType.ADD_TO_ONLY:
            return _g(state, {
                only: Object.assign({}, state.only, {
                    [action.payload]: true,
                }),
            })

        case actionType.REMOVE_FROM_ONLY:
            const only = { ...state.only }
            delete only[action.payload]

            return _g(state, { only })

        case actionType.ADD_TO_EXCEPT:
            return _g(state, {
                except: Object.assign({}, state.except, {
                    [action.payload]: true,
                }),
            })

        case actionType.REMOVE_FROM_EXCEPT:
            const except = { ...state.except }
            delete except[action.payload]

            return _g(state, { except })

        case actionType.RESET:
            return _g(state, {
                all: false,
                only: {},
                except: {},
                addAllCurrentPageRows: false,
            })

        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

function _g(state: state, modifications: Partial<state>): state {
    return Object.assign({}, state, modifications)
}

/** SELECTORS */

type isSelectedGetter = {
    (id: string): boolean
}

export const isSelected = (state: state): isSelectedGetter => {
    const { all, only, except } = state

    return (id: string) => {
        if (Object.keys(only).length > 0) {
            return only[id]
        }

        if (all) {
            return !except[id]
        }

        return false
    }
}

type totalSelectionCountGetter = {
    (total: number): number
}
export const selectionCount = (state: state): totalSelectionCountGetter => {
    const { all, only, except } = state
    const totalOnly = Object.keys(only).length
    const totalExcept = Object.keys(except).length

    return (total: number) => {
        if (totalOnly) {
            return totalOnly
        }

        if (all) {
            return total - totalExcept
        }

        return 0
    }
}

type selectedAllRows = {
    all: boolean
    except: string[]
}
type selectedSomeRows = {
    ids: string[]
}

export type selectedRows = selectedAllRows | selectedSomeRows

export const getSelectedRows = (state: state): selectedRows => {
    const { all, only, except } = state
    const allOnly = Object.keys(only)

    if (all) {
        return { all: true, except: Object.keys(except) }
    }

    return { ids: allOnly }
}
