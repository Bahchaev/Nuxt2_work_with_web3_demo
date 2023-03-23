<template>
  <transition name="fade">
    <div
      v-if="isShow"
      class="modal-container"
      @mousedown.self="close"
    >
      <slot />
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Modal',
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    open() {
      this.isShow = true
    },
    close() {
      this.isShow = false
    }
  }
})
</script>

<style scoped lang="scss">
.modal-container {
  z-index: 1003;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.91);
  overflow-x: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
