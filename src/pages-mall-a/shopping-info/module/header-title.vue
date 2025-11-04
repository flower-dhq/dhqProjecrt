<template>
  <view class="header-title">
    <!-- 普通商品 -->
    <view class="default-shop title-panel" v-if="getSelSpecType === 'default'">
      <view class="flex-hse price-panel">
        <!-- 销售价，卖出去的价格 -->
        <cl-text class="price--red" type="price" size="40rpx" :value="getDefaultPrice" color="primary" />
        <!-- 市场价，参考价格 -->
        <text class="price--ash line-through" :style="{ fontSize: '25rpx', marginLeft: '10rpx' }">价格</text>
        <cl-text
          class="price--ash line-through 111111"
          type="price"
          size="25rpx"
          :value="getSelSpec.marketPrice"
          color="primary"
        />
        <view class="ph-h"></view>
        <!-- 查询降价通知的状态，只针对一个规格设置降价通知。如果已经设置了通知，就不需要再设置通知了；如果没有设置过，就需要设置通知 -->
        <icon-around text="降价通知" src="/pages-mall/static/shop/price_cut_icon.png" @click="linkToNotice" v-if="getSelSpec.isShowNotice" />
        <view class="flex-vsc icon-like" @click="addFavorites">
          <!-- cl-icon-like: 未收藏状态, cl-icon-like-fill: 已收藏状态 -->
          <cl-icon :name="shopStore.isFavority ? 'cl-icon-like-fill' : 'cl-icon-like'" size="36rpx" />
          <text>收藏</text>
        </view>
      </view>
      <view class="title-name">
        <cl-tag v-if="shopStore.source === '自营'" class="tag-source">{{ shopStore.source }}</cl-tag>
        <text>{{ shopStore.shopName }}</text>
      </view>
      <view class="sale-count">月销{{$cmMth.formatSaleCount(shopStore.shopInfo.clientSalesCount || 0)}}</view>
    </view>
    <!-- 秒杀商品 -->
    <view class="second-shop" v-if="getSelSpecType === 'second'">
      <view class="flex-h bg-color--gradient ct-panel">
        <view class="flex-v limit-time">
          <text class="limit-time--white">限时</text>
          <text class="limit-time--yellow">秒杀</text>
        </view>
        <view class="flex-v ct-price">
          <cl-text class="price--white price--bold" type="price" size="40rpx" :value="getPromoPrice" color="primary" />
          <view>
            <text>单买价</text>
            <cl-text
              class="price--white"
              type="price"
              size="24rpx"
              :value="getDefaultPrice"
              color="primary"
              line-through
            />
          </view>
        </view>
        <!-- 距结束 -->
        <view class="ph-h"></view>
        <view class="flex-vc bg-color--cream ct-time">
          <text class="ct-time__text">{{ timeText }}</text>
          <text class="ct-time__time">{{ timeNumber | formatTime }}</text>
        </view>
      </view>
      <view class="title-panel">
        <view class="flex-h">
          <view class="title-name">
            <cl-tag v-if="shopStore.source === '自营'" class="tag-source">{{ shopStore.source }}</cl-tag>
            <text>{{ shopStore.shopName }}</text>
          </view>
          <view class="flex-vsc icon-like" @click="addFavorites">
            <!-- cl-icon-like: 未收藏状态, cl-icon-like-fill: 已收藏状态 -->
            <cl-icon :name="shopStore.isFavority ? 'cl-icon-like-fill' : 'cl-icon-like'" size="36rpx" />
            <text>收藏</text>
          </view>
        </view>

        <view class="sale-count">月销{{$cmMth.formatSaleCount(shopStore.shopInfo.clientSalesCount || 0)}}</view>
      </view>
    </view>
    <!-- 团购商品 -->
    <view class="group-shop" v-if="getSelSpecType === 'group'">
      <view class="flex-h bg-color--gradient ct-panel">
        <view class="flex-v limit-time">
          <text class="limit-time--white">今日</text>
          <text class="limit-time--yellow">必拼</text>
        </view>
        <view class="flex-v ct-price">
          <view class="flex-hse">
            <cl-text class="price--white price--bold" type="price" size="40rpx" :value="getPromoPrice" color="primary" />
            <cl-tag class="tag-people">{{ getSelSpec.promotionActivity.minLimit }}人拼</cl-tag>
          </view>
          <view>
            <text>单买价</text>
            <cl-text
              class="price--white"
              type="price"
              size="24rpx"
              :value="getDefaultPrice"
              color="primary"
              line-through
            />
          </view>
        </view>
        <!-- 距结束 -->
        <view class="ph-h"></view>
        <view class="flex-vc bg-color--cream ct-time">
          <text class="ct-time__text">{{ timeText }}</text>
          <text class="ct-time__time">{{ timeNumber | formatTime }}</text>
        </view>
      </view>
      <view class="title-panel">
        <view class="flex-h">
          <view class="title-name">
            <cl-tag v-if="shopStore.source === '自营'" class="tag-source">{{ shopStore.source }}</cl-tag>
            <text>{{ shopStore.shopName }}</text>
          </view>
          <view class="flex-vsc icon-like" @click="addFavorites">
            <!-- cl-icon-like: 未收藏状态, cl-icon-like-fill: 已收藏状态 -->
            <cl-icon :name="shopStore.isFavority ? 'cl-icon-like-fill' : 'cl-icon-like'" size="36rpx" />
            <text>收藏</text>
          </view>
        </view>

        <view class="sale-count">月销{{$cmMth.formatSaleCount(shopStore.shopInfo.clientSalesCount || 0)}}</view>
      </view>
    </view>
    <!-- 积分 -->
    <view class="integral-shop" v-if="getSelSpecType === 'integral'">
      <view class="flex-h bg-color--gradient ct-panel">
        <view class="flex-hse price-panel-fill ct-price">
          <cl-text class="price--white" size="40rpx" :value="getIntegral" color="primary" />
          <text class="size-30">积分+</text>
          <cl-text class="price--white" type="price" size="30rpx" :value="getPromoPrice" color="primary" />
          <text class="size-30">元</text>
          <view class="ph-h"></view>
        </view>
        <view class="ph-h"></view>
        <!-- 距结束 -->
        <view class="flex-vc bg-color--cream ct-time">
          <text class="ct-time__text">{{ timeText }}</text>
          <text class="ct-time__time">{{ timeNumber | formatTime }}</text>
        </view>
      </view>
      <view class="title-panel">
        <view class="flex-h">
          <view class="title-name">
            <cl-tag v-if="shopStore.source === '自营'" class="tag-source">{{ shopStore.source }}</cl-tag>
            <text>{{ shopStore.shopName }}</text>
          </view>
          <view class="flex-vsc icon-like" @click="addFavorites">
            <!-- cl-icon-like: 未收藏状态, cl-icon-like-fill: 已收藏状态 -->
            <cl-icon :name="shopStore.isFavority ? 'cl-icon-like-fill' : 'cl-icon-like'" size="36rpx" />
            <text>收藏</text>
          </view>
        </view>

        <view class="sale-count">月销{{$cmMth.formatSaleCount(shopStore.shopInfo.clientSalesCount || 0)}}</view>
      </view>
    </view>
  </view>
