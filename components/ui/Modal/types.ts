import Vue from 'vue'

export type IModal = Vue & {
  open: (param?:any) => void,
  close: () => void
}

export interface IModalPublishNFTPayload {
  startPrice: string,
  endPrice: string,
}
