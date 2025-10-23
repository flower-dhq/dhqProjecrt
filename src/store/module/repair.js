// initial state
const state = {
  data:null,
  repairsInfo: null
}

// getters
const getters = {

  getCrm:function (state) {
    return state.data;
  },
  getRepairsInfo(state) {
    return state.repairsInfo;
  }
}

// actions
const actions = {

}

// mutations
const mutations = {

  clearCrm(state) {
    state.data = null;
  },

  setCrm(state,data){
    state.data = data
  },
  clearRepairsInfo(state) {
    state.repairsInfo = null;
  },

  saveRepairsInfo(state, data){
    state.repairsInfo = data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
