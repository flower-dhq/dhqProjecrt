<template>
  <view class="coupon-box">
    <view class="bg-img">
      <view class="desc-box" v-if="[1,2].includes(useRange)">
        <text v-if="useRange == 1">全场通用</text>
        <text v-if="useRange == 2">部分商家</text>
      </view>
      <view v-else class="plh"></view>
      <view class="price-box">
        <text>{{price}}</text>
        <view class="price-tag">券</view>
      </view>
      <view class="title-box">
        <text class="info-title">{{title}}</text>
        <text class="info-desc">{{couponData.useScopeStr}}</text>
        <text class="info-desc">{{dateTime}}</text>
      </view>
      <view class="btn-box" v-attr-color @click="handleClick">
        <view>{{getBtnText}}</view>
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
 * @property {number} useRange 优惠券使用范围(1:全场通用 2：部分商家)
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
}
.bg-img {
  width: 100%;
  height: 100%;
  background-image: url('../images/style_card_1.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px;
}
.plh{
  padding: 10px;
}
.desc-box {
  width: 120rpx;
  height: 100%;
  box-sizing: border-box;
  padding: 59rpx 20rpx 59rpx 50rpx;
  color: #666666;
  font-size: 25rpx;
}
.price-box {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;

  text {
    font-size: 85rpx;
    color: #FF8902;
    font-weight: bold;
  }
  .price-tag {
    width: 30rpx;
    height: 30rpx;
    background-color: #FF8902;
    border: 1px solid #fff;
    text-align: center;
    line-height: 30rpx;
    color: #fff;
    font-size: 20rpx;
    border-radius: 30rpx;
    position: absolute;
    bottom: 58rpx;
    right: -5rpx;
  }
}
.title-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20rpx;

  .info-title {
    @include ellipsis(1);
    font-weight: bold;
    font-size: 32rpx;
    color: #FF8902;
  }
  .info-desc {
    font-size: 21rpx;
    color: #999;
    @include ellipsis();
    // margin-top: 20rpx;
  }
}
.btn-box {
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 38rpx;
  flex-shrink: 0;
  flex-grow: 0;

  view {
    width: 90rpx;
    height: 90rpx;
    border-radius: 90rpx;
    box-sizing: border-box;
    padding: 10rpx 20rpx;
    background-color: #FF8902;
    color: #fff;
    font-size: 25rpx;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>