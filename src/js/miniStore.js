import Vue from 'vue'

class MiniStore {
  constructor() {
    this.store = new Map()
    this.initState = new Map()
  }

  miniInit(id = '') {
    if (!this.initState.has(id)) {
      throw new Error(`The ${id} does not exist.`)
    }

    const data = this.initState.get(id)
    this.store.set(id, Vue.observable(data()))
  }

  miniStore(id, data) {
    if (this.initState.has(id)) {
      throw new Error(`The ${id} already exists.`)
    }
    this.initState.set(id, data)

    return () => {
      return this.store.get(id)
    }
  }
}

const miniVm= new MiniStore()

export const miniStore = miniVm.miniStore.bind(miniVm)

// 放在beforeCreate里执行
export const miniInit = miniVm.miniInit.bind(miniVm)