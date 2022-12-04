import { OrderType, OrderWrapperInterface } from 'stateswap/orders/types'
import styled from 'styled-components/macro'
import { MAKE_OFFER_VIEWS } from '.'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { ArrowLeft } from 'react-feather'
import Row from 'components/Row'
import { ThemedText } from '../../theme'
import { ReactComponent as Checkmark } from '../../assets/svg/checkmark.svg'
import { ContractTransaction, utils } from 'ethers'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { CallState } from '@uniswap/redux-multicall/dist/types'
import { StateswapRegistry } from 'abis/types/StateswapRegistry'
import { ReactComponent as Spinner } from '../../assets/svg/spinner.svg'
import { createOrderAcceptAny } from 'hooks/useExchangeContract'
import { splitSignature } from 'ethers/lib/utils'
import { NULL_SIG, ZERO_BYTES32 } from 'constants/misc'
import { useERC20Contract, useERC721Contract, useStateswapExchangeContract } from 'hooks/useContract'
import { wrap } from 'utils/exchangeWrapper'
import { WETH_ADDRESSES } from 'constants/addresses'
import { Call } from 'stateswap/verifiers'
import DocumentStore from 'orbit-db-docstore'
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

const HoverText = styled.div`
  text-decoration: none;
  color: ${({ theme }) => theme.text1};
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`


