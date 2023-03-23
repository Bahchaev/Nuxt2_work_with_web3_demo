import type { MutationTree } from 'vuex'
import { Contract, EventData } from 'web3-eth-contract'

import { ILog, IWeb3State } from '~/store/web3/types'

const mutations: MutationTree<IWeb3State> = {
  SET_MULTI_TOKEN_CONTRACT: (state, payload: Contract) => {
    state.multiTokenContract = payload
  },

  SET_IS_CONNECTED: (state, payload: boolean) => {
    state.isConnected = payload
  },

  SET_CHAIN_ID: (state, payload: string) => {
    state.chainId = payload
  },

  SET_USER_ADDRESS: (state, payload: string) => {
    state.userAddress = payload
  },

  SET_BALANCE: (state, payload: string) => {
    state.balance = payload
  },

  SET_NFT_TOKEN_ID: (state, payload: string) => {
    state.nftTokenId = payload
  },

  SET_AUCTIONS: (state, payload: EventData[]) => {
    state.auctions = payload
  },

  ADD_AUCTIONS: (state, payload: EventData) => {
    state.auctions = [...state.auctions, payload]
  },

  DELETE_AUCTION: (state, payload: EventData) => {
    state.auctions = state.auctions.filter((auc:EventData) => auc.returnValues.nftTokenId !== payload.returnValues.nftTokenId)
  },

  SET_INVENTORY: (state, payload: EventData[]) => {
    state.inventory = payload
  },

  ADD_NFT_TO_INVENTORY: (state, payload: EventData) => {
    state.inventory = [...state.inventory, payload]
  },

  DELETE_NFT_FROM_INVENTORY: (state, payload: EventData) => {
    state.inventory = state.inventory.filter((nft:EventData) => nft.returnValues.tokenId !== payload.returnValues.tokenId)
  },

  ADD_LOG: (state, payload: ILog) => {
    state.logs.push(payload)
  },

  SET_TOKEN_BUYER_ADDRESS: (state, payload: string) => {
    localStorage.setItem('tokenBuyerAddress', payload)
    state.tokenBuyerAddress = payload
  },

  SET_TOKEN_SELLER_ADDRESS: (state, payload: string) => {
    localStorage.setItem('tokenSellerAddress', payload)
    state.tokenSellerAddress = payload
  }
}

export default mutations
