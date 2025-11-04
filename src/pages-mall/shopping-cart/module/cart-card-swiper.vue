<template>
  <view class="cart-card-swiper">
    <view class="header">
      <slot name="prefix"></slot>
      <image class="header-icon" src="@/pages-mall/static/shop/shop_icon.png" mode="aspectFit"></image>
      <text class="header-name">{{ sellerName }}</text>
    </view>
    <view class="content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  options: { styleIsolation: 'shared' },
  props: {
    // 店铺名称
    sellerName: String,
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.cart-card-swiper {
  width: 100%;
  border-radius: 16rpx;
  background-color: #fff;
}
.header {
  height: 96rpx;
  @include flx-dsp(flex-start, center, row);
  padding: 0rpx 24rpx;

  &>.header-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 12rpx;
  }
  &>.header-name {
    font-size: 26rpx;
    color: #666;
  }
}
.content {
  padding: 0 24rpx 48rpx;
}
</style>