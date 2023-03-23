import { AbiItem } from 'web3-utils'
import * as MarketPlace from './abi/MarketPlace.json'
import * as MultiToken from './abi/MultiToken.json'

/**
 * contract abi
 */
export const multiTokenContractABI = MultiToken.abi as AbiItem[]
export const marketPlaceContractABI = MarketPlace.abi as AbiItem[]

/**
 * contract addresses
 */
export const multiTokenContractAddress = '0x22C8e128bbeB362EdaFDC84812f26873aA5979B2'
export const marketPlaceContractAddress = '0x0eF00b3dB02F848614A5D8d02adC04DFb0AAE5DC'

/**
 * configuration of chain
 */
export const testChain = {
  id: '0xa869',
  name: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc']
}

/**
 * token TOKEN info
 */
export const TOKENInfo = {
  symbol: 'TOKEN',
  decimals: '18'
}
