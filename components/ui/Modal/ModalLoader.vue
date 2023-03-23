<template>
  <Modal ref="modal">
    <div class="modal">
      Waiting...
    </div>
  </Modal>
</template>

<script lang="ts">
import CustomButton from '~/components/ui/CustomButton/index.vue'
import CustomInput from '~/components/ui/CustomInput/index.vue'
import Modal from '~/components/ui/Modal/index.vue'
import MainVue from '~/mixins/MainVue'

export default MainVue.extend({
  name: 'ModalLoader',
  components: { CustomButton, CustomInput, Modal },
  methods: {
    async open() {
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
  &__input {
    display: flex;
    justify-content: space-between;
  }
}
</style>
