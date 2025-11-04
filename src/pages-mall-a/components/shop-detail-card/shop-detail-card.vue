<template>
  <view class="shop-detail-card" :style="[{ width: getSize.width }]">
    <view class="shop-image" :style="[getSize]">
      <cl-image :src="imgUrl" mode="widthFix" @click.native.capture="linkTo">
        <view slot="error" class="cl-image__placeholder" >
          <text class="cl-icon-image"></text>
        </view>
      </cl-image>
    </view>
    <text>
      <text v-if="titleTap" class="goods-tag">{{titleTap}}</text>
      {{shopName}}
    </text>
    <view class="footer">
      <view class="footer-left">
        <cl-text class="footer-price" type="price" size="24rpx" :value="price" color="primary" />
        <cl-tag class="footer-coupon" plain size="mini" v-for="(item, index) in coupon" :key="index">{{item}}</cl-tag>
        <text class="footer-saleCount">{{$cmMth.formatSaleCount(saleCount)}}人付款</text>
        <!-- <text class="footer-saleCount">{{saleCount}}人付款</text> -->
      </view>
      <image v-if="isShopCart" class="footer-icon" src="@/pages-mall/static/shop/shop_cart_icon.png" mode="aspectFit" @click="addShopCart" />
    </view>
  </view>
</template>

<script>
/**
 * 瀑布流的商品卡片，图片宽度固定，高度自动伸缩
 * @property {string} imgUrl 图片地址
 * @property {string} shopName 商品名称
 * @property {number|string} price 价格，默认0
 * @property {array} coupon 优惠券名称，例如['满20减4']
 * @property {number|string} saleCount 销量
 * @property {string|undefined} size 设置图片固定宽度和高度，默认不设置，例如"100rpx 100rpx", "100rpx auto", "auto 100rpx", "100% 100%"
 * @property {boolean} isShopCart 是否显示购物车按钮，默认为 true
 * @property {string} titleTap 标签内容，默认为空字符串，例如 自营
 * @event addShopCart 加入购物车
 * @event linkTo 点击跳转到商品详情页面
 */

export default {
  options: { styleIsolation: 'shared' },
  props: {
    // 图片地址
    imgUrl: String,
    // 商品名称
    shopName: String,
    // 价格
    price: {
      type: [Number, String],
      default: 0
    },
    // 优惠券名称，例如['满20减4']
    coupon: {
      type: Array,
      default: () => []
    },
    // 设置图片固定宽度和高度，默认不设置，例如"100rpx 100rpx", "100rpx auto", "auto 100rpx", "100% 100%"
    size: {
      type: [String, undefined],
      default: '100rpx 100rpx',
      validator(val) {
        if (typeof val === 'string') {
          return val.split(' ').length === 2
        }

        return true
      }
    },
    // 销量
    saleCount: {
      type: [Number, String]
    },
    // 是否显示购物车按钮
    isShopCart: {
      type: Boolean,
      default: true
    },
    titleTap: String
  },
  computed: {
    getSize() {
      if (typeof this.size === 'string') {
        const [width, height] = this.size.split(' ')

        return { width, height }
      } else {
        return {}
      }
    }
  },
  methods: {
    // 加入购物车
    addShopCart() {
      this.$emit('addShopCart')
    },
    // 跳转到商品详情页面
    linkTo() {
      this.$emit('linkTo')
    }
  }
}
</script>

<style lang="scss" scoped>
// $size: 100%;

.shop-detail-card {
  // width: $size;
  // height: 524rpx;
  background-color: #fff;
  @include flx-dsp(flex-start, flex-start, column);
  border-radius: 8rpx;
  overflow: hidden;

  .shop-image {
    // width: $size;
  }
  & > text {
    width: 100%;
    height: 67.2rpx;
    box-sizing: border-box;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 26rpx;
    line-height: 34rpx;
    padding: 0 20rpx;
    margin: 32rpx 0 20rpx;
    
    & .goods-tag{
      background-color: $uni-color-primary;
      border-radius: 10rpx;
      color: #fff;
      padding: 2rpx 8rpx;
      font-size: 20rpx;
      margin-right: 10rpx;
      line-height: 20rpx;
    }
  }
  & > .footer {
    width: 100%;
    box-sizing: border-box;
    @include flx-dsp(space-between, center);
    padding: 0 20rpx 20rpx;
  }
  .footer-left {
    @include flx-dsp(flex-start, center);
  }
}
.footer-price::v-deep .cl-text.is-price {
  color: $uni-color-assist;
}
cl-tag.footer-coupon::v-deep .cl-tag,
.footer-coupon {
  padding: 2rpx 4rpx;
  height: 28rpx;
  font-size: 20rpx;
  line-height: 28rpx;
  border-color: $uni-color-assist;
  color: $uni-color-assist;
  margin-left: 4rpx;
}
.footer-saleCount {
  margin: 5rpx 0 0 10rpx;
  font-size: 20rpx;
  color: #999999;
}
.footer-icon {
  width: 36rpx;
  height: 36rpx;
}
::v-deep .cl-image__placeholder {
  min-height: 200rpx;
}
</style>