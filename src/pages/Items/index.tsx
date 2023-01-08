
import AppBody from 'pages/AppBody'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Linkify from 'react-linkify';
import useENSName from 'hooks/useENSName'
import { shortenAddress } from 'utils'
import Identicon from 'components/Identicon'
import styled from 'styled-components'
import { useGetExactTokenInfo } from 'hooks/useSubgraph'
import { useNFTMetadata } from 'hooks/useNFTMetadata'
import Attribute from 'components/Attribute/Attribute'
import { CHAIN_INFO } from 'constants/chains';
import { useActiveWeb3React } from 'hooks/web3';
import { ReactComponent as Favorite } from 'assets/svg/favorite.svg'
import { ReactComponent as ExternalLink } from 'assets/svg/link.svg'
import { ReactComponent as Share } from 'assets/svg/share.svg'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink';
import { NetworkContextName } from 'constants/misc';
import { useWeb3React } from '@web3-react/core';
import ItemPageModal from 'components/ItemPageModal';
import { useItemPageModalToggle } from 'state/application/hooks';
import { SupportedNFTInterfaces } from 'constants/ERC165'
import { NFTDetailTabs } from 'components/NftDetailTabs';
import { ItemStatus } from 'components/ItemStatus';
import { OrderType, OrderWrapperInterface } from 'stateswap/orders/types';
import OrbitContext from 'state/orbitdb/orbitContext'
import { BigNumber } from 'ethers';
import { Send } from 'react-feather'
import { useItemPageModalIntentionManager, useItemPageOrderManager } from 'state/itemPage/hooks'
import { ModalIntention } from 'state/itemPage/reducer';

