<style lang="scss" scoped></style>

<template>
  <u-tabbar :zIndex="zIndex" :value="value" :activeColor="THEME_COLOR" @change="tabbarClick">
    <u-tabbar-item text="首页" :icon="getIcon(0)"></u-tabbar-item>
    <u-tabbar-item :text="$t('看板')" v-if="isShowKanban" :icon="getIcon(1)"></u-tabbar-item>
  </u-tabbar>
</template>

<script>
export default {
  data() {
    return {
      isShowKanban: true
    };
  },
  props: {
    value: {
        type: Number,
        default: 0
    },
    zIndex: {
        type: Number,
        default: 99999
    }
  },
  computed: {
    imagePrefix() {
      const { IMG_BASE_URL, IMG_BASE_FOLDER} = this.$appConfig
      const availablePrefix = typeof IMG_BASE_URL === 'string' && typeof IMG_BASE_FOLDER === 'string' && IMG_BASE_URL && IMG_BASE_FOLDER;
      const production = process.env.NODE_ENV === 'production';
      return production && availablePrefix ? `${IMG_BASE_URL}/${IMG_BASE_FOLDER}` : '';
    },
  },
  created() {
    if (this.$appConfig.PROJECT_CODE === 'XIANGSHUN_PROD') {
      // 翔顺，需要隐藏掉看板，因为没购买该功能。又因为底部菜单栏至少要两个菜单，所以直接隐藏掉底部菜单栏
      this.isShowKanban = false
    }
  },
  methods: {
    // 生成对应图标
    getIcon(index) {
			const val = this.value
			const path = val === index ? '/' +  this.THEME_NAME : ''
			const icons = [
				`${this.imagePrefix}/static${path}/tabbar_index.png`,
				`${this.imagePrefix}/static${path}/tabbar_view.png`,
			]
			return icons[index]
    },
    // 点击导航栏
    tabbarClick(index) {
			const routes = [
				'/pages/index/index',
				'/pages-kanban/kanban/index'
			]
			const url = routes[index]
      const { uniPlatform } = uni.getSystemInfoSync();
      if(url=='/pages-kanban/kanban/index' && uniPlatform=='H5'){
        uni.navigateTo({url})
      }else{
        uni.reLaunch({url})
      }
    }   
  },
};
</script>
