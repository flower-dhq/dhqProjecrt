<template>
  <view class="count-item">
    <view class="status-wrap">
      <view class="status-name">
        {{ data.name }}
      </view>
      <view class="status-num">
        {{ data.num }}
      </view>
    </view>
    <view class="count-nums">
      <view class="count-num" v-for="(item, index) in data.yjList" :key="index">
        <view class="count-name">{{ item.yjName }} </view>
        <view class="count-val">{{ item.yjNum }} </view>
        <view class="count-lv"> 预警率 {{ item.yjLv }}%</view>
        <view class="count-change">
          <view class="change-name"> {{ changeName }}</view>
          <view class="change-num" :class="item.changeNum >= 0 ? 'rise' : 'descend'">{{ (item.changeNum > 0 ? '+' : '') + item.changeNum + '%' }} </view>
          <text v-if="item.changeNum > 0" class="iconfont change-icon rise">&#xe788;</text>
          <text v-else-if="item.changeNum < 0" class="iconfont change-icon descend">&#xe606;</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'countItem2',
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
  width: 100%;
  height: 200rpx;
  display: flex;
  border: 1px solid #eaeaea;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  .status-wrap {
    width: 150rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f4f7ff;
    color: var(--app-primary-color);
    .status-name {
      font-size: 24rpx;
    }
    .status-num {
      font-size: 44rpx;
      font-weight: bold;
    }
  }
  .count-nums {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .count-num {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .count-name {
        font-size: 20rpx;
        color: #a0a0a0;
      }
      .count-val {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      .count-lv {
        font-size: 16rpx;
        color: #666666;
      }
      .count-change {
        font-size: 16rpx;
        display: flex;
        align-items: baseline;
        .change-name {
          color: #a0a0a0;
          padding-right: 4rpx;
        }
        .change-icon {
          font-size: 16rpx;
        }
        .descend {
          color: #f5212d;
        }
        .rise {
          color: #00b377;
        }
      }
    }
  }
}
</style>
