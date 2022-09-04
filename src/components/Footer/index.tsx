import React from 'react'

export const Footer = () => {
    return (
        <footer className="p-4 shadow md:flex md:items-center md:justify-between md:p-6 bg-gray-300 h-[70px]">
            <span className="font-normal text-center pt-5 pb-2 text-md py-5"> Made with ❤ for the world.</span>
            <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <a href="https://discord.gg/qtMbW2X5fs" className="mr-4 hover:underline md:mr-6 ">Discord.</a>
                </li>
                <li>
                    <a href="https://twitter.com/OtomeeEx" className="mr-4 hover:underline md:mr-6">Twitter.</a>
                </li>
            </ul>
        </footer>
    )
}
