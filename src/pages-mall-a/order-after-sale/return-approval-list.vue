<template>
  <view class="page-box">
    <!-- 条件筛选 -->
    <view class="top-tabs">
      <cl-tabs v-model="tabValue" :labels="tabList" :gutter="80" :border="false" @tab-change="refreshList"></cl-tabs>
    </view>
    <view class="list-scroll" v-if="cartList.length > 0">
      <view class="placeholder"></view>
      <!-- 订单卡片 -->
      <view class="cart-box" v-for="item in cartList" :key="item.asId">
        <view class="cart-status">
          <view class="cart-status-left">
            <icon-around src="/pages-mall/static/shop/shop_icon.png" :text="item.sellerName" direction="right" size="middle-rd" />
            <cl-icon class="icon-right" name="cl-icon-arrow-right" size="14rpx" />
          </view>
          <text class="cart-status-right">{{ item.asStateStrForApp}}</text>
        </view>
        <cart-card-item
          v-for="shop in item.afterSaleGoodsList"
          :key="shop.id"
          :src="shop.goodsPicture"
          :name="shop.goodsName"
          :specification="shop.goodsSpec"
          :price="formatMoney(shop.payAmount)"
          :value="shop.numbers"
          :refundText="1"
          type="textNumber"
          :otherData="item"
          @click="linkTo('shopInfo', shop.goodsId)"
        />
        <view class="cart-btn">
          <cl-button
            plain
            round
            size="mini"
            type="text"
            v-if="transformAsStateToBtn(item.asState, 'delete')"
            @click="delAfterOrderById(item.asId)"
          >删除订单</cl-button>
          <cl-button
            plain
            round
            size="mini"
            type="primary"
            v-if="transformAsStateToBtn(item.asState, 'cancel') && item.isSupply != 1"
            @click="cancelAfterOrderById(item.asId)"
          >取消申请</cl-button>
          <!-- isSupply 是否供应链售后 1-是 0-不是 -->
          <cl-button
            plain
            round
            size="mini"
            type="primary"
            v-if="transformAsStateToBtn(item.asState, 'read')"
            @click="readInfoAfterOrder(item.asId)"
          >查看详情</cl-button>
        </view>
      </view>
      <!-- 加载更多 -->
      <cl-loadmore :loading="pageSplit.loading" :finish="isEndPage"></cl-loadmore>
    </view>
    <!-- 空数据 -->
    <view class="list-scroll" v-else>
      <image class="list-none" src="@/pages-mall-a/static/empty/shop_order_none_icon.png" mode="widthFix" />
      <text class="list-none-text">抱歉~没有订单数据</text>
    </view>
    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import CartCardItem from '@/components/cart-card-item/cart-card-item.vue'
import IconAround from '@/pages-mall-a/components/icon-around.vue'
import commonMethod from '@/js/commonMethod'
import handleDataOfNull from '@/js/handleDataOfNull'

