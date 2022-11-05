import { useRouter } from 'next/router'

function useRouteFilter() {
    const router = useRouter()

    const dispatch = (name: string, value: string) => {
        const currentFilters = router.query?.filter ? decodeURIComponent(router.query?.filter as string).split(',') : []

        router.push(
            {
                query: Object.assign({}, router.query, {
                    page: 0,
                    filter: router.query?.filter ? [...new Set([...currentFilters, name])].join(',') : name,
                    [`filter[${name}]`]: value,
                }),
            },
            undefined,
            { shallow: true }
        )
    }

    return dispatch
}

export default useRouteFilter
