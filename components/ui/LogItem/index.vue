<template>
  <p
    class="log"
    :class="{'error': !!log.code}"
  >
    <span v-if="!!log.code">
      Error {{ log.code }}:
    </span>
    <span>
      {{ log.text }}
    </span>
    <a
      v-if="log.link"
      :href="log.link.href"
      target="_blank"
    >
      {{ log.link.text }}
    </a>
  </p>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ILog } from '@/store/web3/types'

export default Vue.extend({
  name: 'LogItem',
  props: {
    log: {
      type: Object as PropType<ILog>,
      required: true
    }
  }

})
</script>

<style scoped lang="scss">
.log {
  @include text12;
  &.error {
    color: indianred;
  }
}
</style>
