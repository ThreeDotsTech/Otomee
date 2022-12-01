import TransactionTile from 'components/TransactionTile'
import { BigNumber } from 'ethers'
import React, { useContext, useEffect, useState } from 'react'
import { AddressZero } from '@ethersproject/constants'

import { OrderWrapperInterface } from 'stateswap/orders/types'
import OfferTile from 'components/OfferTile'
import { useWeb3React } from '@web3-react/core'

enum ActiveTabOptions {
    TRANSFERS = 0,
    LISTINGS = 1,
    OFFERS = 2,
    PRICE_HISTORY = 3
}
export const NFTDetailTabs = ({ transfers, orders, listings, owner }: { transfers: any[], orders: OrderWrapperInterface[], listings: OrderWrapperInterface[], owner: string }) => {
    const { account } = useWeb3React()
    const [ActiveTab, setActiveTab] = useState<ActiveTabOptions>(ActiveTabOptions.TRANSFERS)
    const [transfersElements, setTransfersElements] = useState<JSX.Element[]>([])
    const [offerElements, setofferElements] = useState<JSX.Element[]>([])
    const [listingElements, setlistingElements] = useState<JSX.Element[]>([])
    const isOwner = account?.toLowerCase() == owner.toLowerCase()


    useEffect(() => {
        setTransfersElements(transfers.map((transfer: { timestamp: number, from: any, to: any, transaction: any, }, index: number) =>
            <TransactionTile key={index} timestamp={transfer.timestamp} from={transfer.from?.id ?? AddressZero} to={transfer.to?.id} transaction={transfer.transaction} />))
        return function () {
            setTransfersElements([])
        }
    }, [transfers])

    useEffect(() => {
        setofferElements(orders.map((order, index: number) =>
            <OfferTile key={index} order={order} owner={owner} />))
        return function () {
            setofferElements([])
        }
    }, [orders])

    useEffect(() => {
        setlistingElements(listings.map((order, index: number) =>
            <OfferTile key={index} order={order} />))
        return function () {
            setlistingElements([])
        }
    }, [listings])


    function renderSwitch(_activeTab: ActiveTabOptions) {
        switch (_activeTab) {
            case ActiveTabOptions.TRANSFERS:
                return <>
                    <div className='flex items-center h-10  justify-evenly'>
                        <p className='w-1/4'>Event</p>
                        <p className='w-1/4 -ml-12'>From</p>
                        <p className='w-1/4'>To</p>
                        <p className='w-1/4 -mr-10'>Date</p>
                    </div>
                    {transfersElements}
                </>;

            case ActiveTabOptions.OFFERS:
                return <>
                    {isOwner ?
                        <div className='flex items-center h-10  justify-evenly '>
                            <p className='flex w-1/4 justify-center '>Price</p>
                            <p className='flex w-1/4 justify-center '>Expiration</p>
                            <p className='flex w-1/4 justify-center '>From</p>
                        </div>
                        :
                        <div className='flex items-center h-10  justify-evenly '>
                            <p className='flex w-1/3 justify-center '>Price</p>
                            <p className='flex w-1/3 justify-center '>Expiration</p>
                            <p className='flex w-1/3 justify-center '>From</p>
                        </div>
                    }
                    {offerElements}
                </>;
            case ActiveTabOptions.LISTINGS:
                return <>
                    <div className='flex items-center h-10  justify-evenly '>
                        <p className='flex w-1/3 justify-center '>Price</p>
                        <p className='flex w-1/3 justify-center '>Expiration</p>
                        <p className='flex w-1/3 justify-center '>From</p>
                    </div>
                    {listingElements}
                </>;
            default:
                return <>
                    foo
                </>;
        }
    }

    return (
        <div className='w-full'>
            <div className="flex w-full items-center justify-evenly mt-5 mb-2 px-1 text-sm font-semibold">
                <div className={'flex cursor-pointer w-1/4 py-2 justify-center items-center rounded-full' + ((ActiveTab == ActiveTabOptions.TRANSFERS) ? ' bg-white' : '')} onClick={() => setActiveTab(ActiveTabOptions.TRANSFERS)}>
                    Transfers
                </div>
                <div className={'flex cursor-pointer w-1/4 py-2 justify-center items-center rounded-full' + ((ActiveTab == ActiveTabOptions.LISTINGS) ? ' bg-white' : '')} onClick={() => setActiveTab(ActiveTabOptions.LISTINGS)}>
                    Listings
                </div>
                <div className={'flex cursor-pointer w-1/4 py-2 justify-center items-center rounded-full' + ((ActiveTab == ActiveTabOptions.OFFERS) ? ' bg-white' : '')} onClick={() => setActiveTab(ActiveTabOptions.OFFERS)}>
                    Offers
                </div>

                <div className={'flex cursor-pointer w-1/4 py-2 justify-center items-center rounded-full' + ((ActiveTab == ActiveTabOptions.PRICE_HISTORY) ? ' bg-white' : '')} onClick={() => setActiveTab(ActiveTabOptions.PRICE_HISTORY)}>
                    Price History
                </div>
            </div>

            <div className="flex flex-col bg-zinc-50 w-full border border-gray-200 rounded-xl divide-y overflow-clip text-sm">

                {renderSwitch(ActiveTab)}

            </div>
        </div>
    )
}
