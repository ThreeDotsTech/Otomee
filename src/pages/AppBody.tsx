import React from 'react'

export default function AppBody({ children, ...rest }: { children: React.ReactNode }) {
    return (<div {...rest} className='relative min-h-screen  w-full'>
        <div className="pt-16 flex flex-col flex-grow bg-gray-100 h-screen">
            {children}
        </div>

    </div>)
}