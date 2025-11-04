// initial state
const state = {
  data:{},
  authInfo: {}
}

// getters
const getters = {

  getAuthInfo(state) {
    return state.authInfo;
  }
}

// actions
const actions = {

}

// mutations
const mutations = {

  clearAuthInfo(state) {
    state.authInfo = {};
  },

  saveAuthInfo(state, data){
    state.authInfo = data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
