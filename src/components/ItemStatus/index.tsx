import { useWeb3React } from '@web3-react/core'
import { formatEther } from 'ethers/lib/utils'
import React from 'react'
import { useItemPageModalIntentionManager, useItemPageNFT, useItemPageOrderManager } from 'state/itemPage/hooks'
import { ModalIntention } from 'state/itemPage/reducer'
import { OrderWrapperInterface } from 'stateswap/orders/types'
import { timeDifference } from 'utils/relativeTime'

export const ItemStatus = ({ itemPageModalToggle, buyOrders, sellOrders }: { itemPageModalToggle: () => void, buyOrders: OrderWrapperInterface[], sellOrders: OrderWrapperInterface[] }) => {

    const { account } = useWeb3React()
    const [_, setModalIntention] = useItemPageModalIntentionManager()
    const [__, setOrder] = useItemPageOrderManager()
    const nft = useItemPageNFT()
    const isOwner = account?.toLowerCase() == nft?.owner.toLowerCase()

    return (
        <>
            {sellOrders[0] ?
                <div className="flex flex-col bg-zinc-50 w-full border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between">
                        <p>For Sale</p>
                        <p>Sale ends in {timeDifference(sellOrders[0].order.expirationTime / 1000)}. </p>
                    </div>
                    <div className="flex flex-col h-full items-center justify-center my-5  ">
                        {nft?.loading ? <h2 className="bg-gray-600 animate-pulse h-20 mt-3 w-3/5"></h2> : <p className="text-5xl font-semibold text-black mb-0 text-ellipsis pb-2">{formatEther(sellOrders[0].price)} ETH</p>}
                        {nft?.loading ? <h2 className="bg-gray-400 animate-pulse h-5 w-3/12"></h2> : <span className="text-lg font-semibold text-black mb-0 text-ellipsis"></span>}
                    </div>

                    <div className="flex h-full items-center justify-center my-3">
                        <a onClick={() => {
                            itemPageModalToggle()
                            if (!isOwner) {
                                setModalIntention(ModalIntention.MATCH)
                                setOrder(sellOrders[0])
                            }
                        }} className='transition ease-in-out delay-100 bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 cursor-pointer'>
                            <div className="flex flex-row justify-center  items-center w-full h-full px-2 py-3 backdrop-saturate-150 rounded-full ">
                                <p className=" text-white font-semibold text-base">{isOwner ? 'Lower Price' : 'Buy'}</p>
                            </div>
                        </a>
                        <a onClick={() => {
                            itemPageModalToggle()
                            if (isOwner) {
                                setModalIntention(ModalIntention.CANCEL)
                                setOrder(sellOrders[0])
                            }
                        }} className='transition ease-in-out delay-100 bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 cursor-pointer'>
                            <div className="flex flex-row justify-center  border-2 border-transparent bg-clip-padding bg-zinc-50 backdrop-saturate-150 items-center w-full h-full px-2 py-3 rounded-full">
                                <p className="bg-clip-text text-transparent bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen font-semibold text-base" >{isOwner ? 'Cancel listing' : 'Make an offer'}</p>
                            </div>
                        </a>
                    </div>
                </div> :
                <div className="flex flex-col bg-zinc-50 w-full border border-gray-200 rounded-xl p-4">
                    {
                        buyOrders[0] &&
                        <>
                            <div className='ml-4 text-base'>
                                Highest offer:
                            </div>
                            <div className='ml-4 text-lg font-semibold'>
                                {formatEther(buyOrders[0].price)}{'ETH'}
                            </div>
                        </>
                    }
                    <div className="flex h-full items-center justify-center my-3">
                        {account?.toLowerCase() != nft?.owner.toLowerCase() ?
                            <a onClick={itemPageModalToggle} className='transition ease-in-out delay-100 bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 cursor-pointer'>
                                <div className="flex flex-row justify-center  items-center w-full h-full px-2 py-3 backdrop-saturate-150 rounded-full ">
                                    <p className=" text-white font-semibold text-base">Make offer</p>
                                </div>
                            </a> :
                            <a onClick={itemPageModalToggle} className='transition ease-in-out delay-100 bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 cursor-pointer'>
                                <div className="flex flex-row justify-center  border-2 border-transparent bg-clip-padding bg-zinc-50 backdrop-saturate-150 items-center w-full h-full px-2 py-3 rounded-full">
                                    <p className="bg-clip-text text-transparent bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen font-semibold text-base" >Sell</p>
                                </div>
                            </a>}
                    </div>
                </div>}
        </>
    )
    /*
    
    */
}
