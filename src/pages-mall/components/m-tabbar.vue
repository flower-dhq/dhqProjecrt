<style lang="scss" scoped></style>

<template>
  <u-tabbar :value="value" zIndex="99" activeColor="#C8924B" @change="tabbarClick">
    <u-tabbar-item text="首页" :icon="getIcon(0)"></u-tabbar-item>
    <u-tabbar-item text="分类" :icon="getIcon(1)"></u-tabbar-item>
    <u-tabbar-item text="购物车" :icon="getIcon(2)"></u-tabbar-item>
    <u-tabbar-item text="我的" :icon="getIcon(3)"></u-tabbar-item>
  </u-tabbar>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    value: {
        type: Number,
        default: 0
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
  methods: {
    // 生成对应图标
    getIcon(index) {
			const val = this.value
			const active = val === index ? '_active' : ''
			const icons = [
				`${this.imagePrefix}/pages-mall/static/tab-bar/tab_home${active}.png`,
				`${this.imagePrefix}/pages-mall/static/tab-bar/tab_cate${active}.png`,
				`${this.imagePrefix}/pages-mall/static/tab-bar/tab_cart${active}.png`,
				`${this.imagePrefix}/pages-mall/static/tab-bar/tab_mine${active}.png`,
			]
			return icons[index]
    },
    // 点击导航栏
    tabbarClick(index) {
			const routes = [
				'/pages-mall/index/index',
				'/pages-mall/category/category',
				'/pages-mall/shopping-cart/shopping-cart',
				'/pages-mall/mine/mine',
			]
			const url = routes[index]
			uni.redirectTo({url})
    }   
  },
};
</script>
