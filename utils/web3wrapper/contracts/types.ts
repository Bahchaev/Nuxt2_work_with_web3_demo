export interface ISafeTransferFromPayload {
  from: string,
  to: string,
  tokenId: string,
  amount: string,
  data: any,
}

export interface IMintNFTPayload {
  data: string,
  errata: string
}

export interface ICreateAuctionPayload {
  nftTokenId: string,
  startPrice: string,
  endPrice: string,
  endTime: string
}

export interface IPublishNFTPayload {
  startPrice: string,
  endPrice: string,
  nftTokenId: string
}

export interface IChangeAdminInputs {
  nftTokenId: string,
  newAdmin: string
}

export interface IChangeBeneficiaryInputs {
  nftTokenId: string,
  newBeneficiary: string
}

export interface IChangeCreationTimeInputs {
  nftTokenId: string,
  createdAt: string
}

export interface IGovernorMintNFTInputs {
  data: string,
  errata: string,
  createdAt: string,
  status: string,
  owner: string,
  admin: string,
  beneficiary: string,
}

export interface IGrantRoleInputs {
  role: string,
  account: string
}

export interface IHasRoleInputs {
  role: string,
  account: string
}

export interface IInitializeInputs {
  uri_: string,
  firstNftIndex: string
  _mintingFee: string
}

export interface IIsFullBenefitInputs {
  nftTokenId: string,
}

export interface IIsRetractedInputs {
  nftTokenId: string,
}

export interface IMetadataInputs {
  id: string,
}

export interface IMintFTInputs {
  tokenId: string,
  to: string,
  amount: string
}

export interface IOwnerOf {
  id: string
}

export interface IRenounceRole {
  role: string,
  account: string
}

export interface IRevokeRole {
  role: string,
  account: string
}

export interface ISafeBatchTransferFrom {
  from: string,
  to: string,
  ids: string[],
  amount: string,
  data: string
}

export interface ISetErrata {
  nftTokenId: string,
  newErrata: string
}

export interface ITotalSupplyInputs {
  id: string
}

export interface ISetFullBenefitFlag {
  nftTokenId: string,
}

export interface ISetMintingFee {
  newMintingFee: string,
}

export interface ISetRetractedFlag {
  nftTokenId: string,
}

export interface ISetSoldFlag {
  nftTokenId: string,
}

export interface IUnsetFullBenefitFlag {
  nftTokenId: string,
}

export interface IUnsetRetractedFlag {
  nftTokenId: string,
}

export interface IUri {
  input: string
}

export interface IWithdrawBalance {
  to: string
}

export interface ICancelAuctionInputs {
  nftTokenId: string,
}

export interface IGetAuctionInfoInputs {
  tokenIds: string[]
}

export interface IReviveAuctionInputs {
  nftTokenId: string
}

export interface ISetRoyaltyFee {
  newRoyaltyFee: string
  newFeeDenominator: string
}
