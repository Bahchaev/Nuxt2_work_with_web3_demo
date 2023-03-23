import { testChain } from '~/utils/web3wrapper/config'

/**
 * Add chain to metamask
 */
export const addEthereumChainRequest = {
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: testChain.id,
    chainName: testChain.name,
    nativeCurrency: testChain.nativeCurrency,
    rpcUrls: testChain.rpcUrls
  }]
}

/**
 * Switch current chain in metamask
 */
export const switchEthereumChainRequest = {
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: testChain.id }]
}

/**
 * Get list of wallet accounts
 */
export const getEthAccountsRequest = {
  method: 'eth_accounts'
}

/**
 * Get current wallet chain id
 */
export const getEthChainIdRequest = {
  method: 'eth_chainId'
}

/**
 * Connect to metamask
 */
export const connectMetaMask = {
  method: 'eth_requestAccounts'
}
