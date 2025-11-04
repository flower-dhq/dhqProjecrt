<template>
  <view class="card-title">
    <view class="title-tag"></view>
    <view class="title-wrap">{{ title }}</view>
  </view>
</template>
<script>
export default {
  name: 'cardTitle',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.card-title {
  width: 100%;
  display: flex;
  align-items: center;
  padding-bottom: 24rpx;
  .title-tag {
    width: 6rpx;
    height: 32rpx;
    background: var(--app-primary-color);
  }
  .title-wrap {
    padding-left: 16rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #222222;
  }
}
</style>
