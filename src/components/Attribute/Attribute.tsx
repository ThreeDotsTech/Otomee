import React from 'react'

const Attribute = ({ trait_type, value }: { trait_type: string, value: string }) => {
    return (
        <div className='flex flex-col rounded-lg border bg-white border-gray-200  w-full py-2 items-center px-1 overflow-hidden'>
            <p className="text-sm text-gray-600 ">
                {trait_type}
            </p>
            <p className="text-md text-black truncate">
                {value}
            </p>
        </div>
    )
}

export default Attribute
