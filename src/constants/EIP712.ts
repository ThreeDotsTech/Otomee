export const eip712Order = {
    name: 'Order',
    fields: [
      { name: 'registry', type: 'address' },
      { name: 'maker', type: 'address' },
      { name: 'staticTarget', type: 'address' },
      { name: 'staticSelector', type: 'bytes4' },
      { name: 'staticExtradata', type: 'bytes' },
      { name: 'maximumFill', type: 'uint256' },
      { name: 'listingTime', type: 'uint256' },
      { name: 'expirationTime', type: 'uint256' },
      { name: 'salt', type: 'uint256' }
    ]
  }

export const eip712Domain = {
    name: 'EIP712Domain',
    fields: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
  }

  