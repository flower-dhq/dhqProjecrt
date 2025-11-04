<template>
  <view class="page-box">
    <view class="page-title">
      <text>{{ title }}</text>
    </view>
    <view class="page-content">
      <rich-text :nodes="content"></rich-text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: '', // 文章标题
      content: '' // 文章内容
    }
  },
  onLoad(options) {
    const params = this.$cmMth.getRouteParams(options, 'configCode')

    this.getArticle(params.configCode)
  },
  methods: {
    // 获取文章内容
    async getArticle(configCode) {
      const params = {
        pathParams: `/${configCode}`
      }
      const { data } = await this.$mallApi.data.getConfigByCode(params)
      
      this.title = data.configName || ''
      this.content = (data.configDesc || '').replace(
        /\<img/g,
        `<img style="width: 100%;height: auto;object-fit: contain;vertical-align: middle;"`
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  box-sizing: border-box;
  padding: 0 18rpx;
}
.page-title {
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
  padding: 20rpx 0 30rpx;
  border-bottom: 1px solid #f7f7f7;
  margin-bottom: 20rpx;
}
.page-content {
  font-size: 28rpx;
}
</style>