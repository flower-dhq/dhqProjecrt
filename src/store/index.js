import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { getLocalUserInfo } from '../service/native'
import repair from './module/repair'
import searchBar from './module/searchBar';
import warehouse from "./module/warehouse";

const store = new Vuex.Store({
	state: {
		backupTabbar: null, // 用来记录点击商城入口时，前一个tabbar是那个页面
		user: {},
		kanbanFilter: {}
	},
	getters: {
		user(state) {
			return state.user
	}
	},
	mutations: {
		// 更新backupTabbar
		catchTabbarPagePath(state, payload) {
			state.backupTabbar = payload
		},
		setUser(state, object) {
			state.user = object;
			uni.setStorageSync('userName', object.userName);
			uni.setStorageSync('userId', object.userid);
			uni.setStorageSync('userAccount', object.userAccount);
			uni.setStorageSync('companyId', object.companyId);
			uni.setStorageSync('token', object.token);
			uni.setStorageSync('id_token', object.id_token);
			// uni.setStorageSync('locale', object.locale || 'zh');
		},
		updateKanbanFilter(state, playload) {
			state.kanbanFilter = playload;
		}
	},
	actions: {
		getLocalUserInfo({ commit }, object) {
			getLocalUserInfo().then(res => {
					if(res && !res.isNOLogin){
							 commit('setUser', res)
					}
			 })
	},
	},
	modules: {
		repair,
    searchBar,
		warehouse
	}
})

export default store
