
import { Erc721 } from "abis/types/Erc721";
import { STATESWAP_VERIFIER_ADDRESSES } from "constants/addresses";
import { BigNumber } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { CallInterface } from "stateswap/orders/types";
import { encodeFunctionSignature } from "utils/encoders";

export const Selectors = {
    util: {
        any: encodeFunctionSignature(
            'any(bytes,address[7],uint8[2],uint256[6],bytes,bytes)'
        ),
        receiveETH: encodeFunctionSignature("receiveETH(bytes,address[7],uint8,uint256[6],bytes)"
        ),
        split: encodeFunctionSignature(
            "split(bytes,address[7],uint8[2],uint256[6],bytes,bytes)"
        ),
        OR: encodeFunctionSignature(
            "or(bytes,address[7],uint8[2],uint256[6],bytes,bytes)"
        )
    },
    erc721: {
        transferExact: encodeFunctionSignature(
            "transferERC721Exact(bytes,address[7],uint8,uint256[6],bytes)"
        )
    },
    erc20: {
        transferExact: encodeFunctionSignature(
            "transferERC20Exact(bytes,address[7],uint8,uint256[6],bytes)"
        )
    }
}

export const Call = {
    erc721: {
        transferFrom: function transferFrom(from: string, to: string, tokenId: string, erc721Contract: Erc721, erc721cAddress: string): CallInterface {

            const callData = erc721Contract.interface.encodeFunctionData("transferFrom", [from.toLowerCase(), to.toLowerCase(), tokenId.toLowerCase()])
            return {
                data: callData,
                howToCall: 0,
                target: erc721cAddress.toLowerCase()
            }
        }
    },
    utils: {
        empty: function empty(chainId: number): CallInterface {
            const call: CallInterface = {
                target: STATESWAP_VERIFIER_ADDRESSES[chainId].toLowerCase(),
                howToCall: 0,
                data: encodeFunctionSignature('test()')
            }
            return call
        }
    }
}

export const VerifierCalls = {
    ERC20_Transfer: function ERC20_Transfer(
        erc20Address: string,
        erc20Amount: BigNumber): [selectorCall: string, extradataCall: string] {
        const selector = Selectors.erc20.transferExact
        const extradata = defaultAbiCoder.encode(
            ["address", "uint256"],
            [erc20Address.toLowerCase(), erc20Amount]
        );

        return [selector, extradata]
    },
    receive_ETH: function receive_ETH(amount: BigNumber): [selectorCall: string, extradataCall: string] {
        const selector = Selectors.util.receiveETH
        const extradata = defaultAbiCoder.encode(
            ["uint256"],
            [amount]
        );
        return [selector, extradata]
    },
    ERC721_Transfer: function ERC721_Transfer(
        erc721Address: string,
        tokenId: string
    ): [selectorCall: string, extradataCall: string] {
        const selectorCall = Selectors.erc721.transferExact;

        const extradataCall = defaultAbiCoder.encode(
            ["address", "uint256"],
            [erc721Address.toLowerCase(), BigNumber.from(tokenId.toLowerCase())]
        );
        return [selectorCall, extradataCall]
    }
}

export const Extradata = {
    util: {
        any: function any() {
            return '0x'
        },
        split: function split(
            {
                addressCall,
                addressCountercall,
                selectorCall,
                selectorCountercall,
                extradataCall,
                extradataCountercall
            }:
                {
                    addressCall: string,
                    addressCountercall: string,
                    selectorCall: string,
                    selectorCountercall: string,
                    extradataCall: string,
                    extradataCountercall: string
                }) {
            return defaultAbiCoder.encode(
                ["address[2]", "bytes4[2]", "bytes", "bytes"],
                [
                    [addressCall.toLowerCase(), addressCountercall.toLowerCase()],
                    [selectorCall, selectorCountercall],
                    extradataCall,
                    extradataCountercall,
                ]
            )
        },
        or: function or({
            addresses,
            selectors,
            extradatas,
        }:
            {
                addresses: string[],
                selectors: string[],
                extradatas: string[],
            }) {
            if (addresses.length != extradatas.length) throw new Error('Different number of verifier addresses and extradatas');
            if (addresses.length != selectors.length) throw new Error('Different number of verifier addresses and selectors');

            const extradataLengths: number[] = []
            let _extradatas = ""

            //Addresses to lowercase
            for (let i = 0; i < addresses.length; i++) {
                addresses[i] = addresses[i].toLowerCase()
            }

            for (let i = 0; i < extradatas.length; i++) {
                //Create extradata's lenghts vector
                extradataLengths.push((extradatas[i].length - 2) / 2)
                //Create extradata string
                if (i == 0) {
                    _extradatas = _extradatas.concat(extradatas[i])
                } else {
                    _extradatas = _extradatas.concat(extradatas[i].slice(2))
                }
            }

            return defaultAbiCoder.encode(
                ['address[]', 'bytes4[]', 'uint256[]', 'bytes'],
                [addresses,
                    selectors,
                    extradataLengths,
                    _extradatas]
            )
        }
    }
}
