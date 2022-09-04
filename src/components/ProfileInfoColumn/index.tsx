import React from 'react'
import { ReactComponent as Twitter } from 'assets/svg/twitter.svg'
import { ReactComponent as Discord } from 'assets/svg/discord.svg'
import { ReactComponent as Linkedin } from 'assets/svg/linkedin.svg'
import { ReactComponent as Telegram } from 'assets/svg/telegram.svg'
import { ReactComponent as Github } from 'assets/svg/github.svg'
import { ReactComponent as Reddit } from 'assets/svg/reddit.svg'
import { ReactComponent as Globe } from 'assets/svg/globe.svg'
import { ReactComponent as Mail } from 'assets/svg/mail.svg'
import styled from 'styled-components/macro'
import { useWeb3React } from '@web3-react/core'
import Identicon from 'components/Identicon'
import useENSName from 'hooks/useENSName'
import useENSText from 'hooks/useENSText'
import { shortenAddress } from '../../utils'

const AvatarWrapper = styled.div`
border-radius: 9999px;
height: 10rem/* 160px */;
width: 10rem/* 160px */;
object-fit: cover;
--tw-translate-y: -5rem/* -80px */;
transform: var(--tw-translate-y);
border-width: 4px;
--tw-border-opacity: 1;
border-color: rgb(255 255 255 / var(--tw-border-opacity));
overflow: clip;


`

const ProfileInfoColumn = ({ userAddress }: { userAddress?: string }) => {
    const { ENSName } = useENSName(userAddress ?? undefined)

    //TODO: Integrate all this functions into a single call
    //using the multicall contract.

    const twitter = useENSText(userAddress, 'com.twitter')
    const name = useENSText(userAddress ?? undefined, 'name')
    const location = useENSText(userAddress ?? undefined, 'location')
    const url = useENSText(userAddress ?? undefined, 'url')
    const email = useENSText(userAddress ?? undefined, 'email')
    const description = useENSText(userAddress ?? undefined, 'description')

    const loading = twitter.loading || name.loading || location.loading || url.loading || email.loading || description.loading
    const hasEnsText = twitter.text || name.text || location.text || url.text || email.text || description.text

    //TODO: Logic and placeholders, cases where user has (or doesn't) active ENS profile. 
    //TODO: Otomee profile integration.
    return (
        <div className="relative w-full h-min md:w-3/12 rounded-b-lg shadow-lg bg-white ml-50 md:ml-5">
            <div className="absolute w-full">
                <div className="flex justify-center">
                    <a
                        className="rounded-full h-40 w-40 object-cover transform -translate-y-20 bg-white  scale-100">
                    </a>
                </div>
            </div>
            <div className="absolute w-full">
                <div className="flex justify-center -translate-y-20">
                    <AvatarWrapper>
                        <Identicon externalAddress={userAddress} jazzIconDiameter={160} />
                    </AvatarWrapper>

                </div>
            </div>


            <div className="mt-20 z-50">
                <div className="max-w-full rounded overflow-hidden">
                    <div className="text-center">
                        <p className="pt-2 text-lg font-semibold">
                            {userAddress && (ENSName || shortenAddress(userAddress))}
                        </p>
                    </div>
                    {loading ? 'Loading...' : !hasEnsText ? 'User doesnt have an ENS account' : <><div className="text-center">
                        <p className="text-xs text-gray-400">
                            {name.text}
                        </p>
                        <div className="flex justify-center text-gray-600 pt-2">
                            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-3.148 0-6 2.553-6 5.702 0 3.148 2.602 6.907 6 12.298 3.398-5.391 6-9.15 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm4 14.5c0 .828-1.79 1.5-4 1.5s-4-.672-4-1.5 1.79-1.5 4-1.5 4 .672 4 1.5z" />
                            </svg>
                            <p className="text-sm text-gray-600">
                                {location.text}
                            </p>
                        </div>
                    </div>
                        <div className="flex flex-col lg:flex-row  w-full items-start px-5 lg:px-0 lg:items-center justify-evenly">
                            <div className="py-0 lg:py-3 flex items-center">
                                <div className='fill-gray-400 p-2 h-8 w-8'>
                                    <Globe className='h-4 w-4' />
                                </div>
                                <p className="text-xs text-justify text-gray-600">
                                    {url.text}
                                </p>
                            </div>
                            <div className=" flex items-center">
                                <div className='fill-gray-400 p-2 h-8 w-8'>
                                    <Mail className='h-4 w-4' />
                                </div>
                                <p className="text-xs text-justify text-gray-600">
                                    {email.text}
                                </p>
                            </div>
                        </div>
                        {/*About*/}
                        <div className="px-6 pb-3">

                            <p className="text-sm font-semibold">
                                About
                            </p>
                            <p className="text-xs text-justify text-gray-600">
                                {description.text}
                            </p>

                        </div>


                        <div className="grid gap-y-2 grid-cols-3 lg:flex w-full p-3  items-center justify-evenly justify-items-center">
                            <a className='relative fill-white bg-gradient-to-r from-TDBlue via-TDGreen to-TDRed rounded-full h-8 w-8' href={'http://twitter.com/' + (twitter.text ? twitter.text : '')} target="_blank" rel="noopener noreferrer">
                                <div className="absolute left-0 top-0 w-full h-full backdrop-blur-sm rounded-full p-2">
                                    <Twitter />
                                </div>

                            </a>
                            <a className='relative fill-white bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen rounded-full h-8 w-8' href='/'>
                                <div className="absolute left-0 top-0 w-full h-full backdrop-blur-sm rounded-full p-2">
                                    <Discord />
                                </div>
                            </a>
                            <a className='relative fill-white bg-gradient-to-r from-TDGreen via-TDRed to-TDBlue rounded-full h-8 w-8' href='/'>
                                <div className="absolute left-0 top-0 w-full h-full backdrop-blur-sm rounded-full p-2">
                                    <Linkedin />
                                </div>
                            </a>
                            <a className='relative fill-white bg-gradient-to-r from-TDBlue via-TDGreen to-TDRed rounded-full h-8 w-8' href='/'>
                                <div className="absolute left-0 top-0 w-full h-full backdrop-blur-sm rounded-full p-2">
                                    <Telegram />
                                </div>
                            </a>
                            <a className='relative fill-white bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen rounded-full h-8 w-8' href='/'>
                                <div className="absolute left-0 top-0 w-full h-full backdrop-blur-sm rounded-full p-2">
                                    <Reddit />
                                </div>
                            </a>
                            <a className='relative fill-white bg-gradient-to-r from-TDGreen via-TDRed to-TDBlue rounded-full h-8 w-8' href='/'>
                                <div className="absolute left-0 top-0 w-full h-full backdrop-blur-sm rounded-full p-2">
                                    <Github />
                                </div>
                            </a>
                        </div>


                        <div className="px-6 py-4 text-center">
                            <span
                                className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-gray-600 mr-2">Joined in
                                24/12/2021</span>

                        </div></>}

                </div>
            </div>


        </div >
    )
}

export default ProfileInfoColumn
