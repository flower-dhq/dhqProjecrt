<style scoped lang="scss">
page {
  height: 100%;
}
.order-list {
  width: 100%;
  height: 100%;
  $b-c: #fafafa;
  background-color: $uni-bg-color-grey;
  .price {
    @include flx-dsp($jsc: flex-start, $ali: flex-end);
    color: $uni-color-primary;
    &__symbol {
      font-size: 24rpx;
      margin-right: 4rpx;
    }
    &__money {
      position: relative;
      top: 2rpx;
      font-size: 34rpx;
    }
    &__decimals {
      font-size: 26rpx;
    }
  }
  .custom-image-container {
    @include flx-dsp($jsc: flex-start, $ali: center);
    .scroll-img {
      &:last-child {
        margin-right: 0;
      }
      width: 180rpx;
      height: 180rpx;
      border-radius: 8rpx;
      margin-right: 10rpx;
      overflow: hidden;
    }
  }
  .tab-switch {
    width: 100%;
    height: 100rpx;
    background-color: #fff;
    @include flx-dsp($jsc: space-between, $ali: center);
    .underline {
      text:nth-child(1) {
        color: $uni-color-primary !important;
      }
      text:nth-child(2) {
        background-color: $uni-color-primary !important;
      }
    }
    .tab-item {
      @include flx-dsp($jsc: center, $ali: center);
      position: relative;
      flex: 1;
      height: 100%;
      font-size: 28rpx;
      text:nth-child(1) {
        color: #333;
      }
      text:nth-child(2) {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        width: 60rpx;
        height: 6rpx;
        background-color: transparent;
      }
    }
  }
  .order-container {
    width: 100%;
    height: calc(100% - 102rpx);
    box-sizing: border-box;
    padding: 30rpx 30rpx 0;
    scroll-view {
      width: 100%;
      height: 100%;
    }
    .order {
      width: 100%;
      border-radius: 16rpx;
      background-color: #fff;
      box-sizing: border-box;
      padding: 20rpx;
      margin-bottom: 20rpx;
      &--status {
        display: block;
        text-align: right;
        font-size: 28rpx;
        &.active {
          color: $uni-color-primary;
        }
      }
      &__top {
        margin: 10rpx 0 20rpx 0;
        @include flx-dsp($jsc: space-between, $ali: center);
        .shop {
          @include flx-dsp($jsc: flex-start, $ali: center);
          image {
            width: 32rpx;
            height: 32rpx;
          }
          & > text {
            margin-left: 10rpx;
            font-size: $uni-font-size-base;
          }
        }
      }
      &__info {
        width: 100%;
        .cust-img {
          width: 180rpx;
          height: 180rpx;
          margin-right: 20rpx;
          border-radius: 8rpx;
          overflow: hidden;
        }
        &--multi {
          width: 100%;
          height: 100%;
          @include flx-dsp($jsc: flex-start, $ali: center);
          scroll-view {
            position: relative;
            z-index: 1;
            width: calc(100% - 200rpx);
            white-space: nowrap;
          }
          .summary {
            position: relative;
            z-index: 3;
            @include flx-dsp($jsc: center, $ali: center, $drt: column);
            width: 200rpx;
            height: 180rpx;
            background-color: rgba(255, 255, 255, 0.3);
            box-shadow: -20rpx 0 30rpx -20rpx rgba(0, 0, 0, 0.3);
            .spm-price {
              color: $uni-color-primary;
            }
            & > text {
              margin-top: 6rpx;
              font-size: 26rpx;
              color: #999;
            }
          }
          .scroll-img {
            &:last-child {
              margin-right: 0;
            }
            width: 180rpx;
            height: 180rpx;
            border-radius: 8rpx;
            margin-right: 10rpx;
          }
        }
        &--single {
          width: 100%;
          $h: 200rpx;
          @include flx-dsp($jsc: space-between, $ali: flex-start);
          & > image {
            width: 200rpx;
            height: 200rpx;
            border-radius: 8rpx;
            margin-right: 24rpx;
          }
          & > view.wr {
            flex: 1;
            min-height: $h;
            @include flx-dsp($jsc: space-between, $ali: flex-start, $drt: column);
            .title-price {
              width: 100%;
              @include flx-dsp($jsc: space-between, $ali: flex-start);
              .price {
                position: relative;
                top: -10rpx;
                justify-content: flex-end;
                width: 45%;
                color: #333;
              }
            }
            .goods-title {
              @include ellipsis();
              color: $uni-text-color;
              font-size: $uni-font-size-base;
              width: 50%;
            }
            .goods-bottom {
              width: 100%;
              .spec-num {
                @include flx-dsp($jsc: space-between, $ali: center);
                text {
                  display: block;
                  $gray-color: #eee;
                  margin: 4rpx 0rpx;
                  display: block;
                  text-align: left;
                  font-size: $uni-font-size-sm;
                  color: #888;
                }
              }
            }
          }
        }
      }
      .sum-info {
        width: 100%;
        margin-bottom: 20rpx;
        @include flx-dsp($jsc: flex-end, $ali: center);
        & > text:nth-child(1) {
          font-size: 26rpx;
          color: #999;
          margin-right: 16rpx;
        }
        & > text:nth-child(2) {
          font-size: 26rpx;
          color: #333;
          margin: 0 10rpx;
        }
      }
      .buttons {
        margin-top: 20rpx;
        width: 100%;
        @include flx-dsp($jsc: flex-end, $ali: center);
        & > text {
          @include flx-dsp($jsc: center, $ali: center);
          width: 150rpx;
          height: 60rpx;
          line-height: 60rpx;
          border-radius: 30rpx;
          border: 1rpx solid #e5e5e5;
          color: #666;
          font-size: 28rpx;
          margin-left: 20rpx;
        }
      }
    }
  }
  .no-order {
    padding-top: 60rpx;
    @include flx-dsp($jsc: center, $ali: center, $drt: column);
    image {
      width: 503rpx;
      height: 316rpx;
    }
    text {
      font-size: 28rpx;
      color: #888;
    }
  }
  ::v-deep .cl-divider__text {
    background-color: $uni-bg-color-grey !important;
  }
  ::v-deep .cl-divider__line {
    background: #e6e6e6 !important;
  }
}
</style>

