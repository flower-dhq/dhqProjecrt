// initial state
const state = {
  data:{},
  authInfo: {}
}

// getters
const getters = {

  getInviteFamily(state) {
    return state.authInfo;
  }
}

// actions
const actions = {

}

// mutations
const mutations = {

  clearInviteFamily(state) {
    state.authInfo = {};
  },

  saveInviteFamily(state, data){
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
