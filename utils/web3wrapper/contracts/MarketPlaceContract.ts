import {
  marketPlaceContractABI, marketPlaceContractAddress
} from '~/utils/web3wrapper/config'
import BaseContract from '~/utils/web3wrapper/contracts/BaseContract'
import {
  ICancelAuctionInputs,
  ICreateAuctionPayload,
  IGetAuctionInfoInputs,
  IGrantRoleInputs, IHasRoleInputs, IInitializeInputs, IRenounceRole, IReviveAuctionInputs, IRevokeRole, ISetRoyaltyFee
} from '~/utils/web3wrapper/contracts/types'

/**
 * Class of marketplace contract instance
 * @extends BaseContract
 */
export default class MarketPlaceContract extends BaseContract {
  // eslint-disable-next-line no-use-before-define
  private static _instance: MarketPlaceContract

  /**
   * Once create marketplace contract instance
   * @private
   */
  private constructor() {
    if (MarketPlaceContract._instance) {
      throw new Error('Error - use MultiTokenContract.getInstance()')
    }

    super({
      abi: marketPlaceContractABI,
      contractAddress: marketPlaceContractAddress
    })
  }

  /**
   * Return marketplace contract instance. Singleton
   * @return MarketPlaceContract
   */
  public static getInstance(): MarketPlaceContract {
    if (!MarketPlaceContract._instance) {
      MarketPlaceContract._instance = new MarketPlaceContract()
    }
    return MarketPlaceContract._instance
  }

  /**
   * Get auction info. Non-payable
   * @param {string} nftTokenId - token id
   */
  public async getAuctions(nftTokenId: string): Promise<any> {
    return await super.fetchContractData('auctions', [nftTokenId])
  }

  /**
   * Get auction price. Non-payable
   * @param {string} nftTokenId - token id
   */
  public async getAuctionPrice(nftTokenId: string): Promise<any> {
    return await super.fetchContractData('getAuctionPrice', [nftTokenId])
  }

  /**
   * Buy token from auction. Payable
   * @param {string} nftTokenId - token id
   * @param {string} userAddress - fee payer wallet address
   */
  public async closeAuction(nftTokenId: string, userAddress: string): Promise<Record<string, any>> {
    return await super.sendDataToContract('closeAuction', [nftTokenId], userAddress)
  }

  /**
   * Get CEO_ROLE
   */
  public async getCeoRole(): Promise<string> {
    return await super.fetchContractData('CEO_ROLE')
  }

  /**
   * Get CFO_ROLE
   */
  public async getCfoRole(): Promise<string> {
    return await super.fetchContractData('CFO_ROLE')
  }

  /**
   * Get DEFAULT_ADMIN_ROLE
   */
  public async getDefaultAdminRole(): Promise<string> {
    return await super.fetchContractData('DEFAULT_ADMIN_ROLE')
  }

  /**
   * Get TOKEN token id. Non-payable
   */
  public async getTokenId(): Promise<string> {
    return await super.fetchContractData('TOKEN')
  }

  /**
   * Get feeDenominator
   */
  public async getFeeDenominator(): Promise<string> {
    return await super.fetchContractData('feeDenominator')
  }

  /**
   * Get getAuctionInfo
   */
  public async getAuctionInfo(inputs: IGetAuctionInfoInputs): Promise<Record<string, any>[]> {
    const { tokenIds } = inputs
    return await super.fetchContractData('getAuctionInfo', [tokenIds])
  }

  /**
   * Get role admin
   */
  public async getRoleAdmin(role: string): Promise<string> {
    return await super.fetchContractData('getRoleAdmin', [role])
  }

  /**
   * Get hasRole
   */
  public async getHasRole(inputs: IHasRoleInputs): Promise<boolean> {
    const {
      role, account
    } = inputs
    return await super.fetchContractData('hasRole', [role, account])
  }

  /**
   * Get multiToken
   */
  public async multiToken(): Promise<any> {
    return await super.fetchContractData('multiToken')
  }

  /**
   * Get royaltyFee
   */
  public async getRoyaltyFee(): Promise<string> {
    return await super.fetchContractData('royaltyFee')
  }

  /**
   * Get SUPERMINTER_ROLE
   */
  public async getSuperMinterRole(): Promise<string> {
    return await super.fetchContractData('SUPERMINTER_ROLE')
  }

  // ------------- PAYABLE METHODS -------------

  /**
   * Create auction on marketplace. Payable
   * @param {ICreateAuctionPayload} payload
   * @param {string} userAddress - fee payer wallet address
   */
  public async createAuction(payload: ICreateAuctionPayload, userAddress: string): Promise<Record<string, any>> {
    const {
      nftTokenId,
      startPrice,
      endPrice,
      endTime
    } = payload
    return await super.sendDataToContract('createAuction', [nftTokenId, startPrice, endPrice, endTime], userAddress)
  }

  public async cancelAuction(inputs: ICancelAuctionInputs, userAddress: string): Promise<void> {
    const { nftTokenId } = inputs
    return await super.sendDataToContract('cancelAuction', [nftTokenId], userAddress)
  }

  public async grantRole(inputs: IGrantRoleInputs, userAddress: string): Promise<void> {
    const {
      role, account
    } = inputs
    await super.sendDataToContract('grantRole', [role, account], userAddress)
  }

  public async initialize(inputs: IInitializeInputs, userAddress: string): Promise<void> {
    const {
      uri_, firstNftIndex, _mintingFee
    } = inputs
    await super.sendDataToContract('initialize', [uri_, firstNftIndex, _mintingFee], userAddress)
  }

  public async renounceRole(inputs: IRenounceRole, userAddress: string): Promise<void> {
    const {
      role, account
    } = inputs
    await super.sendDataToContract('renounceRole', [role, account], userAddress)
  }

  public async reviveAuction(inputs: IReviveAuctionInputs, userAddress: string): Promise<void> {
    const {
      nftTokenId
    } = inputs
    await super.sendDataToContract('reviveAuction', [nftTokenId], userAddress)
  }

  public async revokeRole(inputs: IRevokeRole, userAddress: string): Promise<void> {
    const {
      role, account
    } = inputs
    await super.sendDataToContract('revokeRole', [role, account], userAddress)
  }

  public async setRoyaltyFee(inputs: ISetRoyaltyFee, userAddress: string): Promise<void> {
    const {
      newRoyaltyFee, newFeeDenominator
    } = inputs
    await super.sendDataToContract('setRoyaltyFee', [newRoyaltyFee, newFeeDenominator], userAddress)
  }
}
