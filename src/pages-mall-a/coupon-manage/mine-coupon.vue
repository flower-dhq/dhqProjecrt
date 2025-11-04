<template>
  <view class="page-box">
    <!-- 条件筛选 -->
    <cl-tabs v-model="tabValue" :labels="tabList" :gutter="80" :border="false" @tab-change="tabChange"></cl-tabs>
    <view class="list-scroll" v-if="couponList.length">
      <coupon-card
        v-for="(item, index) in couponList"
        :key="index"
        :title="item.couponName"
        :info="item.couponDesc"
        :price="item.couponValue + ''"
        :type="item.couponStateSrc"
        :showType="item.showType"
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
    <!-- <view class="bottom-bar" @click="linkTo">领券中心</view> -->
  </view>
</template>

<script>
import CouponCard from '@/pages-mall-a/components/coupon-card/coupon-card.vue'
import commonMethod from '@/js/commonMethod'
import * as CouponStore from '@/pages-mall-a/shopping-info/module/couponStore'
import dayjs from 'cl-uni/utils/dayjs'

export default {
  options: { styleIsolation: 'shared' },
  components: {
    CouponCard
  },
  data() {
    return {
      tabValue: 0,
      tabList: [
        { label: '未使用', name: 0 },
        { label: '已使用', name: 1 },
        { label: '已过期', name: 3 }
      ],
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
        url: '/pages-mall-a/coupon-manage/coupon-manage'
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
        pathParams: `/${this.pageSplit.size}/${this.pageSplit.current}`,
        data: {
          queryType: 2, // { 1: 可用优惠券, 2: 我的优惠券, 3: 可领券列表 }
          useState: this.tabValue
        }
      }
      const { data } = await this.$mallApi.shop.getMineCouponList(params)
      let { records } = data
      records = records.map(item => ({ ...item, effectiveType: 1, effectiveTime: item.effectiveDate }))

      return {
        ...data,
        records: CouponStore.formatCoupon(records).map(item => {
          const {useState, useScopeStr, effectiveTypeSrc, couponType, couponDesc} = item
          const isExpire = useState === 3
          return {
            ...item,
            couponStateSrc: isExpire ? 'expired' : useState === 0 ? 'useing' : 'used',
            couponDesc: couponDesc,
            showType: [3, 4].includes(couponType) ? 'price' : 'discount', // couponType: 卡券类型（1-满x元减y元、2-满x件减y元、3-满x元减y折扣、4-满x件减y折扣、11-优惠码(可给他人使用)）
            isExpire
          }
        })
      }
    },
    tabChange(name) {
      this.pageRefresh()
    },
    // 我的优惠券页面，只有去使用的按钮
    handleClick(type, item) {
      const {infoId, couponConditionsOfUse} = item;
      // type 优惠券状态
      switch (type) {
        case 'useing':
          uni.navigateTo({ url: `/pages-mall-a/search-list/search-list?couponInfoId=${infoId}&couponConditionsOfUse=${encodeURIComponent(couponConditionsOfUse)}`})
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  @include flx-dsp(flex-start, flex-start, column);
  background-color: #f7f7f7;
}
.list-scroll {
  width: 100%;
  padding-top: 16rpx;
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