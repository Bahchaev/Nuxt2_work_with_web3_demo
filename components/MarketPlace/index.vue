<template>
  <Card
    size="lg"
    title="Market place"
    class="market-place"
  >
    <div class="market-place__content">
      <Card
        v-for="auction in auctions"
        :key="auction.nftTokenId"
        size="md"
        class="market-place__buy"
      >
        <Card
          size="sm"
          :title="auction.title"
        />
        <CustomButton
          :disabled="auction.disabled"
          @click="buyClick(auction)"
        >
          Buy
        </CustomButton>
      </Card>
    </div>

    <!--    Modals  -->
    <ModalBuyNFT
      ref="modalBuyNFT"
      @btnClick="buyNFT"
    />

    <ModalLoader
      ref="modalLoader"
    />
  </Card>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js'
import { mapGetters } from 'vuex'
import { EventData } from 'web3-eth-contract'

import Card from '@/components/ui/Card/index.vue'
import CustomButton from '@/components/ui/CustomButton/index.vue'
import ModalBuyNFT from '~/components/ui/Modal/ModalBuyNFT.vue'
import ModalLoader from '~/components/ui/Modal/ModalLoader.vue'
import { IModal } from '~/components/ui/Modal/types'
import MainVue from '~/mixins/MainVue'
import MarketPlaceContract from '~/utils/web3wrapper/contracts/MarketPlaceContract'
import MultiTokenContract from '~/utils/web3wrapper/contracts/MultiTokenContract'

export interface IAuction {
  nftTokenId: string,
  title: string,
  disabled: boolean,
  price: string
}

export default MainVue.extend({
  name: 'MarketPlace',
  components: {
    ModalLoader,
    ModalBuyNFT,
    CustomButton,
    Card
  },
  data() {
    return {
      tokenAmount: '',
      auctions: [] as IAuction[]
    }
  },

  computed: {
    ...mapGetters({
      userAddress: 'web3/getUserAddress',
      auctionCreatedEvents: 'web3/getAuctions'
    }),

    modalBuyNFT(): IModal {
      return this.$refs.modalBuyNFT as IModal
    },

    modalLoader(): IModal {
      return this.$refs.modalLoader as IModal
    }
  },

  watch: {
    async auctionCreatedEvents():Promise<void> {
      this.auctions = await this.getAuctions()
    }
  },

  async mounted() {
    this.auctions = await this.getAuctions()
  },

  methods: {
    async getAuctions():Promise<IAuction[]> {
      const marketPlaceContract = MarketPlaceContract.getInstance()
      const promises = this.auctionCreatedEvents.map(async (event:EventData) => {
        const { endTime, nftTokenId } = event.returnValues
        const { owner } = await marketPlaceContract.getAuctions(nftTokenId)
        const isOwner = owner.toLowerCase() === this.userAddress.toLowerCase()
        const isClosed = owner.toLowerCase() === '0x0000000000000000000000000000000000000000'
        const isEnded = endTime * 1000 <= Date.now()
        const price = isEnded ? '' : await marketPlaceContract.getAuctionPrice(nftTokenId)
        return {
          nftTokenId,
          title: `NFT ${nftTokenId}`,
          price: new BigNumber(price).shiftedBy(-18).toString(),
          disabled: isOwner,
          isClosed,
          isEnded,
          isOwner,
          event
        }
      })
      return (await Promise.all(promises))
        .filter((event:Record<string, any>) => !event.isEnded && !event.isClosed)
    },

    async buyClick(nft: IAuction) {
      this.modalBuyNFT.open(nft)
    },

    async buyNFT(nft: IAuction) {
      this.modalBuyNFT.close()
      this.modalLoader.open()
      try {
        await this.addProcessingLog({
          text: `buying NFT ${nft.nftTokenId}`
        })
        const marketPlaceContract = MarketPlaceContract.getInstance()
        const result = await marketPlaceContract.closeAuction(nft.nftTokenId, this.userAddress)
        await this.addProcessingLog({
          text: `success buy NFT ${nft.nftTokenId}, transaction: `,
          link: {
            href: this.getTransactionLink(result.transactionHash as string),
            text: result.transactionHash
          }
        })
        const multiTokenContract = MultiTokenContract.getInstance()
        const balance = multiTokenContract.getBalance(this.userAddress)
        await this.$store.dispatch('web3/setBalance', balance)
      } catch (e:any) {
        await this.addProcessingLog({ code: e.code, text: e.message })
        console.log(e)
      } finally {
        this.modalLoader.close()
      }
    }
  }
})
</script>

<style scoped lang="scss">
.market-place {
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
  }
}
</style>
