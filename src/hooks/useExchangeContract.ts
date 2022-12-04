import { STATESWAP_ATOMIZICER_ADDRESSES, STATESWAP_REGISTRY_ADDRESSES, STATESWAP_VERIFIER_ADDRESSES, WETH_ADDRESSES } from "constants/addresses";
import { defaultAbiCoder, parseEther, randomBytes } from "ethers/lib/utils";
import { ArrayToNumber } from "utils";
import { encodeFunctionSignature } from "utils/encoders";
import { CallInterface, OrderInterface, OrderType, OrderWrapperInterface } from "stateswap/orders/types";
import { Erc20, Erc721, StateswapAtomicizer } from "abis/types";
import { BigNumber } from "ethers";
import { VerifierCalls, Extradata, Selectors } from "stateswap/verifiers";
import { Order } from "stateswap/orders/Order";
import { OrderWrapper } from "stateswap/orders/OrderWrapper";
import { MaxUint256 } from '@ethersproject/constants'
function createCalldata_ERC20_Transfer_with_Fee(
    chainId: number,
    erc20Address: string,
    erc20Amount: BigNumber,
    protocolFee: BigNumber,
    royalty: BigNumber,
    protocolFeeReceiver: string,
    royaltyReceiver: string) {
    const selectorCall = encodeFunctionSignature(
        "sequenceExact(bytes,address[7],uint8,uint256[6],bytes)"
    );
    const callSelector1 = encodeFunctionSignature(
        "transferERC20Exact(bytes,address[7],uint8,uint256[6],bytes)"
    );
    const callExtradata1 = defaultAbiCoder.encode(
        ["address", "uint256"],
        [erc20Address, erc20Amount.sub(protocolFee).sub(royalty)]
    );
    const callSelector2 = encodeFunctionSignature(
        "transferERC20ExactTo(bytes,address[7],uint8,uint256[6],bytes)"
    );
    const callExtradata2 = defaultAbiCoder.encode(
        ["address", "uint256", "address"],
        [erc20Address, protocolFee, protocolFeeReceiver]
    );
    const callSelector3 = encodeFunctionSignature(
        "transferERC20ExactTo(bytes,address[7],uint8,uint256[6],bytes)"
    );
    const callExtradata3 = defaultAbiCoder.encode(
        ["address", "uint256", "address"],
        [erc20Address, royalty, royaltyReceiver]
    );

    const extradataCall = defaultAbiCoder.encode(
        ["address[]", "uint256[]", "bytes4[]", "bytes"],
        [
            [STATESWAP_VERIFIER_ADDRESSES[chainId], STATESWAP_VERIFIER_ADDRESSES[chainId], STATESWAP_VERIFIER_ADDRESSES[chainId]],
            [
                (callExtradata1.length - 2) / 2,
                (callExtradata2.length - 2) / 2,
                (callExtradata3.length - 2) / 2,
            ],
            [callSelector1, callSelector2, callSelector3],
            callExtradata1 +
            callExtradata2.slice(2) +
            callExtradata3.slice(2),
        ]
    );

    return [selectorCall, extradataCall]
}

export function create_ERC20_ERC721_OfferWithFees({
    maker,
    owner,
    erc721Address,
    tokenId,
    erc20Address,
    erc20Amount,
    protocolFee,
    protocolFeeReceiver,
    creatorFee,
    creatorFeeReceiver,
    expirationTime,
    chainId,
    erc20c,
    atomicizerc
}: {
    maker: string,
    owner: string,
    erc721Address: string,
    tokenId: string,
    erc20Address: string,
    erc20Amount: BigNumber,
    protocolFee: number,
    protocolFeeReceiver: string,
    creatorFee: number,
    creatorFeeReceiver: string,
    expirationTime: number,
    chainId: number,
    erc20c: Erc20 | null,
    atomicizerc: StateswapAtomicizer | null
}): OrderWrapperInterface {
    const fee1 = ((erc20Amount.mul(protocolFee).mul(10).div(1000)).add(5)).div(10) //ProtocolFee
    const fee2 = ((erc20Amount.mul(creatorFee).mul(10).div(1000)).add(5)).div(10) //ProtocolFee


    const selector = encodeFunctionSignature(
        "split(bytes,address[7],uint8[2],uint256[6],bytes,bytes)"
    );

    // Call should be an ERC20 transfer to recipient + fees

    const [selectorCall, extradataCall] = createCalldata_ERC20_Transfer_with_Fee(chainId, erc20Address, erc20Amount, fee1, fee2, protocolFeeReceiver, creatorFeeReceiver)

    // Countercall should be an ERC721 transfer

    const [selectorCountercall, extradataCountercall] = VerifierCalls.ERC721_Transfer(erc721Address, tokenId)

    const extradata = defaultAbiCoder.encode(
        ["address[2]", "bytes4[2]", "bytes", "bytes"],
        [
            [STATESWAP_VERIFIER_ADDRESSES[chainId], STATESWAP_VERIFIER_ADDRESSES[chainId]],
            [selectorCall, selectorCountercall],
            extradataCall,
            extradataCountercall,
        ]
    );

    //Registry will be retrieved and assigned later.
    const order: OrderInterface = {
        registry: STATESWAP_REGISTRY_ADDRESSES[chainId],
        maker: maker,
        verifierTarget: STATESWAP_VERIFIER_ADDRESSES[chainId],
        verifierSelector: selector,
        verifierExtradata: extradata,
        maximumFill: 1,
        listingTime: 0,
        expirationTime: expirationTime,
        salt: ArrayToNumber(randomBytes(31))._hex,
    }



    if (!erc20c || !atomicizerc) {
        throw new Error("Invalid contracts");
    }

    const c1 = erc20c.interface.encodeFunctionData("transferFrom", [maker, owner, erc20Amount.sub(fee1).sub(fee2)])
    const c2 = erc20c.interface.encodeFunctionData("transferFrom", [maker, protocolFeeReceiver, fee1])
    const c3 = erc20c.interface.encodeFunctionData("transferFrom", [maker, creatorFeeReceiver, fee2])

    const callData = atomicizerc.interface.encodeFunctionData("atomicize", [
        [erc20Address, erc20Address, erc20Address],
        [0, 0, 0],
        [(c1.length - 2) / 2, (c2.length - 2) / 2, (c3.length - 2) / 2],
        c1 + c2.slice(2) + c3.slice(2)]
    )

    const call = {
        data: callData,
        howToCall: 1,
        target: STATESWAP_ATOMIZICER_ADDRESSES[chainId]
    };

    const orderWrapper: OrderWrapperInterface = {
        call: call,
        collection: erc721Address,
        hash: undefined,
        maker: maker,
        order: order,
        price: erc20Amount._hex,
        signature: undefined,
        target: tokenId,
        type: OrderType.ERC20_FOR_ERC721,
    }

    return orderWrapper

}

