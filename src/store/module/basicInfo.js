// initial state
const state = {
  data:null,
  basicInfo: null
}

// getters
const getters = {

  getBasicInfo(state) {
    return state.basicInfo;
  }
}

// actions
const actions = {

}

// mutations
const mutations = {

  clearBasicInfo(state) {
    state.basicInfo = null;
  },

  saveBasicInfo(state, data){
    state.basicInfo = data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
