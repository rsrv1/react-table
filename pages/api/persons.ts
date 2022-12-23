import type { NextApiRequest, NextApiResponse } from 'next'
import faker from '@faker-js/faker'
import { Person, Status } from '../../src/data/fetchData'
import { range } from '../../src/table/utils'
import { Query, Response } from '../../src/table/hooks/useTableData'
const crypto = require('node:crypto')

const newPerson = (): Person => {
    return {
        id: crypto.randomUUID(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: faker.datatype.number(40),
        visits: faker.datatype.number(1000),
        progress: faker.datatype.number(100),
        status: faker.helpers.shuffle<Person['status']>(Object.values(Status))[0]!,
    }
}

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!
        return range(len).map((d): Person => newPerson())
    }

    return makeDataLevel()
}

const TOTAL = 100
const data = makeData(TOTAL)

function handler(req: NextApiRequest, res: NextApiResponse<Response<Person>>) {
    const { page, perPage, search, sort, filter } = <Query>req.query
    const pageIndex = Number(page)
    const pageSize = Number(perPage)

    res.status(200).json({
        rows: data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
        pageCount: Math.ceil(TOTAL / pageSize),
        total: TOTAL,
    })
}

export default handler
