import { useRouter, useSearchParams } from 'next/navigation'
import { useSettingsState } from '../context/tableContext'
import { getFilterQueryKey, getQueryKey } from '../utils'
import urlcat from 'urlcat'

function useRouteFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { uriQueryPrefix: prefix } = useSettingsState()

    const dispatch = (name: string, value: string) => {
        const filterPath = getQueryKey(prefix, 'filter')
        const currentFilters = searchParams.get(filterPath) ? decodeURIComponent(searchParams.get(filterPath) as string).split(',') : []

        router.push(
            urlcat(
                '',
                '/',
                Object.assign({}, Object.fromEntries(searchParams.entries()), {
                    page: 0,
                    [filterPath]: searchParams.get(filterPath) ? [...new Set([...currentFilters, name])].join(',') : name,
                    [getFilterQueryKey(prefix, name)]: value,
                })
            )
        )
    }

    return dispatch
}

export default useRouteFilter
