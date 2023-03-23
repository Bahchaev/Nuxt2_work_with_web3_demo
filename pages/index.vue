<template>
  <div>
    <div class="header">
      <WalletConnect />
    </div>

    <div
      v-if="isConnected"
      class="main"
    >
      <BuyingTOKEN />
      <PublishNFT />
      <MarketPlace />
      <Inventory />
    </div>

    <Logs />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

import BuyingTOKEN from '~/components/BuyingTOKEN/index.vue'
import Inventory from '~/components/Inventory/index.vue'
import Logs from '~/components/Logs/index.vue'
import MarketPlace from '~/components/MarketPlace/index.vue'
import PublishNFT from '~/components/PublishNFT/index.vue'
import WalletConnect from '~/components/WalletConnect/index.vue'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    Logs,
    Inventory,
    MarketPlace,
    PublishNFT,
    BuyingTOKEN,
    WalletConnect
  },
  computed: {
    ...mapGetters({
      isConnected: 'web3/getIsMetamaskConnected'
    })
  }
})

</script>

<style lang="scss">
.header {
  margin-bottom: 65px;
}
.main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 48px;
  margin-bottom: 40px;
  @include _1919 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
