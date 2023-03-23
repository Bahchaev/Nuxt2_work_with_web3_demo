<template>
  <Card
    size="lg"
    title="Buying TOKEN"
    class="buying-token"
  >
    <div class="buying-token__content">
      <Card
        size="md"
        title="Set TOKEN seller address"
        class="buying-token__buy"
      >
        <CustomInput
          v-model="tokenSellerAddressInput"
          type="text"
          class="buying-token__input"
          label="Seller address"
          @enter="setSellerAddressClick"
        />
        <CustomButton
          type="green"
          class="buying-token__btn"
          :disabled="getIsAddressValid(tokenSellerAddressInput)"
          @click="setSellerAddressClick"
        >
          Set
        </CustomButton>
      </Card>

      <Card
        size="md"
        title="Set approvals for buyer"
        class="buying-token__buy"
      >
        <CustomInput
          v-model="tokenBuyerAddressInput"
          type="text"
          class="buying-token__input"
          label="Buyer address"
          @enter="setApprovalsClick"
        />
        <CustomButton
          type="green"
          class="buying-token__btn"
          :disabled="getIsAddressValid(tokenBuyerAddressInput)"
          @click="setApprovalsClick"
        >
          Set approvals
        </CustomButton>
      </Card>

      <Card
        v-if="tokenSellerAddress"
        size="md"
        title="Buy TOKEN"
        class="buying-token__buy"
      >
        <CustomInput
          v-model="tokenAmount"
          type="number"
          class="buying-token__input"
          label="Input Field"
          @enter="buyClick"
        />
        <CustomButton
          type="green"
          class="buying-token__btn"
          :disabled="buyBtnDisabled"
          @click="buyClick"
        >
          Buy
        </CustomButton>
      </Card>

      <Card
        size="md"
        title="Processing"
        class="buying-token__processing"
      >
        <div class="buying-token__processing-content">
          <LogItem
            v-for="(log, index) in processingLogs"
            :key="index"
            :log="log"
          />
        </div>
      </Card>
    </div>

    <!--    modals  -->
    <ModalLoader
      ref="modalLoader"
    />
  </Card>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js'
import { mapGetters } from 'vuex'

import Card from '~/components/ui/Card/index.vue'
import CustomButton from '~/components/ui/CustomButton/index.vue'
import CustomInput from '~/components/ui/CustomInput/index.vue'
import LogItem from '~/components/ui/LogItem/index.vue'
import ModalLoader from '~/components/ui/Modal/ModalLoader.vue'
import { IModal } from '~/components/ui/Modal/types'
import MainVue from '~/mixins/MainVue'
import MultiTokenContract from '~/utils/web3wrapper/contracts/MultiTokenContract'

export default MainVue.extend({
  name: 'BuyingTOKEN',
  components: {
    ModalLoader,
    LogItem,
    CustomInput,
    CustomButton,
    Card
  },
  data() {
    return {
      tokenAmount: '',
      tokenBuyerAddress: '',
      tokenSellerAddressInput: '',
      tokenBuyerAddressInput: ''
    }
  },
  computed: {
    ...mapGetters({
      userAddress: 'web3/getUserAddress',
      tokenSellerAddress: 'web3/getTokenSellerAddress'
    }),

    modalLoader(): IModal {
      return this.$refs.modalLoader as IModal
    },

    isYouASeller() {
      return this.userAddress.toLowerCase() === this.tokenSellerAddress.toLowerCase()
    },

    buyBtnDisabled() {
      return !this.tokenAmount
        || this.isYouASeller
        || !this.tokenSellerAddress
    }
  },

  methods: {
    getIsAddressValid(address: string): boolean {
      return !address
        || address.length !== 42
    },

    async setSellerAddressClick() {
      await this.$store.dispatch('web3/setTokenSellerAddress', this.tokenSellerAddressInput)
      this.tokenSellerAddressInput = ''
    },

    async setApprovalsClick() {
      try {
        // @ts-ignore
        this.modalLoader.open()
        const multiTokenContract = MultiTokenContract.getInstance()
        await multiTokenContract.setApprovalForAll(this.userAddress, this.tokenBuyerAddressInput, true)
        await this.$store.dispatch('web3/setTokenBuyerAddress', this.tokenBuyerAddressInput)
      } catch (e: any) {
        await this.addProcessingLog({
          code: e.code,
          text: e.message
        })
      } finally {
        // @ts-ignore
        this.modalLoader.close()
      }
    },

    async buyClick() {
      const multiTokenContract = MultiTokenContract.getInstance()
      const payload = {
        from: this.tokenSellerAddress,
        to: this.userAddress,
        tokenId: await multiTokenContract.getTokenId(),
        amount: new BigNumber(this.tokenAmount).shiftedBy(18).toFixed(),
        data: []
      }

      await this.addProcessingLog({
        text: `Buying ${this.tokenAmount} DCI from ${payload.from}`
      })

      try {
        // @ts-ignore
        this.modalLoader.open()
        const isApproval = await multiTokenContract.checkIsApprovalForAll(payload.from, payload.to)
        if (isApproval) {
          const result = await multiTokenContract.safeTransferFrom(payload, this.userAddress)
          await this.addProcessingLog({
            text: 'Success buy TOKEN, transaction: ',
            link: {
              href: this.getTransactionLink(result.transactionHash as string),
              text: result.transactionHash
            }
          })
          const balance = await multiTokenContract.getBalance(this.userAddress)
          await this.$store.dispatch('web3/setBalance', balance)
        } else {
          await this.addProcessingLog({
            code: 'not approval',
            text: `address ${payload.from} has not approvals for address ${payload.to}. Please, login from address ${payload.from} and set approvals for address ${payload.to}`
          })
        }

        this.tokenAmount = ''
      } catch (e: any) {
        await this.addProcessingLog({
          code: e.code,
          text: e.message
        })
        console.log(e)
      } finally {
        // @ts-ignore
        this.modalLoader.close()
      }
    }
  }
})
</script>

<style scoped lang="scss">
.buying-token {
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

    &-content {
      width: 100%;
      display: grid;
      grid-gap: 20px;
    }
  }
}
</style>
