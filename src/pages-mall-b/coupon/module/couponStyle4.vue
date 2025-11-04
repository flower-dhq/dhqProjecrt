<template>
  <view class="coupon-box">
    <view class="bg-img">
      <view class="title-box">
        <text class="info-title">{{title}}</text>
        <text class="info-desc">{{desc}}</text>
        <text class="info-desc">{{couponData.useScopeStr}}</text>
        <text class="info-desc">{{dateTime}}</text>
      </view>
      <view class="info-btn"  @click="handleClick">
        <cl-text class="discount-price" type="price" size="70rpx" :value="price" color="#FF601C" />
        <view class="btn" v-attr-color:background>{{getBtnText}}</view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @property {number|string} price 价格，默认为0
 * @property {string} title 标题
 * @property {string} desc 描述
 * @property {string} dateTime 日期
 * @property {string} btnState 按钮状态
 */
import mixin from "./mixin"
export default {
  mixins: [mixin]
}
</script>

<style lang="scss" scoped>
.coupon-box {
  width: 690rpx;
  height: 190rpx;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 10rpx;
  box-sizing: border-box;
}
.bg-img {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1px dotted #FF601C;
  display: flex;
  border-radius: 10rpx;
}
.title-box {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20rpx;

  .info-title {
    @include ellipsis(1);
    font-weight: bold;
    font-size: 32rpx;
    color: #333;
  }
  .info-desc {
    font-size: 21rpx;
    color: #999;
    @include ellipsis(1);
  }
}
.info-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 28rpx;
  flex-shrink: 0;
  flex-grow: 0;

  .btn {
    height: 42rpx;
    padding: 0 20rpx;
    line-height: 42rpx;
    flex-shrink: 0;
    flex-grow: 0;
    color: #FFF6E7;
    font-size: 25rpx;
    background-color: #FF601C;
    border-radius: 100rpx;
  }
  .discount-price {
    margin-top: -15rpx;
  }
}
::v-deep .cl-text__symbol--price {
  font-size: 40rpx;
}
</style>