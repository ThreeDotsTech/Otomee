import React from 'react'
import { shortenAddress } from 'utils'
import { timeDifference } from 'utils/relativeTime'

import useENSName from 'hooks/useENSName'

import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Identicon from 'components/Identicon'
import { utils } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { useSaleActionManager, useSaleOrderManager } from 'state/sale/hooks'
import { OrderWrapperInterface } from 'orders/types'
import { useMakeOfferModalToggle } from 'state/application/hooks'
import { SaleAction } from 'state/sale/reducer'

const AvatarWrapper = styled.div`
border-radius: 9999px;
height: 1.5rem/* 160px */;
width: 1.5rem/* 160px */;
object-fit: cover;
overflow: clip;
`

const OfferTile = ({ order, owner }: { order: OrderWrapperInterface, owner?: string }) => {
    const { account } = useWeb3React()
    const isOwner = account?.toLowerCase() == owner?.toLowerCase()
    const ENSNameMaker = useENSName(order.maker)
    const [_, setAction] = useSaleActionManager()
    const [__, setOrder] = useSaleOrderManager()
    const MakeOfferModalToggle = useMakeOfferModalToggle()
    return (
        <div className={'flex w-full py-2 items-center overflow-hidden odd:bg-white even:bg-slate-50 justify-evenly h-10'}>

            <div className='flex w-max justify-center'>
                {utils.formatEther(order.price)} ETH
            </div>

            <div className='flex w-max justify-center'>
                {timeDifference(order.order.expirationTime / 1000)}
            </div>

            <div className='w-max flex justify-center'>
                <AvatarWrapper>
                    <Identicon externalAddress={order.maker} jazzIconDiameter={24} />
                </AvatarWrapper>
                <Link to={'/profile/' + order.maker} className='ml-1 font-normal truncate'> {(ENSNameMaker.ENSName || shortenAddress(order.maker))} </Link>
            </div>

            {isOwner ?
                <a
                    onClick={() => {
                        MakeOfferModalToggle()
                        setAction(SaleAction.MATCH)
                        setOrder(order)
                    }}
                    className='transition ease-in-out delay-100 bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen rounded-full text-xs w-max hover:scale-95 cursor-pointer'>
                    <div className="flex flex-row justify-center  items-center w-full px-2 backdrop-saturate-150 rounded-full ">
                        <p className=" text-white text-base">Accept</p>
                    </div>
                </a> :
                <></>
            }
        </div>
    )
}

export default OfferTile
