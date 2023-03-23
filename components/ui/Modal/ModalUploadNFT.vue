<template>
  <Modal ref="modal">
    <div class="modal">
      <div class="modal__header">
        input files CIDs
      </div>
      <CustomInput
        v-model="dataCID"
        label="data file CID"
        class="modal__input"
      />
      <CustomInput
        v-model="errataCID"
        label="errata file CID"
        class="modal__input"
      />
      <CustomButton
        type="green"
        @click="$emit('btnClick', {dataCID, errataCID})"
      >
        Upload
      </CustomButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import CustomButton from '~/components/ui/CustomButton/index.vue'
import CustomInput from '~/components/ui/CustomInput/index.vue'
import Modal from '~/components/ui/Modal/index.vue'
import MainVue from '~/mixins/MainVue'

export default MainVue.extend({
  name: 'ModalUploadNFT',
  components: { CustomButton, CustomInput, Modal },
  data() {
    return {
      dataCID: '',
      errataCID: ''
    }
  },
  methods: {
    open() {
      this.dataCID = 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
      this.errataCID = 'QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH'
      this.modal.open()
    },

    close() {
      this.modal.close()
    }
  }
})
</script>

<style scoped lang="scss">
.modal {
  @include modal;
  min-width: 343px;
  &__header {
    text-align: center;
  }
}
</style>
