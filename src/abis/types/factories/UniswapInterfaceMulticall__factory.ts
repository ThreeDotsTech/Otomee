/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  UniswapInterfaceMulticall,
  UniswapInterfaceMulticallInterface,
} from "../UniswapInterfaceMulticall";

const _abi = [
  {
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "getEthBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "gasLimit",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct UniswapInterfaceMulticall.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "gasUsed",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        internalType: "struct UniswapInterfaceMulticall.Result[]",
        name: "returnData",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class UniswapInterfaceMulticall__factory {
  static readonly abi = _abi;
  static createInterface(): UniswapInterfaceMulticallInterface {
    return new utils.Interface(_abi) as UniswapInterfaceMulticallInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapInterfaceMulticall {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as UniswapInterfaceMulticall;
  }
}