<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="tip-select">
      <image class="car_box_bg" :src="require(`@/static/${[THEME_NAME]}/multiplexing/pay-success.png`)" v-if="type == '1'"></image>
      <image class="car_box_bg" :src="require(`@/static/${[THEME_NAME]}/multiplexing/pay-fail.png`)" v-if="type == '2'"></image>
      <view class="pay_txt">{{ type == '1' ? '支付成功' : '支付失败' }}</view>
      <view class="all_txt" v-if="type == '1'">
        <view class="txt1">金额</view>
        <view class="txt2">￥200.00</view>
      </view>
      <view class="btn">返回</view>
    </view>
  </view>
</template>

<script>
import { getPrivacyAgreement } from '@/service/community'

export default {
  data() {
    return {
      type:'',//1个人钱吧2企业钱包
      changeType:'1',
    }
  },
  onLoad(options) {
    this.type = options.type
    if(this.type == '1'){
      uni.setNavigationBarTitle({
        title: '支付成功'
      })
    }else{
      uni.setNavigationBarTitle({
        title: '支付失败'
      })
    }
  },
  methods: {
    changeSelect(type){
      this.changeType = type
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .u-image {
  margin: 0 auto;
}

.tip-select{
  padding-top: 130rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .car_box_bg{
    width: 200rpx;
    height: 200rpx;
  }
  .pay_txt{
    font-size: 40rpx;
    line-height: 56rpx;
    padding: 34rpx 0 20rpx;
  }
  .all_txt{
    display: flex;
    align-items: flex-end;
    .txt1{
      font-size: 30rpx;
      line-height: 42rpx;
      position: relative;
      top: -6rpx;
    }
    .txt2{
      color: #C8924B;
      font-size: 40rpx;
      font-weight: bold;
      line-height: 56rpx;
    }
  }
  .btn{
    width: 650rpx;
    height: 80rpx;
    border: 1px solid #C8924B;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #C8924B;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 16rpx;
    cursor: pointer;
    margin-top: 200rpx;
  }
}
</style>