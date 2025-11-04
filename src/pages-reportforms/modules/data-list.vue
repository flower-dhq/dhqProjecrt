<template>
  <view>
    <view class="data-list">
      <view class="data-item" v-for="(item,i) in list" :key="i" :class="{'data-item1':list.length==1}">
        <view class="bg-cont">
          <view class="text1">{{item.label}}</view>
          <view class="text2">{{item.value}}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props:{
    list:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return{}
  }
}
</script>
<style lang="scss" scoped>
.data-list{
  overflow: hidden;
  padding: 30rpx 20rpx 0;
  height: 120rpx;
  .data-item{
    float: left;
    width: 25%;
    padding: 0 8rpx;
    box-sizing: border-box;
  }
  .data-item1{
    width: 100%;
  }
}
.bg-cont{
  padding: 20rpx 0;
  background-color: #F8F8F8;
  box-sizing: border-box;
  .text1{
    font-size: 20rpx;
    color: #666666;
    text-align: center;
    margin-bottom: 4rpx;
  }
  .text2{
    font-size: 40rpx;
    color: #333333;
    text-align: center;
  }
}
</style>