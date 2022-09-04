import { Provider, Client, dedupExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'

const cache = cacheExchange({})

export const client = new Client({
    url: 'https://gateway.thegraph.com/api/dcaae7fff38f10cbdefd31245f2a7068/subgraphs/id/0x7859821024e633c5dc8a4fcf86fc52e7720ce525-0',
    exchanges: [dedupExchange, cache, fetchExchange],
})