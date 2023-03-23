<template>
  <Card
    size="lg"
    title="Publish NFT"
    class="publish-nft"
  >
    <div class="publish-nft__content">
      <Card
        size="md"
        class="publish-nft__buy"
      >
        <Card
          size="sm"
          title="NFT"
        />
        <CustomButton @click="uploadClick">
          Upload
        </CustomButton>
      </Card>

      <Card
        size="md"
        title="Processing"
        class="publish-nft__processing"
      >
        <div class="publish-nft__processing-content">
          <LogItem
            v-for="(log, index) in processingLogs"
            :key="index"
            :log="log"
          />
        </div>
      </Card>

      <Card
        size="md"
        class="publish-nft__buy"
      >
        <Card
          size="sm"
          title="NFT"
        />
        <CustomButton
          :disabled="!nftTokenId"
          @click="publishClick"
        >
          Publish
        </CustomButton>
      </Card>
    </div>

    <!--    modals  -->
    <ModalUploadNFT
      ref="modalUploadNft"
      @btnClick="mintNFT"
    />

    <ModalPublishNFT
      ref="modalPublishNft"
      @btnClick="publish"
    />

    <ModalLoader
      ref="modalLoader"
    />
  </Card>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js'
import CID from 'cids'
import { mapGetters } from 'vuex'

import Card from '@/components/ui/Card/index.vue'
import CustomButton from '@/components/ui/CustomButton/index.vue'
import LogItem from '~/components/ui/LogItem/index.vue'
import ModalLoader from '~/components/ui/Modal/ModalLoader.vue'
import ModalPublishNFT from '~/components/ui/Modal/ModalPublishNFT.vue'
import ModalUploadNFT from '~/components/ui/Modal/ModalUploadNFT.vue'
import { IModal, IModalPublishNFTPayload } from '~/components/ui/Modal/types'
import MainVue from '~/mixins/MainVue'
import { publishNFT } from '~/utils/helpers'
import MultiTokenContract from '~/utils/web3wrapper/contracts/MultiTokenContract'
import { IMintNFTPayload } from '~/utils/web3wrapper/contracts/types'

export default MainVue.extend({
  name: 'PublishNFT',
  components: {
    ModalLoader,
    LogItem,
    ModalPublishNFT,
    ModalUploadNFT,
    CustomButton,
    Card
  },
  data() {
    return {
      dataCID: '',
      errataCID: '',
      NFTData: '',
      NFTErrata: ''
    }
  },
  computed: {
    ...mapGetters({
      nftTokenId: 'web3/getNftTokenId',
      userAddress: 'web3/getUserAddress'
    }),

    modalUploadNft(): IModal {
      return this.$refs.modalUploadNft as IModal
    },

    modalPublishNft(): IModal {
      return this.$refs.modalPublishNft as IModal
    },

    modalLoader(): IModal {
      return this.$refs.modalLoader as IModal
    }
  },

  methods: {
    uint8arrayToStringMethod(myUint8Arr: any): string {
      return Buffer.from(myUint8Arr).toString('hex').slice(-64)
    },

    getNFTMintPayload(payload: { dataCID: string, errataCID: string }): IMintNFTPayload {
      this.dataCID = payload.dataCID
      this.errataCID = payload.errataCID
      const dataCid = new CID(payload.dataCID).toV1()
      const errataCid = new CID(payload.errataCID).toV1()
      this.NFTData = `0x${this.uint8arrayToStringMethod(dataCid.multihash)}`
      this.NFTErrata = `0x${this.uint8arrayToStringMethod(errataCid.multihash)}`
      return {
        data: this.NFTData,
        errata: this.NFTErrata
      }
    },

    uploadClick() {
      this.modalUploadNft.open()
    },

    async mintNFT(payload: { dataCID: string, errataCID: string }) {
      this.modalUploadNft.close()
      this.modalLoader.open()
      try {
        const mintNFTPayload = this.getNFTMintPayload(payload)
        await this.addProcessingLog({
          text: 'minting NFT'
        })
        const multiTokenContract = MultiTokenContract.getInstance()
        const result = await multiTokenContract.mintNFT(mintNFTPayload, this.userAddress)
        await this.$store.dispatch('web3/setNntTokenId', result?.events?.TransferSingle[0]?.returnValues?.id || '')
        await this.addProcessingLog({
          text: 'Success mint NFT, transaction: ',
          link: {
            href: this.getTransactionLink(result.transactionHash as string),
            text: result.transactionHash
          }
        })
      } catch (e: any) {
        await this.addProcessingLog({
          code: e.code,
          text: e.message
        })
      } finally {
        this.modalLoader.close()
      }
    },

    publishClick() {
      this.modalPublishNft.open()
    },

    async publish(payload: IModalPublishNFTPayload) {
      this.modalPublishNft.close()
      this.modalLoader.open()
      try {
        await this.addProcessingLog({ text: 'creating auction' })

        const publishNFTPayload = {
          ...payload,
          nftTokenId: this.nftTokenId
        }
        const result = await publishNFT(publishNFTPayload, this.userAddress)

        await this.addProcessingLog({
          text: 'Success create auction, transaction: ',
          link: {
            href: this.getTransactionLink(result.transactionHash as string),
            text: result.transactionHash
          }
        })
        await this.$store.dispatch('web3/setNntTokenId', '')
      } catch (e: any) {
        await this.addProcessingLog({
          code: e.code,
          text: e.message
        })
      } finally {
        this.modalLoader.close()
      }
    }
  }
})
</script>

<style scoped lang="scss">
.publish-nft {
  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
  }

  &__buy {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__input {
    width: 100%;
  }

  &__processing {
    @include text12;
    grid-row: 1 / 3;
    grid-column: 2 / 3;

    &-content {
      width: 100%;
      display: grid;
      grid-gap: 20px;
    }
  }
}
</style>
