<style lang="scss" scoped>
.list-item{
  padding: 30rpx 0;
  border-bottom: 2rpx solid #E8E8E8;
}
.list-top{
  display: flex;
  font-size: 28rpx;
  color: #333;
  padding-bottom: 16rpx;
  .name{
    width: 140rpx;
  }
  .phone{
    flex: 1;
    padding-left: 24rpx;
  }
  .status{
    width: 100rpx;
    text-align: right;
    font-size: 24rpx;
    color: #FF0167;
  }
}
.address{
  font-size: 28rpx; 
  color: #999;
}
.companyName{   
  padding-bottom: 16rpx;
  font-size: 28rpx;  
}

</style>
<template>
  <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="list-item">
      <view  class="companyName" v-if="addrData.isEnterpriseHouse == 1">
         {{ addrData.companyName }} 
      </view>
      <view class="list-top">
        <text class="name"> {{addrData.isEnterpriseHouse == 1 ? addrData.ownerName : addrData.name }} </text> 
        <text class="phone"> {{ addrData.ownerPhones }} 
        </text>
        <text class="status"> {{ addrData.authStatus }} </text>
      </view>
      <view class="address"> {{ addrData.address }} </view>
    </view>
  </view>
</template>
<script>
export default {
  props:{
    addrData:{
      type:Object,
      default:{}
    }
  },
  data(){
    return{
      
        
    }
  }
}
</script>