export function MatchView(
    {
        name,
        registryContract,
        waitingForTX,
        success,
        proxyAddress,
        ethWETH,
        isOwner,
        selectedOrder,
        collectionName,
        imageURL,
        animationURL,
        proxyAllowance,
        chainId,
        account,
        contractAddress,
        db,
        setSuccess,
        setwaitingForTX,
        setethWETH,
        setWalletView,
        toggleWalletModal,
        setWrappedOrder
    }: {
        name: string,
        contractAddress: string,
        account: string | null | undefined,
        chainId: number,
        setwaitingForTX: React.Dispatch<React.SetStateAction<boolean>>,
        registryContract: StateswapRegistry | null,
        waitingForTX: boolean,
        success: boolean,
        proxyAllowance: CallState,
        proxyAddress: CallState,
        ethWETH: boolean,
        isOwner: boolean,
        selectedOrder: OrderWrapperInterface,
        collectionName: string,
        imageURL: string,
        animationURL: string,
        setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
        setethWETH: React.Dispatch<React.SetStateAction<boolean>>
        toggleWalletModal: () => void,
        setWalletView: React.Dispatch<React.SetStateAction<string>>,
        setWrappedOrder: React.Dispatch<React.SetStateAction<OrderWrapperInterface | undefined>>,
        db: DocumentStore<OrderWrapperInterface>
    }
) {
    const erc721c = useERC721Contract(contractAddress)
    const erc20c = useERC20Contract(WETH_ADDRESSES[chainId ?? 0], true)
    const exchangec = useStateswapExchangeContract(true)
    const exchange = wrap(exchangec)
    return (
        <UpperSection>
            <CloseIcon onClick={toggleWalletModal}>
                <CloseColor />
            </CloseIcon>
            <HeaderRow>

                <Row justify="center">
                    <ThemedText.MediumHeader>
                        Confirm your purchase
                    </ThemedText.MediumHeader>
                </Row>
            </HeaderRow>
            <div className="flex flex-col divide-y px-4">
                <div className='flex justify-start w-full mb-4'>
                    <div className="flex">
                        <div className="flex w-5/12 justify-center overflow-x-hidden aspect-square rounded-lg relative bg-slate-200">
                            {(imageURL == '' && animationURL != '') ? <video className="bg-black h-full aspect-video object-contain" src={animationURL} autoPlay muted loop /> : <img className="h-full object-contain" src={imageURL} />}
                        </div>
                        <div className="flex flex-col items-start w-7/12 justify-center ml-2 px-2">
                            <p className="text-base font-semibold text-gray-600 mb-0 truncate grow-0 mt-1">{collectionName}</p>
                            <p className="text-lg font-semibold text-gray-900 mb-2 text-clip ">{name}</p>
                            <div className=" flex flex-col  items-start text-lg font-semibold text-gray-900 mb-0 text-clip grow border-t w-full justify-start">
                                <div className="flex ">
                                    <p className='text-gray-600 mr-2'>Price: </p>
                                    {utils.formatEther(selectedOrder.price)} {selectedOrder?.type == OrderType.ERC721_FOR_ETH_OR_WETH ? 'ETH' : 'WETH'}
                                </div>

                                <div className="flex flex-col">
                                    <p className='text-gray-600 text-base mr-2'>Pay with: </p>
                                    <div className="flex">
                                        <a className={' px-2 mr-2 cursor-pointer text-black  rounded-xl ' + (ethWETH ? '' : 'bg-slate-500 text-white')} onClick={() => { setethWETH(false) }}>ETH </a>
                                        <a className={' px-2 mr-2 cursor-pointer  text-black rounded-xl ' + (ethWETH ? 'bg-slate-500 text-white' : '')} onClick={() => { setethWETH(true) }}>WETH </a>
                                    </div>
                                </div>



                            </div>
                        </div>

                    </div>


                </div>


                <div className="max-w-xl mx-2 py-4 border-b-2 pb-4 ">
                    {!ethWETH ? <>
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

                            {(selectedOrder.type == OrderType.ERC721_FOR_ETH_OR_WETH) ? <></> :
                                <>
                                    <div className="flex-1 ">
                                        {(proxyAllowance?.result == undefined) ? 'Loading...' : (((isOwner ? proxyAllowance?.result[0] == true : (proxyAllowance?.result[0]._hex == MaxUint256._hex))) ?
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
                                                ((proxyAllowance?.result == undefined) ? 'Loading...' : ((isOwner ? proxyAllowance?.result[0] == true : (proxyAllowance?.result[0]._hex == MaxUint256._hex))) ? 'w-full' : 'w-0')
                                            } ></div>
                                        </div>
                                    </div>
                                </>
                            }


                            <div className="flex-1">
                                <div className={"transition ease-in-out delay-100 w-7 h-7 bg-white border-2  mx-auto rounded-full text-lg text-white flex items-center " +
                                    ((proxyAllowance?.result == undefined) ? 'Loading...' : (((isOwner ? proxyAllowance?.result[0] == true : (proxyAllowance?.result[0]._hex == MaxUint256._hex))) || (selectedOrder.type == OrderType.ERC721_FOR_ETH_OR_WETH)) ? 'border-TDGreen' : 'border-gray-200')
                                }>
                                    {success ?
                                        <div className="w-7 h-7  bg-TDGreen mx-auto rounded-full text-lg text-white flex items-center p-2">
                                            <span className="text-white text-center w-full"><Checkmark className=" w-full fill-current white" /></span>
                                        </div> :
                                        <span className="text-gray-900 text-xs text-center w-full">{(selectedOrder.type == OrderType.ERC721_FOR_ETH_OR_WETH) ? 2 : 3}</span>}
                                </div>
                            </div>




                            <div className="flex-1">
                            </div>
                        </div>

                        <div className="flex text-xs content-center items-center justify-center text-center">
                            {(selectedOrder.type != OrderType.ERC721_FOR_ETH_OR_WETH) ? <></> :
                                <div className="flex-1">
                                </div>}
                            <div className="w-1/3">
                                Register
                            </div>
                            {(selectedOrder.type != OrderType.ERC721_FOR_ETH_OR_WETH) ? <></> :
                                <div className="flex-1">
                                </div>}
                            {(selectedOrder.type == OrderType.ERC721_FOR_ETH_OR_WETH) ? <></> :
                                <div className="w-1/3">
                                    Buy
                                </div>}

                            <div className="w-1/3">
                                {(selectedOrder.type == OrderType.ERC721_FOR_ETH_OR_WETH) ? 'Buy' :
                                    'Sign'}
                            </div>
                            {(selectedOrder.type != OrderType.ERC721_FOR_ETH_OR_WETH) ? <></> :
                                <div className="flex-1">
                                </div>}
                        </div>
                    </> :
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
                                    {(proxyAllowance?.result == undefined) ? 'Loading...' : (((isOwner ? proxyAllowance?.result[0] == true : (proxyAllowance?.result[0]._hex == MaxUint256._hex))) ?
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
                                            ((proxyAllowance?.result == undefined) ? 'Loading...' : ((isOwner ? proxyAllowance?.result[0] == true : (proxyAllowance?.result[0]._hex == MaxUint256._hex))) ? 'w-full' : 'w-0')
                                        } ></div>
                                    </div>
                                </div>


                                <div className="flex-1">
                                    <div className={"transition ease-in-out delay-100 w-7 h-7 bg-white border-2  mx-auto rounded-full text-lg text-white flex items-center " +
                                        ((proxyAllowance?.result == undefined) ? 'Loading...' : ((isOwner ? proxyAllowance?.result[0] == true : (proxyAllowance?.result[0]._hex == MaxUint256._hex))) ? 'border-TDGreen' : 'border-gray-200')
                                    }>
                                        {success ?
                                            <div className="w-7 h-7  bg-TDGreen mx-auto rounded-full text-lg text-white flex items-center p-2">
                                                <span className="text-white text-center w-full"><Checkmark className=" w-full fill-current white" /></span>
                                            </div> :
                                            <span className="text-gray-900 text-xs text-center w-full">3</span>}
                                    </div>
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
                                    Buy
                                </div>

                            </div>
                        </>
                    }
                </div>

                <div className="flex flex-col items-center py-4">
                    {success ?
                        <>
                            <h4 className='my-4'>Purchase confirmed!</h4>
                            <h4 className='mb-4'>🎉{' '} You are the new owner of {name}!{' '} 🎉</h4>
                        </> :
                        !ethWETH ?
                            <>
                                <>
                                    <h4>{(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ? 'Register' : 'Buy'}</h4>
                                    <h5 className='px-2 pt-4'> {(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ?
                                        'Register your account to start selling on Otomee, this requires a one-time gas fee.' : waitingForTX ? 'Waiting for blockchain confirmation.' : 'Accept the transaction in your wallet to process your purchase.'} </h5>
                                    {
                                        waitingForTX ?
                                            <Spinner /> :
                                            <button onClick={() => {
                                                if (proxyAddress?.result == undefined) return
                                                //Check if the user is registered on Stateswap
                                                if (proxyAddress?.result[0] == AddressZero) {
                                                    //If not, trigger register Tx
                                                    registryContract?.registerProxy().then((tx: ContractTransaction) => {
                                                        tx.wait(1).then(() => setwaitingForTX(false))
                                                    }, (reason: any) => {
                                                        setwaitingForTX(false)
                                                    })
                                                    setwaitingForTX(true)
                                                    return
                                                } else {
                                                    if (!chainId || !account || !selectedOrder.signature || !erc721c) return
                                                    //Ready to match ETH for ERC721
                                                    const orderAcceptAny = createOrderAcceptAny(account, chainId)
                                                    const emptyCall = Call.utils.empty(chainId)
                                                    const erc721TransferCall = Call.erc721.transferFrom(selectedOrder.maker, account, selectedOrder.target, erc721c, selectedOrder.collection)

                                                    console.log(orderAcceptAny)
                                                    console.log(emptyCall)
                                                    console.log(selectedOrder)
                                                    console.log(erc721TransferCall)
                                                    exchange?.excecuteTradeWith(selectedOrder.order, selectedOrder.signature, erc721TransferCall, orderAcceptAny, splitSignature(NULL_SIG), emptyCall, ZERO_BYTES32, { value: selectedOrder.price })
                                                        .then(
                                                            (tx: ContractTransaction) => {
                                                                tx.wait(1).then(() => {
                                                                    //delete order from orbitdb
                                                                    db.del(selectedOrder.hash);
                                                                    setSuccess(true);
                                                                    setwaitingForTX(false);
                                                                })
                                                            }, (reason: any) => {
                                                                setwaitingForTX(false)
                                                            }
                                                        );
                                                    setwaitingForTX(true);
                                                }
                                            }} className='bg-gray-400 disabled:bg-none disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen  rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 my-4'>
                                                <div className="flex flex-row justify-center  items-center w-full h-full px-2 py-3 backdrop-saturate-150 backdrop-blur-md rounded-full ">
                                                    <p className=" text-white font-semibold text-base">{(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ? 'Register' : 'Buy'}</p>
                                                </div>
                                            </button>

                                    }
                                </>
                            </> :
                            <>
                                <h4>{(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ? 'Register' : (proxyAllowance?.result == undefined) ? 'Loading...' : (((isOwner ? proxyAllowance?.result[0] == false : (proxyAllowance?.result[0]._hex != MaxUint256._hex))) || (selectedOrder.type != OrderType.ERC721_FOR_ETH_OR_WETH)) ? 'Approve' : 'Buy'}</h4>
                                <h5 className='px-2 pt-4'> {(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ?
                                    'Register your account to start selling on Otomee, this requires a one-time gas fee.' : (proxyAllowance?.result == undefined) ? 'Loading...' : (((isOwner ? proxyAllowance?.result[0] == false : (proxyAllowance?.result[0]._hex != MaxUint256._hex))) || (selectedOrder.type != OrderType.ERC721_FOR_ETH_OR_WETH)) ? 'To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.' : waitingForTX ? 'Waiting for blockchain confirmation.' : 'Accept the transaction in your wallet to process your purchase.'} </h5>
                                {
                                    waitingForTX ?
                                        <Spinner /> :
                                        <button onClick={() => {
                                            if (proxyAddress?.result == undefined) return
                                            //Check if there is a Stateswap proxy for this wallet
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
                                            // Check of the matcher can spend it's 721 if it's the owner, or it's ERC20 if it's not the owner
                                            if (((isOwner ? proxyAllowance?.result[0] == false : (proxyAllowance?.result[0]._hex != MaxUint256._hex))) || (selectedOrder.type != OrderType.ERC721_FOR_ETH_OR_WETH)) {
                                                // If not
                                                //If it's the NFT Owner, aprove the NFT
                                                if (isOwner) {
                                                    console.log('Approve')
                                                    console.log(erc721c)
                                                    erc721c?.setApprovalForAll(proxyAddress?.result[0], true)
                                                        .then((tx: ContractTransaction) => {
                                                            tx.wait(1).then(() => setwaitingForTX(false))
                                                        }, (reason: any) => {
                                                            setwaitingForTX(false)
                                                        })
                                                    console.log('Approve')
                                                    // If it's not the NFT owner,aprove the ERC20
                                                } else {
                                                    erc20c?.approve(proxyAddress?.result[0], MaxUint256)
                                                        .then((tx: ContractTransaction) => {
                                                            tx.wait(1).then(() => setwaitingForTX(false))
                                                        }, (reason: any) => {
                                                            setwaitingForTX(false)
                                                        })
                                                }
                                                setwaitingForTX(true)
                                                return
                                            } else {
                                                //Ready to accept the order
                                                if (!chainId || !account || !selectedOrder.signature || !erc721c || !erc20c) return
                                                const OrderAcceptAny = createOrderAcceptAny(account, chainId)
                                                const erc20TransferCall = Call.erc20.transferFrom(account, selectedOrder.maker, selectedOrder.price, erc20c, WETH_ADDRESSES[chainId])
                                                const erc721TransferCall = Call.erc721.transferFrom(selectedOrder.maker, account, selectedOrder.target, erc721c, selectedOrder.collection)

                                                console.log(OrderAcceptAny)
                                                console.log(erc20TransferCall)
                                                console.log(selectedOrder)
                                                console.log(erc721TransferCall)
                                                exchange?.excecuteTrade(selectedOrder.order, selectedOrder.signature, erc721TransferCall, OrderAcceptAny, splitSignature(NULL_SIG), erc20TransferCall, ZERO_BYTES32)
                                                    .then(
                                                        (tx: ContractTransaction) => {
                                                            tx.wait(1).then(() => {
                                                                //delete order from orbitdb
                                                                db.del(selectedOrder.hash);
                                                                setSuccess(true);
                                                                setwaitingForTX(false);
                                                            })
                                                        }, (reason: any) => {
                                                            setwaitingForTX(false)
                                                        }
                                                    );
                                                setwaitingForTX(true);
                                            }
                                        }} className='bg-gray-400 disabled:bg-none disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen  rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 my-4'>
                                            <div className="flex flex-row justify-center  items-center w-full h-full px-2 py-3 backdrop-saturate-150 backdrop-blur-md rounded-full ">
                                                <p className=" text-white font-semibold text-base">{(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ? 'Register' : (proxyAllowance?.result == undefined) ? 'Loading...' : (((isOwner ? proxyAllowance?.result[0] == false : (proxyAllowance?.result[0]._hex != MaxUint256._hex))) || (selectedOrder.type != OrderType.ERC721_FOR_ETH_OR_WETH)) ? 'Approve' : 'Buy'}</p>
                                            </div>
                                        </button>

                                }
                            </>}
                </div>
            </div>
        </UpperSection >


    )

}