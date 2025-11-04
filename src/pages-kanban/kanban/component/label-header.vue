<style scoped lang="scss">
.box {
  background-color: #ffffff;
  padding: 20rpx;
  margin: 0 auto;
  border-radius: 12rpx;
  width: 710rpx;
  box-sizing: border-box;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #222222;

  box-sizing: border-box;
}

.cont {
  width: 100%;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  &-l {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  &-r {

  }
}

.header::before {
  content: '';
  height: 32rpx;
  width: 6rpx;
  background: #2761ff;
  margin: 0 10rpx 0 0;
  position: absolute;
  left: 20rpx;
}
</style>

<template>
  <view class="box">
    <view class="header">
      <view class="header-l">
        <text class="title">{{ title }}</text>
        <slot name="slot-left"></slot>
      </view>
      <view class="header-r">
        <slot name="slot-right"></slot>
      </view>
    </view>
    <view class="cont">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
