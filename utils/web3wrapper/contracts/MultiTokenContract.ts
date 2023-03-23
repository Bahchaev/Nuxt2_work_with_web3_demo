import BigNumber from 'bignumber.js'

import { multiTokenContractABI, multiTokenContractAddress, TOKENInfo } from '~/utils/web3wrapper/config'
import BaseContract from '~/utils/web3wrapper/contracts/BaseContract'
import {
  IChangeAdminInputs,
  IChangeBeneficiaryInputs,
  IChangeCreationTimeInputs,
  IGovernorMintNFTInputs,
  IGrantRoleInputs,
  IHasRoleInputs,
  IInitializeInputs,
  IIsFullBenefitInputs,
  IIsRetractedInputs,
  IMetadataInputs,
  IMintFTInputs,
  IMintNFTPayload,
  IOwnerOf,
  IRenounceRole,
  IRevokeRole,
  ISafeBatchTransferFrom,
  ISafeTransferFromPayload,
  ISetErrata,
  ISetFullBenefitFlag,
  ISetMintingFee,
  ISetRetractedFlag,
  ISetSoldFlag,
  ITotalSupplyInputs, IUnsetFullBenefitFlag, IUnsetRetractedFlag, IUri, IWithdrawBalance
} from '~/utils/web3wrapper/contracts/types'

/**
 * Class of multi-token contract instance
 * @extends BaseContract
 */
export default class MultiTokenContract extends BaseContract {
  // eslint-disable-next-line no-use-before-define
  private static _instance: MultiTokenContract
  balance = ''
  tokenId = ''
  decimals = ''
  symbol = ''

  /**
   * Once create multi-token contract instance
   * @private
   */
  private constructor() {
    if (MultiTokenContract._instance) {
      throw new Error('Error - use MultiTokenContract.getInstance()')
    }

    super({
      abi: multiTokenContractABI,
      contractAddress: multiTokenContractAddress
    })
  }

  /**
   * Return multi-token contract instance. Singleton
   * @return MultiTokenContract
   */
  public static getInstance(): MultiTokenContract {
    if (!MultiTokenContract._instance) {
      MultiTokenContract._instance = new MultiTokenContract()
    }
    return MultiTokenContract._instance
  }

  /**
   * Get TOKEN token data. Non-payable
   */
  public async getAnonData(): Promise<void> {
    this.tokenId = await this.getTokenId()
    this.decimals = TOKENInfo.decimals
    this.symbol = TOKENInfo.symbol
  }

  /**
   * Get TOKEN token id. Non-payable
   */
  public async getTokenId(): Promise<string> {
    return await super.fetchContractData('TOKEN')
  }

  /**
   * Get user TOKEN balance. Non-payable
   * @param accountAddress - wallet account address
   */
  public async getBalance(accountAddress:string): Promise<string> {
    const balance = await super.fetchContractData('balanceOf', [accountAddress, this.tokenId])
    this.balance = new BigNumber(balance).shiftedBy(-this.decimals).toFixed()
    return this.balance
  }

