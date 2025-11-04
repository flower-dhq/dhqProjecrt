<template>
  <view class="cart-card-item" @click="click">
    <slot name="prefix"></slot>
    <image class="cart-image" :src="src" mode="aspectFill" />
    <view class="cart-info">
      <text class="cart-name">{{ name }}</text>
      <text class="cart-spec">{{ specification }}</text>
      <text class="cart-coupon">{{ coupon }}</text>
      <!-- 底部有多种类型 -->
      <view class="cart-info-footer" v-if="type === 'default'">
        <cl-text v-if="valid" type="price" size="26rpx" :value="price" color="primary" />
        <cl-text v-else size="26rpx" :value="invalidDesc" color="error" />
        <!-- 加个空事件的view，为了阻止事件冒泡 -->
        <view @click.stop v-if="valid">
          <cl-input-number disabled v-model="syncCount" :step="1" :min="1" @change="numberChange"></cl-input-number>
        </view>
      </view>
      <view class="cart-info-footer" v-if="type === 'textNumber'">
        <text class="text-number">x {{syncCount}}</text>
        <view v-if="otherData.asType != 20">
          <text v-if="refundText" class="refund">退款</text>
          <cl-text type="price" size="26rpx" :value="price" color="primary" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 购物车卡片
 * @property {string} src 商品图片
 * @property {string} name 商品名称
 * @property {string} specification 商品规格名称
 * @property {string} coupon 商品优惠券，换行使用\n
 * @property {number|string} price 商品价格
 * @property {number} value 商品数量，使用v-model
 * @property {string} invalidDesc 失效原因
 * @property {string} valid 是否有效结算   1 正常结算   0失效    显示invalidDesc
 * @property {string} type 底部类型['default', 'textNumber', 'none']，默认default
 * @event input 绑定v-model
 * @event numberChange 商品数量更改事件
 * @event click 点击事件
 */

export default {
  options: { styleIsolation: 'shared' },
  props: {
    // 商品图片
    src: String,
    // 商品名称
    name: String,
    // 商品规格名称
    specification: String,
    // 商品优惠券，换行使用\n
    coupon: String,
    // 商品价格
    price: {
      type: [Number, String],
      default: 1
    },
    // 商品数量，使用v-model
    value: {
      type: Number,
      default: 1
    },
    invalidDesc: String,
    valid: Number,
    /*
     * 底部类型
     * default: 左右结构，左边商品价格，右边商品数量输入框
     * textNumber: 左右结构，左边商品数量文本，右边商品价格
     * none: 底部不出现，及不出现商品数量文本，和商品价格
     */
    type: {
      type: String,
      default: 'default',
      validator(val) {
        return ['default', 'textNumber', 'none'].some(item => item === val)
      }
    },
    // 是否显示退款文本
    refundText: {
      type: Number,
      default: 0
    },
    otherData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    syncCount: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
      shopNum: 1
    }
  },
  methods: {
    numberChange() {
      this.$emit('numberChange')
    },
    // 点击跳转到商品详情页面
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.cart-card-item {
  width: 100%;
  @include flx-dsp(flex-start, flex-start, row);
  background-color: #fff;
}
.cart-image {
  width: 180rpx;
  height: 180rpx;
  margin-right: 24rpx;
  @include flx-size('keep');
  border-radius: 8rpx;
}
.cart-info {
  width: 100%;
  @include flx-dsp(flex-start, flex-start, column);

  .cart-name {
    font-size: 26rpx;
    line-height: 36rpx;
    @include ellipsis(2);
  }
  .cart-spec {
    font-size: 24rpx;
    color: #999;
    margin-top: 16rpx;
  }
  .cart-coupon {
    font-size: 24rpx;
    color: $uni-color-assist;
    line-height: 40rpx;
    margin-top: 14rpx;
  }
}
.cart-info-footer {
  width: 100%;
  margin-top: 18rpx;
  @include flx-dsp(space-between, center, row);
  .refund{
    color: #999;
    font-size: 26rpx;
    margin-right: 10rpx;
  }
}
.text-number {
  font-size: 24rpx;
}
::v-deep .cl-text.is-price {
  color: $uni-color-assist;
}
::v-deep .cl-input-number__value {
  margin: 0;
  padding: 0 20rpx;
  height: 40rpx;
  background-color: #f5f5f5;
}
::v-deep .cl-input-number__minus {
  background-color: initial;
}
::v-deep .cl-input-number__plus {
  background-color: initial;
  color: #333;
}
</style>