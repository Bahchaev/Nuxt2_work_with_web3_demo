<template>
  <Card
    size="lg"
    title="Logs"
    class="logs"
  >
    <ul class="logs__list">
      <li
        v-for="(log, index) in logs"
        :key="index"
        class="logs__log"
      >
        <LogItem :log="log" />
      </li>
    </ul>
  </Card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

import Card from '@/components/ui/Card/index.vue'
import LogItem from '~/components/ui/LogItem/index.vue'

export default Vue.extend({
  name: 'Logs',
  components: { LogItem, Card },
  computed: {
    ...mapGetters({
      logs: 'web3/getLogs'
    })
  }
})
</script>

<style scoped lang="scss">
.logs {
  &__list {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 5px;
  }
}
</style>
