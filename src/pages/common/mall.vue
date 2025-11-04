<style lang="scss" scoped>

</style>

<template>
        <middle-box :current-page="3" ref="child"></middle-box>
</template>

<script>
import { mapState } from 'vuex'
import MiddleBox from '@/components/middle/middle-box.vue';

// 只有微信小程序才会起作用，其他平台uni.addInterceptor 拦截
export default {
  components: {
      MiddleBox,
      },
  data() {
    return {
      jumpedMall: false
    };
  },
  computed: {
    ...mapState({
      backupTabbar: state => state.backupTabbar
    })
  },
  onShow() {
    if (this.jumpedMall) {
      uni.switchTab({url: this.backupTabbar})
      this.jumpedMall = false
    }
  },
  onTabItemTap() {
    uni.navigateTo({url: '/pages-mall/index/index'})
    this.jumpedMall = true
  }
};
</script>
