const state = {
  materials:[],
  materialStore:{}
};

const getters = {
  materialStore:state=>state.materialStore
}

const actions = {}

const mutations = {
  /**
   * e.g. function(state, {value}) {
   * }
   */
  saveMaterials(state,item){

    let obj = JSON.parse(JSON.stringify(state.materialStore));
    if (item.type=='1'){
      obj = {}
    }
    
    let datas = item.materials;
    
    for (let i = 0; i < datas.length; i++) {
      let storeName = datas[i].tabNameWarehouse
      if(!obj[storeName]){
        obj[storeName] = []
      }
      let stores = obj[storeName]
      stores.push(datas[i])
      obj[storeName] = stores
    }
    state.materialStore = obj

  },
  deleteMaterialsPos(state,data){
    let key = data.key;
    let pos = data.pos;

    let obj = JSON.parse(JSON.stringify(state.materialStore));
    let arr = obj[key]

    if(arr.length==1){
      delete obj[key];
    }else {
      obj[key].splice(pos,1)
    }

    state.materialStore = obj
  },
  clearMaterilas(state){
    let obj = JSON.parse(JSON.stringify(state.materialStore));
    for (let key in obj) {
      delete obj[key];
    }
    state.materialStore = obj

    console.log("clearMaterilas")
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