export default {
  options: { styleIsolation: 'shared' },
  components: {
    CartCardItem,
    IconAround
  },
  data() {
    return {
      tabValue: 1, // (1: 处理中, 2: 已完成)
      tabList: [
        { label: '处理中(0)', name: 1 },
        { label: '已完成(0)', name: 2 }
      ],
      cartList: [], // 售后订单列表
      pageSplit: {
        size: 10,
        current: 1,
        total: 0,
        loading: false
      }
    }
  },
  filters: {
    // 售后状态（1:待审核 2:已拒绝 3:已通过（待发货）4:已通过（待收货） 5:收到货（待退款）6：已退款（已完成） 7:已取消 8 已删除 9：退款失败 10：退款中）
    transformAsStateToText(asState) {
      switch (asState) {
        case 1:
          return '待审核'
        case 2:
          return '已拒绝'
        case 3:
          return '已通过'
        case 4:
          return '已通过（待收货）'
        case 5:
          return '收到退货'
        case 6:
          return '退款成功'
        case 7:
          return '已取消'
        case 8:
          return '已删除'
        case 9:
          return '退款失败'
        case 10:
          return '退款中'
        default:
          return ''
      }
    }
  },
  computed: {
    isEndPage() {
      const { current, size, total } = this.pageSplit
      return (current - 1) * size + this.cartList.length >= total
    }
  },
  onLoad() {
    // 未授权登录不允许进入当前页面
    if (!commonMethod.checkAuth()) return

    this.getAfterSaleCount()
    this.refreshList()
  },
  // 下拉刷新
  async onPullDownRefresh() {
    this.getAfterSaleCount()
    this.refreshList()
  },
  // 上拉加载
  async onReachBottom() {
    if (this.isEndPage) return

    this.pageSplit.loading = true
    this.pageSplit.current += 1
    await this.getAfterSaleList(true)

    this.pageSplit.loading = false
  },
  methods: {
    // 获取订单列表
    async getAfterSaleList(isLoad) {
      const { memberId, projectId } = commonMethod.getUserStatusInfo()
      const { proejctId } = uni.getStorageSync(this.$constant.PROJECT_INFO)
      const params = {
        pathParams: `/${this.pageSplit.size}/${this.pageSplit.current}`,
        data: {
          asState: this.tabValue,
          memberId,
          projectId
        }
      }

      const res = await this.$mallApi.shop.getAfterSaleByPage(params)
      const { records = [], total = 0 } = handleDataOfNull(res.data || {})

      this.pageSplit.total = total
      if (isLoad) {
        this.cartList = this.cartList.concat(records)
        return
      }
      this.cartList = records
    },
    // 获取tabs栏的订单数量
    async getAfterSaleCount() {
      const { memberId, projectId } = commonMethod.getUserStatusInfo()
      const params = {
        pathParams: `/${memberId}`,
        data: {}
      }

      let { data } = await this.$mallApi.shop.getAfterSaleCount(params)
      // completeCount: 已完成订单的统计数量, processCount: 未处理订单的统计数量
      data = data || { completeCount: 0, processCount: 0 }

      this.tabList = [
        { label: `处理中(${data.processCount})`, name: 1 },
        { label: `已完成(${data.completeCount})`, name: 2 }
      ]
    },
    async refreshList() {
      this.pageSplit.current = 1
      await this.getAfterSaleList()

      uni.stopPullDownRefresh()
    },
    // asId 售后订单id
    async delAfterOrderById(asId) {
      const params = {
        pathParams: `/${asId}`,
        data: {}
      }
      const { success } = await this.$mallApi.shop.delAfterSaleById(params)
      const message = success ? '删除订单成功' : '删除订单失败'

      this.$refs.elMessage.open({
        message,
        position: 'middle'
      })

      if (success) {
        this.getAfterSaleCount()
        this.refreshList()
      }
    },
    // asId 售后订单id
    async cancelAfterOrderById(asId) {
      const params = {
        pathParams: `/${asId}`,
        responseToast: false
      }
      const { success } = await this.$mallApi.shop.cancelAfterSaleById(params)
      const message = success ? '取消订单成功' : '取消订单失败'

      this.$refs.elMessage.open({
        message,
        position: 'middle'
      })

      if (success) {
        this.getAfterSaleCount()
        this.refreshList()
      }
    },
    // asId 售后订单id
    readInfoAfterOrder(asId) {
      uni.navigateTo({ url: '/pages-mall-a/order-after-sale/return-approval-info?afterSaleId=' + asId })
    },
    /**
     * 根据售后状态显示订单卡片里的按钮
     * @param {number} asState 售后订单类型
     * @param {string} type 按钮类型，['delete', 'cancel', 'read']
     */
    transformAsStateToBtn(asState, type) {
      // { delete: '删除订单', cancel: '取消申请', read: '查看详情' }
      if (!['delete', 'cancel', 'read'].some(item => item === type)) {
        throw new Error('type is not exist')
      }

      const temp = {
        delete: [2, 7, 8],
        cancel: [1],
        read: [1, 2, 3, 4, 5, 6, 7, 9, 10]
      }
      return temp[type].some(item => item === asState)
    },
    // 将单位分转换为单位元
    formatMoney(val) {
      const res = commonMethod.precision.divide(val, 100)
      return commonMethod.precision.decimals(res, 2)
    },
    linkTo(to) {
      switch (to) {
        case 'shopInfo':
          if (arguments[1]) {
            uni.navigateTo({ url: '/pages-mall-a/shopping-info/shopping-info?shopId=' + arguments[1] })
          }
          break
        default:
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

/* #ifdef H5 */
.top-tabs {
  position: fixed;
  top: 0rpx;
  left: 0;
  right: 0;
  height: 80rpx;
  z-index: 1;
}
/* #endif */
/* #ifdef MP-WEIXIN */
.top-tabs {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80rpx;
  z-index: 1;
}
/* #endif */

.list-scroll {
  width: 100%;
  padding: 20rpx 20rpx 0;
  box-sizing: border-box;
  @include flx-dsp(flex-start, center, column);
  background-color: #f7f7f7;
}
.placeholder {
  width: 100%;
  height: 80rpx;
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
  width: 500rpx;
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
.cart-box {
  background-color: #fff;
  padding: 20rpx;
  width: 100%;
  box-sizing: border-box;
  @include flx-dsp(flex-start, flex-start, column);

  &:not(:last-child) {
    margin-bottom: 20rpx;
  }
  .cart-card-item,
  cart-card-item {
    &:not(:nth-last-child(2)) {
      margin-bottom: 20rpx;
    }
  }
}
.cart-status {
  width: 100%;
  @include flx-dsp(space-between, center, row);
  padding-bottom: 28rpx;
}
.cart-status-left {
  @include flx-dsp(flex-start, center, row);

  ::v-deep .icon-around .icon-image {
    margin-right: 12rpx;
  }
  ::v-deep .icon-around,
  icon-around {
    display: inherit;
  }
  ::v-deep .cl-icon-arrow-right,
  cl-icon-arrow-right {
    line-height: 1;
    color: #cdcdcd;
    display: inherit;
    margin-left: 8rpx;
  }
}
.cart-status-right {
  font-size: 26rpx;
  color: $uni-color-main;
}
.cart-btn {
  width: 100%;
  @include flx-dsp(flex-end, center, row);
  padding-top: 28rpx;

  ::v-deep .cl-button {
    width: 160rpx;
    height: 60rpx;
    padding: 0;
    font-size: 28rpx;
    line-height: 1;

    &.cl-button--text .cl-button__text {
      color: #666666;
    }
  }
}
</style>