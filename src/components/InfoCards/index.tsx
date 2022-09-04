import React from 'react'

export const InfoCard = ({ title, description, icon }: { title: string, description: string, icon: JSX.Element }) => {
    return (
        <div className="relative group flex justify-center p-6 bg-transparent flex-col items-center rounded-xl w-96 h-[330px] content-start">
            <div className='group-hover:animate-rapid_tilt transition duration-1000'>{icon}</div>
            <h1 className="text-gray-900 text-xl leading-tight font-medium mb-2 group-hover:scale-110 transition duration-1000">{title}</h1>
            <p className="text-justify text-gray-700 text-base mb-4">
                {description}
            </p>
        </div>)
}