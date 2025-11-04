<template>
  <view class="favorite-card" @click="linkTo">
    <cl-image :src="imgUrl" size="220rpx" mode="aspectFill">
      <view slot="error" class="cl-image__placeholder">
        <text class="cl-icon-image"></text>
      </view>
    </cl-image>
    <view class="card-content">
      <text class="content-title">{{ name }}</text>
      <text class="content-num">{{ getNumber }}人收藏</text>
      <view class="placeholder"></view>
      <view class="content-bottom">
        <cl-text class="content-price" type="price" size="26rpx" :value="price" color="primary" />
        <cl-tag round type="info" size="mini" v-if="!favState">失效</cl-tag>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 商品收藏卡片
 * @property {string} imgUrl 图片地址
 * @property {string} name 商品名称
 * @property {number} number 收藏人数
 * @property {number|string} price 价格
 * @property {boolean} favState 商品是否失效，false表示失效
 * @event linkTo 点击跳转到商品详情页面
 */

export default {
  options: { styleIsolation: 'shared' },
  props: {
    imgUrl: String,   // 图片地址
    name: String,     // 商品名称
    number: Number,   // 收藏人数
    price: [Number, String], // 价格
    // 商品是否失效，false表示失效
    favState: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    // 收藏人数
    getNumber() {
      let res = parseInt(this.number)

      return Number.isNaN(res) ? 0 : res
    }
  },
  onLoad() {},
  methods: {
    // 跳转到商品详情页面
    linkTo() {
      if (!this.favState) return

      this.$emit('linkTo')
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 220rpx;

.favorite-card {
  width: 100%;
  border-radius: 16rpx;
  background-color: #fff;
  padding: 24rpx 20rpx;
  box-sizing: border-box;
  @include flx-dsp(flex-start, flex-start, row);
}
// .card-img {
//   width: $height;
//   height: $height;
//   @include flx-size('keep');
// }
.card-content {
  @include flx-size('stretch');
  @include flx-dsp(flex-start, flex-start, column);
  margin-left: 26rpx;
  height: $height;

  .content-title {
    font-size: 28rpx;
    line-height: 40rpx;
    @include ellipsis(2);
  }
  .content-num {
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
  }
  .placeholder {
    width: 100%;
    @include flx-size('stretch');
  }
  .content-bottom {
    width: 100%;
    @include flx-dsp(space-between, center, row);
  }
  .content-price::v-deep {
    &.cl-text.is-price,
    .cl-text.is-price {
      color: $uni-color-assist;
    }
  }
  ::v-deep.cl-tag.cl-tag--mini {
    width: 112rpx;
    height: 48rpx;
    text-align: center;
    background-color: #C7C7C7;
  }
}
</style>