<template>
  <view class="star-rating-container">
    <view v-for="(star, index) in elementList" :key="index" class="star-item" @click="handleClick(star, index)" @touchstart="showTooltip(index)">
      <image v-if="value && index < value" src="@/static/icon-img/rate_icon.png" style="width: 50rpx; height: 50rpx;" />
      <image v-else src="@/static/icon-img/rate_no_icon.png" style="width: 50rpx; height: 50rpx;" />
      <view v-if="showTip && activeIndex === index" class="tooltip">
        {{ star.title }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    value: { type: Number, default: 0 },
    elementList: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return {
      showTip: false,
      activeIndex: -1,
      timer: null,
    };
  },
  methods: {
    handleClick(star) {
      if (this.disabled) {
        return;
      }
      this.$emit('input', star.score)
      this.$emit('change', star);
    },
    showTooltip(index) {
      if (this.disabled) {
        return;
      }
      this.activeIndex = index;
      this.showTip = true;
      if(this.timer){
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.showTip = false;
      }, 3000);
    }
  },
};
</script>

<style scoped>
.star-rating-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10rpx 0;
  position: relative;
}
.star-item {
  position: relative;
}
.tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FFFFFF;
  border: 2rpx solid var(--app-primary-color);
  color: #333333;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  white-space: nowrap;
  z-index: 999;
  pointer-events: none;
}
.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--app-primary-color) transparent transparent transparent;
}
</style>
