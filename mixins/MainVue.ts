import Vue from 'vue'
import { IModal } from '@/components/ui/Modal/types'

import { ILog } from '~/store/web3/types'
import { addLog } from '~/utils/web3wrapper/logs/logs'

export default Vue.extend({
  data() {
    return {
      accounts: [] as string[],
      processingLogs: [] as ILog[]
    }
  },
  computed: {
    modal() {
      return this.$refs.modal as IModal
    }
  },
  methods: {
    async addProcessingLog(log: ILog) {
      this.processingLogs.push(log)
      await addLog(log)
    },

    getTransactionLink(hash:string) {
      return `https://testnet.snowtrace.io/tx/${hash}`
    }
  }
})
