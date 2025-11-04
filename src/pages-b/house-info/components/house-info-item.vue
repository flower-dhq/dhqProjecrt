<style lang="scss" scoped>
.house_info--box{
  padding: 10px 8px;
  border-bottom: 1px solid #F5F0F0;
}
.top{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text:first-child{
    font-size: 24rpx;
    color: #999;
  }
  text:last-child{
    font-size: 28rpx;
    color:#ff0167;
  }
}
.house-addr{
  padding: 10rpx 0;
  font-size: 28rpx;
  color:#333;
}
.btn-cont{
  height: 46rpx;
  position: relative;
  text{
    position: absolute;
    right: 0rpx;
    color: var(--app-primary-color);
    font-size: 22rpx;
    padding: 6rpx;
    margin-left: 10rpx;
    border-style:solid;
    border-width:2rpx;
    border-color:var(--app-primary-color);
    width: 120rpx;
    text-align: center;
    border-radius: 100rpx;
  }
  .select-btn{
    color: #999;
    border-color: #dcdcdc;
    background-color: #fff;
  }
}
.reason{
  text{
    color: #999;
    font-size: 24rpx;
  }
}
</style>
<template>
  <view class="house_info--box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="top">
      <text>{{ obj.projectName }}</text>
      <text>{{ obj.authTypeStr }}</text>
    </view>
    <view class="house-addr">
      <text>{{ obj.address }}</text>
    </view>
    <view class="btn-cont">
      <text @click="setDefault(obj.isDefault)" v-if="obj.authType === 1 && !obj.HouseAuthItem && obj.isDefault!==1">设为默认</text>
      <text class="select-btn" v-if="obj.authType === 1 && !obj.HouseAuthItem && obj.isDefault===1">默认地址</text>
    </view>
    <view class="reason" v-if="obj.authType===3">
      <text>{{ obj.cancelDesc ? obj.cancelDesc : obj.rejectDesc }}</text>
    </view>
  </view>
</template>
<script>
export default {
  props:{
    obj:{
      type:Object,
      default:{}
    }
  },
  methods:{
    setDefault(){
      this.$emit('setDefault');
    }
  }
}
</script>