<template>
  <view class="order-list">
    <!-- tab切换 -->
    <view class="tab-switch">
      <view class="tab-item" v-for="(tb, idx) in tab.list" :key="idx" @click="tabSwitch(idx)" :class="{ underline: tab.curIndex === idx }">
        <text>{{ tb.name }}</text>
        <text></text>
      </view>
    </view>
    <!-- 商品列表 -->
    <view class="order-container">
      <template v-for="(item, index) in tab.list">
        <scroll-view :scroll-y="true" v-if="index === tab.curIndex" :key="index" class="order-swiper">
          <cl-scroller ref="scroller" @up="onUp" @down="onDown">
            <view v-for="(order, i) in item.data" :key="i" class="order">
              <view class="order__top">
                <view class="shop" @tap="buttonClick({ type: 'shop', data: order })">
                  <image src="/pages-mall-a/static/shop_icon.png" mode=""></image>
                  <text>{{ order.shopName }}</text>
                  <cl-icon name="cl-icon-arrow-right" color="#cdcdcd" size="30"></cl-icon>
                </view>
                <text class="order--status" :class="{ active: highlight(order) }">{{ order.orderStatusText }}</text>
              </view>
              <view class="order__info" @tap.stop="buttonClick({ type: 'viewOrder', orderStatus: order.orderStatus, data: order })">
                <view class="order__info--multi" v-if="order.url.length > 1">
                  <scroll-view :scroll-x="true">
                    <view class="custom-image-container">
                      <custom-image class="scroll-img" v-for="(img, idx) in order.url" :key="idx" :src="img" mode="scaleFit"></custom-image>
                    </view>
                  </scroll-view>
                  <view class="summary">
                    <view class="price">
                      <text class="price__symbol">&yen;</text>
                      <text class="price__money">{{ order.money.int }}</text>
                      <text class="price__decimals">{{ order.money.flt }}</text>
                    </view>
                    <text>共{{ order.number }}件商品</text>
                  </view>
                </view>
                <view class="order__info--single" v-else>
                  <custom-image class="cust-img" :src="order.url[0]" mode="scaleFit"></custom-image>
                  <view class="wr">
                    <view class="title-price">
                      <text class="goods-title">{{ order.title }}</text>
                      <view class="price">
                        <text class="price__symbol">&yen;</text>
                        <text class="price__money">{{ order.salePrice.int }}</text>
                        <text class="price__decimals">{{ order.salePrice.flt }}</text>
                      </view>
                    </view>
                    <view class="goods-bottom">
                      <view class="spec-num">
                        <text>{{ order.spec }}</text>
                        <text>x {{ order.number }}</text>
                      </view>
                      <view class="sum-info">
                        <text>实付</text>
                        <view class="price">
                          <text class="price__symbol">&yen;</text>
                          <text class="price__money">{{ order.money.int }}</text>
                          <text class="price__decimals">{{ order.money.flt }}</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view class="buttons">
                <text v-if="setOrderStatus({ type: 'cancel', orderStatus: order.orderStatus })" @tap.stop="buttonClick({ type: 'cancel', orderStatus: order.orderStatus, data: order })">取消订单</text>
                <text v-if="setOrderStatus({ type: 'toPay', orderStatus: order.orderStatus })" @tap.stop="buttonClick({ type: 'toPay', orderStatus: order.orderStatus, data: order })">去支付</text>
                <text v-if="setOrderStatus({ type: 'confirmReceipt', orderStatus: order.orderStatus })" @tap.stop="buttonClick({ type: 'confirmReceipt', orderStatus: order.orderStatus, data: order })">确认收货</text>
                <!-- <text v-if="setOrderStatus({...order, type: 'unevaluated', orderStatus: order.orderStatus})" @tap.stop="buttonClick({type: 'unevaluated', orderStatus: order.orderStatus, data: order})">评价晒单</text> -->
                <!-- <text v-if="setOrderStatus({type: 'return', orderStatus: order.orderStatus, order})" @tap.stop="buttonClick({type: 'return', orderStatus: order.orderStatus, data: order})">售后申请</text> -->
                <text v-if="false && setOrderStatus({ type: 'deleteOrder', orderStatus: order.orderStatus })" @tap.stop="buttonClick({ type: 'deleteOrder', orderStatus: order.orderStatus, data: order })">删除订单</text>
              </view>
            </view>
            <cl-loadmore
              :text="item.load.text"
              v-if="(inited && !item.load.refresh && !(item.data.length === 0)) || (!item.load.refresh && item.load.pending && item.data.length === 0)"
              :finish-text="item.load.finishText"
              :finish="item && !item.load.hasData"
              :loading="item && item.load.pending"
            ></cl-loadmore>
            <view class="no-order" v-if="!item.load.pending && item.data.length === 0">
              <image src="/pages-mall-a/static/question.png" mode=""></image>
              <text>您还没有相关订单</text>
            </view>
          </cl-scroller>
        </scroll-view>
      </template>
    </view>
    <cl-confirm ref="confirm"></cl-confirm>
    <cl-toast ref="toast"></cl-toast>
  </view>
