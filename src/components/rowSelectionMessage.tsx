import React from 'react'

function RowSelectionMessage({ count, resetRowSelection }: { count: number; resetRowSelection: () => void }) {
    return (
        <div className="bg-sky-50 px-4 py-2 mb-2">
            <div className="flex">
                <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-sky-700">
                        {count} row{count > 1 && 's'} selected
                    </p>
                    <p className="mt-3 text-sm md:mt-0 md:ml-6">
                        <button onClick={resetRowSelection} type="button" className="whitespace-nowrap font-medium text-sky-700 hover:text-sky-600">
                            <span aria-hidden="true">&times;</span> de-select all
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RowSelectionMessage
