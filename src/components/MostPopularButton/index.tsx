import React from 'react'
import { useGetNFTsFromAccount, useGetNFTsFromContract, useMostPopularCollections } from 'hooks/useSubgraph'
import { useERC721Data } from 'hooks/useNFTName'
import { useHistory } from 'react-router-dom';



export const MostPopularButton = ({ i }: { i: number }) => {
    const { mostPopular, fetching } = useMostPopularCollections();
    const { name, supply, loading } = useERC721Data(mostPopular[i] ? mostPopular[i][0] : '')
    const history = useHistory()
    function gotoCollectionPage() {
        history.push('/collection/' + (mostPopular[i] ? mostPopular[i][0] : ''))
    }
    const name_contract: string = mostPopular[i] ? mostPopular[i][0] : ''

    return (

        <div>
            {mostPopular[0] ? <>
                <div className='relative group '>
                    <div className='absolute animate-tilt -inset-0.5 bg-gradient-to-r from-TDRed via-TDGreen to-TDBlue rounded-lg blur-lg   opacity-100 group-hover:opacity-0 transition duration-700'></div>
                    <button className="relative p-5 bg-white rounded-lg flex items-center justify-between space-x-8 w-96 cursor-pointer h-16   group-hover:scale-110 content-align-end transition duration-700" onClick={gotoCollectionPage}>
                        <table className='table-auto'>
                            <tbody>
                                <tr>
                                    <td className='w-5 items-left '>
                                        <div className='font-bold text-xl'>{i + 1}</div>
                                    </td>
                                    <td>
                                        {name?.length === undefined ?
                                            <p className='text-sm font-medium text-slate-900 pl-2 group-hover:underline transition duration-700'>{name_contract}</p>
                                            :
                                            <p className='text-sm font-medium text-slate-900 pl-2 group-hover:underline transition duration-700'>{name}</p>
                                        }
                                    </td>
                                    {/* <td className='w-50'>
                                    <p>{supply}</p>
                                </td> */}
                                </tr>
                            </tbody>
                        </table>
                    </button>
                </div>
            </> :
                <button className='invisible'></button>}
        </div>
    )
}