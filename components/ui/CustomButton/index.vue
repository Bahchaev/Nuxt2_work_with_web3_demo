<template>
  <button
    class="custom-button"
    :class="type"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CustomButton',
  props: {
    type: {
      type: String,
      default: 'default',
      validator(value:string) {
        const validValues = ['default', 'green']
        return validValues.includes(value)
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped lang="scss">
.custom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 43px;
  border-radius: 8px;
  padding: 12px 24px;
  &.default {
    background: #11BFF6;
    border-bottom: 6px solid #075770;
  }
  &.green {
    background: #11F61A;
    border-bottom: 6px solid #075770;
  }
  &:disabled {
    background: #DEE4DE;
    border-bottom: 6px solid #8CA0A6;
    color: #B0B0B0;
    cursor: not-allowed;
    &:hover,
    &:active {
      transform: none;
    }
  }
}
</style>
