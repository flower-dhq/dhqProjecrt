<template>
  <view class="yb-circle-progress" :style="[{backgroundColor: activeColor}, sumWidth]">
    <view class="left" :style="[leftStyle, sumWidth]"></view>
    <view
      class="right"
      :style="[rotateStyle, rightStyle, sumWidth]"
    ></view>
    <view class="inner" :style="[innerWidth]">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin';

export default {
  name: 'yb-circle-progress',
  mixins: [mpMixin],
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    inactiveColor: {
      type: String,
      default: '#e9efff'
    },
    activeColor: {
      type: String,
      default: '#2761FF'
    },
    width: {
      type: String,
      default: '160rpx'
    },
    borderWidth: {
      type: String,
      default: '30rpx'
    }
  },
  computed: {
    rotateStyle() {
      const tempNum = this.percent || 0
      const deg = (tempNum / 100) * 360;
      return {
        transform: `translate(-50%, -50%) rotate(${deg > 180 ? deg - 180 : deg}deg)`
      };
    },
    sumWidth() {
      return {
        width: this.width,
        height: this.width
      }
    },
    innerWidth() {
      const match = this.width.match(/[a-z]+$/gi)
      const unit = match?.[0] ?? 'rpx'
      const width = parseFloat(this.width) || 0
      const borderWidth = parseFloat(this.borderWidth) || 0
      const sum = (width >= borderWidth) ? (width - borderWidth) : 0
      return {
        width: sum + unit,
        height: sum + unit
      }
    },
    leftStyle() {
      const size = uni.$u.getPx(this.width)
      const halfSize = uni.$u.addUnit((size / 2), 'px') // 取一半圆
      return {
        backgroundColor: this.inactiveColor,
        clip: `rect(auto, ${halfSize}, auto, auto)`,
      }
    },
    rightStyle() {
      const size = uni.$u.getPx(this.width) // 将rpx转为了px，然后再取整数
      const halfSize = uni.$u.addUnit((size / 2), 'px') // 取一半圆
      const tempNum = this.percent || 0
      return {
        backgroundColor: tempNum > 50 ? this.activeColor : this.inactiveColor,
        clip: `rect(auto, auto, auto, ${halfSize})`,
      }
    }
  },
};
</script>


<style lang="scss" scoped>
.yb-circle-progress {
  position: relative;
  border-radius: 50%;
  flex: 0 0 auto;
}
.left {
  position: absolute;
  // margin: auto;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.right {
  position: absolute;
  // margin: auto;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  transition: transform 0.2s;
}
.inner {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  background: #fff;
  border-radius: 50%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>