export function createOrderAcceptAny(maker: string, chainId: number): OrderInterface {
    const anySelector = Selectors.util.any
    const anyExtradata = Extradata.util.any()
    const order = new Order()
        .setRegistry(STATESWAP_REGISTRY_ADDRESSES[chainId])
        .setMaker(maker)
        .setVerifierTarget(STATESWAP_VERIFIER_ADDRESSES[chainId])
        .setVerifierSelector(anySelector)
        .setVerifierExtradata(anyExtradata)
        .setMaximumFill(1)
        .setListingTime(0)
        .setExpirationTime(Number.MAX_SAFE_INTEGER - 1);
    return order
}


export function create_ERC721_WETH_OR_ETH_Offer({
    maker,
    erc721Address,
    tokenId,
    chainId,
    price,
    expirationTime,
}: {
    maker: string,
    owner: string,
    erc721Address: string,
    tokenId: string,
    chainId: number,
    price: BigNumber,
    expirationTime: number
}): OrderWrapper {

    const wethAddress = WETH_ADDRESSES[chainId];

    //Split calls and countercalls
    const splitSelector = Selectors.util.split;

    //Call should be an erc721 token transfer.
    const [ERC721TransferSelector, ERC721TransferExtradata] = VerifierCalls.ERC721_Transfer(erc721Address, tokenId)

    //Countercall should one of two (OR):
    const orSelector = Selectors.util.OR;

    //a) ERC721 for ETH
    const [receiveETHSelector, receiveETHExtradata] = VerifierCalls.receive_ETH(price);
    const extradataERC721ForETH = Extradata.util.split(
        {
            addressCall: STATESWAP_VERIFIER_ADDRESSES[chainId],
            selectorCall: ERC721TransferSelector,
            extradataCall: ERC721TransferExtradata,
            addressCountercall: STATESWAP_VERIFIER_ADDRESSES[chainId],
            selectorCountercall: receiveETHSelector,
            extradataCountercall: receiveETHExtradata
        }
    );

    //b) ERC721 for ERC20
    const [receiveERC20Selector, receiveERC20extradata] = VerifierCalls.ERC20_Transfer(wethAddress, price)
    const extradataERC721ForERC20 = Extradata.util.split(
        {
            addressCall: STATESWAP_VERIFIER_ADDRESSES[chainId],
            selectorCall: ERC721TransferSelector,
            extradataCall: ERC721TransferExtradata,
            addressCountercall: STATESWAP_VERIFIER_ADDRESSES[chainId],
            selectorCountercall: receiveERC20Selector,
            extradataCountercall: receiveERC20extradata
        }
    );

    //Join two options in Or extradata
    const orExtradata = Extradata.util.or(
        {
            addresses: [STATESWAP_VERIFIER_ADDRESSES[chainId], STATESWAP_VERIFIER_ADDRESSES[chainId]],
            selectors: [splitSelector, splitSelector],
            extradatas: [extradataERC721ForETH, extradataERC721ForERC20]
        }
    );

    // TODO: Verify Extradata.util.or implementation (compara to this)
    /*     defaultAbiCoder.encode(
            ['address[]', 'bytes4[]', 'uint256[]', 'bytes'],
            [[STATESWAP_VERIFIER_ADDRESSES[chainId], STATESWAP_VERIFIER_ADDRESSES[chainId]],
            [splitSelector, splitSelector],
            [(extradataERC721ForETH.length - 2) / 2, (extradataERC721ForERC20.length - 2) / 2],
            extradataERC721ForETH + extradataERC721ForERC20.slice(2)]
        ) */


    //Build order
    const order = new Order()
        .setRegistry(STATESWAP_REGISTRY_ADDRESSES[chainId])
        .setMaker(maker)
        .setVerifierTarget(STATESWAP_VERIFIER_ADDRESSES[chainId])
        .setVerifierSelector(orSelector)
        .setVerifierExtradata(orExtradata)
        .setMaximumFill(1)
        .setListingTime(0)
        .setExpirationTime(expirationTime);

    //Wrap Order
    const orderWrapper = new OrderWrapper(order)
        .setCollection(erc721Address.toLowerCase())
        .setPrice(price._hex)
        .setTarget(tokenId)
        .setType(OrderType.ERC721_FOR_ETH_OR_WETH)

    return orderWrapper
}

