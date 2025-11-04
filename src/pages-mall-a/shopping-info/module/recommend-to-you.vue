<template>
  <view class="list-scroll" v-if="pageSplit.listCount">
    <view class="recommend4you-title">
				<text>· 为 / 您 / 推 / 荐 ·</text>
			</view>
    <!-- 瀑布流 -->
    <cl-waterfall ref="elWaterfall" v-model="cardList" :gutter="19.2">
      <cl-waterfall-column v-for="(children, index) in cardList" :key="index">
        <template v-if="Array.isArray(children)">
          <shop-detail-card
            v-for="(item, j) in children"
            :key="j"
            :imgUrl="item.logo"
            :shopName="item.gmName"
            :price="item.lowestPrice"
            :saleCount="item.clientSalesCount"
            size="346rpx auto"
            :isShopCart="false"
            :titleTap="item.sellerSource | getTitleTap"
            @linkTo="linkTo('shopInfo', item)"
          />
        </template>
      </cl-waterfall-column>
    </cl-waterfall>
    <!-- 加载更多 -->
    <cl-loadmore :loading="pageSplit.loading" :finish="isEndPage"></cl-loadmore>
  </view>
</template>

<script>
import ShopDetailCard from '@/pages-mall-a/components/shop-detail-card/shop-detail-card.vue'
import commonMethod from '@/js/commonMethod'
import handleDataOfNull from '@/js/handleDataOfNull'

/**
 * 为你推荐
 */
export default {
  components: {
    ShopDetailCard
  },
  data() {
    return {
      cardList: [], // 商品列表
      pageSplit: {
        // 分页
        size: 10,
        current: 1,
        total: 0,
        loading: false, // 显示/隐藏加载更多
        listCount: 0 // 列表长度，即cardList的长度
      },
    }
  },
  computed: {
    // 是否为最后一页
    isEndPage() {
      const { total } = this.pageSplit
      return this.pageSplit.listCount >= total
    }
  },
  filters: {
    getTitleTap(val) {
      return val === 0 ? '加盟' : ''
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    // 获取为你推荐列表
    async getShopList() {
      const { projectId } = commonMethod.storageAction({ action: 'get', key: this.$constant.PROJECT_INFO })
      const { size, current } = this.pageSplit
      const params = {
        pathParams: `/${size}/${current}`,
        data: {
          projectId
        },
        hideLoading: true
      }
      const res = await this.$mallApi.data.getRecommendGoods(params)
      const { data = {} } = handleDataOfNull(res)
      const { records = [], total = 0 } = handleDataOfNull(data)

      this.pageSplit.total = total
      return records
    },
    async refresh() {
      this.pageSplit.current = 1

      const res = this.cardList = await this.getShopList()
      this.pageSplit.listCount = res.length

      // 瀑布流组件更新列表数据
      this.$refs.elWaterfall?.refresh(res)
    },
    // 上拉加载
    async scrollToBottom() {
      if (this.isEndPage) return

      this.pageSplit.current += 1
      this.pageSplit.loading = true

      const res = await this.getShopList()
      this.pageSplit.listCount += res.length
      // 瀑布流组件追加列表数据
      this.$refs.elWaterfall?.append(res)

      this.pageSplit.loading = false
    },
    linkTo(val, ...arg) {
      switch (val) {
        case 'shopInfo':
          const info = arg[0]
          uni.navigateTo({ url: '/pages-mall-a/shopping-info/shopping-info?shopId=' + info.gmId })
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend4you-title{
  @include flx-dsp($jsc: center, $ali: center);
  width: 100%;
  height: 104rpx;
  text{
    font-size: 34rpx;
  }
}
.list-scroll {
  @include flx-dsp(flex-start, flex-start, row);
  flex-wrap: wrap;
  padding: 20rpx 9.6rpx 0;
  // margin-top: 186rpx;
  background-color: #f7f7f7;

  .list-none {
    display: block;
    width: 500rpx;
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
}
::v-deep .cl-loadmore__wrap,
cl-loadmore {
  width: 100%;
}
::v-deep .shop-detail-card {
  margin-bottom: 20rpx;
}
</style>