import AppBody from '../AppBody'
import ProfileBanner from 'components/ProfileBanner'
import ProfileInfoColumn from 'components/ProfileInfoColumn'
import Collection from 'components/Collection'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ItemCard1 from 'components/ItemCard/model1'
import { useGetNFTsFromAccount } from 'hooks/useSubgraph'

export default function UserProfile() {

    const { address }: { address: string } = useParams()
    const { NFTs, fetching } = useGetNFTsFromAccount(address, 30)
    const [ercTokensList, setercTokensList] = useState<JSX.Element[]>([])
    useEffect(() => {
        setercTokensList(NFTs?.map((token: { identifier: string, id: string, token: any }, index: number) => <ItemCard1 key={index} address={token.id.split('/')[0]} identifier={token.token ? token.token.identifier : token.identifier} index={index} />))
    }, [NFTs])

    return (
        <>
            <AppBody>
                <div className="relative">
                    <ProfileBanner />
                    <div className="flex flex-col w-full md:flex-row">
                        <ProfileInfoColumn userAddress={address.toLocaleLowerCase()} />
                        <Collection fetching={fetching} ercTokenList={ercTokensList} />
                    </div>
                </div>
            </AppBody>
        </>
    )
}