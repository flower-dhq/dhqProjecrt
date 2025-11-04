<template>
  <u-transition mode="fade" :show="show">
    <view :class="['yb-tag', getType, getPlain, getPlainFill, getShape, getSize]" :style="[getCustomStyle]" @click="clickEvent">
      <text class="yb-tag__text">{{ text }}</text>
    </view>
  </u-transition>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'

/**
 * @property {string|object} customStyle 自定义样式
 * @property {boolean} show 默认true。标签显示/隐藏
 * @property {string} type 默认primary。标签类型 primary、info、success、warning、error
 * @property {string} text 标签内容
 * @property {boolean} plain 默认false。标签是否镂空
 * @property {boolean} plainFill 默认false。镂空时是否填充背景色
 * @property {string} shape 默认square。标签形状 square（方形，带圆角）、circle（两边半圆形）
 * @property {string} size 默认medium。标签大小 mini、medium、large
 * @event click 点击事件
 */
export default {
  name: 'YbTag',
  mixins: [mpMixin],
  props: {
    show: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'primary',
      validator(val) {
        return ['primary', 'info', 'success', 'warning', 'error'].includes(val)
      }
    },
    text: {
      type: String,
      default: ''
    },
    plain: {
      type: Boolean,
      default: false
    },
    plainFill: {
      type: Boolean,
      default: false
    },
    shape: {
      type: String,
      default: 'square',
      validator(val) {
        return ['square', 'circle'].includes(val)
      }
    },
    size: {
      type: String,
      default: 'medium',
      validator(val) {
        return ['mini', 'medium', 'large'].includes(val)
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    getType() {
      const tmp = this.type || 'primary'
      return 'yb-tag--' + tmp
    },
    getPlain() {
      const tmp = this.type || 'primary'
      return this.plain ? `yb-tag--${tmp}--plain` : ''
    },
    getPlainFill() {
      const tmp = this.type || 'primary'
      return this.plain ? `yb-tag--${tmp}--plain--fill` : ''
    },
    getShape() {
      const tmp = this.shape || 'square'
      return this.shape ? `yb-tag--${tmp}` : ''
    },
    getSize() {
      const tmp = this.size || 'medium'
      return this.shape ? `yb-tag--${tmp}` : ''
    }
  },
  methods: {
    clickEvent() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "uview-ui/libs/css/components.scss";

.yb-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;

  &.yb-tag--circle {
    border-radius: 200rpx;
  }
  &.yb-tag--square {
    border-radius: 6rpx;
  }

  @mixin height($height, $size, $padding) {
    height: $height;
    line-height: $height;
    padding: 0 $padding;
    font-size: $size;
    line-height: $size;
  }
  &.yb-tag--mini {
    @include height(44rpx, 24rpx, 10rpx);
  }
  &.yb-tag--medium {
    @include height(52rpx, 26rpx, 20rpx);
  }
  &.yb-tag--large {
    @include height(64rpx, 30rpx, 30rpx);
  }

  @mixin border($color) {
    background-color: $color;
    border-color: $color;
    color: #FFFFFF;
  }
  &.yb-tag--primary {
    @include border($u-primary);
  }
  &.yb-tag--info {
    @include border($u-info);
  }
  &.yb-tag--success {
    @include border($u-success);
  }
  &.yb-tag--warning {
    @include border($u-warning);
  }
  &.yb-tag--error {
    @include border($u-error);
  }

  @mixin plain($color) {
    border-color: $color;
    color: $color;
  }
  &.yb-tag--primary--plain {
    @include plain($u-primary);
  }
  &.yb-tag--primary--plain--fill {
    background-color: #ecf5ff;
  }
  &.yb-tag--info--plain {
    @include plain($u-info);
  }
  &.yb-tag--info--plain--fill {
    background-color: #f4f4f5;
  }
  &.yb-tag--success--plain {
    @include plain($u-success);
  }
  &.yb-tag--success--plain--fill {
    background-color: #f5fff0;
  }
  &.yb-tag--warning--plain {
    @include plain($u-warning);
  }
  &.yb-tag--warning--plain--fill {
    background-color: #fdf6ec;
  }
  &.yb-tag--error--plain {
    @include plain($u-error);
  }
  &.yb-tag--error--plain--fill {
    background-color: #fef0f0;
  }
}
.yb-tag__text {
  font-size: inherit;
  line-height: inherit;
}
</style>