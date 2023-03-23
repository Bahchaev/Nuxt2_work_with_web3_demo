<template>
  <Modal ref="modal">
    <div class="modal">
      <div class="modal__header">
        Price: {{ price }}
      </div>
      <div class="modal__input">
        <span>
          Start
        </span>
        <CustomInput
          v-model="startPrice"
          type="number"
        />
      </div>
      <div class="modal__input">
        <span>
          Minimum
        </span>
        <CustomInput
          v-model="minimumPrice"
          type="number"
        />
      </div>
      <CustomButton
        type="green"
        :disabled="isBtnDisabled"
        @click="btnClick"
      >
        Publish
      </CustomButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import CustomButton from '~/components/ui/CustomButton/index.vue'
import CustomInput from '~/components/ui/CustomInput/index.vue'
import Modal from '~/components/ui/Modal/index.vue'
import MainVue from '~/mixins/MainVue'

import { IModalPublishNFTPayload } from './types'

export default MainVue.extend({
  name: 'ModalPublishNFT',
  components: { CustomButton, CustomInput, Modal },
  props: {
    price: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      startPrice: '',
      minimumPrice: ''
    }
  },
  computed: {
    isBtnDisabled():boolean {
      return !this.minimumPrice
        || !this.startPrice
        || +this.startPrice <= 0
        || +this.minimumPrice <= 0
        || +this.minimumPrice >= +this.startPrice
    }
  },
  methods: {
    resetData() {
      this.startPrice = ''
      this.minimumPrice = ''
    },

    open() {
      this.resetData()
      this.modal.open()
    },

    close() {
      this.modal.close()
    },

    btnClick() {
      const emitPayload:IModalPublishNFTPayload = {
        startPrice: this.startPrice,
        endPrice: this.minimumPrice
      }
      this.$emit('btnClick', emitPayload)
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
