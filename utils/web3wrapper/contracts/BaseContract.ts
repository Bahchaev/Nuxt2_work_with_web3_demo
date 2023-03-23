import Web3 from 'web3'
import { Contract, EventData } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import { addLog } from '~/utils/web3wrapper/logs/logs'

interface IBaseContractConstructorPayload {
  abi: AbiItem[],
  contractAddress: string
}

/**
 * Class of base contract instance
 */
export default class BaseContract {
  contract: Contract
  web3: Web3

  /**
   * Create base contract instance
   * @param {IBaseContractConstructorPayload} payload
   * @return BaseContract
   */
  constructor(payload:IBaseContractConstructorPayload) {
    const { ethereum } = window
    this.web3 = new Web3(ethereum)
    this.contract = new this.web3.eth.Contract(payload.abi, payload.contractAddress)
  }

  /**
   * Get number of last block in blockchain
   */
  async getLatestBlock():Promise<number> {
    return await this.web3.eth.getBlockNumber()
  }

  /**
   * Get array of contract events for last 2047 blocks.
   * Set 'scanBlockAmount' for change amount of scanned blocks
   * @param {string} eventName - name of event
   */
  async getPastEvents(eventName: string): Promise<EventData[]> {
    const scanBlockAmount = 2047
    const latestBlock = await this.getLatestBlock()
    let fromBlock = latestBlock
    const events = []
    await addLog({ text: `get all past contract events: ${eventName}` })

    while (fromBlock > latestBlock - scanBlockAmount) {
      const config = {
        filter: {},
        fromBlock: fromBlock - 2047,
        toBlock: fromBlock
      }
      // eslint-disable-next-line no-await-in-loop
      const createdAuctions = await this.contract.getPastEvents(eventName, config)
      events.push(...createdAuctions)
      fromBlock -= 2047
    }

    return events
  }

  /**
   * Subscribe to contract event
   * @param {string} eventName - name of event
   * @param callback - function, which will be called for every event
   */
  subscribeEvent(eventName: string, callback: (event: EventData) => void): void {
    this.contract.events[eventName]({ fromBlock: 'latest' })
      .on('connected', async (subscriptionId: string) => {
        await addLog({ text: `subscribe contract events ${eventName}, subscription id: ${subscriptionId}` })
      })
      .on('data', (event: EventData) => {
        callback(event)
      })
      .on('error', async (error:any, receipt:any) => {
        let text = `subscription error of ${eventName} event: "${error}"`
        if (receipt) {
          text += `, subscription receipt of ${eventName} event: "${receipt}"`
        }
        addLog({
          code: 'subscription',
          text
        })
      })
  }

  /**
   * Get information from contract. Non-payable
   * @param {string} method - name of contract method (watch contract ABI)
   * @param {string[]} params - array of contract method params (watch contract ABI)
   */
  async fetchContractData(method: string, params?: Array<string | string[]>):Promise<any> {
    try {
      let logText = `fetch contract data, method: ${method}`
      if (params) {
        logText += `, params: ${params}`
      }
      addLog({ text: logText })
      return await this.contract.methods[method]
        .apply(this, params)
        .call()
    } catch (e) {
      addLog({
        code: 'fetch contract data error',
        text: JSON.stringify(e)
      })
      throw e
    }
  }

  /**
   * Send transaction to contract. Payable
   * @param {string} method - name of contract method (watch contract ABI)
   * @param {string[]} params - array of contract method params (watch contract ABI)
   * @param {string} userAddress - fee payer wallet address
   */
  async sendDataToContract(method: string, params: Array<string | string[]>, userAddress: string):Promise<any> {
    try {
      return await this.contract.methods[method]
        .apply(this, params)
        .send({
          from: userAddress
        })
    } catch (e) {
      addLog({
        code: 'send data to contract error',
        text: JSON.stringify(e)
      })
      throw e
    }
  }
}
