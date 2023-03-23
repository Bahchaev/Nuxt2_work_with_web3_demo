<template>
  <div
    class="card"
    :class="size"
  >
    <div
      v-if="title"
      class="card__title title"
    >
      {{ title }}
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Card',
  props: {
    size: {
      type: String,
      default: 'large',
      validator(value: string) {
        const validValues = ['lg', 'md', 'sm']
        return validValues.includes(value)
      }
    },
    title: {
      type: String,
      default: ''
    }
  }
})
</script>

<style scoped lang="scss">
.card {
  padding: 24px;
  word-break: break-word;

  &.lg {
    background: #CAEFFC;
    border-radius: 20px;

    &>.title {
      @include text20;
      margin-bottom: 12px;
    }
  }

  &.md {
    background: #EBF9FE;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    .title {
      @include text16;
      width: 100%;
      text-align: center;
    }
  }

  &.sm {
    background: #A574C3;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
