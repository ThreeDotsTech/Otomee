
import { Web3Provider } from '@ethersproject/providers';
import { WETH_ADDRESSES } from 'constants/addresses';
import { SupportedNFTInterfaces } from 'constants/ERC165';
import { parseEther } from 'ethers/lib/utils';
import { useERC20Contract, useStateswapAtomizicerContract } from 'hooks/useContract';
import { useERC165 } from 'hooks/useERC165';
import { createErc721_WethOrEthOffer, createWETH_Erc721Order } from 'hooks/useExchangeContract';
import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import styled from 'styled-components';
import { OrderWrapperInterface } from 'stateswap/orders/types';
import { isToday } from 'utils'
import { ReactComponent as Close } from '../../assets/images/x.svg'

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

export default function MakeOffer({
    account,
    chainId,
    contractAddress,
    collectionName,
    owner,
    name,
    id,
    imageURL,
    animationURL,
    library,
    toggleWalletModal,
    setWalletView,
    setWrappedOrder

}: {
    library: Web3Provider | undefined,
    account: string,
    owner: string,
    chainId: number | undefined,
    contractAddress: string,
    collectionName: string,
    name: string,
    id: string,
    imageURL: string,
    animationURL: string
    toggleWalletModal: () => void
    setWalletView: React.Dispatch<React.SetStateAction<string>>
    setWrappedOrder: React.Dispatch<React.SetStateAction<OrderWrapperInterface | undefined>>
}) {

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [price, setPrice] = useState<number | undefined | string>('')

    const Erc165Response = useERC165(contractAddress, [SupportedNFTInterfaces.ERC721, SupportedNFTInterfaces.ERC1155])
    const isERC721 = Erc165Response[0].result?.[0]
    const isERC1155 = Erc165Response[1].result?.[0]


    const erc20c = useERC20Contract(WETH_ADDRESSES[chainId ?? 0], true)
    const atomicizerc = useStateswapAtomizicerContract(true)

    const isOwner = owner.toLowerCase() == account.toLocaleLowerCase()

    const onChangePrice = (event: any) => {
        setPrice(event.target.value)
    }

    const onChangeDate = (dates: any) => {

        if (dates.length != undefined) {
            const [start, end] = dates;

            if (start > new Date()) {
                setStartDate(new Date())
                setEndDate(end);
            } else {
                setStartDate(start);
                setEndDate(end);
            }
        } else {
            startDate.setHours(dates.getHours())
            endDate?.setHours(dates.getHours())

            startDate.setMinutes(dates.getMinutes())
            endDate?.setMinutes(dates.getMinutes())
        }
    };

    return <div className='flex flex-col w-full py-2 px-3'>
        <div className="relative flex justify-between w-full">
            <div className="flex items-center ">
                <div className="flex justify-center overflow-x-hidden w-1/4 aspect-square rounded-lg relative bg-slate-200">
                    {(imageURL == '' && animationURL != '') ? <video className="bg-black h-full aspect-video object-contain" src={animationURL} autoPlay muted loop /> : <img className="h-full object-contain" src={imageURL} />}
                </div>
                <div className="flex flex-col w-full ml-2">
                    <p className="text-base font-semibold text-gray-600 mb-0 text-clip h-min ">{collectionName}</p>
                    <p className="text-lg font-semibold text-gray-900 mb-0 text-clip ">{name}</p>
                </div>
            </div>
            <CloseIcon onClick={toggleWalletModal}>
                <CloseColor />
            </CloseIcon>
        </div>

        <div className="flex flex-col mt-3">
            <label htmlFor='price' className="text-gray-700 select-none font-medium">{isOwner ? 'ETH' : 'WETH'} Price</label>
            <input

                autoComplete='false'
                pattern="[0-9]*"
                inputMode='numeric'
                id="price"
                type="text"
                name="price"
                placeholder="Price"
                value={price}
                onChange={onChangePrice}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
        </div>
        <div className="flex flex-col mt-3 w-full">
            <label htmlFor='expiration' className="text-gray-700 select-none font-medium">Expiration Date</label>
            <div className="self-center mt-1">
                <DatePicker
                    minDate={new Date()}
                    selected={startDate}
                    onChange={onChangeDate}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline

                    minTime={endDate ? isToday(endDate) ? new Date() : new Date(new Date(endDate).setHours(0, 0)) : undefined}
                    maxTime={endDate ? new Date(new Date(endDate).setHours(23, 59)) : undefined}

                    showTimeInput
                    showTimeSelect


                />
            </div>
        </div>

        <div className="flex h-full items-center justify-center my-3 mt-5">
            {!isOwner &&
                <a onClick={() => setWalletView('add_funds')} className='bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5 cursor-pointer'>
                    <div className="flex flex-row justify-center  border-2 border-transparent bg-clip-padding bg-white backdrop-saturate-150 items-center w-full h-full px-2 py-3 rounded-full">
                        <p className="bg-clip-text text-transparent bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen font-semibold text-base" >Convert WETH</p>
                    </div>
                </a>
            }
            <button onClick={() => {
                if (!chainId || !endDate) return
                setWrappedOrder(
                    isOwner ? createErc721_WethOrEthOffer({
                        maker: account,
                        owner,
                        erc721Address: contractAddress,
                        tokenId: id,
                        chainId,
                        price: parseEther(price as string),
                        expirationTime: endDate.getTime()
                    }).getOrbitDBSafeOrderWrapper() : createWETH_Erc721Order({
                        maker: account,
                        erc721Address: contractAddress,
                        tokenId: id,
                        wethAmount: parseEther(price as string),
                        expirationTime: endDate.getTime(),
                        chainId: chainId
                    }
                    )
                )
                setWalletView('status')
            }} disabled={(isNaN(Number(price)) || price == '' || !endDate)} className='bg-gray-400 disabled:bg-none disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-r from-TDRed via-TDBlue to-TDGreen  rounded-full text-xs h-10 w-1/2 hover:scale-95 mx-5'>
                <div className="flex flex-row justify-center  items-center w-full h-full px-2 py-3 backdrop-saturate-150 backdrop-blur-md rounded-full ">
                    <p className=" text-white font-semibold text-base"> {isOwner ? 'Create Listing' : 'Make offer'} </p>
                </div>
            </button>

        </div>

    </div>;
}
