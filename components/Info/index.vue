<template>
  <div class="info">
    <div class="info__balance">
      <p>
        user address: {{ userAddress }}
      </p>
      <p>
        balance: {{ balance }} TOKEN
      </p>
      <p>
        multi-token contract address: {{ multiTokenContractAddress }}
      </p>
      <p>
        marketplace contract address: {{ marketPlaceContractAddress }}
      </p>
      <p>
        TOKEN seller address: {{ tokenSellerAddress }}
      </p>

      <p>
        TOKEN buyer address: {{ tokenBuyerAddress }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

import MainVue from '~/mixins/MainVue'
import { marketPlaceContractAddress, multiTokenContractAddress } from '~/utils/web3wrapper/config'

export default MainVue.extend({
  name: 'Info',
  components: {

  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters({
      userAddress: 'web3/getUserAddress',
      isMetamaskConnected: 'web3/getIsMetamaskConnected',
      balance: 'web3/getBalance',
      tokenBuyerAddress: 'web3/getTokenBuyerAddress',
      tokenSellerAddress: 'web3/getTokenSellerAddress'
    }),

    multiTokenContractAddress():string {
      return multiTokenContractAddress
    },

    marketPlaceContractAddress():string {
      return marketPlaceContractAddress
    }
  }
})
</script>

<style scoped lang="scss">
.info {
  &__balance {
    @include text16;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    border: 2px solid #075770;
    border-radius: 8px;
    padding: 10px 24px;
  }
}
</style>
