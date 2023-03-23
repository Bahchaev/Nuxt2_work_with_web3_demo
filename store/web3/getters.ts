import type { GetterTree } from 'vuex'
import { EventData } from 'web3-eth-contract'

import { ILog, IWeb3State } from '~/store/web3/types'
import { testChain } from '~/utils/web3wrapper/config'

const getters: GetterTree<IWeb3State, IWeb3State> = {
  getIsMetamaskConnected: (state): boolean => !!state.userAddress,
  getIsConnected: (state): boolean => state.isConnected,
  getChainId: (state): string => state.chainId,
  getIsRightChain: (state):boolean => state.chainId === testChain.id,
  getUserAddress: (state): string => state.userAddress,
  getBalance: (state): string => state.balance,
  getNftTokenId: (state): string => state.nftTokenId,
  getAuctions: (state): EventData[] => state.auctions,
  getInventory: (state): EventData[] => state.inventory,
  getLogs: (state): ILog[] => state.logs,
  getTokenBuyerAddress: (state): string => state.tokenBuyerAddress,
  getTokenSellerAddress: (state): string => state.tokenSellerAddress
}

export default getters
