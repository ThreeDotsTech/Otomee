import React from 'react'
import Banner from 'assets/images/banner.png'
import Logo from 'assets/images/Otomee.png'
import { useERC721Data } from 'hooks/useNFTName'



const CollectionBanner = ({ address, floorPrice }: { address: string, floorPrice: number | string }) => {
    const erc721 = useERC721Data(address)
    return (
        <div className="relative h-72 overflow-visible">
            <img id="cover" className="absolute object-cover h-72 w-full"
                src={Banner}
                alt="{{ profile.user.username }}" />

            <div className="h-full">
                <div className="absolute flex flex-col justify-center h-full w-full items-center">

                    <img id="cover" className="object-cover rounded-full h-32 w-32 mb-3"
                        src={Logo}
                        alt="{{ profile.user.username }}" />

                    <div className="flex flex-col w-1/3 h-min text-black rounded-lg backdrop-blur-xl  backdrop-saturate-150 py-2 px-5 items-center">
                        <p className="font-sans sm:text-3xl text-2xl subpixel-antialiased font-medium text-opacity-50 leading-none drop-shadow-xl">
                            {erc721.name} </p>
                        <div className="flex w-full justify-between items-center  divide-x">
                            <div className="flex flex-col h-ful justify-center items-center py-2 px-5 w-1/3">
                                <p className="text-md text-gray-600 subpixel-antialiased font-medium  leading-none drop-shadow-lg mb-2">
                                    items</p>
                                <p className="text-lg text-black subpixel-antialiased font-medium leading-none drop-shadow-lg">
                                    {erc721.supply?.toNumber()}</p>
                            </div>
                            <div className="flex flex-col h-ful justify-center items-center py-2 px-5 w-1/3">
                                <p className="text-md text-gray-600 subpixel-antialiased font-medium  leading-none drop-shadow-lg mb-2">
                                    floor price</p>
                                <p className="text-lg text-black subpixel-antialiased font-medium leading-none drop-shadow-lg">
                                    {floorPrice}</p>
                            </div>
                            <div className="flex flex-col h-ful justify-center items-center py-2 px-5 w-1/3">
                                <p className="text-md text-gray-600 subpixel-antialiased font-medium  leading-none drop-shadow-lg mb-2">
                                    volume</p>
                                <p className="text-lg text-black subpixel-antialiased font-medium leading-none drop-shadow-lg">
                                    -</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CollectionBanner
