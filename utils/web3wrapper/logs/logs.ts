import { Store } from 'vuex'

interface ILog {
  text: string,
  code?: string,
  link?: {
    href: string,
    text: string
  }
}

let store: Store<any>

if (process.browser) {
  window.onNuxtReady((ctx: any) => {
    store = ctx.$store
  })
}

const logs:ILog[] = []

export function getLogs():ILog[] {
  return logs
}

export function addLog(log:ILog):void {
  logs.push(log)
  store.dispatch('web3/addLog', log).then()
}