</template>

<script>
import { paymentMx } from '@/js/minxins.js';
import Payment from '@/js/payment.js';

export default {
  data() {
    return {
      inited: false,
      pending: false,
      tab: {
        curIndex: 0,
        pageSize: 10,
        list: [
          {
            name: '待付款',
          },
          {
            name: '待收货',
          },
          {
            name: '已完成',
          },
          {
            name: '已取消',
          },
        ],
      },
      paying: false,
    };
  },
  onLoad(option) {
    const { orderStatus } = option;
    //this.getTotalNum();
    this.init(orderStatus);
  },
  mixins: [paymentMx],
  methods: {
    tabNum(index) {
      const total = this.tab.list[index].total || 0;
      return `(${total})`;
    },
    tabSwitch(index, initLoad) {
      const hasNoData = !!!this.tab.list[index].data.length;
      this.tab.curIndex = index;
      if (hasNoData) {
        this.loadOrderData({ initLoad });
      }
    },
    setOrderStatus(params) {
      const { type, orderStatus, order, evaluateStatus } = params;
      const { orderAfterSaleState } = order || {};
      let show = false;
      switch (type) {
        case 'cancel':
          show = orderStatus === 0;
          break;
        case 'toPay':
          show = orderStatus === 0;
          break;
        case 'confirmReceipt':
          show = orderStatus === 2;
          break;
        case 'return':
          show = orderAfterSaleState === 1;
          break;
        case 'deleteOrder':
          show = orderStatus === 4;
          break;
        case 'unevaluated':
          show = orderStatus === 3 && evaluateStatus === 0;
          break;
      }
      return show;
    },
    init(tabIdx) {
      const rightMove = tabIdx ? Number(tabIdx) + 1 : 0;
      const tabIndex = rightMove;
      this.tab.list = [
        {
          name: '全部',
        },
        {
          name: '待付款',
        },
        {
          name: '待发货',
        },
        {
          name: '待收货',
        },
        {
          name: '已完成',
        },
        // {
        // 	name: '已取消'
        // }
      ];
      this.expandCnData();
      this.tabSwitch(tabIndex, true);
    },
    expandCnData() {
      const list = this.tab.list;
      list.forEach((item) => {
        this.$set(item, 'data', []);
        this.$set(item, 'load', {
          pending: false,
          total: 0,
          curPage: 1,
          hasData: true,
          text: '上拉加载更多',
          refresh: false,
          finishText: '我的底线',
        });
      });
    },
    loadOrderData(params) {
      const { initLoad, refresh, firstLevelCateId, todayRec } = params || {};
      const { curIndex, list: sclLst, pageSize } = this.tab;
      const leftMove = curIndex - 1; // 加了全部左移1位索引
      const orderStatus = leftMove === -1 ? '' : leftMove;
      const curLstItm = sclLst[curIndex];
      const lData = curLstItm && curLstItm.data;
      const isMock = false;
      if (!lData) return Promise.resolve();
      if (isMock) {
        const total = curIndex === 0 ? 2 : curIndex * 5 + 1;
        const list = [];
        const rd = Math.random() > 0.5 ? 1 : 2;
        const allRd = Math.random();
        const all = allRd < 0.2 ? 0 : allRd < 0.4 ? 1 : allRd < 0.6 ? 2 : allRd < 0.8 ? 3 : 4;
        const orderStatus = curIndex; //curIndex === 0 ? all : curIndex === 1 ? 0 : curIndex === 2 ? rd : curIndex;
        const orderStatusText = orderStatus === 0 ? '待付款' : orderStatus === 1 ? '待收货' : orderStatus === 2 ? '已完成' : orderStatus === 3 ? '已取消' : '';
        const num = lData.length >= total ? total : total - lData.length >= pageSize ? pageSize : total - lData.length;
        for (let i = 0; i < num; i++) {
          list.push({
            id: '6050ab963b36f3349833149d',
            title: '芝华士12年500ml+ 百龄坛特醇威士忌洋酒',
            url: ['https://cms.wuyeface.com/filemanager/filedatabase/img/2021/5/25/0106da29-04c8-41b8-839e-3eaa4f33bda3.jpg'],
            shopName: '小会便利店',
            number: 1,
            price: 1999.08,
            money: {
              int: '1999',
              flt: '.08',
            },
            orderStatus,
            orderStatusText,
            spec: '5000ml',
          });
        }
        const mockResp = {
          statusCode: 200,
          message: '请求成功',
          data: {
            list,
            total,
          },
        };
        const canLoad = curLstItm.load.hasData || !lData.length;
        if (canLoad) {
          curLstItm.load.pending = true;
          this.pending = true; // !initLoad
          return this.$mallApi.Test.mock({ mock: mockResp, hideLoading: true, timeout: 1000 }).then((res) => {
            curLstItm.load.pending = false;
            this.pending = false;
            if (res.statusCode === 200) {
              const list = res.data.list;
              list.forEach((item) => {
                lData.push(item);
              });
              if (list.length) ++curLstItm.load.curPage;
              curLstItm.load.hasData = !(list.length < pageSize) || list.length === 0;
              curLstItm.total = res.data.total;
            }
            if (refresh) {
              curLstItm.load.refresh = false;
              this.$refs['scroller'][0].end();
            }
            if (initLoad) this.inited = true;
            curLstItm.load.text = lData.length === 0 ? '下拉刷新~' : '上拉加载更多';
          });
        } else {
          return Promise.resolve();
        }
      } else {
        const canLoad = curLstItm.load.hasData || !lData.length;
        if (canLoad) {
          const { memberId } = this.$cmMth.getUserStatusInfo() || {};
          const data = {
            buyerId: memberId, //memberId,
            orderStatus,
          };

          curLstItm.load.pending = true;
          return this.$mallApi.data.getGoodsOrderList({ data, pathParams: `/${pageSize}/${curLstItm.load.curPage}`, hideLoading: true }).then((res) => {
            curLstItm.load.pending = false;
            if (res.statusCode === 200) {
              const list = (res.data && Array.isArray(res.data.records) && res.data.records) || [];
              const precision = this.$cmMth.precision;
              list.forEach((item) => {
                const { isAfterSale, orderGoodsList, sellerName, orderStatus, orderStatusStr, payAmountStr, afterSaleState, afterSaleStateStr, evaluateStatus } = item;
                const evaluateStr = evaluateStatus ? '已评价' : '待评价';
                const order = {
                  ...item,
                  shopName: sellerName,
                  url: [],
                  number: 0,
                  price: payAmountStr,
                  orderStatus,
                  orderStatusText: orderStatus === 3 ? '已完成' : afterSaleState !== 0 ? afterSaleStateStr : orderStatusStr, //orderStatus === 3：显示评价状态  afterSaleState !== 0：申请售后，显示售后状态
                  money: this.$cmMth.formatSum({ value: payAmountStr, type: 'UpperCamelCase' }),
                };
                Array.isArray(orderGoodsList) &&
                  orderGoodsList.forEach((item) => {
                    const { goodsName, goodsImageUrl, numbers, goodsSpec, salePriceStr, payAmountStr } = item;
                    //order.price = precision.plus(order.price, payAmountStr);
                    order.title = goodsName;
                    order.number += numbers;
                    order.url.push(goodsImageUrl);
                    order.spec = goodsSpec;
                    order.salePrice = this.$cmMth.formatSum({ value: salePriceStr, type: 'UpperCamelCase' });
                  });
                lData.push(order);
              });
              if (list.length) ++curLstItm.load.curPage;
              curLstItm.load.hasData = !(list.length < pageSize || list.length === 0);
              curLstItm.total = res.data.total;
            }
            if (refresh) {
              curLstItm.load.refresh = false;
              this.$refs['scroller'][0].end();
            }
            if (initLoad) this.inited = true;
            curLstItm.load.text = lData.length === 0 ? '下拉刷新~' : '上拉加载更多';
          });
        }
      }
    },
    onUp() {
      const index = this.tab.curIndex;
      const curCate = this.tab.list[index];
      const isTodayRec = curCate.todayRec;
      const args = {};
      isTodayRec ? (args.todayRec = 1) : (args.firstLevelCateId = curCate.id);
      this.$set(this.tab.list[index].load, 'pending', true);
      this.loadOrderData({ args });
    },
    onDown() {
      const index = this.tab.curIndex;
      const args = { refresh: true };
      this.$set(this.tab.list[index], 'data', []);
      this.$set(this.tab.list[index].load, 'curPage', 1);
      this.$set(this.tab.list[index].load, 'refresh', true);
      //this.getTotalNum();
      this.loadOrderData(args);
    },
    confirmReceipt(params) {
      const { orderId } = params;
      this.$refs['confirm'].open({
        title: '确认提示',
        message: `您确定收到货吗`,
        callback: (data) => {
          const { action } = data;
          if (action === 'confirm') {
            this.$mallApi.data.goodsConfirmReceipt({ pathParams: `/${orderId}`, loadingText: '确认中' }).then((res) => {
              if (res.statusCode === 200) {
                this.onDown();
              }
            });
          }
        },
      });
    },
    buttonClick(params) {
      const { type, orderStatus, data } = params;
      const { orderId, sellerId } = data || {};
      let url = '';
      switch (type) {
        case 'cancel':
          this.cancelOrder(data);
          break;
        case 'toPay':
          this.repayOrder(data);
          break;
        case 'confirmReceipt':
          this.confirmReceipt(data);
          break;
        case 'return':
          // url = `/pages-mall-a/order/order-detail?orderId=${orderId}`
          const { orderAfterSaleState } = data;
          const isAfterSale = data.orderGoodsList[0].isAfterSale;
          const asId = data.orderGoodsList[0].asId;
          const afterSaleDetailUrl = `/pages-mall-a/order-after-sale/return-approval-info?afterSaleId=${asId}`;
          const applyAfterSaleUrl = `/pages-mall-a/editor-upload/return-request?orderId=${orderId}&goodsSpecId=${data.orderGoodsList[0].goodsSpecId}`;
          url = isAfterSale !== 0 ? afterSaleDetailUrl : orderAfterSaleState === 1 && isAfterSale === 0 ? applyAfterSaleUrl : '';
          break;
        case 'viewOrder':
        case 'unevaluated':
          url = `/pages-mall-a/order/order-detail?orderId=${orderId}`;
          break;
        case 'shop':
          url = `/pages-mall-a/shop/detail?shopId=${sellerId}`;
          break;
        case 'deleteOrder':
          this.deleteOrder(data);
          break;
      }
      if (url) uni.navigateTo({ url });
    },
    statusColor(status) {
      return {
        active: status < 1,
      };
    },
    async repayOrder(params) {
      /** 支付参数 */
      const { orderId, payAmount: payAmountTmp, payType } = params;

      let args = {};
      if (payType === 'wx') {
        args = Payment.submitByWX(orderId, payAmountTmp);
      } else if (payType === 'zfb') {
        args = Payment.submitByZFB(orderId, payAmountTmp);
      }

      // #ifdef  H5
      const isAPP = this.isWebViewApp();
      if (!isAPP) args.returnUrl = this.getPayResultPage();
      // #endif
      /** 支付参数 */

      const res = await this.$mallApi.data.payOrder({ data: args, loadingText: '去支付中' });
      if (!res.success) return;

      const { payInfo, payAmount, payOrderSn } = res.data || {};
      const isIntegralPay = payInfo === null && payAmount === 0;
      if (isIntegralPay) {
        // 积分支付
        this.integralPay({ paySn: payOrderSn });
      } else {
        const { success } = await Payment.wxPayAll(payType, res.data);

        if (success) {
          // 跳转到支付结果页面
          Payment.payToResultPage(payOrderSn);
        }
      }

      // const isWebViewApp = this.isWebViewApp();
      // let tradeType = '';
      // // #ifdef  MP
      // tradeType = 'mini'
      // // #endif

      // // #ifdef  H5
      // tradeType = isWebViewApp ? 'app' : 'jsapi'
      // // #endif
      // //const {cip} = await this.$mallApi.data.getIpAddress({loadingText: '去支付中', hideLoading: false});
      // const {openId} = this.$cmMth.getUserStatusInfo() || {};
      // const args = {
      // 	//clientIp: cip,
      // 	orderId,
      // 	payUserId: openId,
      // 	tradeType,
      // 	payType: payType,
      // 	payAmount
      // }
      // // #ifdef  H5
      // if (!isWebViewApp) args.returnUrl = this.getPayResultPage();
      // // #endif
      // this.$mallApi.data.payOrder({data: args, loadingText: '去支付中'}).then(res => {
      // 	if (res.statusCode === 200) {
      // 		const {payOrderSn, payInfo, tradeType, payAmount} = res.data;
      // 		const isIntegralPay = payInfo === null && payAmount === 0;
      // 		if (isIntegralPay) {
      // 			this.integralPay({paySn: payOrderSn})
      // 		}
      // 		else if (tradeType == 'mini') {
      // 			const payArg = JSON.parse(payInfo);
      // 			this.requestPayment({...payArg, paySn: payOrderSn});
      // 		} else {
      // 			this.otherPay(res.data || {});
      // 		}
      // 	}
      // })
    },
    requestPayment(params = {}) {
      const { paySn, timeStamp, nonceStr, package: pkg, signType, paySign } = params;
      return new Promise((resolve) => {
        uni.getProvider({
          service: 'oauth',
          success: (res) => {
            const [provider] = res.provider;
            uni.requestPayment({
              provider,
              timeStamp,
              nonceStr,
              package: pkg,
              signType,
              paySign,
              success: (res) => {
                uni.navigateTo({ url: `/pages-mall-a/order/pay-result?paySn=${paySn}` });
                resolve(res);
              },
              fail: (err) => {
                resolve(err);
              },
            });
          },
        });
      });
    },
    cancelOrder(params) {
      const { orderId } = params;
      this.$refs['confirm'].open({
        title: '取消确认',
        message: `您确定要取消此订单吗`,
        callback: (data) => {
          const { action } = data;
          if (action === 'confirm') {
            this.$mallApi.data.cancelOrder({ pathParams: `/${orderId}`, loadingText: '取消中' }).then((res) => {
              if (res.statusCode === 200) {
                this.onDown();
              }
            });
          }
        },
      });
    },
    deleteOrder(params) {
      const { id } = params;
      this.$refs['confirm'].open({
        title: '删除确认',
        message: `您确定要删除此订单吗`,
        callback: (data) => {
          const { action } = data;
          if (action === 'confirm') {
            const args = { id };
            this.$mallApi.goods.deleteOrderById({ data: args, loadingText: '删除中' }).then((res) => {
              if (res.statusCode === 200) {
                this.onDown();
              }
            });
          }
        },
      });
    },
    getTotalNum() {
      const { memberId } = this.$cmMth.getUserStatusInfo() || {};
      return this.$mallApi.data.getGoodsOrderTotal({ data: { buyerId: memberId }, hideLoading: true }).then((res) => {
        if (res.statusCode === 200) {
          const { unPaidTotal, unDeliveredTotal, unReceivingTotal, completedTotal, cancelTotal } = res.data || {};
          this.tab.list[0].total = unPaidTotal;
          this.tab.list[1].total = unDeliveredTotal;
          this.tab.list[2].total = unReceivingTotal;
          this.tab.list[3].total = completedTotal;
          this.tab.list[4].total = cancelTotal;
        }
      });
    },
    highlight(params) {
      const { orderStatus, evaluateStatus } = params;
      return orderStatus <= 3; // || orderStatus === 3 && evaluateStatus === 0
    },
  },
};
</script>
