<template>
  <view :class="['coupon-card', getBoxStyle]">
    <view class="card-detail">
      <text class="card-title">{{ title }}</text>
      <text class="card-info">{{ info }}</text>
      <text class="one-line">{{ coupon.useScopeStr }}</text>
      <text class="one-line">{{ coupon.effectiveTypeSrc }}</text>
    </view>
    <view class="card-price">
      <cl-text type="price" :value="price" size="48rpx" color="primary" />
      <button :class="['card-btn', { hidden: getShowBtn }]" @click="handleClick">{{ getBtnValue }}</button>
    </view>
  </view>
</template>

<script>
// 优惠券类型: receiving: 立即领取, intergal: 积分兑换, useing: 立即使用, empty: 已抢光, used: 已使用, expired: 已过期
const btnValue = {
  receiving: { name: '立即领取', isDisable: false },
  intergal: { name: '积分兑换', isDisable: false },
  useing: { name: '去使用', isDisable: false },
  empty: { name: '', isDisable: true },
  used: { name: '', isDisable: true },
  expired: { name: '', isDisable: true }
}

export default {
  options: { styleIsolation: 'shared' },
  props: {
    title: String, // 标题
    info: String, // 优惠信息，换行直接在字符串里使用 \n
    price: String, // 优惠券价格
    type: { // 优惠券类型
      type: String,
      default: 'empty',
      validator(val) {
        return Object.keys(btnValue).some(item => item === val)
      }
    },
    // 展示多少折扣(discount)，还是展示多少元(price)
    showType: {
      type: String,
      default: 'price',
      validator(val) {
        return ['price', 'discount'].includes(val)
      }
    },
    coupon: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    getBoxStyle() {
      return `type-${this.type}`
    },
    getShowBtn() {
      return btnValue[this.type].isDisable
    },
    getBtnValue() {
      return btnValue[this.type].name
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.type)
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin type-style($type: 'empty', $url: '', $color: $uni-color-main, $bgColor1: #FF1450, $bgColor2: #FF6932) {
  &.type-#{$type} {
    background-image: url($url);

    ::v-deep .cl-text.is-price {
      color: $color;
    }
    .card-btn {
      background-image: linear-gradient(36deg, $bgColor1, $bgColor2);
    }
  }
}

.coupon-card {
  display: flex;
  align-items: center;
  width: 705rpx;
  height: 278rpx;
  background-size: 100% 100%;

  @include type-style('receiving', '~@/pages-mall/static/shop/coupon_receiving_icon.png', $uni-color-main, #FF1450, #FF6932);
  @include type-style('intergal', '~@/pages-mall/static/shop/coupon_intergal_icon.png', #9013FE, #8E7DF1, #D88DFE);
  @include type-style('useing', '~@/pages-mall/static/shop/coupon_useing_icon.png', #3C8EFF, #1875F0, #87BBFF);
  @include type-style('used', '~@/pages-mall/static/shop/coupon_gray_bg.png', #AEAEAE, #AEAEAE, #AEAEAE);
  @include type-style('empty', '~@/pages-mall/static/shop/coupon_empty_icon.png', #AEAEAE, #AEAEAE, #AEAEAE);
  @include type-style('expired', '~@/pages-mall/static/shop/coupon_gray_bg.png', #AEAEAE, #AEAEAE, #AEAEAE);

  &>.card-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 70rpx;
  }
  .card-title {
    font-size: 30rpx;
    color: $uni-text-color;
    @include ellipsis($line: 1);
  }
  .card-info {
    font-size: 24rpx;
    color: #666;
    line-height: 32rpx;
    margin-top: 8rpx;
    @include ellipsis($line: 2);
  }

  .one-line{
    font-size: 24rpx;
    color: #666;
    margin-top: 4rpx;
    @include ellipsis($line: 1);
  }

  &>.card-price {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-right: 60rpx;
  }
  ::v-deep .cl-text__symbol--price {
    font-size: 44rpx;
  }
  .card-btn {
    width: 126rpx;
    height: 40rpx;
    padding: 0;
    font-size: 20rpx;
    color: #fff;
    line-height: 40rpx;
    border-radius: 20rpx;
    margin: 40rpx initial 0;

    &.hidden {
      visibility: hidden;
    }
  }
}
</style>