import gql from "graphql-tag";

export const GET_ERC721_TOKENS_FROM_A_CONTRACT = gql`
query($address: String!,$first: Int!,$skip: Int!){
  erc721Tokens(first:$first,skip:$skip,where:{contract:$address}){ 
      id
      identifier
    }
  }
`
export const GET_ERC1155_TOKENS_FROM_A_CONTRACT = gql`
query($address: String!,$first: Int!,$skip: Int!){
  erc1155Tokens(first:$first,skip:$skip,where:{contract:$address}){ 
      id
    identifier
    totalSupply{
      id
      valueExact
    }
  }
  }
`
export const GET_ERC721_TOKENS_FROM_AN_ACCOUNT = gql`
query($address: String!,$first: Int!,$skip: Int!){
    erc721Tokens(first:$first,skip:$skip, where:{owner:$address}) {
    id
    identifier
    }
}
`
export const GET_ERC1155_TOKENS_FROM_AN_ACCOUNT = gql`
query($address: String!,$first: Int!,$skip: Int!){
  erc1155Balances(first:$first,skip:$skip,where:{account:$address}){
    id
    token{
      id
      identifier
    }
    valueExact
  }
}
`
export const GET_EXACT_ERC721_TOKEN = gql`
query($id: String!){
    erc721Token(id:$id){
        id
        identifier
        owner{
          id
        }
        approval{
          id
        }
        uri
        transfers{
          id
          transaction{
            id
            blockNumber
            timestamp
            events{
              id
            }
          }
          timestamp
          from{
            id
          }
          to{
            id
          }
          
        }
      }
}
`

export const GET_EXACT_ERC1155_TOKEN = gql`
query($id: String!){
  erc1155Token(id:$id) {
    id
    identifier
    totalSupply{
      id
      valueExact
    }
    transfers(first:5){
          id
          transaction{
            id
            blockNumber
            timestamp
            events{
              id
            }
          }
          timestamp
          from{
            id
          }
          to{
            id
          }
      		valueExact 
        }
  }
}
`

export const GET_LATEST_ERC721_TRANSFERS = gql`
query($hola:String){
  erc721Transfers(orderBy: timestamp, first: 1000, orderDirection: asc) {
    id
    timestamp
    contract{
      id
    }
  }
}`

export const GET_LATEST_ERC1155_TRANSFERS = gql`
query($hola1:String){
  erc1155Transfers(orderBy:timestamp, first:1000, orderDirection: desc){
   id
   timestamp
   contract{
     id
   }
 }
 }`

export const GET_NUMBER_OF_ERC721_TRANSFERS_TO_ADDRESS = gql`
 query($from:String,$to:String){
    erc721Transfers(where:{from:$from,to:$to}){
      id
    }
  }
 `

export const GET_NUMBER_OF_ERC1155_TRANSFERS_TO_ADDRESS = gql`
 query($from:String,$to:String){
    erc1155Transfers(where:{from:$from,to:$to}){
      id
    }
  }
 `