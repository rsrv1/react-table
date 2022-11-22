import { useSettingsState } from '../context/tableContext'
import { getQueryKey } from '../utils'

function useRouteKey() {
    const { uriQueryPrefix } = useSettingsState()

    const getKey = (name: string) => {
        return getQueryKey(uriQueryPrefix, name)
    }

    return getKey
}

export default useRouteKey
