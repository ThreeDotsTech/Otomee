import { TypedDataSigner } from "@ethersproject/abstract-signer"
import { StateswapExchange } from "abis/types"
import { eip712Domain, eip712Order } from "constants/EIP712"
import { BigNumberish, BytesLike, CallOverrides, Contract, Signature, Signer } from "ethers"
import { defaultAbiCoder } from "ethers/lib/utils"
import { CallInterface, OrderInterface } from "stateswap/orders/types"
import { hashOrder, parseSig, structToSign } from "utils/order"

//Can´t call _signTypedData from regular Signer.
//Remove with EthersV6 

export interface SignerExtended extends Signer, TypedDataSigner {
}

export function wrap(inst: StateswapExchange | null) {
  if (!inst) return
  const obj = {
    inst: inst,
    hashOrder: (order: OrderInterface) => inst.hashOrder_(order.registry, order.maker, order.verifierTarget, order.verifierSelector, order.verifierExtradata, order.maximumFill, order.listingTime, order.expirationTime, order.salt),
    hashToSign: (order: OrderInterface) => {
      return inst.hashOrder_(order.registry, order.maker, order.verifierTarget, order.verifierSelector, order.verifierExtradata, order.maximumFill, order.listingTime, order.expirationTime, order.salt).then(hash => {
        return inst.hashToSign_(hash)
      })
    },
    validateOrderParameters: (order: OrderInterface) => inst.validateOrderParameters_(order.registry, order.maker, order.verifierTarget, order.verifierSelector, order.verifierExtradata, order.maximumFill, order.listingTime, order.expirationTime, order.salt),
    validateOrderAuthorization: (hash: BytesLike, maker: string, sig: Signature, misc: any) => inst.validateOrderAuthorization_(hash, maker, defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [sig.v, sig.r, sig.s]), misc),
    approveOrderHash: (hash: BytesLike) => inst.approveOrderHash_(hash),
    approveOrder: (order: OrderInterface, inclusion: boolean, misc: any) => inst.approveOrder_(order.registry, order.maker, order.verifierTarget, order.verifierSelector, order.verifierExtradata, order.maximumFill, order.listingTime, order.expirationTime, order.salt, inclusion, misc),
    setOrderFill: (order: OrderInterface, fill: BigNumberish) => inst.setOrderFill_(hashOrder(order), fill),
    excecuteTrade: (order: OrderInterface, sig: Signature, call: CallInterface, counterorder: OrderInterface, countersig: Signature, countercall: CallInterface, metadata: BytesLike) => inst.stateswap_(
      [order.registry, order.maker, order.verifierTarget, order.maximumFill, order.listingTime, order.expirationTime, order.salt, call.target,
      counterorder.registry, counterorder.maker, counterorder.verifierTarget, counterorder.maximumFill, counterorder.listingTime, counterorder.expirationTime, counterorder.salt, countercall.target],
      [order.verifierSelector, counterorder.verifierSelector],
      order.verifierExtradata, call.data, counterorder.verifierExtradata, countercall.data,
      [call.howToCall, countercall.howToCall],
      metadata,
      defaultAbiCoder.encode(['bytes', 'bytes'], [
        defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [sig.v, sig.r, sig.s]),
        defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [countersig.v, countersig.r, countersig.s])
      ])
    ),
    excecuteTradeWith: (order: OrderInterface, sig: Signature, call: CallInterface, counterorder: OrderInterface, countersig: Signature, countercall: CallInterface, metadata: BytesLike, misc: any) => inst.stateswap_(
      [order.registry, order.maker, order.verifierTarget, order.maximumFill, order.listingTime, order.expirationTime, order.salt, call.target,
      counterorder.registry, counterorder.maker, counterorder.verifierTarget, counterorder.maximumFill, counterorder.listingTime, counterorder.expirationTime, counterorder.salt, countercall.target],
      [order.verifierSelector, counterorder.verifierSelector],
      order.verifierExtradata, call.data, counterorder.verifierExtradata, countercall.data,
      [call.howToCall, countercall.howToCall],
      metadata,
      defaultAbiCoder.encode(['bytes', 'bytes'], [
        defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [sig.v, sig.r, sig.s]),
        defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [countersig.v, countersig.r, countersig.s])
      ]),
      misc
    ),
    sign: (order: OrderInterface, account: SignerExtended, chainId: number) => {
      console.log(inst.address)
      const structure = structToSign(order, inst.address, chainId)
      return account._signTypedData(structure.domain, {
        Order: eip712Order.fields
      }, order).then(sigBytes => {
        const sig = parseSig(sigBytes)
        return sig
      })
    }
  }
  return obj
}