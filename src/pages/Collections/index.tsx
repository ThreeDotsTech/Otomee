import Collection from 'components/Collection'
import CollectionBanner from 'components/CollectionBanner'
import ItemCard1 from 'components/ItemCard/model1'
import { BigNumber, utils } from 'ethers'
import { useGetNFTsFromContract } from 'hooks/useSubgraph'
import AppBody from 'pages/AppBody'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import OrbitContext from 'state/orbitdb/orbitContext'
import { OrderType, OrderWrapper } from 'types/orders'

const Collections = () => {
    const { address }: { address: string } = useParams()
    const [ercTokensList, setercTokensList] = useState<JSX.Element[]>([])
    const [TokensOnSaleList, setTokensOnSaleList] = useState<JSX.Element[]>([])
    const [needToFetch, setNeedToFetch] = useState(false)
    const [Steps, setSteps] = useState(0)
    const { NFTs, fetching, erc721Error, erc1155Error, executeQuery } = useGetNFTsFromContract(address, 30, Steps * 30)
    const { orbitdb } = useContext(OrbitContext)
    const [orders, setOrders] = useState<OrderWrapper[]>([])

    //Get orders for this collection and set floor price.
    useEffect(() => {
        if (!orbitdb?.db) return
        const orders = orbitdb.queryRecord((order: OrderWrapper) => (order.collection == address) && (order.type == OrderType.ERC721_FOR_ETH_OR_WETH))
        orders.sort((a: OrderWrapper, b: OrderWrapper) => (BigNumber.from(a.price) > BigNumber.from(b.price)) ? 1 : -1)
        setOrders(orders)

    }, [orbitdb])


    //Get orders for this collection and set floor price.
    useEffect(() => {
        setTokensOnSaleList(orders.map((order, index: number) => <ItemCard1 key={order.target} address={address} identifier={order.target} index={index} order={order} />))
        return (() => {
            setTokensOnSaleList([])
        })
    }, [orders])

    useEffect(() => {
        return () => {
            setercTokensList([])
            setSteps(0)
        }
    }, [address])


    function handleScroll(e: any) {
        if (fetching) return
        const bottom = e.target.scrollHeight - e.target.scrollTop < Math.floor(e.target.clientHeight * 1.6);
        if (bottom) {
            if (needToFetch) return
            console.log("Setting Need to fech to true...")
            setNeedToFetch(true)
        }
    }

    //Turn off the need to fetch after fetching goes to false
    useEffect(() => {
        if (fetching) return
        if (needToFetch) setNeedToFetch(false)
        console.log("Setting Need to fech to false...")
    }, [fetching])

    function fetchMoreItems() {
        setSteps(Steps + 1)
        console.log("Increasing steps by one...")
    }

    useEffect(() => {
        if (!needToFetch) return
        console.log("Need to fetch is true...")
        fetchMoreItems()
    }, [needToFetch])

    useEffect(() => {
        if (fetching) return
        const NFTList = NFTs ? NFTs : []
        if (ercTokensList[ercTokensList.length - 1] == NFTList[NFTList.length - 1]) {
            console.log('Tried to append the same arrray, aborting...')
        }
        setercTokensList(prevState => {
            console.log(prevState.length, NFTList.length)
            if (Steps == 0 && prevState.length == 30) return prevState
            return ([...prevState, ...NFTList.map((token: { identifier: string, id: string, token?: any }, index: number) => <ItemCard1 key={token.identifier} address={address} identifier={token.identifier} index={index} />)])
        })
        return (() => {
            console.log(ercTokensList)
        })
    }, [NFTs, fetching, Steps])

    return (
        <>
            <AppBody>
                <div className="relative overflow-y-scroll" onScroll={handleScroll}>
                    <CollectionBanner address={address} floorPrice={orders[0] ? utils.formatEther(BigNumber.from(orders[0].price)) : '-'} />
                    <div className="flex flex-col w-full md:flex-row">
                        <Collection ercTokenList={[...TokensOnSaleList, ...ercTokensList]} fetching={(fetching && !needToFetch)} />
                    </div>

                </div>
            </AppBody>
        </>
    )
}

export default Collections
