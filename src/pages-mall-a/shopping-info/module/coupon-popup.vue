<template>
  <cl-popup :visible.sync="isShowCoupon" direction="bottom" size="916rpx">
    <view class="coupon-popup">
      <text class="coupon-title">可领取优惠券</text>
      <scroll-view class="coupon-scroll" scroll-y="true">
        <template v-if="couponList.length">
          <coupon-card
            v-for="(item, index) in couponList"
            :key="index"
            :title="item.couponConditionsOfUse"
            :info="item.couponDesc"
            :price="item.couponValue + ''"
            :type="item.couponStateSrc"
            :showType="item.showType"
            :coupon="item"
            @click="handleClick($event, item)"
          />
        </template>
        <!-- 空数据 -->
        <view class="list-scroll" v-else>
          <image class="list-none" src="@/pages-mall-a/static/empty/coupon_none_icon.png" mode="aspectFit" />
          <text class="list-none-text">抱歉~没找到商品</text>
        </view>
      </scroll-view>
    </view>
  </cl-popup>
</template>

<script>
import CouponCard from '@/pages-mall-a/components/coupon-card/coupon-card.vue'
import { state, mutations, formatCoupon } from './couponStore'
import * as ShopStore from './shopStore'

/**
 * 弹窗 —— 优惠券
 * @property {boolean} visible 显示隐藏。使用 .sync 方式
 * @event update:visible
 */
export default {
  options: { styleIsolation: 'shared' },
  components: {
    CouponCard
  },
  props: {
    // 显示/隐藏
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    // goods：商品详情 seller：商家详情
    identifyParam: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      couponList: [],
      pageSplit: {
        current: 1,
        pageTotal: 0,
        loading: false
      },
      couponStore: state(),
      shopStore: ShopStore.state()
    }
  },
  computed: {
    // 显示优惠券弹窗
    isShowCoupon: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {
    this.getCouponList()
  },
  methods: {
    // 获取优惠券列表
    async getCouponList() {
      await this.syncGetData(() => {
        console.log('this.shopStore.shopInfo.sellerId==',this.shopStore.shopInfo.sellerId)
        const temp = this.shopStore.shopInfo.sellerId
        return temp !== null && temp !== undefined
      })

      const params = {
        pathParams: `/10/1`,
        data: {
          //queryType: 3, // { 1: 可用优惠券, 2: 我的优惠券, 3: 可领券列表 }
          sellerId: this.shopStore.shopInfo.sellerId // 店铺id，因为优惠券关联了店铺，指定店铺才能使用优惠券
        },
        hideLoading: true
      }
      const { data } = await this.$mallApi.shop.getShopCouponList(params)
      const { records, pages } = data
      if(records.length == 0){
        this.$emit("nocouponlist")
      }
      this.couponList = formatCoupon(records).map(item => {
        // 是否过期
        const isExpire = item.effectiveType === 1 ? Date.now() - new Date(item.effectiveTime).getTime() > 1000 : false
        // 使用范围。{ 1: 全平台, 2: 指定店铺 }
        const scopeText = item.useScope === 1 ? '指定全平台' : item.useScope === 2 ? `指定${item.relationName}` : ''

        return {
          ...item,
          couponStateSrc: 
            item.remain === 0 ? 'empty' : 'receiving', // 排除抢光剩下就是可领取，可领券列表只留这两种状态
          couponDesc: item.couponDesc,
          showType: [3, 4].includes(item.couponType) ? 'price' : 'discount', // couponType: 卡券类型（1-满x元减y元、2-满x件减y元、3-满x元减y折扣、4-满x件减y折扣、11-优惠码(可给他人使用)）
          isExpire
        }
      })
			this.$emit('getCouponList', this.couponList)
    },
    async receiveCoupon(item) {
      const params = {
        pathParams: `/${item.originId}${this.identifyParam}`
      }
      const { success } = await this.$mallApi.shop.receiveCoupon(params)
      if (success) {
        uni.showToast({
          title: '领取成功',
			    icon: 'none'
        })
        this.$set(item, 'couponState', 'useing')
      }
    },
    useCoupon(item) {
      mutations.setSelCoupon(item.originId, item)
      this.$emit('update:visible', false)
    },
    async handleClick(type, item) {
      // type: 优惠券状态
      switch (type) {
        case 'receiving':
          await this.receiveCoupon(item)
          await this.getCouponList()
          break
        case 'useing':
          await this.useCoupon(item)
          break
      }
    },
    // 有些数据是异步的，要等其他地方赋值后，才能再这里获取到数据
    syncGetData(fn = () => true) {
      if (typeof fn !== 'function') return Promise.resolve()

      let timeId = null
      return new Promise(resolve => {
        timeId = setInterval(() => {
          const isFlag = fn.call(this)
          if (isFlag) {
            clearInterval(timeId)
            resolve()
          }
        }, 300)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
cl-popup ::v-deep .cl-popup,
::v-deep .cl-popup {
  border-top-left-radius: 16rpx;
  border-top-right-radius: 16rpx;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.coupon-popup {
  height: 100%;

  & > .coupon-title {
    display: block;
    font-size: 30rpx;
    color: $uni-text-color;
    text-align: center;
    padding-bottom: 30rpx;
  }
  & > .coupon-scroll {
    height: 826rpx;
  }
}
.list-scroll {
  @include flx-dsp(space-between, flex-start);
  flex-wrap: wrap;
}
.list-none {
  display: block;
  width: 320rpx;
  height: 240rpx;
  margin: 0 auto;
  padding-top: 100rpx;
}
.list-none-text {
  display: block;
  width: 100%;
  font-size: 28rpx;
  color: #888;
  text-align: center;
}
</style>