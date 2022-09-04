// simplified from https://github.com/ethereum/EIPs/blob/master/assets/eip-712/Example.js

import { eip712Domain } from 'constants/EIP712'
import { defaultAbiCoder, keccak256 } from 'ethers/lib/utils'

function encodeType (name:string, fields:{name:string,type:string}[]) {
  const result = `${name}(${fields.map(({ name, type }) => `${type} ${name}`).join(',')})`
  return result
  
}

function typeHash(name:string, fields:{name:string,type:string}[]) {
    const keccakString = keccak256(encodeType(name, fields))
    return Buffer.from(keccakString.slice('0x'.length),'hex')
}

function encodeData (name:string, fields:{name:string,type:string}[], data:any) {
  const encTypes = []
  const encValues = []

  // Add typehash
  encTypes.push('bytes32')
  encValues.push(typeHash(name, fields))

  // Add field contents
  for (const field of fields) {
    let value = data[field.name]
    if (field.type === 'string' || field.type === 'bytes') {
      encTypes.push('bytes32')
      value = Buffer.from(keccak256(value).slice('0x'.length),'hex')
      encValues.push(value)
    } else {
      encTypes.push(field.type)
      encValues.push(value)
    }
  }

  return defaultAbiCoder.decode(encTypes,encValues)
}

export function structHash(name:string, fields:{name:string,type:string}[], data:any) {
    const keccakString = keccak256(encodeData(name, fields, data))
    return Buffer.from(keccakString.slice('0x'.length),'hex')
}


export function signHash (typedData:any) {
  return keccak256(
    Buffer.concat([
      Buffer.from('1901', 'hex'),
      structHash(eip712Domain.name, eip712Domain.fields, typedData.domain),
      structHash(typedData.name, typedData.fields, typedData.data)
    ])
  )
}


