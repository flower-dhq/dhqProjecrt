const repairData = {
  customFields: {}
}

// initial state
const state = {
  repairsInfo: JSON.parse(JSON.stringify(repairData))
}

// getters
const getters = {
  getRepairsInfo(state) {
    return state.repairsInfo
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  clearRepairsInfo(state) {
    state.repairsInfo = JSON.parse(JSON.stringify(repairData))
  },
  saveRepairsInfo(state, data) {
    state.repairsInfo = data
  },
  setRepairsInfo(state, params) {
    for (var key in params) {
      state.repairsInfo[key] = params[key]
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
