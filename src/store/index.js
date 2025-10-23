import Vue from 'vue'
import Vuex from 'vuex'
import mall from "./module/mall"
import enterpriseAuth from './module/enterpriseAuth'
import goodsCollection from './module/goodsCollection'
import houseAuth from './module/houseAuth'
import inviteFamily from './module/inviteFamily'
import repair from './module/repair'
import basicInfo from './module/basicInfo'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		backupTabbar: null, // 用来记录点击商城入口时，前一个tabbar是那个页面
	},
	getters: {},
	mutations: {
		// 更新backupTabbar
		catchTabbarPagePath(state, payload) {
			state.backupTabbar = payload
		}
	},
	actions: {},
	modules: {
		mall,
		enterpriseAuth,
		goodsCollection,
		houseAuth,
		inviteFamily,
		repair,
		basicInfo
	}
})

export default store
