import { IWeb3State } from '~/store/web3/types'

export const initState = (): IWeb3State => ({
  isConnected: false,
  chainId: '',
  userAddress: '',
  balance: '-',
  nftTokenId: '',
  auctions: [],
  inventory: [],
  multiTokenContract: null,
  logs: [],
  tokenBuyerAddress: '',
  tokenSellerAddress: ''
})

export default initState
