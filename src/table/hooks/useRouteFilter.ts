import { useRouter } from 'next/router'
import { useSettingsState } from '../context/tableContext'
import { getFilterQueryKey, getQueryKey } from '../utils'

function useRouteFilter() {
    const router = useRouter()
    const { uriQueryPrefix: prefix } = useSettingsState()

    const dispatch = (name: string, value: string) => {
        const filterPath = getQueryKey(prefix, 'filter')
        const currentFilters = router.query[filterPath] ? decodeURIComponent(router.query[filterPath] as string).split(',') : []

        router.push(
            {
                query: Object.assign({}, router.query, {
                    page: 0,
                    [filterPath]: router.query[filterPath] ? [...new Set([...currentFilters, name])].join(',') : name,
                    [getFilterQueryKey(prefix, name)]: value,
                }),
            },
            undefined,
            { shallow: true }
        )
    }

    return dispatch
}

export default useRouteFilter
