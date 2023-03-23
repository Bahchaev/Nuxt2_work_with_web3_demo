import BigNumber from 'bignumber.js'
import { EventData } from 'web3-eth-contract'

import { marketPlaceContractAddress } from '~/utils/web3wrapper/config'
import MarketPlaceContract from '~/utils/web3wrapper/contracts/MarketPlaceContract'
import MultiTokenContract from '~/utils/web3wrapper/contracts/MultiTokenContract'
import { IPublishNFTPayload } from '~/utils/web3wrapper/contracts/types'

/**
 * Check filteredEvents and delete all elements, which are in searchEvents,
 * has same token id and has less block number
 * @param {EventData[]} filteredEvents - array of events, which should be filtered
 * @param {EventData[]} searchEvents - array of events for search
 * @return filtered array of events
 */
export function filterOldEvents(filteredEvents:EventData[], searchEvents:EventData[]):EventData[] {
  return filteredEvents.filter((filterEvent:Record<string, any>) => {
    const oldAuction = searchEvents.find((findEvent:Record<string, any>) => {
      const filterTokenId = filterEvent.returnValues.nftTokenId || filterEvent.returnValues.tokenId
      const findTokenId = findEvent.returnValues.nftTokenId || findEvent.returnValues.tokenId
      return filterTokenId === findTokenId && filterEvent.blockNumber < findEvent.blockNumber
    })
    return !oldAuction
  })
}

/**
 * Prepare payloand and publish NFT on marketplace
 * @param {IPublishNFTPayload} payload
 * @param {string} userAddress - fee payer wallet address
 */
export async function publishNFT(payload: IPublishNFTPayload, userAddress:string):Promise<Record<string, any>> {
  try {
    const createAuctionPayload = {
      nftTokenId: payload.nftTokenId,
      startPrice: new BigNumber(payload.startPrice).shiftedBy(18).toFixed(),
      endPrice: new BigNumber(payload.endPrice).shiftedBy(18).toFixed(),
      endTime: (Date.now() / 1000 + (60 * 60)).toFixed(0)
    }
    const multiTokenContract = MultiTokenContract.getInstance()
    await multiTokenContract.setApprovalForAll(userAddress, marketPlaceContractAddress)
    const marketPlaceContract = MarketPlaceContract.getInstance()
    return await marketPlaceContract.createAuction(createAuctionPayload, userAddress)
  } catch (e: any) {
    console.log(e)
    throw e
  }
}
