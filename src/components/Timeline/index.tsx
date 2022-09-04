import React from 'react'

export const Timeline = () => {
    return (
        <ol className="flex items-center">
            <li className="relative mb-6">
                <div className="flex items-center">
                    <div className="flex z-10 justify-center items-center w-6 h-6 rounded-full bg-TDBlue shrink-0 animate-ping "></div>
                    <div className="hidden sm:flex w-full bg-gray-700 h-0.5 "></div>
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-gray-700 text-base" >Alpha.</h3>
                </div>
            </li>
            <li className="relative mb-6">
                <div className="flex items-center">
                    <div className="flex z-10 justify-center items-center w-6 h-6 rounded-full bg-TDRed shrink-0  "></div>
                    <div className="hidden sm:flex w-full bg-gray-700 h-0.5 "></div>
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-gray-700 text-base" >Seed Round.</h3>
                </div>
            </li>
            <li className="relative mb-6">
                <div className="flex items-center">
                    <div className="flex z-10 justify-center items-center w-6 h-6 rounded-full bg-TDGreen shrink-0 "></div>
                    <div className="hidden sm:flex w-full bg-gray-700 h-0.5 "></div>
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-gray-700 text-base" >First team.</h3>
                </div>
            </li>
            <li className="relative mb-6">
                <div className="flex items-center">
                    <div className="flex z-10 justify-center items-center w-6 h-6 rounded-full bg-TDBlue shrink-0 "></div>
                    <div className="hidden sm:flex w-full bg-gray-700 h-0.5 "></div>
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-gray-700 text-base" >Marketing campaign.</h3>
                </div>
            </li>
            <li className="relative mb-6">
                <div className="flex items-center">
                    <div className="flex z-10 justify-center items-center w-6 h-6 rounded-full bg-TDRed shrink-0 "></div>
                    <div className="hidden sm:flex w-full bg-gray-700 h-0.5 "></div>
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-gray-700 text-base" >DAO foundation.</h3>
                </div>
            </li>
            <li className="relative mb-6">
                <div className="flex items-center">
                    <div className="flex z-10 justify-center items-center w-6 h-6 rounded-full bg-TDGreen shrink-0 "></div>
                    <div className="hidden sm:flex w-full bg-gray-700 h-0.5 "></div>
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-gray-700 text-base" >Token sale.</h3>
                </div>
            </li>
            <li className="relative mb-6">
                <div className="flex items-center">
                    <div className="flex z-10 justify-center items-center w-6 h-6 rounded-full bg-TDBlue shrink-0 "></div>
                    <div className="hidden sm:flex w-full bg-gray-700 h-0.5 "></div>
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-gray-700 text-base" >Complete team.</h3>
                </div>
            </li>
            <li className="relative mb-6">
                <div className="flex items-center">
                    <div className="flex z-10 justify-center items-center w-6 h-6 rounded-full bg-TDRed shrink-0 "></div>
                    <div className="hidden sm:flex w-full bg-gray-700 h-0.5 "></div>
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-gray-700 text-base" >Official launch.</h3>
                </div>
            </li>
            <li className="relative mb-6">
                <div className="flex items-center">
                    <div className="flex z-10 justify-center items-center w-6 h-6 rounded-full bg-TDGreen shrink-0 "></div>
                    <div className="hidden sm:flex w-full  border-dashed border-2 border-gray-700 "></div>
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-gray-700 text-base" >Complete transition to DAO.</h3>
                </div>
            </li>
        </ol>

    )
}
