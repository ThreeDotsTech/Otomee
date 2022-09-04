import React from 'react'

export const Circles = () => {

    return (
        <div className='flex justify-center z-0'>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-TDBlue rounded-full filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-TDGreen rounded-full  filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-10 left-20 w-72 h-72 bg-TDRed rounded-full  filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
    )
}