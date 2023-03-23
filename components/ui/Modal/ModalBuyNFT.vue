<template>
  <Modal ref="modal">
    <div class="modal">
      <div class="modal__header">
        Price: {{ nft.price }}
      </div>
      <CustomButton
        type="green"
        @click="btnClick"
      >
        Buy
      </CustomButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import { IAuction } from '~/components/MarketPlace/index.vue'
import CustomButton from '~/components/ui/CustomButton/index.vue'
import CustomInput from '~/components/ui/CustomInput/index.vue'
import Modal from '~/components/ui/Modal/index.vue'
import MainVue from '~/mixins/MainVue'

export default MainVue.extend({
  name: 'ModalBuyNFT',
  components: { CustomButton, CustomInput, Modal },
  data() {
    return {
      nft: {} as IAuction
    }
  },
  methods: {
    async open(nft:IAuction) {
      this.nft = nft
      this.modal.open()
    },

    close() {
      this.modal.close()
    },

    btnClick() {
      this.$emit('btnClick', this.nft)
    }
  }
})
</script>

<style scoped lang="scss">
.modal {
  @include modal;
  min-width: 343px;
  &__input {
    display: flex;
    justify-content: space-between;
  }
}
</style>
