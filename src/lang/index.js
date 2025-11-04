import VueI18n from 'vue-i18n/dist/vue-i18n.min.js'
import Vue from 'vue'
import kanbanZh from './kanban_zh.json'
import kanbanEn from './kanban_en.json'

Vue.use(VueI18n)

export default new VueI18n({
	locale: uni.getStorageSync('locale') || 'zh',
	messages: {
		zh: Object.assign(kanbanZh),
		en: Object.assign(kanbanEn),
	}
})
