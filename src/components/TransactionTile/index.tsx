import React from 'react'
import { shortenAddress } from 'utils'
import { AddressZero } from '@ethersproject/constants'
import { timeDifference } from 'utils/relativeTime'
import { ReactComponent as Mint } from 'assets/svg/mint.svg'
import { ReactComponent as Transfer } from 'assets/svg/transfer.svg'
import { ReactComponent as ExternalLink } from 'assets/svg/link.svg'
import useENSName from 'hooks/useENSName'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'
import { useActiveWeb3React } from 'hooks/web3'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Identicon from 'components/Identicon'

const AvatarWrapper = styled.div`
border-radius: 9999px;
height: 1.5rem/* 160px */;
width: 1.5rem/* 160px */;
object-fit: cover;
overflow: clip;
`

const TransactionTile = ({ timestamp, from, to, transaction }: { timestamp: number, from: any, to: any, transaction: any }) => {
    const { chainId } = useActiveWeb3React()
    const ENSNameFrom = useENSName(from)
    const ENSNameTo = useENSName(to)
    return (
        <div className={'flex w-full py-2 items-center overflow-hidden odd:bg-white even:bg-slate-50 justify-evenly h-10'}>

            {from == AddressZero ? <div className='w-1/4 flex' > <Mint className='mr-1' /> Mint </div> : <div className='w-1/4 flex'> <Transfer className='mr-1' /> Transfer </div>}

            <div className='w-1/4 flex -ml-12'>
                <AvatarWrapper>
                    <Identicon externalAddress={from} jazzIconDiameter={24} />
                </AvatarWrapper>
                <Link to={'/profile/' + from} className='ml-1 font-normal truncate'> {(ENSNameFrom.ENSName || shortenAddress(from))} </Link>
            </div>

            <div className='w-1/4 flex'>
                <AvatarWrapper>
                    <Identicon externalAddress={to} jazzIconDiameter={24} />
                </AvatarWrapper>
                <Link to={'/profile/' + to} className='ml-1 font-normal truncate'> {(ENSNameTo.ENSName || shortenAddress(to))} </Link>
            </div>
            <div className='flex w-1/4 -mr-10 items-center'>
                <a className='truncate' href={getExplorerLink(chainId ?? 1, transaction.id, ExplorerDataType.TRANSACTION)} target="_blank" rel="noreferrer">
                    {timeDifference(timestamp)}
                </a>
                <ExternalLink className='h-4 ml-1' />
            </div>

        </div>
    )
}

export default TransactionTile
