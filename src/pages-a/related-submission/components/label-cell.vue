<style lang="scss" scoped>
.label-cell {
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;

  &__box {
    position: relative;
    @include flx-dsp($jsc: flex-start, $ali: center);
    margin: 0 auto;
    width: 690rpx;
    padding: 30rpx 0;
    &.line::after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: '';
      display: block;
      width: 100%;
      height: 1rpx;
      transform: translateY(50%);
      background-color: #eaeaea;
    }
  }
  &__label {
    @include flx-dsp($jsc: flex-start, $ali: center);
    font-size: 30rpx;
    font-weight: 400;
    color: #333;
    width: 180rpx;
    display: block;
    padding-right: 20rpx;
    box-sizing: border-box;

    .required {
      margin-left: 2px;
      color: #ff0000;
    }
  }
  &__content {
    @include flx-dsp($jsc: space-between, $ali: center);
    flex: 1;
    .slot {
      flex: 1;
      font-size: 15px;
    }
    .placehoder {
      width: 100%;
      display: inline-block;
      text-align: left;
      color: #ccc;
      font-size: 30rpx;
    }
  }
}
</style>

<template>
  <view class="label-cell" :style="[THEME_CSS_VAR]">
    <view class="label-cell__box" :class="[border ? 'line' : '']">
      <view class="label-cell__label">
        <text>{{ label }}</text>
        <text class="required" v-if="required">*</text>
      </view>
      <view class="label-cell__content" @click="click">
        <text v-if="placehoderVisible" class="placehoder">{{ placehoder }}</text>
        <view v-else class="slot">
          <slot></slot>
        </view>
        <u-icon v-if="arrow" name="arrow-right" color="#999"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    placehoderVisible: {
      type: Boolean,
      default: true,
    },
    placehoder: {
      type: String,
      default: '请选择',
    },
  },
  methods: {
    click() {
      this.$emit('click')
    }
  },
  onLoad() {},
};
</script>
