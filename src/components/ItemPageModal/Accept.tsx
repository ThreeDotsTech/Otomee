import styled from 'styled-components/macro'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import Row from 'components/Row'
import { ThemedText } from '../../theme'
import { ReactComponent as Checkmark } from '../../assets/svg/checkmark.svg'
import { ContractTransaction, utils } from 'ethers'
import { AddressZero } from '@ethersproject/constants'
import OrbitContext from 'state/orbitdb/orbitContext'
import { ReactComponent as Spinner } from '../../assets/svg/spinner.svg'
import { createAny_AnyOrder } from 'hooks/useExchangeContract'
import { splitSignature } from 'ethers/lib/utils'
import { NULL_SIG, ZERO_BYTES32 } from 'constants/misc'
import { useERC20Contract, useERC721Contract, useStateswapExchangeContract, useStateswapRegistryContract } from 'hooks/useContract'
import { wrap } from 'utils/exchangeWrapper'
import { WETH_ADDRESSES } from 'constants/addresses'
import { Call } from 'stateswap/verifiers'
import { useItemPageNFT, useItemPageOrderManager } from 'state/itemPage/hooks'
import { useWeb3React } from '@web3-react/core'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useContext, useMemo, useState } from 'react'
import { useItemPageModalToggle } from 'state/application/hooks'
import useENSName from 'hooks/useENSName'
import { shortenAddress } from 'utils'
import { Link } from 'react-router-dom'
import Identicon from 'components/Identicon'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`
const AvatarWrapper = styled.div`
border-radius: 9999px;
height: 1.5rem/* 160px */;
width: 1.5rem/* 160px */;
object-fit: cover;
overflow: clip;
`

export function AccepptView({
    success,
    setSuccess
}:
    {
        success: boolean
        setSuccess: React.Dispatch<React.SetStateAction<boolean>>
    }) {
    const nft = useItemPageNFT()
    const { account, chainId } = useWeb3React()
    const { orbitdb } = useContext(OrbitContext)
    const [selectedOrder, setOrder] = useItemPageOrderManager()
    if (!selectedOrder || !nft || !account || !orbitdb || !orbitdb?.db) return (<></>)
    const ENSNameMaker = useENSName(selectedOrder.maker)
    const isOwner = nft.owner.toLowerCase() == account?.toLocaleLowerCase()

    const erc721c = useERC721Contract(nft.contractAddress)
    const erc20c = useERC20Contract(WETH_ADDRESSES[chainId ?? 0], true)
    const registryContract = useStateswapRegistryContract(true)
    const exchangec = useStateswapExchangeContract(true)
    const exchange = wrap(exchangec)

    const toggleWalletModal = useItemPageModalToggle()

    const accountArgument = useMemo(
        () => [account],
        [account])
    const proxyAddress = useSingleCallResult(registryContract, 'proxies', accountArgument)
    const isApprovedForAllArgument = useMemo(
        () => [account, proxyAddress.result && proxyAddress.result[0]],
        [account, chainId, proxyAddress?.result])
    const proxyAllowance = useSingleCallResult(erc721c, 'isApprovedForAll', isApprovedForAllArgument)

    const [waitingForTX, setwaitingForTX] = useState<boolean>(false)
    const [waitingForSignature, setWaitingForSignature] = useState<boolean>(false)

    return (
        <UpperSection>
            <CloseIcon onClick={toggleWalletModal}>
                <CloseColor />
            </CloseIcon>
            <HeaderRow>

                <Row justify="center">
                    <ThemedText.MediumHeader>
                        Accept Offer
                    </ThemedText.MediumHeader>
                </Row>
            </HeaderRow>
            <div className="flex flex-col divide-y px-4">
                <div className='flex justify-start w-full mb-4'>
                    <div className="flex">
                        <div className="flex w-5/12 justify-center overflow-x-hidden aspect-square rounded-lg relative bg-slate-200">
                            {(nft.imageURL == '' && nft.animationURL != '') ? <video className="bg-black h-full aspect-video object-contain" src={nft.animationURL} autoPlay muted loop /> : <img className="h-full object-contain" src={nft.imageURL} />}
                        </div>
                        <div className="flex flex-col items-start w-7/12 justify-center ml-2 px-2">
                            <p className="text-base font-semibold text-gray-600 mb-0 truncate grow-0 mt-1">{nft.collectionName}</p>
                            <p className="text-lg font-semibold text-gray-900 mb-2 text-clip ">{nft.name}</p>
                            <div className=" flex flex-col  items-start text-lg font-semibold text-gray-900 mb-0 text-clip grow border-t border-b w-full justify-center">
                                <div className="flex ">
                                    <p className='text-gray-600 mr-2'>Price: </p>
                                    {utils.formatEther(selectedOrder.price)}  WETH
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className='text-gray-600 text-base mr-2'>Offer from: </p>
                                <div className='w-max flex justify-center'>
                                    <AvatarWrapper>
                                        <Identicon externalAddress={selectedOrder.maker} jazzIconDiameter={24} />
                                    </AvatarWrapper>
                                    <Link to={'/profile/' + selectedOrder.maker} className='ml-1 font-normal truncate'> {(ENSNameMaker.ENSName || shortenAddress(selectedOrder.maker))} </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="max-w-xl mx-2 py-4 border-b-2 pb-4 ">
                    <>
                        <div className="flex pb-3">
                            <div className="flex-1">
                            </div>

                            <div className="flex-1 ">
                                {(proxyAddress?.result == undefined) ? 'Loading...' : ((proxyAddress?.result[0] != AddressZero) ?
                                    <div className="w-7 h-7  bg-TDRed  mx-auto rounded-full text-lg text-white flex items-center p-2">
                                        <span className="text-white text-center w-full"><Checkmark className=" w-full fill-current white" /></span>
                                    </div> :
                                    <div className="w-7 h-7 bg-white border-2 border-TDRed  mx-auto rounded-full text-lg text-white flex items-center">
                                        <span className="text-gray-900 text-xs text-center w-full">1</span>
                                    </div>)
                                }

                            </div>


                            <div className="w-1/4 align-center items-center align-middle content-center flex">
                                <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                                    <div className={"transition ease-in-out bg-TDRed      text-xs leading-none py-1 text-center text-gray-900 rounded " +
                                        ((proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] != AddressZero) ? 'w-full' : 'w-0')
                                    } ></div>
                                </div>
                            </div>

                            <div className="flex-1 ">
                                {(proxyAllowance?.result == undefined) ? 'Loading...' : (((isOwner ? proxyAllowance?.result[0] == true : true)) ?
                                    <div className="w-7 h-7  bg-TDBlue mx-auto rounded-full text-lg text-white flex items-center p-2">
                                        <span className="text-white text-center w-full"><Checkmark className=" w-full fill-current white" /></span>
                                    </div> :
                                    <div className={"transition ease-in-out delay-100 w-7 h-7 bg-white border-2  mx-auto rounded-full text-lg text-white flex items-center " +
                                        ((proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] != AddressZero) ? 'border-TDBlue' : 'border-gray-200')
                                    }>
                                        <span className="text-gray-900 text-xs text-center w-full">2</span>
                                    </div>)
                                }
                            </div>

                            <div className="w-1/4 align-center items-center align-middle content-center flex">
                                <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                                    <div className={"transition ease-in-out bg-TDBlue  text-xs leading-none py-1 text-center text-gray-900 rounded " +
                                        ((proxyAllowance?.result == undefined) ? 'Loading...' : ((isOwner ? proxyAllowance?.result[0] == true : true)) ? 'w-full' : 'w-0')
                                    } ></div>
                                </div>
                            </div>

                            <div className="flex-1 ">
                                {success ?
                                    <div className="w-7 h-7  bg-TDGreen mx-auto rounded-full text-lg text-white flex items-center p-2">
                                        <span className="text-white text-center w-full"><Checkmark className=" w-full fill-current white" /></span>
                                    </div> :
                                    <div className={"transition ease-in-out delay-100 w-7 h-7 bg-white border-2  mx-auto rounded-full text-lg text-white flex items-center " +
                                        ((proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] != AddressZero) ? 'border-TDGreen' : 'border-gray-200')
                                    }>
                                        <span className="text-gray-900 text-xs text-center w-full">3</span>
                                    </div>
                                }
                            </div>
                            <div className="flex-1">
                            </div>
                        </div>

                        <div className="flex text-xs content-center text-center">
                            <div className="w-1/3">
                                Register
                            </div>

                            <div className="w-1/3">
                                Approve
                            </div>

                            <div className="w-1/3">
                                Accept
                            </div>

                        </div>
                    </>
                </div>

                <div className="flex flex-col items-center py-4">
                    {success ?
                        <>
                            <h4 className='my-4'>Transaction confirmed!</h4>
                            <h4 className='mb-4'>🎉{' '} You have sold {nft.name}!{' '} 🎉</h4>
                        </> :
                        <>
                            <h4>{(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ? 'Register' : (proxyAllowance?.result == undefined) ? 'Loading...' : (((proxyAllowance?.result[0] == false))) ? 'Approve' : 'Accept Offer'}</h4>
                            <h5 className='px-2 pt-4'> {(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ?
                                'Register your account to start selling on Otomee, this requires a one-time gas fee.' : (proxyAllowance?.result == undefined) ? 'Loading...' : (((proxyAllowance?.result[0] == false))) ? 'To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.' : waitingForTX ? 'Waiting for blockchain confirmation.' : 'Accept the transaction in your wallet to process your purchase.'} </h5>
                            {
                                (!waitingForSignature) ?
                                    waitingForTX ?
                                        <Spinner /> :
                                        <button onClick={() => {
                                            if (proxyAddress?.result == undefined) return
                                            //If the user is not registered on StateSwap, register
                                            if (proxyAddress?.result[0] == AddressZero) {
                                                registryContract?.registerProxy().then((tx: ContractTransaction) => {
                                                    tx.wait(1).then(() => setwaitingForTX(false))
                                                }, (reason: any) => {
                                                    setwaitingForTX(false)
                                                })
                                                setwaitingForTX(true)
                                                return
                                            }
                                            if (proxyAllowance?.result == undefined) return
                                            // If the owner hasn't approved the proxy to spend
                                            // the ERC721, approve it for spending.
                                            if (((proxyAllowance?.result[0] == false))) {
                                                console.log(erc721c)
                                                erc721c?.setApprovalForAll(proxyAddress?.result[0], true)
                                                    .then((tx: ContractTransaction) => {
                                                        tx.wait(1).then(() => setwaitingForTX(false))
                                                    }, (reason: any) => {
                                                        setwaitingForTX(false)
                                                    })
                                                setwaitingForTX(true)
                                                return
                                            } else {
                                                //Ready to accept the order
                                                if (!chainId || !account || !selectedOrder.signature || !erc721c || !erc20c) return
                                                const OrderAcceptAny = createAny_AnyOrder(account, chainId)
                                                const erc20TransferCall = Call.erc20.transferFrom(selectedOrder.maker, account, selectedOrder.price, erc20c, WETH_ADDRESSES[chainId])
                                                const erc721TransferCall = Call.erc721.transferFrom(account, selectedOrder.maker, selectedOrder.target, erc721c, selectedOrder.collection)
                                                exchange?.stateswap(OrderAcceptAny, splitSignature(NULL_SIG), erc721TransferCall, selectedOrder.order, selectedOrder.signature, erc20TransferCall, ZERO_BYTES32)
                                                    .then(
                                                        (tx: ContractTransaction) => {
                                                            setWaitingForSignature(false)
                                                            setwaitingForTX(true)
                                                            tx.wait(1).then(() => {
                                                                if (!orbitdb || !orbitdb?.db) return
                                                                //delete order from orbitdb
                                                                orbitdb.db.del(selectedOrder.hash);
                                                                setSuccess(true);
                                                                setwaitingForTX(false);
                                                            })
                                                        }, (reason: any) => {
                                                            setwaitingForTX(false)
                                                        }
                                                    );
                                                setWaitingForSignature(true)

                                            }
                                        }} className='bg-gray-400 disabled:bg-none disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen  rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 my-4'>
                                            <div className="flex flex-row justify-center  items-center w-full h-full px-2 py-3 backdrop-saturate-150 backdrop-blur-md rounded-full ">
                                                <p className=" text-white font-semibold text-base">{(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ? 'Register' : (proxyAllowance?.result == undefined) ? 'Loading...' : proxyAllowance?.result[0] == false ? 'Approve' : 'Accept Offer'}</p>
                                            </div>
                                        </button>
                                    :
                                    <p className='text-sm text-gray-600 my-4'>
                                        Waiting for confirmation...
                                    </p>
                            }
                        </>}
                </div>
            </div>
        </UpperSection >
    )

}