const AvatarWrapper = styled.div`
border-radius: 9999px;
height: 1.5rem/* 160px */;
width: 1.5rem/* 160px */;
object-fit: cover;
overflow: clip;
`
const ItemsPage = () => {
    const { chainId, active, account } = useActiveWeb3React()
    const contextNetwork = useWeb3React(NetworkContextName)
    const { address, idString }: { address: string, idString: string } = useParams()
    const [attributesElements, setattributesElements] = useState<JSX.Element[]>([])
    const [nftType, setnftType] = useState<SupportedNFTInterfaces>(SupportedNFTInterfaces.ERC721)
    const { is721, is1155, totalSupply, transfers, fetching, erc721Error, erc1155Error, executeQuery } = useGetExactTokenInfo(address, idString, 0)
    const nft = useNFTMetadata(address, idString)
    const { orbitdb } = useContext(OrbitContext)
    const [buyOrders, setBuyOrders] = useState<OrderWrapperInterface[]>([])
    const [sellOrders, setSellOrders] = useState<OrderWrapperInterface[]>([])

    const [_, setModalIntention] = useItemPageModalIntentionManager()
    const [__, setOrder] = useItemPageOrderManager()

    const isOwner = nft.owner.toLowerCase() == account?.toLocaleLowerCase()

    //Get buy offers for this NFT, sort by price.
    useEffect(() => {
        if (!orbitdb?.db) return
        const buyOrders = orbitdb.queryRecord((order: OrderWrapperInterface) => (order.collection.toLowerCase() == address.toLowerCase() && order.target == idString && order.order.expirationTime > Date.now() && (order.type == OrderType.ERC20_FOR_ERC721 || order.type == OrderType.ERC20_FOR_ERC1155)))
        buyOrders.sort((a: OrderWrapperInterface, b: OrderWrapperInterface) => (BigNumber.from(a.price).lt(BigNumber.from(b.price))) ? 1 : -1)
        setBuyOrders(buyOrders)
    }, [orbitdb])

    //Get sell offers for this NFT, sort by price.
    useEffect(() => {
        if (!orbitdb?.db) return
        const sellOrders = orbitdb.queryRecord((order: OrderWrapperInterface) => true)
        console.log(sellOrders)
    }, [orbitdb])

    //Get sell offers for this NFT, sort by price.
    useEffect(() => {
        if (!orbitdb?.db) return
        const sellOrders = orbitdb.queryRecord((order: OrderWrapperInterface) => (order.collection == address && order.target == idString && order.order.expirationTime > Date.now() && (order.type == OrderType.ERC721_FOR_ETH_OR_WETH || order.type == OrderType.ERC1155_FOR_ETH_OR_WETH)))
        sellOrders.sort((a: OrderWrapperInterface, b: OrderWrapperInterface) => (BigNumber.from(a.price).lt(BigNumber.from(b.price))) ? -1 : 1)
        setSellOrders(sellOrders)
    }, [orbitdb])

    useEffect(() => {
        if (is1155) {
            setnftType(SupportedNFTInterfaces.ERC1155)
        } else if (is721) {
            setnftType(SupportedNFTInterfaces.ERC721)
        }
        return () => {
            setnftType(SupportedNFTInterfaces.ERC721)
        }
    }, [is721, is1155])

    const itemPageModalToggle = useItemPageModalToggle()

    const { ENSName } = useENSName(nft.owner)



    useEffect(() => {
        setattributesElements(nft.attributesList?.map((attribute: { trait_type: string, value: string, }, index: number) => <Attribute key={index} trait_type={attribute.trait_type} value={attribute.value} />))
        return function () {
            setattributesElements([])
        }
    }, [nft.attributesList])

    if (!chainId) return null

    return (
        <AppBody>
            <>
                <div className="flex flex-col p-5 overflow-y-scroll">
                    <div className="flex w-full justify-between ">
                        <div className="flex flex-col">
                            <div className="flex text-white rounded-full bg-gradient-to-r from-TDBlue via-TDGreen to-TDRed text-base p-1 self-start mb-2">
                                {nft.loading ? <h2 className="bg-gray-400 animate-pulse h-5 w-20 px-1 my-1"></h2> :
                                    <Link to={'/collection/' + address} className="text-white font-normal mb-0 text-ellipsis px-1 ">{nft.collectionName}</Link>}
                                <div className="rounded-full bg-white/25  font-extralight px-2 truncate max-w-xss">
                                    {nft.loading ? <h2 className="bg-gray-400  rounded-full animate-pulse my-1 h-5 w-10 truncate"></h2> :
                                        idString}
                                </div>
                            </div>
                            {nft.loading ? <h2 className="bg-gray-600 animate-pulse h-7 w-4/12 mb-2 mx-1 self-start"></h2> :
                                <p className="text-3xl font-semibold text-black mb-0 text-ellipsis pb-2 self-start">{nft.name}</p>}

                            <div className="flex w-full items-center self-start">
                                {nft.loading ? <h2 className="bg-gray-400 animate-pulse h-6 w-20 mr-1"></h2> //Show a placeholder while the subgraph loads
                                    : (is721 ? //If it's a 721, show the owner
                                        <> <div className="mr-1">Owner:</div>
                                            <AvatarWrapper>
                                                {fetching ? <h2 className="bg-gray-400 animate-pulse h-6 w-6 rounded-full"></h2> : <Identicon externalAddress={nft.owner} jazzIconDiameter={24} />}
                                            </AvatarWrapper>
                                            {fetching ? <h2 className="bg-gray-400 animate-pulse h-6 w-20 mr-1"></h2> : <Link to={'/profile/' + nft.owner} className='ml-1 font-semibold'> {(ENSName || shortenAddress(nft.owner))} </Link>}
                                        </> : // If its a 1155, show the total supply
                                        <>
                                            <div className="mr-1">Supply:</div>
                                            {fetching ? <h2 className="bg-gray-400 animate-pulse h-6 w-10 mr-1"></h2> : <p className='ml-1 font-semibold'> {totalSupply} </p>}
                                        </>
                                    )}
                            </div>
                        </div>
                        <div className="flex flex-col h-full justify-self-end justify-end w-5/12">
                            <div className="flex w-full justify-between pr-5 -ml-10">
                                <div className='flex items-center'>
                                    <Favorite className='mx-4 hover:scale-95 cursor-pointer' />
                                    <Share className='mx-4 hover:scale-95 cursor-pointer' />
                                    {isOwner && <Send className='mx-4 hover:scale-95 cursor-pointer' onClick={() => {
                                        itemPageModalToggle()
                                        if (isOwner) {
                                            setModalIntention(ModalIntention.TRANSFER)
                                        }
                                    }} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row pt-4">
                        <div className="flex flex-col justify-start items-center overflow-x-hidden w-7/12 pr-20">

                            <div className="flex justify-center overflow-x-hidden  max-w-xl max-h-min rounded-3xl shadow-2xl bg-slate-200 mb-4 items-center">
                                {nft.loading ?
                                    <h2 className="bg-gray-400 animate-pulse aspect-square h-96"></h2> :
                                    nft.animationURL != '' ?
                                        <video className="bg-black w-full aspect-video object-contain" src={nft.animationURL} autoPlay={true} controls={true} loop={true} />
                                        : <img className="h-full object-contain" src={nft.imageURL} />}
                            </div>

                            {nft.loading ? <h2 className="bg-gray-300 animate-pulse h-36 w-full mt-3"></h2> :
                                <p className="text-sm text-justify font-normal text-gray-700 mb-0 text-ellipsis pb-5 mt-3"> <Linkify componentDecorator={(decoratedHref: string, decoratedText: string, key: number): React.ReactNode => {
                                    return (
                                        <a href={decoratedHref} target="_blank" rel="noreferrer" key={key}>
                                            {decoratedText}
                                        </a>
                                    );
                                }}>{nft.description}</Linkify></p>}
                            <p className="font-semibold text-lg py-2 self-start">PROPERTIES</p>
                            <div className="grid grid-cols-3 gap-3 w-full px-2">
                                {attributesElements}
                            </div>
                            <p className="font-semibold text-lg py-2 self-start  mt-3">BLOCKCHAIN</p>
                            <div className="grid grid-cols-6 gap-3 w-full mb-5">

                                <p className=' text-gray-500'> NETWORK</p>
                                <p>{CHAIN_INFO[chainId].label}</p>

                                <div></div>
                                <p className=' text-gray-500'> STANDARD</p>
                                <div>{fetching ? <p className="bg-gray-400 animate-pulse h-6 w-10 "></p> : is721 ? 'ERC-721' : is1155 ? 'ERC-1155' : 'UNKNOWN'}</div>
                                <div></div>

                                <p className=' text-gray-500'> CONTRACT</p>
                                <a href={getExplorerLink(chainId, address, ExplorerDataType.ADDRESS)} target="_blank" rel="noreferrer" className='col-span-2 w-min'><div className="flex overflow-visible items-center">{shortenAddress(address)}<ExternalLink className='h-4 ' /></div> </a>


                                <p className=' text-gray-500'> TOKEN ID</p>
                                <p className='truncate'>{idString}</p>
                                <div></div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start w-5/12 -ml-10">

                            <ItemStatus loading={nft.loading} itemPageModalToggle={itemPageModalToggle} owner={nft.owner} address={address} identifier={idString} buyOrders={buyOrders} sellOrders={sellOrders} />
                            <NFTDetailTabs transfers={transfers} orders={buyOrders} listings={sellOrders} owner={nft.owner} />


                        </div>
                    </div>
                </div>
            </>
            {(contextNetwork.active || active) && (
                <ItemPageModal nft={nft} reloadNFTData={executeQuery} />
            )}
        </AppBody>
    )

    return (
        <></>
    )
}

export default ItemsPage
