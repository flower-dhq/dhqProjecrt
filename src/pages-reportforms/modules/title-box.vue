<template>
  <view class="title-box">
    <view class="text">{{title}}</view>
    <view class="icon" @click="toDetail">
      <u-icon name="arrow-right" color="#B6B6B6" size="18"></u-icon>
    </view>
  </view>
</template>
<script>
export default {
  props:{
    title:{
      type:String,
      default:'工单情况'
    }
  },
  methods:{
    toDetail(){
      this.$emit('toDetail')
    }
  }
}
</script>
<style lang="scss" scoped>
.title-box{
  height: 100rpx;
  line-height: 100rpx;
  display: flex;
  border-bottom: 1px solid #EBEBEB;
}
.text{
  position: relative;
  padding-left: 52rpx;
  flex: 1;
  font-size: 30rpx;
  color: #222222;
  font-weight: bold;
}
.text::before{
  content: '';
  position: absolute;
  top: 34rpx;
  left: 30rpx;
  display: block;
  width: 6rpx;
  height: 32rpx;
  background-color: #2761FF;
  
}
.icon{
  width: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>