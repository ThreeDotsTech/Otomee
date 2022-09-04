import useENSAddress from 'hooks/useENSAddress'
import { useActiveWeb3React } from 'hooks/web3'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { isAddress } from 'utils'


let searchableAddress = ''

const SearchBar = () => {
    const history = useHistory()

    const [query, setQuery] = useState("")

    const context = useActiveWeb3React()

    const { loading, address } = useENSAddress(query)
    const [triggerSearch, settriggerSearch] = useState(false)




    useEffect(() => {
        if (!isAddress(query) && query.toLowerCase().endsWith('.eth')) {
            console.log(query + ' is an ENS domain.')
            address && (searchableAddress = address)
            console.log(address)
            if (triggerSearch && !loading) {
                console.log('Search triggered, loading done')
                context.library?.getCode(searchableAddress).then(function (code: string) {
                    if (code == '0x') {

                        history.replace('/profile/' + searchableAddress)
                    } else {//Todo: check multisig wallets
                        history.replace('/collection/' + searchableAddress)
                    }
                })
                settriggerSearch(false)
            }
        } else {
            searchableAddress = query.toLowerCase()
        }
    }, [query, address, loading, triggerSearch])



    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            event.stopPropagation();
        }
        switch (event.key) {
            case 'Enter':
                settriggerSearch(true)
                console.log('Triggering search:' + triggerSearch)
                break;
            default:
                break;
        }
    };



    return (
        <div className="w-full lg:px-6 md:w-3/4 md:px-12">
            <div className="relative text-gray-600">
                <input id="docsearch"
                    className="border border-gray-300 focus:border-gray-600 rounded-lg bg-white focus:outline-none py-2 pr-4 pl-10 block w-full leading-normal relative align-top"
                    type="text" placeholder="" role="combobox"
                    aria-autocomplete="list" aria-expanded="false" aria-label="search input"
                    aria-owns="algolia-autocomplete-listbox-0" dir="auto"
                    onChange={event => setQuery(event.target.value)}
                    onKeyUp={handleKeyDown}
                />

                <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
                    <svg className="fill-current pointer-events-none  w-4 h-4" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20">
                        <path
                            d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z">
                        </path>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default SearchBar
