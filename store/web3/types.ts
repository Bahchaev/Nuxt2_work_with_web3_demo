import { EventData } from 'web3-eth-contract'

export interface ILog {
  text: string,
  code?: string,
  link?: {
    href: string,
    text: string
  }
}

export interface IWeb3State {
  isConnected: boolean,
  chainId: string,
  userAddress: string,
  balance: string,
  nftTokenId: string,
  auctions: EventData[],
  inventory: EventData[],
  multiTokenContract: any,
  logs: ILog[],
  tokenBuyerAddress: string,
  tokenSellerAddress: string
}
