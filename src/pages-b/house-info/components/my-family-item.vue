<style lang="scss" scoped>
.list-item{
  padding: 32rpx 0 28rpx;
  border-bottom: 2rpx solid #E8E8E8;
}
.list-top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333;
  padding-bottom: 26rpx;
  .role{
    padding-left: 20rpx;
    color: #0DB14B;
  }
  .status{
    width: 100rpx;
    text-align: right;
    font-size: 24rpx;
    color: var(--app-primary-color);
  }
}
.address{
  font-size: 28rpx;
  font-size: 28rpx;
  color: #999;
}
.btn-list{
  text-align: right;
  padding: 22rpx 0 0;
  text{
    display: inline-block;
    padding: 8rpx 24rpx;
    font-size: 26rpx;
    border-radius: 28rpx;
    margin-left: 20rpx;
    border: 1px solid var(--app-primary-color);;
    color: var(--app-primary-color);
  }
}
</style>
<template>
  <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="list-item">
      <view class="list-top">
        <text class="name"> {{ familyData.ownerName }} </text>
        <text class="phone"> {{ familyData.ownerPhones }} 
          <text class="role">{{ familyData.ownerOrFamily }}</text>
        </text>
        <text class="status"> {{ familyData.status }} </text>
      </view>
      <view class="address"> {{ familyData.address }} </view>
      <view v-if="familyData.isFlag" class="btn-list">
        <text @click="clickBtn(familyData,0)">删除</text>
        <!-- <text @click="clickBtn(familyData,1)">解除消息提醒</text> -->
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props:{
    familyData:{
      type:Object,
      default:{
        ownerName:'',
        ownerPhones:'',
        status:'',
        address:''
      }
    }
  },
  data(){
    return{
      clickBtn(item,type){
        this.$emit('openModal',item,type)
        // this.$parent.openModal(item,type)
      }
        
    }
  }
}
</script>