<template>
  <view class="coupon-box">
    <view class="bg-img">
      <view class="price-left">
        <view class="title">
          {{price}}<view class="tag">折</view>
        </view>
        <view class="desc">{{desc}}</view>
      </view>
      <view class="info-right">
        <text class="info-title">{{title}}</text>
        <text class="info-desc">{{couponData.useScopeStr}}</text>
        <text class="info-desc">{{dateTime}}</text>
      </view>
      <view class="info-btn" v-attr-color @click="handleClick">
        <view class="btn">{{getBtnText}}</view>
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
  background-image: url('../images/style_card_2.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
}
.price-left {
  width: 200rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #FFF6E7;
  flex-shrink: 0;
  flex-grow: 0;

  .title {
    width: 100%;
    font-size: 70rpx;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  .tag {
    font-size: 30rpx;
    margin-bottom: 10rpx;
  }
  .desc {
    font-size: 21rpx;
  }
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
    color: #EB0812;
  }
  .info-desc {
    font-size: 21rpx;
    color: #EB0812;
    margin-top: 20rpx;
  }
}
.info-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 38rpx;

  .btn {
    height: 42rpx;
    padding: 0 20rpx;
    line-height: 42rpx;
    flex-shrink: 0;
    flex-grow: 0;
    color: #FFF6E7;
    font-size: 25rpx;
    background-color: #EB0812;
    border-radius: 100rpx;
  }
}
</style>