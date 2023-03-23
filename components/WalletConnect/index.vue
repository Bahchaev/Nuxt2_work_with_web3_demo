<template>
  <div class="connect">
    <div v-if="!isMetamaskConnected">
      Metamask is not connected!
    </div>
    <CustomButton
      v-if="!isMetamaskConnected"
      class="connect__btn"
      @click="connectMetaMask"
    >
      Connect wallet
    </CustomButton>
    <Info v-if="isMetamaskConnected" />
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

import CustomButton from '@/components/ui/CustomButton/index.vue'
import Info from '~/components/Info/index.vue'
import MainVue from '~/mixins/MainVue'
import { filterOldEvents } from '~/utils/helpers'
import MarketPlaceContract from '~/utils/web3wrapper/contracts/MarketPlaceContract'
import MultiTokenContract from '~/utils/web3wrapper/contracts/MultiTokenContract'
import { connectWallet, initConnection } from '~/utils/web3wrapper/walletConnection/metaMaskConnection'

export default MainVue.extend({
  name: 'WalletConnect',
  components: { Info, CustomButton },
  data() {
    return {}
  },

  computed: {
    ...mapGetters({
      isMetamaskConnected: 'web3/getIsMetamaskConnected',
      userAddress: 'web3/getUserAddress'
    })
  },

  async mounted(): Promise<void> {
    try {
      const userAddress = await initConnection()
      await this.$store.dispatch('web3/setUserAddress', userAddress)
      await this.connectContracts()
    } catch (e) {
      console.error(e)
    }
  },

  methods: {
    async connectMetaMask() {
      const userAddress = await connectWallet()
      await this.$store.dispatch('web3/setUserAddress', userAddress)
      await this.connectContracts()
    },

    async connectContracts() {
      if (this.isMetamaskConnected) {
        await this.connectMultiTokenContract()
        await this.connectMarketPlaceContract()

        await this.$store.dispatch('web3/setTokenBuyerAddress', localStorage.getItem('tokenBuyerAddress') || '')
        await this.$store.dispatch('web3/setTokenSellerAddress', localStorage.getItem('tokenSellerAddress') || '')

        const filteredAuctionCreatedEvents = filterOldEvents(this.$store.getters['web3/getAuctions'], this.$store.getters['web3/getInventory'])
        const filteredAuctionClosedEvents = filterOldEvents(this.$store.getters['web3/getInventory'], this.$store.getters['web3/getAuctions'])
        await this.$store.dispatch('web3/setAuctions', filteredAuctionCreatedEvents)
        await this.$store.dispatch('web3/setInventory', filteredAuctionClosedEvents)
      }
    },

    async connectMultiTokenContract() {
      const multiTokenContract = MultiTokenContract.getInstance()
      await multiTokenContract.getAnonData()
      const balance = await multiTokenContract.getBalance(this.userAddress)
      await this.$store.dispatch('web3/setBalance', balance)
    },

    async connectMarketPlaceContract() {
      const marketPlaceContract = MarketPlaceContract.getInstance()

      const auctionCreatedEvents = await marketPlaceContract.getPastEvents('AuctionCreated')
      await this.$store.dispatch('web3/setAuctions', filterOldEvents(auctionCreatedEvents, auctionCreatedEvents))

      const auctionClosedEvents = await marketPlaceContract.getPastEvents('AuctionClosed')
      const filteredEvents = filterOldEvents(auctionClosedEvents, auctionClosedEvents)
        .filter((event) => event.returnValues.buyer.toLowerCase() === this.$store.getters['web3/getUserAddress'].toLowerCase())
      await this.$store.dispatch('web3/setInventory', filteredEvents)

      await marketPlaceContract.subscribeEvent(
        'AuctionCreated',
        (event) => this.$store.dispatch('web3/addAuctions', event)
      )

      await marketPlaceContract.subscribeEvent(
        'AuctionClosed',
        (event) => {
          this.$store.dispatch('web3/deleteAuction', event)
          if (event.returnValues.buyer.toLowerCase() === this.$store.getters['web3/getUserAddress'].toLowerCase()) {
            this.$store.dispatch('web3/addNFTToInventory', event)
          }
        }
      )
    }
  }
})
</script>

<style scoped lang="scss">
.connect {
  display: flex;
  gap: 24px;
  align-items: center;
}
</style>