  /**
   * Check for approval status from one address to another. Non-payable
   * @param {string} from - account/contract address
   * @param {string} to - account/contract address
   */
  public async checkIsApprovalForAll(from:string, to:string):Promise<boolean> {
    return await super.fetchContractData('isApprovedForAll', [from, to])
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
   * Get COO_ROLE
   */
  public async getCooRole(): Promise<string> {
    return await super.fetchContractData('COO_ROLE')
  }

  /**
   * Get DEFAULT_ADMIN_ROLE
   */
  public async getDefaultAdminRole():Promise<string> {
    return await super.fetchContractData('DEFAULT_ADMIN_ROLE')
  }

  /**
   * Get MARKETPLACE_ROLE
   */
  public async getMarketPlaceRole():Promise<string> {
    return await super.fetchContractData('MARKETPLACE_ROLE')
  }

  /**
   * Get SUPERADMIN_ROLE
   */
  public async getSuperAdminRole():Promise<string> {
    return await super.fetchContractData('SUPERADMIN_ROLE')
  }

  /**
   * Get SUPERMINTER_ROLE
   */
  public async getSuperMinterRole():Promise<string> {
    return await super.fetchContractData('SUPERMINTER_ROLE')
  }

  /**
   * Get adminOf
   */
  public async getAdminOf(address: string):Promise<string> {
    return await super.fetchContractData('adminOf', [address])
  }

  /**
   * Get balanceOfBatch
   */
  public async getBalanceOfBatch(addresses: string[], ids: string[]):Promise<string> {
    return await super.fetchContractData('balanceOfBatch', [addresses, ids])
  }

  /**
   * Get beneficiaryOf
   */
  public async getBeneficiaryOf(address: string):Promise<string> {
    return await super.fetchContractData('beneficiaryOf', [address])
  }

  /**
   * Get exists
   */
  public async getExists(id: string):Promise<string> {
    return await super.fetchContractData('exists', [id])
  }

  /**
   * Get role admin
   */
  public async getRoleAdmin(role: string):Promise<string> {
    return await super.fetchContractData('getRoleAdmin', [role])
  }

  /**
   * Get hasFirstSale
   */
  public async getHasFirstSale(nftTokenId: string):Promise<boolean> {
    return await super.fetchContractData('hasFirstSale', [nftTokenId])
  }

  /**
   * Get hasRole
   */
  public async getHasRole(inputs: IHasRoleInputs):Promise<boolean> {
    const {
      role, account
    } = inputs
    return await super.fetchContractData('hasRole', [role, account])
  }

  /**
   * Get isFullBenefit
   */
  public async getIsFullBenefit(inputs: IIsFullBenefitInputs):Promise<boolean> {
    const {
      nftTokenId
    } = inputs
    return await super.fetchContractData('isFullBenefit', [nftTokenId])
  }

  /**
   * Get isRetracted
   */
  public async getIsRetracted(inputs: IIsRetractedInputs):Promise<boolean> {
    const {
      nftTokenId
    } = inputs
    return await super.fetchContractData('isRetracted', [nftTokenId])
  }

  /**
   * Get metadata
   */
  public async getMetadata(inputs: IMetadataInputs):Promise<Record<string, any>> {
    const {
      id
    } = inputs
    return await super.fetchContractData('metadata', [id])
  }

  /**
   * Get mintingFee
   */
  public async getMintingFee():Promise<string> {
    return await super.fetchContractData('mintingFee')
  }

  /**
   * Get metadata
   */
  public async ownerOf(inputs: IOwnerOf):Promise<string> {
    const {
      id
    } = inputs
    return await super.fetchContractData('ownerOf', [id])
  }

  /**
   * Get totalSupply
   */
  public async getTotalSupply(inputs: ITotalSupplyInputs):Promise<string> {
    const {
      id
    } = inputs
    return await super.fetchContractData('totalSupply', [id])
  }

  /**
   * Get uri
   */
  public async getUri(inputs: IUri):Promise<string> {
    const {
      input
    } = inputs
    return await super.fetchContractData('uri', [input])
  }

  // ------------- PAYABLE METHODS -------------

  /**
   * Set for approval status from one address to another. Payable
   * @param {string} userAddress - user address
   * @param {string} operator - account/contract address
   * @param {boolean} approvedValue - new approve status
   */
  public async setApprovalForAll(userAddress: string, operator: string, approvedValue = true): Promise<void> {
    if (userAddress.toLowerCase() !== operator.toLowerCase()) {
      const isAlreadyApproved = await this.checkIsApprovalForAll(userAddress, operator)
      if (!isAlreadyApproved && approvedValue) {
        await super.sendDataToContract('setApprovalForAll', [operator, approvedValue.toString()], userAddress)
      }
    }
  }

  /**
   * Mint NFT. Payable
   * @param {IMintNFTPayload} payload
   * @param {string} userAddress - user address
   */
  public async mintNFT(payload: IMintNFTPayload, userAddress:string): Promise<Record<string, any>> {
    const {
      data,
      errata
    } = payload
    await this.setApprovalForAll(userAddress, multiTokenContractAddress, true)
    return await super.sendDataToContract('mintNFT', [data, errata.toString()], userAddress)
  }

  /**
   * Send transaction
   * @param {ISafeTransferFromPayload} payload
   * @param {string} userAddress - user address
   */
  public async safeTransferFrom(payload: ISafeTransferFromPayload, userAddress: string): Promise<Record<string, any>> {
    const {
      from, to, tokenId, amount, data
    } = payload
    return await super.sendDataToContract('safeTransferFrom', [from, to, tokenId, amount, data], userAddress)
  }

  public async changeAdmin(inputs: IChangeAdminInputs, userAddress:string): Promise<void> {
    const {
      nftTokenId, newAdmin
    } = inputs
    await super.sendDataToContract('changeAdmin', [nftTokenId, newAdmin], userAddress)
  }

  public async changeBeneficiary(inputs: IChangeBeneficiaryInputs, userAddress:string): Promise<void> {
    const {
      nftTokenId, newBeneficiary
    } = inputs
    await super.sendDataToContract('changeBeneficiary', [nftTokenId, newBeneficiary], userAddress)
  }

  public async changeCreationTime(inputs: IChangeCreationTimeInputs, userAddress:string): Promise<void> {
    const {
      nftTokenId, createdAt
    } = inputs
    await super.sendDataToContract('changeCreationTime', [nftTokenId, createdAt], userAddress)
  }

  public async governorMintNFT(inputs: IGovernorMintNFTInputs, userAddress:string): Promise<void> {
    const {
      data, errata, createdAt, status, owner, admin, beneficiary
    } = inputs
    await super.sendDataToContract('governorMintNFT', [data, errata, createdAt, status, owner, admin, beneficiary], userAddress)
  }

  public async grantRole(inputs: IGrantRoleInputs, userAddress:string): Promise<void> {
    const {
      role, account
    } = inputs
    await super.sendDataToContract('grantRole', [role, account], userAddress)
  }

  public async initialize(inputs: IInitializeInputs, userAddress:string): Promise<void> {
    const {
      uri_, firstNftIndex, _mintingFee
    } = inputs
    await super.sendDataToContract('initialize', [uri_, firstNftIndex, _mintingFee], userAddress)
  }

  public async mintFT(inputs: IMintFTInputs, userAddress:string): Promise<void> {
    const {
      tokenId, to, amount
    } = inputs
    await super.sendDataToContract('mintFT', [tokenId, to, amount], userAddress)
  }

  public async renounceRole(inputs: IRenounceRole, userAddress:string): Promise<void> {
    const {
      role, account
    } = inputs
    await super.sendDataToContract('renounceRole', [role, account], userAddress)
  }

  public async revokeRole(inputs: IRevokeRole, userAddress:string): Promise<void> {
    const {
      role, account
    } = inputs
    await super.sendDataToContract('revokeRole', [role, account], userAddress)
  }

  public async safeBatchTransferFrom(inputs: ISafeBatchTransferFrom, userAddress:string): Promise<void> {
    const {
      from, to, ids, amount, data
    } = inputs
    await super.sendDataToContract('safeBatchTransferFrom', [from, to, ids, amount, data], userAddress)
  }

  public async setErrata(inputs: ISetErrata, userAddress:string): Promise<void> {
    const {
      nftTokenId, newErrata
    } = inputs
    await super.sendDataToContract('setErrata', [nftTokenId, newErrata], userAddress)
  }

  public async setFullBenefitFlag(inputs: ISetFullBenefitFlag, userAddress:string): Promise<void> {
    const {
      nftTokenId
    } = inputs
    await super.sendDataToContract('setFullBenefitFlag', [nftTokenId], userAddress)
  }

  public async setMintingFee(inputs: ISetMintingFee, userAddress:string): Promise<void> {
    const {
      newMintingFee
    } = inputs
    await super.sendDataToContract('setMintingFee', [newMintingFee], userAddress)
  }

  public async setRetractedFlag(inputs: ISetRetractedFlag, userAddress:string): Promise<void> {
    const {
      nftTokenId
    } = inputs
    await super.sendDataToContract('setRetractedFlag', [nftTokenId], userAddress)
  }

  public async setSoldFlag(inputs: ISetSoldFlag, userAddress:string): Promise<void> {
    const {
      nftTokenId
    } = inputs
    await super.sendDataToContract('setSoldFlag', [nftTokenId], userAddress)
  }

  public async unsetFullBenefitFlag(inputs: IUnsetFullBenefitFlag, userAddress:string): Promise<void> {
    const {
      nftTokenId
    } = inputs
    await super.sendDataToContract('unsetFullBenefitFlag', [nftTokenId], userAddress)
  }

  public async unsetRetractedFlag(inputs: IUnsetRetractedFlag, userAddress:string): Promise<void> {
    const {
      nftTokenId
    } = inputs
    await super.sendDataToContract('unsetRetractedFlag', [nftTokenId], userAddress)
  }

  public async withdrawBalance(inputs: IWithdrawBalance, userAddress:string): Promise<void> {
    const {
      to
    } = inputs
    await super.sendDataToContract('withdrawBalance', [to], userAddress)
  }
}
