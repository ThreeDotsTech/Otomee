import React, { useEffect, useState } from 'react'
import { ReactComponent as ETHLogo } from 'assets/svg/ethereum.svg'
import { useHistory } from 'react-router-dom'
import { useNFTMetadata } from 'hooks/useNFTMetadata'
import { ReactComponent as Play } from 'assets/svg/play.svg'
import { ReactComponent as Pause } from 'assets/svg/pause.svg'
import { OrderWrapperInterface } from 'orders/types'
import { formatEther } from 'ethers/lib/utils'

const ItemCard1 = ({ index, address, identifier, order }: { index: number, address: string, identifier: string, order?: OrderWrapperInterface }) => {

    const { title, image, loading, collectionName, animation } = useNFTMetadata(address, identifier)

    const [playVideo, setPlayVideo] = useState(false)

    const history = useHistory()

    function tooglePlayVideo() {
        setPlayVideo(!playVideo)
        return () => setPlayVideo(false)
    }

    function gotoItemPage() {
        history.push('/collection/' + address + '/' + identifier.toString())
    }

    return (
        <article className={"relative w-full shadow-lg bg-zinc-50 border border-gray-200 rounded-lg cursor-pointer hover:-translate-y-1 hover:shadow-2xl"} >
            <div className="flex justify-center overflow-x-hidden w-full aspect-square rounded-t-lg relative bg-slate-200">
                <a href={'/#/collection/' + address + '/' + identifier.toString()}>{(image == '' && animation != '') || playVideo ? <video className="bg-black h-full aspect-video object-contain" src={animation} autoPlay muted loop /> : <img className="h-full object-contain" src={image} />}</a>
                {animation != '' && image != '' ? <div onClick={tooglePlayVideo} className='absolute bottom-1 right-1 bg-white hover:shadow-2xl rounded-full w-8 h-8 p-2 fill-gray-400'>{playVideo ? <Pause className='' /> : <Play />}</div> : <></>}
            </div>
            <a href={'/#/collection/' + address + '/' + identifier.toString()} className="mt-2 pl-2 mb-2 flex justify-between h-16">
                <div className=' flex flex-col w-full'>
                    <div className="flex flex-row items-center">
                        <div className="flex flex-col w-full">
                            <p className="text-2xs font-semibold text-gray-600 mb-0 text-clip h-min ">{collectionName}</p>
                            <p className="text-xs font-semibold text-gray-900 mb-0 text-clip ">{title}</p>
                        </div>

                    </div>
                    <div className="flex">
                        {order &&
                            <div className=' mb-2 bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen rounded-md text-xs w-1/3'>
                                <div className="flex flex-row justify-center  items-center w-full px-2 py-1 backdrop-saturate-150 backdrop-blur-md rounded-md ">
                                    <p className=" text-white">{formatEther(order.price)} ETH</p>
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </a>
        </article>
    )
}

export default ItemCard1
