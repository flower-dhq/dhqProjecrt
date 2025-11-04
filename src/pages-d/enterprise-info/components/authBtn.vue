<style scoped lang="scss" >
.companyAuth_cont{
  .btn_cont{
    width: 540rpx;
    margin:auto;
    padding: 20rpx 0;
    .add_btn{
      width: 100%;
      height: 68rpx;
      line-height: 68rpx;
      border-radius: 8rpx;
      color: #fff;
      background-color: var(--app-primary-color);
      border: none;
      button::after {
             border: none !important;
			}
     button{
        border: none !important;
      }
    }
  }
}
.companyAuth_cont .btn_cont  button::after {
             border: none !important;
			}
</style>

<template>
  <view class="companyAuth_cont" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="btn_cont">
      <button type="primary" class="add_btn">{{btnName}}</button>
    </view>
  </view>
</template>

<script>
export default {
  props:['btnName']
}
</script>