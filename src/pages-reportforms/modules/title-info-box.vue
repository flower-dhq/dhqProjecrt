<template>
  <view class="info-box">
    <view class="text-box">
      <view class="text1">订阅名称</view>
      <view class="text2">总部{{titleInfo.name}}</view>
    </view>
    <view class="text-box r">
      <view class="text1">统计时间</view>
      <view class="text2">{{titleInfo.time}}</view>
    </view>
  </view>
</template>
<script>
export default {
  props:{
    titleInfo:{}
  }
}
</script>
<style lang="scss" scoped>
.info-box{
  display: flex;
  border-radius: 12rpx;
  background-color: #fff;
}
.text-box{
  padding: 30rpx;
  width: 50%;
  .text1{
    font-size: 26rpx;
    color: #333333;
    margin-bottom: 16rpx;
  }
  .text2{
    font-size: 34rpx;
    font-weight: bold;
    color: #333333;
  }
}
.r{
  text-align: right;
}
</style>