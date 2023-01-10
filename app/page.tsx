import Table from '../lib'

async function fetchData() {
    // await new Promise(resolve => setTimeout(() => resolve(true), 2000))

    const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, { cache: 'no-store' })
    const data = await res.json()
    return data
}

export default async function Page({ params }: { params?: any; children?: React.ReactNode }) {
    const data = await fetchData()

    return (
        <div className="space-y-4">
            <Table />
        </div>
    )
}
