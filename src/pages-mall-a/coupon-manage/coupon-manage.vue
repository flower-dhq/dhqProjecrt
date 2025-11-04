<template>
  <view class="page-box-top">
    <view class="list-scroll" v-if="couponList.length">
      <coupon-card
        v-for="(item, index) in couponList"
        :key="index"
        :title="item.couponName"
        :info="item.couponDesc"
        :price="item.couponValue + ''"
        :type="item.couponStateSrc"
        :showType="item.showType"
        :effectTime="item.effectTime"
        :coupon="item"
        @click="handleClick($event, item)"
      />
      <!-- 加载更多 -->
      <cl-loadmore :loading="pageSplit.loading" :finish="isEndPage"></cl-loadmore>
      <!-- <view class="placeholder"></view> -->
    </view>
    <!-- 空数据 -->
    <view class="list-scroll" v-else>
      <image class="list-none" src="@/pages-mall-a/static/empty/coupon_none_icon.png" mode="widthFix" />
      <text class="list-none-text">抱歉~没找到优惠券</text>
    </view>
    <!-- <view class="bottom-bar" @click="linkTo">查看我的优惠券</view> -->
    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import couponCard from '@/pages-mall-a/components/coupon-card/coupon-card.vue'
import commonMethod from '@/js/commonMethod'
import * as CouponStore from '@/pages-mall-a/shopping-info/module/couponStore'

export default {
  options: { styleIsolation: 'shared' },
  components: {
    couponCard
  },
  data() {
    return {
      couponList: [],
      pageSplit: {
        size: 10,
        current: 1,
        pageTotal: 0,
        loading: false
      },
      couponStore: CouponStore.state
    }
  },
  computed: {
    isEndPage() {
      return this.pageSplit.current === this.pageSplit.pageTotal
    }
  },
  onLoad() {
    // 未授权登录不允许进入当前页面
    if (!commonMethod.checkAuth()) return

    this.pageRefresh()
    // uni.startPullDownRefresh()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.pageRefresh()
  },
  // 上拉加载
  async onReachBottom() {
    if (this.isEndPage) return

    this.pageSplit.loading = true
    this.pageSplit.current++

    const { records } = await this.getCouponList()
    this.couponList = this.couponList.concat(records)

    this.pageSplit.loading = false
  },
  methods: {
    linkTo() {
      uni.navigateTo({
        url: '/pages-mall-a/coupon-manage/mine-coupon'
      })
    },
    async pageRefresh() {
      this.pageSplit.current = 1

      let { pages, records } = await this.getCouponList()
      this.pageSplit.pageTotal = pages
      this.couponList = records

      uni.stopPullDownRefresh()
    },
    // 获取优惠券列表
    async getCouponList() {
      const params = {
        pathParams: `/${this.pageSplit.size}/${this.pageSplit.current}`
      }
      const { data } = await this.$mallApi.shop.getCouponManageList(params)
      const { records = [] } = data

      return {
        ...data,
        records: CouponStore.formatCoupon(records).map(item => {
          // 是否过期。effectiveType: 有效类型（1-固定日期:yyyy-MM-dd HH:mm:ss 2-倒计时:天)
          const isExpire = item.effectiveType === 1 ? (Date.now() - new Date(item.effectiveTime).getTime() > 1000) : false
          // 是否为可领取。个人领取上限(receiveLimitNumber) - 已领取数量(quantityReceived)
          // const isReceive = Boolean(item.receiveLimitNumber - item.quantityReceived)
          //新判断，有已领取数量的按钮显示去使用
          const isReceive = Boolean(item.quantityReceived)

          return {
            ...item,
            // remain 优惠券剩余数量, 先判断是否过期，再判断剩余数量，再判断自己是否已经领取了
            // couponStateSrc: isExpire ? 'expired' : item.remain === 0 ? 'empty' : !isReceive ? 'receiving' : 'useing',
            couponStateSrc: item.remain === 0 ? 'empty' : 'receiving', // 可领券列表只留这两种状态
            couponDesc: item.couponDesc,
            showType: [3, 4].includes(item.couponType) ? 'price' : 'discount', // couponType: 卡券类型（1-满x元减y元、2-满x件减y元、3-满x元减y折扣、4-满x件减y折扣、11-优惠码(可给他人使用)）
            isExpire
          }
        })
      }
    },
    // 领取优惠券
    async receiveCoupon(item) {
      const params = {
        pathParams: '/' + item.originId
      }
      const { success , message } = await this.$mallApi.shop.receiveCouponByCouponCenter(params)
      if (success) {
        item.couponState = 'useing'
        setTimeout(() => {
          uni.showToast({title: "领取成功",duration: 2000,icon: 'none'})
        }, 0);
      }else{
        setTimeout(() => {
          uni.showToast({title: message,duration: 2000,icon: 'none'})
        }, 0);
      }
    },
    async handleClick(type, item) {
      // type: 优惠券状态
      switch (type) {
        case 'receiving':
          await this.receiveCoupon(item)
          await this.pageRefresh()
          break
        case 'useing':
          uni.navigateTo({ url: '/pages-mall-a/search-list/search-list' })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box-top {
  background-color: #f7f7f7;
}
.list-scroll {
  width: 100%;
  padding-top: 16rpx;
  background-color: #f7f7f7;
  @include flx-dsp(flex-start, center, column);
}
.placeholder {
  width: 100%;
  height: 100rpx;
}
.bottom-bar {
  position: fixed;
  bottom: 0rpx;
  left: 0rpx;
  right: 0rpx;
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  font-size: 30rpx;
  line-height: 100rpx;
  text-align: center;
}
::v-deep .cl-loadmore__wrap,
cl-loadmore {
  width: 100%;
}
.list-none {
  display: block;
  width: 320rpx;
  margin: 0 auto;
  padding-top: 160rpx;
}
.list-none-text {
  display: block;
  width: 100%;
  font-size: 28rpx;
  color: #888;
  text-align: center;
}
</style>