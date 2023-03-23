<template>
  <Card
    size="lg"
    title="Inventory"
    class="inventory"
  >
    <div class="inventory__content">
      <Card
        v-for="nft in inventory"
        :key="nft.id"
        size="md"
      >
        <Card
          size="sm"
          :title="`NFT ${nft.returnValues.nftTokenId || nft.returnValues.tokenId}`"
        />
        <CustomButton
          @click="publishClick(nft)"
        >
          Publish
        </CustomButton>
      </Card>
    </div>

    <!--    modals  -->
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
import { mapGetters } from 'vuex'

import Card from '@/components/ui/Card/index.vue'
import CustomButton from '~/components/ui/CustomButton/index.vue'
import ModalLoader from '~/components/ui/Modal/ModalLoader.vue'
import ModalPublishNFT from '~/components/ui/Modal/ModalPublishNFT.vue'
import { IModal, IModalPublishNFTPayload } from '~/components/ui/Modal/types'
import MainVue from '~/mixins/MainVue'
import { publishNFT } from '~/utils/helpers'

export default MainVue.extend({
  name: 'Inventory',
  components: {
    ModalLoader, ModalPublishNFT, CustomButton, Card
  },
  data() {
    return {
      nftTokenId: ''
    }
  },
  computed: {
    ...mapGetters({
      inventory: 'web3/getInventory',
      userAddress: 'web3/getUserAddress'
    }),
    modalPublishNft(): IModal {
      return this.$refs.modalPublishNft as IModal
    },
    modalLoader(): IModal {
      return this.$refs.modalLoader as IModal
    }
  },
  methods: {
    publishClick(nft:Record<string, any>) {
      this.nftTokenId = nft.returnValues.nftTokenId || nft.returnValues.tokenId
      this.modalPublishNft.open()
    },

    async publish(payload: IModalPublishNFTPayload) {
      this.modalPublishNft.close()
      this.modalLoader.open()
      try {
        await this.addProcessingLog({
          text: 'creating auction'
        })

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
.inventory {
  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
  }
  &__nft {
    height: 90px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #EBE8ED;
    border-radius: 8px;
  }
}
</style>
