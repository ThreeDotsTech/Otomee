import { TypedDataSigner } from "@ethersproject/abstract-signer"
import { OtomeeExchange } from "abis/types"
import { eip712Domain, eip712Order } from "constants/EIP712"
import { BigNumberish, BytesLike, CallOverrides, Contract, Signature, Signer } from "ethers"
import { defaultAbiCoder } from "ethers/lib/utils"
import { Call, Order } from "types/orders"
import { hashOrder, parseSig, structToSign } from "utils/order"

//Can´t call _signTypedData from regular Signer.
//Remove with EthersV6 

export interface SignerExtended extends Signer, TypedDataSigner{
}

export function wrap(inst: OtomeeExchange|null) {
    if(!inst) return
    const obj = {
      inst: inst,
      hashOrder: (order: Order) => inst.hashOrder_(order.registry, order.maker, order.staticTarget, order.staticSelector, order.staticExtradata, order.maximumFill, order.listingTime, order.expirationTime, order.salt),
      hashToSign: (order: Order) => {
          return inst.hashOrder_(order.registry, order.maker, order.staticTarget, order.staticSelector, order.staticExtradata, order.maximumFill, order.listingTime, order.expirationTime, order.salt).then(hash => {
          return inst.hashToSign_(hash)
        })
      },
      validateOrderParameters: (order: Order) => inst.validateOrderParameters_(order.registry, order.maker, order.staticTarget, order.staticSelector, order.staticExtradata, order.maximumFill, order.listingTime, order.expirationTime, order.salt),
      validateOrderAuthorization: (hash: BytesLike, maker:string, sig:Signature, misc:any) => inst.validateOrderAuthorization_(hash, maker, defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [sig.v, sig.r, sig.s]), misc),
      approveOrderHash: (hash:BytesLike) => inst.approveOrderHash_(hash),
      approveOrder: (order: Order, inclusion:boolean, misc:any) => inst.approveOrder_(order.registry, order.maker, order.staticTarget, order.staticSelector, order.staticExtradata, order.maximumFill, order.listingTime, order.expirationTime, order.salt, inclusion, misc),
      setOrderFill: (order: Order, fill:BigNumberish) => inst.setOrderFill_(hashOrder(order), fill),
      excecuteTrade: (order: Order, sig:Signature, call:Call, counterorder:Order, countersig:Signature, countercall:Call, metadata:BytesLike) => inst.excecuteTrade_(
        [order.registry, order.maker, order.staticTarget, order.maximumFill, order.listingTime, order.expirationTime, order.salt, call.target,
          counterorder.registry, counterorder.maker, counterorder.staticTarget, counterorder.maximumFill, counterorder.listingTime, counterorder.expirationTime, counterorder.salt, countercall.target],
        [order.staticSelector, counterorder.staticSelector],
        order.staticExtradata, call.data, counterorder.staticExtradata, countercall.data,
        [call.howToCall, countercall.howToCall],
        metadata,
        defaultAbiCoder.encode(['bytes', 'bytes'], [
            defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [sig.v, sig.r, sig.s]),
            defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [countersig.v, countersig.r, countersig.s]) 
        ])
      ),
      excecuteTradeWith: (order: Order, sig:Signature, call:Call, counterorder:Order, countersig:Signature, countercall:Call, metadata:BytesLike, misc:any) => inst.excecuteTrade_(
        [order.registry, order.maker, order.staticTarget, order.maximumFill, order.listingTime, order.expirationTime, order.salt, call.target,
          counterorder.registry, counterorder.maker, counterorder.staticTarget, counterorder.maximumFill, counterorder.listingTime, counterorder.expirationTime, counterorder.salt, countercall.target],
        [order.staticSelector, counterorder.staticSelector],
        order.staticExtradata, call.data, counterorder.staticExtradata, countercall.data,
        [call.howToCall, countercall.howToCall],
        metadata,
        defaultAbiCoder.encode(['bytes', 'bytes'], [
            defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [sig.v, sig.r, sig.s]),
            defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [countersig.v, countersig.r, countersig.s])
        ]),
        misc
      ),
      sign: (order: Order, account:SignerExtended, chainId: number) => {
        console.log(inst.address)
        const structure = structToSign(order, inst.address, chainId)
        return account._signTypedData(structure.domain,{
            Order: eip712Order.fields
          }, order).then(sigBytes => {
            const sig = parseSig(sigBytes)
            return sig
          })
      }
    }
    return obj
  }