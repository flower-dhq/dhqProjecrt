<style lang="scss" scoped>
.evaluation {
  width: 100%;
  height: 100%;
  background-color: #f7f7f7;
  box-sizing: border-box;
  padding: 30rpx;
  .order {
    width: 100%;
    border-radius: 16rpx;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20rpx;
    margin-bottom: 20rpx;
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
          @include flx-dsp($jsc: flex-start, $ali: flex-start, $drt: column);
          .goods-title {
            @include ellipsis();
            color: $uni-text-color;
            font-size: $uni-font-size-base;
            width: 50%;
          }

          .goods-spec,
          .goods-num {
            display: block;
            $gray-color: #eee;
            margin: 4rpx 0rpx;
            display: block;
            text-align: left;
            font-size: $uni-font-size-sm;
            color: #888;
          }
          .goods-spec {
            margin-top: 10rpx;
            margin-bottom: 40rpx;
          }

          .goods-bottom {
            width: 100%;
          }
        }
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
  <view class="evaluation">
    <cl-scroller ref="scroller" @up="onUp" @down="onDown">
      <view v-for="(order, i) in dataList" :key="i" class="order">
        <view class="order__top">
          <view class="shop" @tap="buttonClick({data: order})">
            <image src="/pages-mall-a/static/shop_icon.png" mode=""></image>
            <text>{{ order.shopName }}</text>
            <cl-icon name="cl-icon-arrow-right" color="#cdcdcd" size="30"></cl-icon>
          </view>
        </view>
        <view class="order__info">
          <view class="order__info--single" @tap="getDetailPage(order.orderId)">
            <custom-image class="cust-img" :src="order.url" mode="scaleFit"></custom-image>
            <view class="wr">
              <text class="goods-title">{{ order.title }}</text>
              <text class="goods-spec">{{ order.spec }}</text>
              <text class="goods-num">x {{ order.number }}</text>
            </view>
          </view>
        </view>
        <view class="buttons" v-if="order.evaluateStatus === 0">
          <text @tap="buttonClick({data: order, type: 'evaluate'})">评价晒单</text>
        </view>
      </view>
      <cl-loadmore
        :text="load.text"
        v-if="loadMoreShow"
        :finish-text="load.finishText"
        :finish="load.finish"
        :loading="load.pending"
      ></cl-loadmore>
      <view class="no-order" v-if="noDataShow">
        <image src="/pages-mall-a/static/question.png" mode=""></image>
        <text>没有相关评价订单</text>
      </view>
    </cl-scroller>
  </view>
</template>

<script>
export default {
  data() {
    return {
      load: {
        inited: false,
        pending: false,
        total: 0,
        curPage: 1,
        size: 10,
        finish: false,
        text: '上拉加载更多',
        refresh: false,
        finishText: '我的底线'
      },
      requesting: false,
      dataList: []
    }
  },
  computed: {
    loadMoreShow() {
      const { inited } = this.load
      return inited && this.dataList.length
    },
    noDataShow() {
      const { inited, refresh } = this.load
      const noData = this.dataList.length === 0
      return inited && !refresh && noData
    }
  },
  onLoad() {
    this.getDataList({ showLoading: true, isInit: true })
  },
  methods: {
    // 上拉加载
    onUp() {
      if (this.load.finish) return
      this.load.pending = true
      this.getDataList()
    },
    // 下拉刷新
    onDown() {
      this.dataList = []
      this.load.curPage = 1
      this.load.refresh = true
      this.load.finish = false
      this.getDataList()
    },
    // 加载数据
    getDataList(params = {}) {
      const { showLoading, isInit } = params
      const { curPage, size, refresh } = this.load
      this.requesting = true
      this.$mallApi.data
        .getEvaluation({ pathParams: `/${size}/${curPage}`, hideLoading: !showLoading })
        .then(res => {
          this.requesting = false
          if (res.statusCode === 200) {
            const list = Array.isArray(res.data?.records) ? res.data.records : []
            list.forEach(item => {
              const { sellerName, goodsImageUrl, goodsName, goodsSpec, numbers } = item
              const d = {
                ...item,
                shopName: sellerName,
                url: goodsImageUrl,
                title: goodsName,
                spec: goodsSpec,
                number: numbers
              }
              this.dataList.push(d)
            })

            if (list.length) ++this.load.curPage
            this.load.finish = list.length < size || list.length === 0
            if (refresh) {
              this.load.refresh = false
              this.$refs['scroller'].end()
            }
            if (isInit) this.load.inited = true
            this.load.text = list.length === 0 ? '下拉刷新~' : '上拉加载更多'
          }
        })
        .catch(_ => {
          this.requesting = false
        })
    },
    // 页面点击
    buttonClick(params = {}) {
      const { data, type } = params
      const { sellerId, goodsId, orderId, shopName, goodsName, goodsSpecId, goodsSpec, goodsImageUrl} = data || {}
      let url = ''
      if (type === 'evaluate') {
        const args = encodeURIComponent(
          JSON.stringify({
            orderId, // 订单id
            gmId: goodsId, // 商品id
            gsId: goodsSpecId, // 规格id
            imgUrl: goodsImageUrl, // 图片地址
            specName: goodsSpec,
            shopName,
            goodsName
          })
        )
        url = `/pages-mall-a/editor-upload/editor-upload?args=${args}`
      } else {
        url = `/pages-mall-a/shop/detail?shopId=${sellerId}`
      }

      if (url) uni.navigateTo({ url })
    },
    // 跳转订单详情
    getDetailPage(orderId) {
      uni.navigateTo({
        url: `/pages-mall-a/order/order-detail?orderId=${orderId}`
      })
    }
  }
}
</script>
