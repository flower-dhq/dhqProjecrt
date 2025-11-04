<template>
  <view class="icon-around" @click="click">
    <view :class="['icon-panel', getDirectClass, getSizeClass]">
      <image
        :class="['icon-image', { 'image-default': coverBG, 'is-round': round }]"
        mode="aspectFit"
        :src="src"
        @error="errorLoad"
      />
      <text class="icon-label">{{ text }}</text>
    </view>
  </view>
</template>

<script>
/**
 * 第一种：图标在上，文字在下
 * 第二种：图标在左，文字在右
 * @property {string} src 图片地址
 * @property {string} text 图片文字
 * @property {string} direction 文字方向。默认bottom
 * @property {string} size 大小。默认default。['default', 'middle-less', 'middle', 'middle-rd']
 * @property {boolean} round 图片是否圆形
 * @event click 点击事件
 */

export default {
  props: {
    src: String,
    text: String,
    // 文字方向
    direction: {
      type: String,
      default: 'bottom',
      validator(val) {
        return ['bottom', 'right'].some(item => item === val)
      }
    },
    // 大小
    size: {
      type: String,
      default: 'default',
      validator(val) {
        return ['default', 'middle-less', 'middle', 'middle-rd'].some(item => item === val)
      }
    },
    // 是否圆形
    round: Boolean
  },
  data() {
    return {
      coverBG: false
    }
  },
  computed: {
    getSizeClass() {
      return `size-${this.size}`
    },
    getDirectClass() {
      return `text-${this.direction}`
    }
  },
  methods: {
    errorLoad() {
      this.coverBG = true
    },
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin size-style($width: 36rpx, $font-size: 16rpx, $color: #333) {
  & > .icon-image {
    width: $width;
    height: $width;
  }
  & > .icon-label {
    font-size: $font-size;
    color: $color;
    line-height: 1;
  }
}

.icon-around {
  display: inline-block;
}
.icon-panel {
  display: flex;
  justify-content: flex-start;
  align-items: center;

/************
 * $props.direction
 ************/
  &.text-right {
    flex-direction: row;
  }
  &.text-bottom {
    flex-direction: column;
  }
/************/
  & > .icon-image {
    width: 36rpx;
    height: 36rpx;

    &.image-default {
      background-color: #f0f2f5;
    }
    &.is-round {
      border-radius: 100%;
    }
  }

/************
 * $props.size
 ************/
  &.size-default {
    @include size-style(36rpx, 16rpx, $uni-text-color);
  }
  &.size-middle-less {
    @include size-style(44rpx, 18rpx, $uni-text-color);
  }
  &.size-middle {
    @include size-style(48rpx, 28rpx, $uni-text-color-grey);
  }
  &.size-middle-rd {
    @include size-style(32rpx, 26rpx, $uni-text-color);
  }
/************/
}
</style>
