<template>
  <view class="page-box">
    <cl-list-item v-for="item in aboutList" :key="item.configId" :label="item.configName" :border="true" @click="linkTo(item)">
      <cl-icon slot="append" name="cl-icon-arrow-right"></cl-icon>
    </cl-list-item>
  </view>
</template>

<script>
/**
 * 关于我们，包括 隐私政策，用户协议，证照信息
 */
export default {
  data() {
    return {
      aboutList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      const params = {
        pathParams: '/AboutUs'
      }
      const { data } = await this.$mallApi.data.getConfigByCode(params)
      const { children } = data || {}
      
      this.aboutList = children || []
    },
    linkTo(item) {
      uni.navigateTo({ url: '/pages-mall-b/about-company/article-info?configCode=' + item.configCode })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  background-color: #f7f7f7;
  padding: 14rpx;
  box-sizing: border-box;
}
</style>