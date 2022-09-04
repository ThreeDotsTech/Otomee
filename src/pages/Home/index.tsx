import AppBody from '../AppBody'
import { useGetNFTsFromContract, useMostPopularCollections } from 'hooks/useSubgraph'
import { stringify } from 'querystring'
import { InfoCard } from 'components/InfoCards'
import { MostPopularList } from 'components/MostPopularList'
import { Timeline } from 'components/Timeline'
import { Circle } from 'react-feather'
import { Circles } from 'components/CirclesFloating'
import { Footer } from 'components/Footer'

export default function Home() {
    const { mostPopular, fetching } = useMostPopularCollections()
    // const { NFTs, erc1155Error, erc721Error } = useGetNFTsFromContract(mostPopular[0][0].toString(), 2)
    console.log(mostPopular)
    // console.log(NFTs)
    return (
        <><AppBody >
            <div className='bg-TDLightBlue '>
                <div className="flex justify-center px-16 py-4 mx-auto bg-TDLightBlue">
                    <h1 className="text-6xl font-normal leading-normal content-center">Welcome to Otomee!</h1>
                </div>
                <div className='font-bold text-center pt-5 pb-0 text-xl'>Hot collections.</div>
                <div className='flex justify-center'>
                    <MostPopularList />
                </div>
                <div className='font-bold text-center pt-5 pb-0 text-xl'>Benefits.</div>
                <div className='flex space-x-4 bg-TDLightBlue p-14 items-center justify-center pt-4 pb-0'>
                    <InfoCard title={"Censorship-resistance."} description={"No one will be able to stop any collection from being traded or listed at Otomee."} icon={<svg className="w-12 h-12 justify-center " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>} />
                    <InfoCard title={'0 Downtime.'} description={'Without a central server to take down, or a company with a bad administration, once deployed no one will be able to stop the Marketplace.'} icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>} />
                    <InfoCard title={"Low costs."} description={"Our serverless architecture makes operational costs dramatically lower than any centralized alternative, which will allow us to offer lower protocol fees and some other benefits for the users while still maintaining a sustainable economic model."} icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    <InfoCard title={"User Governance."} description={"Otomee will be governed by its users, through a DAO which will be the beneficiary of the  protocol fees."} icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                </div>
                <div className='font-bold text-center pt-5 pb-2 text-xl'>Roadmap.</div>
                <div className='flex justify-center pt-4'>
                    <Timeline />
                </div>
                <Footer />
            </div>




        </AppBody></>)
}