</template>

<script>
import IconAround from '@/pages-mall-a/components/icon-around.vue'
import * as ShopStore from './shopStore'
import * as SpecStore from './specStore'
import commonMethod from '@/js/commonMethod'

let timeFlag = null

/**
 * 商品标题，分别包含[default: '普通商品', second: '秒杀商品', group: '团购商品', integral: '积分商品']
 * 查询降价通知的状态，只针对一个规格设置降价通知，只有普通商品才有降价通知。如果已经设置了通知，就不需要再设置通知了；如果没有设置过，就需要设置通知
 * @property {object} otherParams 传递其他参数
 * @event addFavorites 加入/取消收藏
 */
export default {
  options: { styleIsolation: 'shared' },
  components: {
    IconAround
  },
  props: {
    // 传递其他参数
    otherParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      timeNumber: 0, // 倒计时剩余时间，单位毫秒
      timeText: '距结束', // ['距结束', '距开始']
      shopStore: ShopStore.state(),
      specStore: SpecStore.state(),
      showDownPrice: false, //点击降价通知
      isCodeIn:false,
    }
  },
  filters: {
    // 转换为时间格式
    formatTime(val) {
      let day = Math.floor(val / 86400000)
      let hour = Math.floor((val % 86400000) / 3600000)
      let minute = Math.floor(((val % 86400000) % 3600000) / 60000)
      let second = Math.floor((((val % 86400000) % 3600000) % 60000) / 1000)

      hour = hour < 10 ? '0' + hour : hour
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second

      return (day <= 0 ? '' : `${day}天\n`) + `${hour} : ${minute} : ${second}`
    }
  },
  computed: {
    // 如果是积分商品，需要获取积分数
    getIntegral() {
      if (this.getSelSpecType === 'integral') {
        return this.getSelSpec.promotionActivity.integral
      } else {
        return 0
      }
    },
    // 如果是秒杀商品、团购商品，需要获取倒计时开始时间和结束时间
    getTime() {
      // 第一个replace是处理ios的兼容性问题，第二个replace是处理时间里出现 .0 的问题
      if (['second', 'group', 'integral'].includes(this.getSelSpecType)) {
        return {
          startTime: this.getSelSpec.promotionActivity.activityTimeBegin.replace(/\-/g, '/').replace(/\.[0-9]+$/, ''),
          endTime: this.getSelSpec.promotionActivity.activityTimeEnd.replace(/\-/g, '/').replace(/\.[0-9]+$/, '')
        }
      } else {
        return {
          startTime: '0',
          endTime: '0'
        }
      }
    },

    getSelSpec: SpecStore.getters.getSelSpec,
    getDefaultPrice: SpecStore.getters.getDefaultPrice,
    getPromoPrice: SpecStore.getters.getPromoPrice,
    getSelSpecType: SpecStore.getters.getSelSpecType
  },
  watch: {
    getSelSpecType: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          clearInterval(timeFlag)
          if (['second', 'group', 'integral'].includes(newVal)) {
            this.countdownTime(this.getTime.startTime, this.getTime.endTime)
          }
        }
      }
    }
  },
  methods: {
    // 加入/取消收藏
    addFavorites() {
      // 未授权登录不允许进入当前页面
      if (!commonMethod.checkAuth()) return

      this.$emit('addFavorites')
    },
    // 倒计时
    countdownTime(startTime, endTime) {
      let SECONDS = 1 * 1000
      let startTimeTmp = new Date(startTime).getTime()
      let endTimeTmp = new Date(endTime).getTime()
      let nowTimeTmp = new Date().getTime()

      // 如果是活动时间还没开始，就显示距开始；如果是活动时间开始了，但还没结束，就显示距结束
      if (startTimeTmp - nowTimeTmp > SECONDS) {
        this.timeText = '距开始'
        this.timeNumber = startTimeTmp - nowTimeTmp
      } else if (endTimeTmp - nowTimeTmp > SECONDS) {
        this.timeText = '距结束'
        this.timeNumber = endTimeTmp - nowTimeTmp
      } else {
        this.timeNumber = 0
        return
      }

      timeFlag = setInterval(() => {
        // 倒计时结束
        if (this.timeNumber <= 1000) {
          this.timeNumber = 0
          clearInterval(timeFlag)

          // 活动已开始，但还没有结束
          if (endTimeTmp - nowTimeTmp > SECONDS) {
            this.countdownTime(startTime, endTime)
            this.$emit("timeEnd")
          }

          return
        }

        this.timeNumber -= 1000
      }, 1000)
    },
    // 跳转到降价通知页面
    linkToNotice() {
      // 未授权登录不允许进入当前页面
      if (!commonMethod.checkAuth()) return

      const { gmId, sellerId } = this.shopStore.shopInfo
      const { price, gsId } = this.getSelSpec
      uni.navigateTo({
        url: `/pages-mall-b/downPriceNotice/downPriceNotice?sellerId=${sellerId}&gmId=${gmId}&gsId=${gsId}&price=${price}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header-title {
  width: 100%;
}

$height: 108rpx;

.flex-h {
  @include flx-dsp(flex-start, flex-start, row);
}
.flex-v {
  @include flx-dsp(flex-start, flex-start, column);
}
.flex-vc {
  @include flx-dsp(center, center, column);
}
.flex-vsc {
  @include flx-dsp(flex-start, center, column);
}
.flex-hse {
  @include flx-dsp(flex-start, flex-end, row);
}
.ct-panel {
  width: 100%;
  height: $height;
  padding: 10rpx 16rpx;
  box-sizing: border-box;
}
.ct-time {
  width: 160rpx;
  height: $height;
  margin: -10rpx -16rpx -10rpx 0;
  padding-right: 16rpx;
  box-sizing: border-box;
  color: $uni-color-main;
  font-size: 24rpx;
  line-height: 32rpx;
  position: relative;

  &::after {
    position: absolute;
    top: 0rpx;
    left: -70rpx;
    width: 0;
    height: 0;
    content: '';
    border-top: 54rpx solid transparent;
    border-right: 70rpx solid #fff1ce;
    border-bottom: 54rpx solid transparent;
  }
  .ct-time__text {
    font-weight: bold;
    line-height: 32rpx;
  }
  .ct-time__time {
    text-align: center;
  }
}
.limit-time {
  padding: 10rpx;
  border-radius: 6rpx;
  background-color: rgba(#de4d00, 0.4);
  font-size: 28rpx;
  line-height: 32rpx;
  font-weight: bold;
  margin-right: 20rpx;

  .limit-time--white {
    color: #fff;
  }
  .limit-time--yellow {
    color: #ffed7a;
  }
}
.ct-price {
  color: #fff;
  font-size: 22rpx;
}
.price--white,
.price--white::v-deep .cl-text {
  color: #fff;
}
.price--red,
.price--red::v-deep .cl-text {
  color: $uni-color-assist;
}
.price--ash,
.price--ash::v-deep .cl-text {
  color: #b4b3b3 !important;
  text-decoration: line-through !important;
}
.line-through {
  text-decoration: line-through;
}
.price--bold {
  font-weight: bold;
}
.bg-color--gradient {
  background-image: linear-gradient(44deg, #ffbb4c, #ff2300);
}
.bg-color--cream {
  background-color: #fff1ce;
}
.ph-h {
  @include flx-size('stretch');
}
.tag-source {
  &::v-deep.cl-tag,
  ::v-deep .cl-tag {
    width: 52rpx;
    height: 28rpx;
    padding: 0;
    font-size: 20rpx;
    line-height: 28rpx;
    text-align: center;
    background-image: linear-gradient($uni-color-main, $uni-color-assist);
    margin-right: 20rpx;
    vertical-align: 6rpx;
  }
}
.tag-people {
  &::v-deep.cl-tag,
  ::v-deep .cl-tag {
    height: 30rpx;
    font-size: 16rpx;
    line-height: 30rpx;
    color: rgba(#fff, 0.7);
    border-radius: 14rpx;
    background-color: #ff2300;
    padding: 0 10rpx;
    margin-bottom: 10rpx;
    margin-left: 8rpx;
  }
}
.icon-like {
  font-size: 16rpx;
  line-height: 1;
  white-space: nowrap;

  ::v-deep .cl-icon.cl-icon-like-fill {
    color: $uni-color-main;
  }
}
.title-panel {
  width: 100%;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
}
.title-name {
  @include flx-size('stretch');
  font-size: 30rpx;
  font-weight: bold;
  line-height: 40rpx;
  padding-right: 15rpx;
}
.price-panel {
  margin-bottom: 20rpx;
  line-height: 1;

  ::v-deep .icon-around {
    margin-right: 30rpx;
  }
  .size-30 {
    font-size: 30rpx;
  }
}
.price-panel-fill {
  margin-top: 30rpx;
  line-height: 40rpx;
}
.sale-count {
  height: 40rpx;
  line-height: 40rpx;
  text-align: right;
  font-size: 26rpx;
  color: #999;
  margin-top: 20rpx;
}
</style>