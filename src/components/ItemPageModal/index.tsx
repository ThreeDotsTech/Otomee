import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { AutoColumn } from 'components/Column'
import { PrivacyPolicy } from 'components/PrivacyPolicy'
import Row, { AutoRow, RowBetween } from 'components/Row'
import { useContext, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Info, } from 'react-feather'
import styled from 'styled-components/macro'

import MetamaskIcon from '../../assets/images/metamask.png'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { ReactComponent as Checkmark } from '../../assets/svg/checkmark.svg'
import { ReactComponent as Spinner } from '../../assets/svg/spinner.svg'
import { injected } from '../../connectors'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import usePrevious from '../../hooks/usePrevious'
import { useItemPageModalToggle, useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { ExternalLink, ThemedText } from '../../theme'
import { isMobile } from '../../utils/userAgent'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import Card, { LightCard } from '../Card'
import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'
import { useActiveWeb3React } from 'hooks/web3'
import "react-datepicker/dist/react-datepicker.css";
import { useERC20Contract, useERC721Contract, useStateswapExchangeContract, useStateswapRegistryContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import MakeOffer from 'components/ItemPageModal/MakeOffer'
import { OrderType, OrderWrapperInterface } from 'stateswap/orders/types'
import { Status } from './Status'
import { SignerExtended, wrap } from 'utils/exchangeWrapper'
import { splitSignature } from 'ethers/lib/utils'
import { WETH_ADDRESSES } from 'constants/addresses'
import { useSaleActionManager, useSaleOrderManager } from 'state/sale/hooks'
import OrbitContext from 'state/orbitdb/orbitContext'
import { ContractReceipt, ContractTransaction, utils } from 'ethers'
import { SaleAction } from 'state/sale/reducer'
import { useGetNumberOfErc721Transfers } from 'hooks/useSubgraph'
import { isAddress, shortenAddress } from 'utils'
import useENSAddress from 'hooks/useENSAddress'
import useENSAvatar from 'hooks/useENSAvatar'
import Identicon from 'components/Identicon'
import { Link } from 'react-router-dom'
import { create_accept_any_order, create_empty_call } from 'hooks/useExchangeContract'
import { NULL_SIG, ZERO_BYTES32 } from 'constants/misc'
import { MatchView } from './Match'

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

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
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

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg0};
  padding: 0 1rem 1rem 1rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0 1rem 1rem 1rem`};
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

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
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

const LinkCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.white};

  :hover {
    cursor: pointer;
    filter: brightness(0.9);
  }
`

export const MAKE_OFFER_VIEWS = {
    OPTIONS: 'options',
    OPTIONS_SECONDARY: 'options_secondary',
    OFFER: 'offer',
    PENDING: 'pending',
    LEGAL: 'legal',
    ADD_FUNDS: 'add_funds',
    STATUS: 'status'
}

const AvatarWrapper = styled.div`
border-radius: 9999px;
height: 1.5rem/* 160px */;
width: 1.5rem/* 160px */;
object-fit: cover;
overflow: clip;
`

export default function ItemPageModal({
    contractAddress,
    collectionName,
    owner,
    name,
    id,
    imageURL,
    animationURL,
    reloadNFTData
}: {
    owner: string
    contractAddress: string,
    collectionName: string,
    name: string,
    id: string,
    imageURL: string,
    animationURL: string
    reloadNFTData: () => void
}) {
    // important that these are destructed from the account-specific web3-react context
    const { active, account, connector, activate, error, chainId } = useWeb3React()

    const { orbitdb } = useContext(OrbitContext)

    const { library } = useActiveWeb3React()

    const [walletView, setWalletView] = useState(MAKE_OFFER_VIEWS.OFFER)

    const previousWalletView = usePrevious(walletView)

    const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

    const [pendingError, setPendingError] = useState<boolean>()

    const [wrappedOrder, setWrappedOrder] = useState<OrderWrapperInterface>()

    const erc20c = useERC20Contract(WETH_ADDRESSES[chainId ?? 0], true)

    const erc721c = useERC721Contract(contractAddress)

    const exchangec = useStateswapExchangeContract(true)

    const exchange = wrap(exchangec)

    const walletModalOpen = useModalOpen(ApplicationModal.MAKE_OFFER)

    const toggleWalletModal = useItemPageModalToggle()

    const previousAccount = usePrevious(account)

    const [signing, setSigning] = useState<boolean>(false)
    const [ethWETH, setethWETH] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [waitingForTX, setwaitingForTX] = useState<boolean>(false)

    const [modalAction, setAction] = useSaleActionManager()

    const [selectedOrder, setOrder] = useSaleOrderManager()

    const isOwner = owner.toLowerCase() == account?.toLocaleLowerCase()

    const [destination, setDestination] = useState<string>('')

    const [ENSdestination, setENSDestination] = useState<string>('')

    const { address, loading } = useENSAddress(ENSdestination)


    useEffect(() => {
        if (destination.toLocaleLowerCase().endsWith('.eth')) {
            setENSDestination(destination)
        } else {
            setENSDestination('')
        }
    })

    const { numberOfErc721Transfers,
        numberOfErc721Transferserror,
        numberOfErc721Transfersfetching,
        numberOfErc721TransfersExecuteQuery } = useGetNumberOfErc721Transfers(account ?? '', isAddress(destination) ? destination : address ?? '')

    const onChangeDestination = (event: any) => {
        setDestination(event.target.value)
        if (isAddress(event.target.value)) {
            numberOfErc721TransfersExecuteQuery()
        }
    }

    const accountArgument = useMemo(
        () => [account === null ? undefined : account],
        [account])

    const registryContract = useStateswapRegistryContract(true)

    const proxyAddress = useSingleCallResult(registryContract, 'proxies', accountArgument)

    const allowanceArgument = useMemo(
        () => [account === null ? undefined : account, proxyAddress.result && proxyAddress.result[0]],
        [account, chainId, proxyAddress?.result])

    const proxyAllowance = useSingleCallResult(isOwner ? erc721c : erc20c, isOwner ? 'isApprovedForAll' : 'allowance', allowanceArgument)

    //Once the wrapped Order has been created, ask for the user's signature.
    useEffect(() => {
        if (!wrappedOrder?.order || !account || !chainId || !proxyAddress?.result || !proxyAllowance?.result || signing || modalAction) return

        if (proxyAddress?.result[0] == AddressZero || (isOwner ? proxyAllowance?.result[0] == false : (proxyAllowance?.result[0]._hex != MaxUint256._hex))) return
        setSigning(true)
        exchange?.hashOrder(wrappedOrder.order).then((hash: string) => wrappedOrder.hash = hash)
        exchange?.sign(
            wrappedOrder?.order,
            library?.getSigner(account) as SignerExtended,
            chainId).
            then(
                (flatsig: { v: number, r: string, s: string }) => {
                    const signature = splitSignature(flatsig)
                    console.log(wrappedOrder)
                    if (!wrappedOrder.order) return
                    wrappedOrder.signature = signature
                    console.log('broadcasting order')
                    orbitdb?.addRecord(wrappedOrder)
                    setWrappedOrder(undefined)
                    setSigning(false)
                    setSuccess(true)
                }).catch((reason: any) => {
                    if (reason.code == 4001) {
                        setWrappedOrder(undefined)
                        setSigning(false)
                        toggleWalletModal()
                    }
                })
    }, [wrappedOrder, proxyAddress?.result, proxyAllowance?.result, signing])


    // close on connection, when logged out before
    useEffect(() => {
        if (account && !previousAccount && walletModalOpen) {
            toggleWalletModal()
        }
    }, [account, previousAccount, toggleWalletModal, walletModalOpen])

    // always reset to offer view
    useEffect(() => {
        if (walletModalOpen) {
            setPendingError(false)
            setWalletView(MAKE_OFFER_VIEWS.OFFER)
        } else {
            setWrappedOrder(undefined)
            setSuccess(false)
            setAction(null)
            setOrder(null)
            setENSDestination('')
            setDestination('')
        }
    }, [walletModalOpen])

    // close modal when a connection is successful
    const activePrevious = usePrevious(active)
    const connectorPrevious = usePrevious(connector)
    useEffect(() => {
        if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
            setWalletView(MAKE_OFFER_VIEWS.OFFER)
        }
    }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        let name = ''
        Object.keys(SUPPORTED_WALLETS).map((key) => {
            if (connector === SUPPORTED_WALLETS[key].connector) {
                return (name = SUPPORTED_WALLETS[key].name)
            }
            return true
        })
        setPendingWallet(connector) // set wallet for pending view
        setWalletView(MAKE_OFFER_VIEWS.PENDING)


        connector &&
            activate(connector, undefined, true)
                .then(async () => {
                    const walletAddress = await connector.getAccount()
                })
                .catch((error) => {
                    if (error instanceof UnsupportedChainIdError) {
                        activate(connector) // a little janky...can't use setError because the connector isn't set
                    } else {
                        setPendingError(true)
                    }
                })
    }

    // get wallets user can switch too, depending on device/browser
    function getOptions() {
        const isMetamask = window.ethereum && window.ethereum.isMetaMask
        return Object.keys(SUPPORTED_WALLETS).map((key) => {
            const option = SUPPORTED_WALLETS[key]
            // check for mobile options
            if (isMobile) {

                if (!window.web3 && !window.ethereum && option.mobile) {
                    return (
                        <Option
                            onClick={() => {
                                option.connector !== connector && !option.href && tryActivation(option.connector)
                            }}
                            id={`connect-${key}`}
                            key={key}
                            active={option.connector && option.connector === connector}
                            color={option.color}
                            link={option.href}
                            header={option.name}
                            subheader={null}
                            icon={option.iconURL}
                        />
                    )
                }
                return null
            }

            // overwrite injected when needed
            if (option.connector === injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                    if (option.name === 'MetaMask') {
                        return (
                            <Option
                                id={`connect-${key}`}
                                key={key}
                                color={'#E8831D'}
                                header={'Install Metamask'}
                                subheader={null}
                                link={'https://metamask.io/'}
                                icon={MetamaskIcon}
                            />
                        )
                    } else {
                        return null //dont want to return install twice
                    }
                }
                // don't return metamask if injected provider isn't metamask
                else if (option.name === 'MetaMask' && !isMetamask) {
                    return null
                }
                // likewise for generic
                else if (option.name === 'Injected' && isMetamask) {
                    return null
                }
            }

            // return rest of options
            return (
                !isMobile &&
                !option.mobileOnly && (
                    <Option
                        id={`connect-${key}`}
                        onClick={() => {
                            option.connector === connector
                                ? setWalletView(MAKE_OFFER_VIEWS.OFFER)
                                : !option.href && tryActivation(option.connector)
                        }}
                        key={key}
                        active={option.connector === connector}
                        color={option.color}
                        link={option.href}
                        header={option.name}
                        subheader={null} //use option.descriptio to bring back multi-line
                        icon={option.iconURL}
                    />
                )
            )
        })
    }

    function getModalContent() {
        if (error) {
            return (
                <UpperSection>
                    <CloseIcon onClick={toggleWalletModal}>
                        <CloseColor />
                    </CloseIcon>
                    <HeaderRow>
                        {error instanceof UnsupportedChainIdError ? <a>Wrong Network</a> : <a>Error connecting</a>}
                    </HeaderRow>
                    <ContentWrapper>
                        {error instanceof UnsupportedChainIdError ? (
                            <h5>
                                Please connect to the appropriate Ethereum network.
                            </h5>
                        ) : (
                            <a>Error connecting. Try refreshing the page.</a>
                        )}
                    </ContentWrapper>
                </UpperSection>
            )
        }
        if (modalAction == SaleAction.MATCH) {
            if (!selectedOrder || !chainId) return
            return (
                <MatchView                                    // G
                    name={name}
                    contractAddress={contractAddress}         // o
                    account={account}
                    chainId={chainId}                         // d
                    setwaitingForTX={setwaitingForTX}
                    registryContract={registryContract}       // F
                    waitingForTX={waitingForTX}
                    success={success}                         // o
                    proxyAllowance={proxyAllowance}
                    proxyAddress={proxyAddress}               // r
                    ethWETH={ethWETH}
                    isOwner={isOwner}                         // g
                    selectedOrder={selectedOrder}
                    collectionName={collectionName}           // i
                    imageURL={imageURL}
                    animationURL={animationURL}               // v
                    setethWETH={setethWETH}
                    toggleWalletModal={toggleWalletModal}     // e
                    setWalletView={setWalletView}
                    setWrappedOrder={setWrappedOrder}         // M
                />
            )                                                 // e
        }
        if (modalAction == SaleAction.TRANSFER) {
            return (
                <UpperSection>
                    <CloseIcon onClick={toggleWalletModal}>
                        <CloseColor />
                    </CloseIcon>
                    <HeaderRow>
                        <Row justify="center">
                            <ThemedText.MediumHeader>
                                Transfer
                            </ThemedText.MediumHeader>
                        </Row>
                    </HeaderRow>
                    <div className="flex flex-col px-4">
                        <div className='flex justify-start w-full mb-4'>
                            <div className="flex">
                                <div className="flex w-5/12 justify-center overflow-x-hidden aspect-square rounded-lg relative bg-slate-200">
                                    {(imageURL == '' && animationURL != '') ? <video className="bg-black h-full aspect-video object-contain" src={animationURL} autoPlay muted loop /> : <img className="h-full object-contain" src={imageURL} />}
                                </div>
                                <div className="flex flex-col items-start w-7/12 justify-center ml-2 px-2">
                                    <p className="text-base font-semibold text-gray-600 mb-0 truncate grow-0 mt-1">{collectionName}</p>
                                    <p className="text-lg font-semibold text-gray-900 mb-2 text-clip ">{name}</p>

                                </div>

                            </div>


                        </div>
                        <h4 className='my-4'>Wallet address or ENS name</h4>

                        <input
                            autoComplete='false'
                            pattern="[0-9]*"
                            inputMode='numeric'
                            id="price"
                            type="text"
                            name="price"
                            value={destination}
                            onChange={onChangeDestination}
                            placeholder="0x1abc... or destination.eth"
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />


                        Transfering to:
                        {!(!isAddress(destination) && !address) ? <>
                            <AvatarWrapper>
                                <Identicon externalAddress={isAddress(destination) ? destination : (address ?? '')} jazzIconDiameter={24} />
                            </AvatarWrapper>
                            <h5 className='ml-1 font-normal truncate'> {isAddress(destination) ? shortenAddress(destination) : destination} </h5>
                            {numberOfErc721Transfers}
                        </> : <></>}
                        {waitingForTX ?
                            <Spinner /> :
                            <button onClick={() => {
                                if (!account) return

                                erc721c?.transferFrom(account, destination, id).then((tx: ContractTransaction) => {
                                    tx.wait(1).then(() => {
                                        console.log('nftSent')
                                        setwaitingForTX(false)
                                        setTimeout(function () { reloadNFTData(); console.log('reloading query') }, 15000);
                                    })
                                }, (reason: any) => {
                                    setwaitingForTX(false)
                                })

                                setwaitingForTX(true)
                            }} disabled={(!isAddress(destination) && !address)} className='bg-gray-400 disabled:bg-none disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen  rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 my-4 self-center justify-self-center place-self-center self'>
                                <div className="flex flex-row justify-center  items-center w-full h-full px-2 py-3 backdrop-saturate-150 backdrop-blur-md rounded-full ">
                                    <p className=" text-white font-semibold text-base">Transfer</p>
                                </div>
                            </button>}


                    </div>

                </UpperSection >


            )
        }
        if (modalAction == SaleAction.CANCEL) {
            return (
                <UpperSection>
                    <CloseIcon onClick={toggleWalletModal}>
                        <CloseColor />
                    </CloseIcon>
                    <HeaderRow>
                        <Row justify="center">
                            <ThemedText.MediumHeader>
                                Cancel Listing
                            </ThemedText.MediumHeader>
                        </Row>
                    </HeaderRow>
                    <div className="flex flex-col items-center">
                        <h4 className=' text-justify px-8'>
                            Canceling your listing will unpublish this sale from Otomee and requires a transaction to make sure it will never be fulfillable.
                        </h4>
                        {waitingForTX ?
                            <Spinner /> :
                            <button onClick={() => {
                                if (!selectedOrder) return

                                exchange?.hashOrder(selectedOrder.order).then((hash: string) => {
                                    exchangec?.setOrderFill_(hash, 1).then((tx: ContractTransaction) => { // TODO: This will only work for ERC721,
                                        // modify to make compatible with ERC1155
                                        tx.wait(1).then(() => {
                                            orbitdb?.db?.del(hash)
                                            setwaitingForTX(false)
                                            toggleWalletModal()
                                        })
                                    }, (reason: any) => {
                                        if ((reason.message as string).includes("execution reverted: Fill is already set to the desired value")) {
                                            orbitdb?.db?.del(hash)
                                            toggleWalletModal()
                                        }
                                        setwaitingForTX(false)
                                    })
                                })
                                setwaitingForTX(true)
                            }} className='bg-gray-400 disabled:bg-none disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen  rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 my-4 self-center justify-self-center place-self-center self'>
                                <div className="flex flex-row justify-center  items-center w-full h-full px-2 py-3 backdrop-saturate-150 backdrop-blur-md rounded-full ">
                                    <p className=" text-white font-semibold text-base">Cancel Listing</p>
                                </div>
                            </button>}
                    </div>

                </UpperSection>


            )
        }
        if (walletView === MAKE_OFFER_VIEWS.LEGAL) {
            return (
                <UpperSection>
                    <HeaderRow>
                        <HoverText
                            onClick={() => {
                                setWalletView(
                                    (previousWalletView === MAKE_OFFER_VIEWS.LEGAL ? MAKE_OFFER_VIEWS.OFFER : previousWalletView) ??
                                    MAKE_OFFER_VIEWS.OFFER
                                )
                            }}
                        >
                            <ArrowLeft />
                        </HoverText>
                        <Row justify="center">
                            <ThemedText.MediumHeader>
                                Legal & Privacy
                            </ThemedText.MediumHeader>
                        </Row>
                    </HeaderRow>
                    <PrivacyPolicy />
                </UpperSection>
            )
        }
        if (account && walletView === MAKE_OFFER_VIEWS.OFFER) {
            return (
                <MakeOffer library={library} owner={owner} account={account} chainId={chainId} setWrappedOrder={setWrappedOrder} contractAddress={contractAddress} toggleWalletModal={toggleWalletModal} setWalletView={setWalletView} collectionName={collectionName} name={name} imageURL={imageURL} animationURL={animationURL} id={id} />
            )
        }
        if (account && walletView === MAKE_OFFER_VIEWS.STATUS) {
            return (
                <UpperSection>
                    <CloseIcon onClick={toggleWalletModal}>
                        <CloseColor />
                    </CloseIcon>
                    <HeaderRow>
                        <HoverText
                            onClick={() => {
                                setWalletView(
                                    MAKE_OFFER_VIEWS.OFFER
                                )
                                setWrappedOrder(undefined)
                            }}
                        >
                            <ArrowLeft />
                        </HoverText>
                        <Row justify="center">
                            <ThemedText.MediumHeader>
                                Confirm your offer
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
                                    <div className=" flex items-center text-lg font-semibold text-gray-900 mb-0 text-clip grow border-t w-full justify-start">
                                        <div className="flex">
                                            <p className='text-gray-600 mr-2'>Price: </p>
                                            {wrappedOrder && utils.formatEther(wrappedOrder?.price)} WETH
                                        </div>

                                    </div>
                                </div>

                            </div>


                        </div>


                        <div className="max-w-xl mx-2 py-4 border-b-2 pb-4 ">
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
                                    Sign
                                </div>

                            </div>
                        </div>

                        <div className="flex flex-col items-center py-4">
                            {success ?
                                <>
                                    <h4 className='my-4'>Order confirmed!</h4>
                                    <h5 className='mb-4'> Your order has been created and broadcasted, you can now close this window.</h5>
                                </> :
                                <>
                                    <h4>{(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ? 'Register' : (proxyAllowance?.result == undefined) ? 'Loading...' : ((isOwner ? proxyAllowance?.result[0] == false : (proxyAllowance?.result[0]._hex != MaxUint256._hex))) ? 'Approve' : 'Sign'}</h4>
                                    <h5 className='px-2 pt-4'> {(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ?
                                        'Register your account to start selling on Otomee, this requires a one-time gas fee.' : (proxyAllowance?.result == undefined) ? 'Loading...' : ((isOwner ? proxyAllowance?.result[0] == false : (proxyAllowance?.result[0]._hex != MaxUint256._hex))) ? 'To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.' : 'Accept the signature request in your wallet to broadcast your listing.'} </h5>
                                    {(proxyAllowance?.result == undefined) ? 'Loading...' : ((isOwner ? proxyAllowance?.result[0] == false : (proxyAllowance?.result[0]._hex != MaxUint256._hex))) ?
                                        waitingForTX ?
                                            <Spinner /> :
                                            <button onClick={() => {
                                                if (proxyAddress?.result == undefined) return
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
                                                if ((isOwner ? proxyAllowance?.result[0] == false : (proxyAllowance?.result[0]._hex != MaxUint256._hex))) {
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
                                                }
                                            }} className='bg-gray-400 disabled:bg-none disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen  rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 my-4'>
                                                <div className="flex flex-row justify-center  items-center w-full h-full px-2 py-3 backdrop-saturate-150 backdrop-blur-md rounded-full ">
                                                    <p className=" text-white font-semibold text-base">{(proxyAddress?.result == undefined) ? 'Loading...' : (proxyAddress?.result[0] == AddressZero) ? 'Register' : 'Approve'}</p>
                                                </div>
                                            </button>
                                        :
                                        <p className='text-sm text-gray-600 my-4'>
                                            Waiting for signature...
                                        </p>

                                    }
                                </>}
                        </div>
                    </div>

                </UpperSection >

            )
        }
        if (account && walletView === MAKE_OFFER_VIEWS.ADD_FUNDS) {
            return (
                <UpperSection>
                    <CloseIcon onClick={toggleWalletModal}>
                        <CloseColor />
                    </CloseIcon>
                    <HeaderRow>
                        <HoverText
                            onClick={() => {
                                setWalletView(
                                    MAKE_OFFER_VIEWS.OFFER
                                )
                            }}
                        >
                            <ArrowLeft />
                        </HoverText>
                        <Row justify="center">
                            <ThemedText.MediumHeader>
                                Convert WETH
                            </ThemedText.MediumHeader>
                        </Row>
                    </HeaderRow>
                    <iframe width="100%"
                        height="500"
                        src={"https://app.uniswap.org/#/swap?outputCurrency=" + WETH_ADDRESSES[chainId ?? 0] + "&exactAmount=0&theme=light&exactField=output"}>
                    </iframe>

                </UpperSection>


            )
        }

        return (
            <UpperSection>
                <CloseIcon onClick={toggleWalletModal}>
                    <CloseColor />
                </CloseIcon>
                {walletView !== MAKE_OFFER_VIEWS.OFFER ? (
                    <HeaderRow color="blue">
                        <HoverText
                            onClick={() => {
                                setPendingError(false)
                                setWalletView(MAKE_OFFER_VIEWS.OFFER)
                            }}
                        >
                            <ArrowLeft />
                        </HoverText>
                    </HeaderRow>
                ) : (
                    <HeaderRow>
                        <HoverText>
                            Connect a wallet
                        </HoverText>
                    </HeaderRow>
                )}

                <ContentWrapper>
                    <AutoColumn gap="16px">
                        <LightCard>
                            <AutoRow style={{ flexWrap: 'nowrap' }}>
                                <ThemedText.Black fontSize={14}>

                                    By connecting a wallet, you agree to Otomee’{' '}
                                    Terms of Service and
                                    acknowledge that you have read and understand the Otomee{' '}
                                    Protocol Disclaimer.

                                </ThemedText.Black>
                            </AutoRow>
                        </LightCard>
                        {walletView === MAKE_OFFER_VIEWS.PENDING ? (
                            <PendingView
                                connector={pendingWallet}
                                error={pendingError}
                                setPendingError={setPendingError}
                                tryActivation={tryActivation}
                            />
                        ) : (
                            <OptionGrid>{getOptions()}</OptionGrid>
                        )}
                        <LinkCard padding=".5rem" $borderRadius=".75rem" onClick={() => setWalletView(MAKE_OFFER_VIEWS.LEGAL)}>
                            <RowBetween>
                                <AutoRow gap="4px">
                                    <Info size={20} />
                                    <ThemedText.White fontSize={14}>
                                        How this app uses APIs
                                    </ThemedText.White>
                                </AutoRow>
                                <ArrowRight size={16} />
                            </RowBetween>
                        </LinkCard>
                    </AutoColumn>
                </ContentWrapper>
            </UpperSection>
        )
    }

    return (
        <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
            <Wrapper>{getModalContent()}</Wrapper>
        </Modal>
    )
}
