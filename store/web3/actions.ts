import type { ActionTree } from 'vuex'
import { Contract } from 'web3-eth-contract'

import { ILog, IWeb3State } from '~/store/web3/types'

const actions: ActionTree<IWeb3State, IWeb3State> = {
  setMultiTokenContract({ commit }, payload: Contract):void {
    commit('SET_MULTI_TOKEN_CONTRACT', payload)
  },

  setIsConnected({ commit }, payload: boolean): void {
    commit('SET_IS_CONNECTED', payload)
  },

  setChainId({ commit }, payload: string): void {
    commit('SET_CHAIN_ID', payload)
  },

  setUserAddress({ commit }, payload: string): void {
    commit('SET_USER_ADDRESS', payload)
  },

  setBalance({ commit }, payload: string): void {
    commit('SET_BALANCE', payload)
  },

  setNntTokenId({ commit }, payload: string): void {
    commit('SET_NFT_TOKEN_ID', payload)
  },

  setAuctions({ commit }, payload: any[]): void {
    commit('SET_AUCTIONS', payload)
  },

  addAuctions({ commit, getters, dispatch }, payload: any):void {
    const auctionTokenId = payload.returnValues?.nftTokenId || payload.returnValues?.tokenId || ''
    const inventory = getters('getInventory')
    const nft = inventory.find((event:Record<string, any>) => {
      const eventTokenId = event.returnValues?.nftTokenId || event.returnValues?.tokenId
      return auctionTokenId === eventTokenId
    })
    if (nft) {
      dispatch('deleteNFTFromInventory', nft)
    }
    commit('ADD_AUCTIONS', payload)
  },

  deleteAuction({ commit }, payload: any):void {
    commit('DELETE_AUCTION', payload)
  },

  setInventory({ commit }, payload: any[]): void {
    commit('SET_INVENTORY', payload)
  },

  addNFTToInventory({ commit, getters, dispatch }, payload: any):void {
    const inventoryTokenId = payload.returnValues?.nftTokenId || payload.returnValues?.tokenId || ''
    const auctions = getters('getAuctions')
    const nft = auctions.find((event:Record<string, any>) => {
      const eventTokenId = event.returnValues?.nftTokenId || event.returnValues?.tokenId
      return inventoryTokenId === eventTokenId
    })
    if (nft) {
      dispatch('deleteAuction', nft)
    }
    commit('ADD_NFT_TO_INVENTORY', payload)
  },

  deleteNFTFromInventory({ commit }, payload: any):void {
    commit('DELETE_NFT_FROM_INVENTORY', payload)
  },

  addLog({ commit }, payload: ILog): void {
    commit('ADD_LOG', payload)
  },

  setTokenBuyerAddress({ commit }, payload: string): void {
    commit('SET_TOKEN_BUYER_ADDRESS', payload)
  },

  setTokenSellerAddress({ commit }, payload: string): void {
    commit('SET_TOKEN_SELLER_ADDRESS', payload)
  }
}

export default actions
