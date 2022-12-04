import { eip712Order } from "constants/EIP712";
import { OrderInterface } from "stateswap/orders/types";
import { signHash, structHash } from "./eip712";

export const hashOrder = (order: OrderInterface) => {
  return structHash(eip712Order.name, eip712Order.fields, order)
}

export const structToSign = (order: OrderInterface, exchange: string, chainId: number) => {
  return {
    name: eip712Order.name,
    fields: eip712Order.fields,
    domain: {
      name: 'Stateswap Exchange',
      version: '1.0',
      chainId: chainId,
      verifyingContract: exchange
    },
    data: order
  }
}

export const hashToSign = (order: OrderInterface, exchange: string, chainId: number) => {
  return signHash(structToSign(order, exchange, chainId))
}

export const parseSig = (bytes: string) => {
  bytes = bytes.substring(2)
  const r = '0x' + bytes.slice(0, 64)
  const s = '0x' + bytes.slice(64, 128)
  const v = parseInt('0x' + bytes.slice(128, 130), 16)
  return { v, r, s }
}

