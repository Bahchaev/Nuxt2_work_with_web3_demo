import { testChain } from '~/utils/web3wrapper/config'
import { addLog, getLogs } from '~/utils/web3wrapper/logs/logs'
import {
  addEthereumChainRequest, connectMetaMask,
  getEthAccountsRequest, getEthChainIdRequest,
  switchEthereumChainRequest
} from '~/utils/web3wrapper/walletConnection/providerRequests'

declare global {
  interface Window {
    ethereum?: any
    onNuxtReady?: any
  }
}

let ethereum: any
let userAddress = ''
let chainId = ''

/**
 * Check - is current chain is testChain
 */
function getIsRightChain():boolean {
  return chainId === testChain.id
}

/**
 * Add chain to user's metamask app
 */
async function addChain(): Promise<void> {
  addLog({ text: `add chain ${testChain.id}: ${testChain.name}` })
  await ethereum.request(addEthereumChainRequest)
}

/**
 * Switch current chain in metamask to testChain
 */
async function switchChain(): Promise<void> {
  addLog({ text: `switch to chain ${testChain.id}: ${testChain.name}` })
  await ethereum.request(switchEthereumChainRequest)
  chainId = await ethereum.request(getEthChainIdRequest)
}

/**
 * Handle chain change event callback function
 * @param {string} _chainId - switch target chain id
 */
function handleChainChanged(_chainId: string): void {
  chainId = _chainId
  if (getIsRightChain()) {
    window.location.reload()
  }
}

/**
 * Handle account change event callback function
 * @param {string[]} accounts - switch target accounts
 */
async function handleAccountChanged(accounts: string[]): Promise<void> {
  userAddress = accounts[0] || ''
  if (userAddress) {
    window.location.reload()
  }
}

/**
 * Subscribe wallet events
 */
const setWalletEvents = async (): Promise<void> => {
  // unsubscribe to metamask events
  ethereum.removeListener('chainChanged', handleChainChanged)
  ethereum.removeListener('accountsChanged', handleAccountChanged)

  // subscribe to metamask events
  addLog({ text: 'set wallet event: onChainChanged' })
  ethereum.on('chainChanged', handleChainChanged)
  addLog({ text: 'set wallet event: onAccountsChanged' })
  ethereum.on('accountsChanged', handleAccountChanged)
}

/**
 * Get init state of wallet
 */
async function getInitState(): Promise<void> {
  try {
    // check chain
    if (!getIsRightChain()) {
      await addChain()
      await switchChain()
    }

    await setWalletEvents()
  } catch (e:any) {
    await addLog({ code: e.code, text: e.message })
    console.error(e)
  }
}

/**
 * Check metamask connection status and get wallet state if it's true
 */
export async function initConnection(): Promise<string> {
  ethereum = window.ethereum
  const accounts = await ethereum.request(getEthAccountsRequest)
  addLog({ text: 'request accounts' })
  userAddress = accounts[0] || ''

  if (userAddress) {
    addLog({ text: 'request chainId' })
    chainId = await ethereum.request(getEthChainIdRequest)
    await getInitState()
    return userAddress
  }

  return ''
}

/**
 * Handle wallet connect
 */
export async function connectWallet(): Promise<string> {
  await ethereum.request(connectMetaMask)
  return await initConnection()
}
