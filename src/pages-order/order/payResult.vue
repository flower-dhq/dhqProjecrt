<template>
  <view class="pay-result-wrap" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <template v-if="payStatus == '1'">
      <view class="pay-icon-wrap">
        <u-icon name="checkmark-circle-fill" color="#05aa77" size="120"></u-icon>
      </view>
      <view class="status-text">支付成功</view>
    </template>
    <template v-else>
      <view class="pay-icon-wrap" style="transform: rotate(180deg)">
        <u-icon name="info-circle-fill" color="#cccccc" size="120"></u-icon>
      </view>
      <view class="status-text">支付失败</view>
    </template>
    <view class="cancel-btn-wrap">
      <view class="cancel-btn" @click="goBack">返回</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      payStatus: '',
    };
  },
  onLoad(options) {
    this.payStatus = options.status;
    uni.setNavigationBarTitle({
      title: this.payStatus == '1' ? '支付成功' : '支付失败',
    });
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
  },
};
</script>
<style scoped lang="scss">
.pay-result-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  padding-top: 140rpx;
  .pay-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .status-text {
    padding-top: 30rpx;
    width: 100%;
    text-align: center;
    font-size: 46rpx;
  }
  .cancel-btn-wrap {
    width: 100%;
    padding-top: 100rpx;
    .cancel-btn {
      margin: 0 auto;
      width: 80%;
      padding: 20rpx 0;
      text-align: center;
      background: var(--app-primary-color);
      border-radius: 50rpx;
      color: #fff;
      font-size: 30rpx;
    }
  }
}
</style>
