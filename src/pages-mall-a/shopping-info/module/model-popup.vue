<template>
  <cl-popup :visible.sync="isShowCoupon" direction="bottom" size="916rpx" :padding="0" @close="coupopClose">
    <view class="model-popup">
      <!-- 商品的标题和价格 -->
      <view class="shop-info">
        <image
          :src="getSelSpec.image || otherParams.imgUrl"
          mode="aspectFit"
          @click="previewImage(getSelSpec.image,otherParams.imgUrl)"
        />
        <view class="title-panel">
          <text class="shop-title">{{ otherParams.shopName }}</text>
          <view class="price-panel">
            <cl-text :value="getSpecPrice" type="price" size="26rpx" color="primary"></cl-text>
            <text class="shop-count">（库存{{ getStoreCount }}件）</text>
          </view>
        </view>
      </view>
      <scroll-view class="coupon-scroll" scroll-y="true">
        <!-- 配送方式 -->
        <view class="flex-form-panel">
          <text class="flex-form-title">配送方式</text>
          <cl-radio-group class="flex-form-list" v-model="deliveryStore.selDeliveryId" border>
            <cl-radio
              class="model-tag"
              v-for="item in getDeliveryValues()"
              :key="item.key"
              :label="item.key"
            >{{ item.value }}</cl-radio>
          </cl-radio-group>
        </view>
        <!-- 规格型号 -->
        <view class="flex-form-panel">
          <text class="flex-form-title">规格型号</text>
          <cl-radio-group class="flex-form-list" v-model="specStore.selSpecId" border @change="ruleStock">
            <cl-radio
              class="model-tag"
              v-for="item in getSpecValues()"
              :key="item.gsId"
              :label="item.gsId"
              :disabled="item.disabled"
            >{{ item.gsName }} <view v-if="item.promotionActivity" class="activity"><cl-icon name="cl-icon-active" color="white" :size="20"></cl-icon></view> </cl-radio>
          </cl-radio-group>
        </view>
        <!-- 数量 -->
        <view class="shop-number">
          <text class="shop-number-text">数量</text>
          <!-- 单独购买不限制数量 -->
          <cl-input-number v-if="clickSource === 'aloneBuy'" v-model="specStore.shopNum" :step="1" :min="1" :max="getSelSpec.storeCount" @change="inputChange($event, getSelSpec.storeCount)"></cl-input-number>
          <template v-else-if="getSelSpecType === 'default'">
            <!-- 普通商品不限制购买数量 -->
            <cl-input-number v-model="specStore.shopNum" :step="1" :min="1" :max="getStoreCount" @change="inputChange($event, getStoreCount)"></cl-input-number>
          </template>
          <template v-else-if="buyLimitNum === 0">
            <!-- 活动商品的购买数量buyLimit为0，表示不限制购买数量 -->
            <cl-input-number v-model="specStore.shopNum" :step="1" :min="1" :max="getStoreCount" @change="inputChange($event, getStoreCount)"></cl-input-number>
          </template>
          <template v-else-if="buyLimitNum === 1">
            <!-- buyLimit为1，表示限制购买1个，则只展示文本，因为客户觉得按钮不能点击就是个bug，SB -->
            <text class="cl-input-number__value">1</text>
          </template>
          <template v-else>
            <!-- buyLimit大于0，表示限制购买数量 -->
            <cl-input-number
              v-model="specStore.shopNum"
              :step="1"
              :min="1"
              :max="getSelSpec.promotionActivity.buyLimit"
              @change="inputChange($event, getSelSpec.promotionActivity.buyLimit)"
            ></cl-input-number>
          </template>
        </view>
      </scroll-view>
      <!-- 立即购买 -->
      <!-- putShelves: 商品是否上架，0: 下架, 1: 上架 -->
      <template v-if="otherParams.putShelves === 1">
        <view class="shop-cart-panel" v-if="clickSource === 'spec'">
          <button class="shop-btn" v-show="getSelSpecType === 'default'" @click="joinShopCart">加入购物车</button>
          <!-- 如果没有任何规格可以选择，就将按钮变成 灰色，内容为 库存为0 -->
          <button
            :class="['shop-btn', 'shop-btn-other', { 'fill-width': getSelSpecType !== 'default' }]"
            :disabled="getStoreCount === 0 || !isStock"
            @click="buyNow"
          >{{ getStoreCount === 0 ? '库存0件' : (isStartActive === 'default' || isStartActive === 'startActive') ? (isStock?'立即购买':'库存不足') : '原价购买' }}</button>
        </view>
        <view class="shop-cart-panel" v-else>
          <!-- 购物车不限库存加入 -->
          <button
            v-if="clickSource == 'join'"
            :class="['shop-btn', 'shop-btn-other', 'fill-width']"
            @click="confirm(clickSource)"
          >确定</button>
          <button
            v-else
            :class="['shop-btn', 'shop-btn-other', 'fill-width']"
            :disabled="!isStock"
            @click="confirm(clickSource)"
          >{{isStock?'确定':'库存不足'}}</button>
        </view>
      </template>
      <view class="shop-cart-panel" v-else>
        <button class="shop-btn shop-btn-other fill-width" disabled>已下架</button>
      </view>
    </view>
  </cl-popup>
