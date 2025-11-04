// initial state
const state = {
  data:null,
}

// getters
const getters = {

  getCollectionInfo:function (state) {
    return state.data;
  },

}

// actions
const actions = {

}

// mutations
const mutations = {

  clearCollectionInfo(state) {
    state.data = null;
  },

  setCollectionInfo(state,data){
    state.data = data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