export function create_ERC721_ERC20_OR_ETH_OfferWithFees({
    maker,
    erc721Address,
    tokenId,
    erc20Address,
    price,
    protocolFee,
    protocolFeeReceiver,
    creatorFee,
    creatorFeeReceiver,
    expirationTime,
    chainId,
    erc721c,
    atomicizerc
}: {
    maker: string,
    owner: string,
    erc721Address: string,
    tokenId: string,
    erc20Address: string,
    price: BigNumber,
    protocolFee: number,
    protocolFeeReceiver: string,
    creatorFee: number,
    creatorFeeReceiver: string,
    expirationTime: number,
    chainId: number,
    erc721c: Erc721 | null,
    atomicizerc: StateswapAtomicizer | null
}): OrderWrapperInterface {
    const fee1 = ((price.mul(protocolFee).mul(10).div(1000)).add(5)).div(10) //ProtocolFee
    const fee2 = ((price.mul(creatorFee).mul(10).div(1000)).add(5)).div(10) //CreatorFee

    const extradataSelector = encodeFunctionSignature(
        "split(bytes,address[7],uint8[2],uint256[6],bytes,bytes)"
    );

    const [selectorCall, extradataCall] = VerifierCalls.ERC721_Transfer(erc721Address, tokenId)

    //Countercall should be:

    const selector = encodeFunctionSignature(
        "or(bytes,address[7],uint8[2],uint256[6],bytes,bytes)"
    );

    //a) ERC721 for ETH

    const [selectorCountercall1, extradataCountercall1] = VerifierCalls.receive_ETH(price.sub(fee1).sub(fee2))

    const extradataOption1 = defaultAbiCoder.encode(
        ["address[2]", "bytes4[2]", "bytes", "bytes"],
        [
            [STATESWAP_VERIFIER_ADDRESSES[chainId], STATESWAP_VERIFIER_ADDRESSES[chainId]],
            [selectorCall, selectorCountercall1],
            extradataCall,
            extradataCountercall1,
        ]
    );

    //b) ERC721 for ERC20
    const [selectorCountercall2, extradataCountercall2] = createCalldata_ERC20_Transfer_with_Fee(chainId, erc20Address, price, fee1, fee2, protocolFeeReceiver, creatorFeeReceiver)

    const extradataOption2 = defaultAbiCoder.encode(
        ["address[2]", "bytes4[2]", "bytes", "bytes"],
        [
            [STATESWAP_VERIFIER_ADDRESSES[chainId], STATESWAP_VERIFIER_ADDRESSES[chainId]],
            [selectorCall, selectorCountercall2],
            extradataCall,
            extradataCountercall2,
        ]
    );

    const extradata = defaultAbiCoder.encode(
        ['address[]', 'bytes4[]', 'uint256[]', 'bytes'],
        [[STATESWAP_VERIFIER_ADDRESSES[chainId], STATESWAP_VERIFIER_ADDRESSES[chainId]],
        [extradataSelector, extradataSelector],
        [(extradataOption1.length - 2) / 2, (extradataOption2.length - 2) / 2],
        extradataOption1 + extradataOption2.slice(2)]
    );

    const order: OrderInterface = {
        registry: STATESWAP_REGISTRY_ADDRESSES[chainId],
        maker: maker,
        verifierTarget: STATESWAP_VERIFIER_ADDRESSES[chainId],
        verifierSelector: selector,
        verifierExtradata: extradata,
        maximumFill: 1,
        listingTime: 0,
        expirationTime: expirationTime,
        salt: ArrayToNumber(randomBytes(31))._hex,
    }

    if (!erc721c || !atomicizerc) {
        throw new Error("Invalid contracts");
    }



    const orderWrapper: OrderWrapperInterface = {
        call: undefined,
        collection: erc721Address.toLowerCase(),
        hash: undefined,
        maker: maker.toLowerCase(),
        order: order,
        price: price._hex,
        signature: undefined,
        target: tokenId,
        type: OrderType.ERC721_FOR_ETH_OR_WETH,
    }

    return orderWrapper

}