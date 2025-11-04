<template>
  <view class="coupon-box">
    <view class="bg-img">
      <view class="price-left">
        <cl-text type="price" size="70rpx" :value="price" color="#fff" />
      </view>
      <view class="info-right">
        <text class="info-title">{{title}}</text>
        <text class="info-desc els1">{{desc}}</text>
        <text class="info-desc els1">{{couponData.useScopeStr}}</text>
        <text class="info-desc">{{dateTime}}</text>
      </view>
      <view class="info-btn" v-attr-color @click="handleClick">
        {{getBtnText}}
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
}
.bg-img {
  width: 100%;
  height: 100%;
  background-image: url('../images/style_card_0.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
}
.price-left {
  width: 230rpx;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.info-right {
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
    // margin-top: 20rpx;
  }
  .els1 {
     @include ellipsis(1);
  }
}
.info-btn {
  width: 90rpx;
  height: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  color: #49C0A3;
  font-size: 25rpx;
  writing-mode: vertical-lr;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px dotted #CCCCCC;
}

::v-deep .cl-text__symbol--price {
  font-size: 40rpx;
}
</style>