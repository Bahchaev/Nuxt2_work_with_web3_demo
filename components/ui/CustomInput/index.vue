<template>
  <div class="custom-input">
    <div
      v-if="label"
      class="custom-input__label"
    >
      {{ label }}
    </div>
    <input
      class="custom-input__input"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      @input="(e) => $emit('input', e.target.value)"
      @keydown.enter="$emit('enter')"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CustomInput',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    }
  }

})
</script>

<style scoped lang="scss">
.custom-input {
  &__label {
    @include text12;
    margin-bottom: 4px;
  }
  &__input {
    @include text12;
    font-weight: 700;
    height: 32px;
    background: #FFFFFF;
    border: 1px solid #11BFF6;
    border-radius: 6px;
    padding: 8px 12px;
    width: 100%;
  }
}
</style>