</template>

<script>
import CouponCard from '@/pages-mall-a/components/coupon-card/coupon-card.vue'
import * as SpecStore from './specStore'
import * as DeliveryStore from './deliveryStore'

/**
 * 弹窗-配送方式，规格型号
 * @property { Boolean } value 显示/隐藏优惠券弹窗，使用 v-model
 * @property { String } clickSource 点击来源，['spec', 'join', 'buy', 'joinBuy', 'createBuy']。
 * 如果点击的是规格型号(spec)，则底部按钮显示加入购物车和立即购买。
 * 如果点击的是立即购买、单独购买(buy)，加入购物车(join)，去参团(joinBuy)，我要开团(createBuy)，则底部显示确定。
 * @property { Object } otherParams 商品的图片地址和商品名称，例如 { imgUrl: String, shopName: String }
 * @event joinShopCart 加入购物车
 * @event buyNow 立即购买
 */
export default {
  options: { styleIsolation: 'shared' },
  components: {
    CouponCard
  },
  props: {
    // 显示优惠券弹窗
    value: {
      type: Boolean,
      default: false,
      required: true
    },
    /**
     * clicksSorce 点击来源，{spec: '规格', join: '加入购物车', buy: '立即购买'}
     * 如果点击的是规格型号，则底部按钮显示加入购物车和立即购买；如果点击的是立即购买和加入购物车，则底部显示确定
     */
    clickSource: {
      type: String,
      default: 'spec',
      validator(val) {
        return ['spec', 'join', 'buy', 'aloneBuy', 'joinBuy', 'createBuy'].includes(val)
      }
    },
    // 商品的图片地址和商品名称
    otherParams: {
      type: Object,
      default: () => ({
        imgUrl: '', // 如果规格没有图片，则取商品logo的图片做为规格图片
        shopName: '',
        putShelves: 0 // 是否上架，0：下架，1：上架
      })
    },
    getAddrStock: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      specStore: SpecStore.state(),
      deliveryStore: DeliveryStore.state(),
      lastShopNum: SpecStore.state().shopNum
    }
  },
  computed: {
    getSelSpec: SpecStore.getters.getSelSpec,
    getSelSpecType: SpecStore.getters.getSelSpecType,
    isStartActive: SpecStore.getters.isStartActive,
    getDefaultPrice: SpecStore.getters.getDefaultPrice,
    isStock() {
      return SpecStore.state().isStock
    },
    getSpecPrice() {
      if (this.clickSource === 'aloneBuy' && this.getSelSpecType === 'group') {
        // 如果规格是团购，并且点击了单独购买，则价格显示为原价
        return this.getDefaultPrice
      } else {
        return SpecStore.getters.getSpecPrice()
      }
    },
    getStoreCount: SpecStore.getters.getStoreCount,

    isShowCoupon: {
      get() {
        return this.value
      },
      set(val) {
        if (val) {
          this.coupopShow()
        }
        this.$emit('input', val)
      }
    },
    // 购买限制数量，0表示不限制
    buyLimitNum() {
      return this.getSelSpec?.promotionActivity?.buyLimit
    }
  },
  watch: {
    /**
     * 解决小程序无法给商品数量设置默认值1的问题
     * 问题原因：当前组件第一次创建时input-number的最大值为undefined，此时商品数量为0。当获取接口数据，input-number的最大值有值了，但因为此时商品数量依然为默认值1，无法触发商品数量重新赋值，所以渲染完值为0
     */
    getStoreCount: {
      handler(newVal, oldVal) {
        if (newVal === oldVal) {
          if (oldVal === undefined) {
            // 组件被创建时，会触发这里，先把shopNum置空
            SpecStore.mutations.setShopNum(0)
          }
        } else {
          if (oldVal === undefined) {
            // 当监听的属性第一次有了值，会触发这里，再把shopNum设置为默认值
            // 注意,修改shopNum默认值时也需要修改这里
            SpecStore.mutations.setShopNum(1)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    getDeliveryValues: DeliveryStore.getMapValues,
    getSpecValues: SpecStore.getMapValues,
    joinShopCart() {
      this.$emit('joinShopCart')
    },
    buyNow() {
      this.$emit('buyNow')
    },
    previewImage(url, url1) {
      let list = url ? [url] : [url1]
      uni.previewImage({ urls: list })
    },
    confirm(val) {
      if (val === 'join') {
        this.joinShopCart()
      } else if (['buy', 'aloneBuy', 'joinBuy', 'createBuy'].includes(val)) {
        this.buyNow()
      }
    },
    coupopClose() {
      if (['joinBuy', 'createBuy'].includes(this.clickSource)) {
        SpecStore.disableSpecByGroup(false)
        this.$forceUpdate()
      }
    },
    coupopShow() {
      if (['joinBuy', 'createBuy'].includes(this.clickSource)) {
        SpecStore.disableSpecByGroup(true)
        this.$forceUpdate()
      }
    },
    // 切换  校验库存
    ruleStock(val) {
      this.getAddrStock()
    },
    // 最大数校验
    inputChange(e, max) {
      const lastShopNum = this.lastShopNum
      const current = Number(e)
      const isExceed = !Number.isNaN(current) && current >= max && lastShopNum == max
      if (isExceed) uni.showToast({
        title: '购买数量不能超过上限',
        icon: 'none'
      })
      this.lastShopNum = e
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .cl-popup {
  border-top-left-radius: 16rpx;
  border-top-right-radius: 16rpx;
}
.model-popup {
  height: 100%;

  & > .coupon-scroll {
    height: 580rpx;
  }
}
.shop-info {
  display: flex;
  padding: 34rpx 40rpx 8rpx;

  & > image {
    @include flx-size('keep');
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
    margin-right: 24rpx;
  }
  & > .title-panel {
    @include flx-dsp(space-between, flex-start, column);
  }
  .shop-title {
    font-size: 28rpx;
    color: $uni-text-color;
    line-height: 40rpx;
  }
  ::v-deep .cl-text.is-price {
    color: $uni-color-assist;
  }
  .shop-count {
    font-size: 24rpx;
  }
}
.flex-form-panel {
  padding: 0rpx 40rpx;

  &:first-child {
    padding-top: 30rpx;
  }
  .flex-form-title {
    display: block;
    font-size: 26rpx;
    color: $uni-text-color;
    font-weight: bold;
    padding: 0 0 24rpx;
  }
  .flex-form-list {
    @include flx-dsp(flex-start, flex-start, row);
    flex-wrap: wrap;
  }
  .model-tag{
    position: relative;
    .activity{
      position: absolute;
      right: 9rpx;
      top: -14rpx;
      width: 30rpx;
      height: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      border-radius: 50%;
    }
  }
  .model-tag::v-deep .cl-radio,
  .model-tag.cl-radio {
    box-sizing: border-box;
    min-height: 48rpx;
    padding: 0 18rpx;
    margin: 0 24rpx 24rpx 0;
    background-color: $uni-bg-color-grey;
    color: $uni-text-color;
    line-height: 44rpx;
    height: auto;

    &.is-checked {
      border-color: $uni-color-main;
      color: $uni-color-main;
      background-color: rgba($uni-color-main, 0.05);
    }
    &.is-disabled {
      border-color: #ddd;
      background-color: rgba(#ddd, 0.05);
      color: #c0c4cc;
    }
  }
  cl-radio {
    margin-left: 0;
  }
}
.shop-number {
  display: flex;
  justify-content: space-between;
  padding: 0 40rpx 20rpx;

  & > .shop-number-text {
    font-size: 26rpx;
    color: $uni-text-color;
    font-weight: bold;
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
}
.shop-cart-panel {
  width: 100%;
  height: 112rpx;
  background-color: #fff;
  @include flx-dsp(space-between, center, row);
  border-top: 1rpx solid #e4e4e4;
  box-sizing: border-box;
  padding: 0 20rpx;

  .shop-btn {
    display: inline-block;
    width: 320rpx;
    height: 80rpx;
    border-radius: 36rpx;
    padding: 0px;
    font-size: 28rpx;
    color: #fff;
    background-color: $uni-color-primary;
    line-height: 2.8;

    &.shop-btn-other {
      background-color: $uni-color-main;

      &.fill-width {
        width: 100%;
      }
    }
    &[disabled='true'] {
      background-color: #ddd;
      color: #333;
    }
  }
}
</style>