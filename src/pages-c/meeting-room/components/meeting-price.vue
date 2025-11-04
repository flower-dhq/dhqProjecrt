<template>
  <view class="meeting-price" :style="{ color }">
    <text class="price-12">{{ isSign ? '￥' : '' }}</text>
    <!-- <text :class="{isBigSize?'price-22':'price-15'}">{{ number }}</text> -->
    <text class="price-22" :class="{'price-15': isBigSize}">{{ number }}</text>
    <text class="price-12">{{ suffix }}</text>
  </view>
</template>

<script>
/**
 * 价格
 * @property {number|string} number 数字
 * @property {string} suffix 后缀内容
 * @property {boolean} isSign 是否显示符号
 */
export default {
  props: {
    number: {
      type: [Number, String],
      default: 0
    },
    suffix: {
      type: String,
      default: '/天'
    },
    isSign: {
      type: Boolean,
      default: true
    },
    isBigSize: {
      type: Boolean,
      default: false
    },
    color: String
  }
}
</script>

<style lang="scss" scoped>
.price-12 {
  font-size: 12px;
  line-height: 1;
  color: inherit;
}
.price-22 {
  font-size: 22px;
  line-height: 1;
  color: inherit;
}
.price-15 {
  font-size: 15px !important;
  line-height: 1;
  color: inherit;
}
</style>