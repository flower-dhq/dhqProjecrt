<template>
  <view class="pull-down-panel" @click.stop="handleCloseView">
    <view class="panel-wrapper" @click.stop>
      <view class="wrapper-content">
        <slot name="content"></slot>
      </view>
      <view class="footer-btn">
        <view v-if="reset" class="reset" @click="handleReset">重置</view>
        <view class="confirm" @click="handleConfirm">确认</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    reset: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleCloseView() {
      this.$emit('closePanel')
    },
    handleReset() {
      this.$emit('reset')
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.pull-down-panel {
  position: absolute;
  width: 100%;
  background: rgba($color: #000, $alpha: 0.5);
  z-index: 1;
  overflow: hidden;

  .panel-wrapper {
    position: relative;
    width: 100%;
    max-height: 62%;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
    z-index: 1;

    .wrapper-content {
      position: relative;
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .footer-btn {
      width: 100%;
      display: flex;
      .reset {
        width: 32%;
        text-align: center;
        padding: 24rpx 0;
        font-size: 32rpx;
        
        
      }
      .confirm {
        flex: 1;
        text-align: center;
        padding: 24rpx 0;
        color: #fff;
        background: #2761ff;
        font-size: 32rpx;
        
        
      }
    }
  }
}
</style>