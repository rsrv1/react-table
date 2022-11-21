import { useSettingsState } from '../context/tableContext'
import { getQueryKey } from '../utils'

function useRouteKey() {
    const { uriQueryPrefix } = useSettingsState()

    const getKey = (name: string) => {
        if (name.startsWith('filter')) throw new Error(`${name} is a reserved keyword, please choose different`)

        return getQueryKey(uriQueryPrefix, name)
    }

    return getKey
}

export default useRouteKey
