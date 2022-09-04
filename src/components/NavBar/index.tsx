import React from 'react'
import { ReactComponent as Logo } from 'assets/svg/logo.svg'
import Punk from 'assets/example/punk.png'
import Web3Status from 'components/Web3Status'
import styled from 'styled-components/macro'
import SearchBar from 'components/SearchBar'
import { withRouter } from 'react-router-dom'

const Web3Wrapper = styled.div`
  display:none;
  flex-grow: 1;
  justify-content: flex-end;
  padding-right: 1.25rem/* 20px */;
  @media (min-width: 768px) {
    display: flex;
}
`

const Wrapper2 = styled.div`
  width: fit-content;
`

const NavBar = withRouter(({ history }) => {

    function gotoHome() {
        history.push('/')
    }

    return (
        <header className="top-0 lef-0 w-full z-40 fixed">
            <div className=" relative flex flex-row w-full h-16 bg-TDLightBlue overflow-clip items-center">
                <div className='absolute w-full aspect-square  bg-TDGreen rounded-full -translate-y-1/3'></div>
                <div className='absolute w-1/4 aspect-square bg-TDRed rounded-full -translate-x-1/4 translate-y-1/3'></div>
                <div className='absolute w-80 aspect-square bg-TDBlue rounded-full right-0 translate-x-1/4 pt-5 -translate-y-1/3'></div>
                <div className='absolute w-full h-16 backdrop-blur-2xl backdrop-saturate-150'></div>
            </div>


            <div className="flex fixed top-0 inset-x-0 z-100 h-16 items-center">
                <div className="w-full relative mx-auto px-10">
                    <div className="flex items-center -mx-6 ">
                        <div className="lg:w-1/4 xl:w-1/5 pl-6 pr-6 lg:pr-8 cursor-pointer" onClick={gotoHome}>
                            <div className="flex justify-center items-center">
                                <a href="/" className="block lg:mr-1">
                                    <Logo className='h-10 w-auto' />
                                </a>
                                <span className='text-xl font-semibold text-zinc-50 pl-1'>
                                    Otomee
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-grow lg:w-3/4 xl:w-4/5">
                            <SearchBar />


                            <button type="button" id="sidebar-open"
                                className="flex px-6 items-center md:hidden text-white focus:outline-none focus:text-green-400">
                                <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                                </svg>
                            </button>


                            <button type="button" id="sidebar-close"
                                className="hidden px-6 items-center lg:hidden text-white bg-zinc-50 focus:outline-none focus:text-green-400 ">
                                <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path
                                        d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z">
                                    </path>
                                </svg>
                            </button>
                            <Web3Wrapper>
                                <Wrapper2>
                                    <Web3Status />
                                </Wrapper2>
                            </Web3Wrapper>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    )
})

export default NavBar
