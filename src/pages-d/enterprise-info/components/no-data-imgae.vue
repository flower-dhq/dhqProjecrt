<style lang="scss" scoped>
.no-data-pic-box{
  height: 100%;
  width: 100%;
  padding-top: 330rpx;
  background-color: #fff;
  box-sizing: border-box;
}
.img{
  display: block;
  width: 350rpx;
  height: 350rpx;
  margin: 20rpx auto ;
}
.text{
  display: block;
  text-align: center;
  color: #999;
}
</style>
<template>
  <view class="no-data-pic-box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <image class="img" :src='nodataImg'></image>
    <text class="text">暂无数据</text>
  </view>
</template>
<script>
export default {
  data(){
    return{
    }
  },
  computed:{
    nodataImg() {
      return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/tips.png`
    },
  }
}
</script>