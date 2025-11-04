<style lang="scss" scoped>
.column-caption {
  width: 320rpx;
  height: 120rpx;
  background: #f6f9ff;
  box-sizing: border-box;
  padding: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .txt-figure{
    display: flex;
    flex-direction: column;
    .tf-t{
      font-size: 20rpx;
      color: #666;
      margin-bottom: 20rpx;
    }
    .tf-v {
      font-size: 40rpx;
      color: #000;
      font-weight: bold;
    }
  }
  .column-icon{
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    .col{
      width: 12rpx;
      background: linear-gradient(180deg, #1EB4EA 0%, #2761FF 100%);
      opacity: 0.7;
      border-radius: 2px 2px 0px 0px;
    }
    .col:nth-child(1) {
      height: 20rpx;
    }
    .col:nth-child(2) {
      height: 40rpx;
      margin: 0 6rpx;
    }
    .col:nth-child(3) {
      height: 60rpx;
    }
  }
}
</style>

<template>
  <view class="column-caption">
    <view class="txt-figure">
      <text class="tf-t">{{ configData.title }}</text>
      <text class="tf-v" :class="[unit == 1 ? 'yuan-size' : '']">{{ configData.value }}</text>
    </view>
    <view class="column-icon">
      <view class="col"></view>
      <view class="col"></view>
      <view class="col"></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    unit: {
      type: Number,
      default: 2
    },
    configData: {
      type: Object,
      default() {
        return {
          title: '',
          value: ''
        };
      },
    },
  },
  methods: {},
};
</script>
