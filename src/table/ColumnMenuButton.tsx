import { DotsThreeVertical } from 'phosphor-react'
import React from 'react'

export const buttonClassName =
    'flex items-center rounded-full group hover:bg-gray-100 ml-2 p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'
export const Icon = <DotsThreeVertical weight="regular" className="w-5 h-5 hover:text-gray-700" aria-hidden="true" />

const FakeColumnMenuButton = () => {
    return (
        <button type="button" aria-label="column menu" className={buttonClassName}>
            {Icon}
        </button>
    )
}

export { FakeColumnMenuButton }
