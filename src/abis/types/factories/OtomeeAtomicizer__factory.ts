/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  OtomeeAtomicizer,
  OtomeeAtomicizerInterface,
} from "../OtomeeAtomicizer";

const _abi = [
  {
    constant: false,
    inputs: [
      {
        name: "addrs",
        type: "address[]",
      },
      {
        name: "values",
        type: "uint256[]",
      },
      {
        name: "calldataLengths",
        type: "uint256[]",
      },
      {
        name: "calldatas",
        type: "bytes",
      },
    ],
    name: "atomicize",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class OtomeeAtomicizer__factory {
  static readonly abi = _abi;
  static createInterface(): OtomeeAtomicizerInterface {
    return new utils.Interface(_abi) as OtomeeAtomicizerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OtomeeAtomicizer {
    return new Contract(address, _abi, signerOrProvider) as OtomeeAtomicizer;
  }
}
