<template>
  <view class="count-item">
    <view class="count-name">{{ data.name }} </view>
    <view class="count-num"> {{ data.num }} </view>
    <view class="change-wrap">
      <view class="change-name">
        {{ changeName }}
      </view>
      <view class="change-num" :class="data.changeNum >= 0 ? 'rise' : 'descend'">{{ (data.changeNum > 0 ? '+' : '') + data.changeNum + '%' }} </view>
      <text v-if="data.changeNum > 0" class="iconfont change-icon rise">&#xe788;</text>
      <text v-else-if="data.changeNum < 0" class="iconfont change-icon descend">&#xe606;</text>
    </view>
  </view>
</template>
<script>
export default {
  name: 'countItem',
  props: {
    data: {
      type: Object,
      default: {}
    },
    changeName: {
      type: String,
      default: '较去年'
    }
  }
}
</script>
<style lang="scss" scoped>
.count-item {
  width: 33%;
  padding: 20rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .count-name {
    font-size: 24rpx;
    color: #a0a0a0;
  }
  .count-num {
    font-size: 48rpx;
    font-weight: bold;
    color: #333333;
  }
  .change-wrap {
    display: flex;
    align-items: baseline;
    font-size: 20rpx;
    color: #a0a0a0;
    .change-name {
      color: #a0a0a0;
      padding-right: 4rpx;
    }
    .change-num {
      font-size: 20rpx;
    }
    .change-icon {
      font-size: 14rpx;
    }
    .descend {
      color: #f5212d;
    }
    .rise {
      color: #00b377;
    }
  }
}
</style>
