<template>
  <view class="page-box-top">
    <!-- 搜索栏 -->
    <view class="header">
      <image class="list-icon" v-if="false" src="@/pages-mall/static/shop/category_list_icon.png" @click="linkTo('category')" />
      <shop-input-search v-model="searchStore.searchValue" @confirm="refresh" />
      <view class="click-pd" @click="goSearch"></view>
    </view>
    <!-- 条件筛选 -->
    <cl-filter-bar @change="refresh">
      <cl-filter-item label="筛选" :options="filterList" v-model="searchStore.filterValue" type="dropdown" prop="all" />
      <cl-filter-item
        label="销量"
        v-model="searchStore.saleValue"
        type="order"
        prop="sale"
        @change="filterChange('saleValue', $event)"
      />
      <cl-filter-item
        label="价格"
        v-model="searchStore.priceValue"
        type="order"
        prop="price"
        @change="filterChange('priceValue', $event)"
      />
    </cl-filter-bar>
    <view class="placeholder"></view>
    <!-- 商品列表 -->
    <view class="list-scroll" v-if="pageSplit.listCount">
      <!-- start: 显示优惠信息 -->
      <text class="coupon-info" v-if="couponConditionsOfUse">以下商品使用条件适用：{{couponConditionsOfUse}}</text>
      <!-- end -->
      <!-- 瀑布流 -->
      <cl-waterfall ref="elWaterfall" v-model="cardList" :gutter="19.2">
        <cl-waterfall-column v-for="(children, index) in cardList" :key="index">
          <template v-if="Array.isArray(children)">
            <shop-detail-card
              v-for="(item, j) in children"
              :key="j"
              :imgUrl="item.goodsPic"
              :shopName="item.gmName"
              :price="item.salePrice/100"
              :saleCount="item.totalSalesCount"
              size="346rpx auto"
              @addShopCart="openModel(item)"
              @linkTo="linkTo('shopInfo', item)"
            />
          </template>
        </cl-waterfall-column>
      </cl-waterfall>
      <!-- 加载更多 -->
      <cl-loadmore :loading="pageSplit.loading" :finish="isEndPage" finish-text="我是底线"></cl-loadmore>
    </view>
    <!-- 暂无商品 -->
    <view class="list-scroll" v-else>
      <image class="list-none" src="@/pages-mall-a/static/empty/shop_list_none_icon.png" mode="widthFix" />
      <text class="list-none-text">抱歉~没找到商品</text>
    </view>
    <!-- 购物车按钮 -->
    <view class="shop-cart" @click="linkTo('shopCart')"></view>
    <view class="back2home" @click="linkTo('backHome')"></view>
    <!-- 弹窗-规格型号 -->
    <model-popup
      v-if="isFalg"
      v-model="isShowModel"
      clickSource="join"
      :otherParams="{ imgUrl: shopStore.shopInfo.logo, shopName: shopStore.shopInfo.gmName, putShelves: shopStore.shopInfo.putShelves }"
      @joinShopCart="joinCartList"
    />
    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import commonMethod from '@/js/commonMethod'
import ShopInputSearch from '@/pages-mall-a/components/input-search/shop-input-search.vue'
import ShopDetailCard from '@/pages-mall-a/components/shop-detail-card/shop-detail-card.vue'
import ModelPopup from '@/pages-mall-a/shopping-info/module/model-popup.vue'
import handleDataOfNull from '@/js/handleDataOfNull'
import { miniInit } from '@/js/miniStore'
import * as DeliveryStore from '@/pages-mall-a/shopping-info/module/deliveryStore'
import * as SpecStore from '@/pages-mall-a/shopping-info/module/specStore'
import * as ShopStore from '@/pages-mall-a/shopping-info/module/shopStore'

// 地址参数 ?gmName=(商品名称)&gcId=(商品分类id)
export default {
  options: { styleIsolation: 'shared' },
  components: {
    ShopInputSearch,
    ShopDetailCard,
    ModelPopup
  },
  data() {
    return {
      searchStore: {
        searchValue: '', // 商品名称
        filterValue: false, // 筛选值
        saleValue: '', // 销量值，(asc: 由低到高, desc: 由高到低, '': 不排序)
        priceValue: '', // 价格值，(asc: 由低到高, desc: 由高到低, '': 不排序)
        categoryId: '' // 商品分类id
      },
      // 筛选列表
      filterList: [
        { value: false, label: '全部' },
        { value: true, label: '促销' }
      ],
      cardList: [], // 商品列表
      pageSplit: {
        // 分页
        size: 10,
        current: 1,
        total: 0,
        loading: false, // 显示/隐藏加载更多
        listCount: 0 // 列表长度，即cardList的长度
      },
      isShowModel: false,
      shopStore: ShopStore.state(),
      deliveryStore: DeliveryStore.state(),
      specStore: SpecStore.state(),

      pjIdRoute: '',
      couponInfoIdRoute: '',
      useTipsRoute: '',

      isFalg: true, // 用来销毁model-popup 组件 处理详情页回来打开异常问题
    }
  },
  computed: {
    getSelSpec: SpecStore.getters.getSelSpec,
    getDefaultPrice: SpecStore.getters.getDefaultPrice,

    isEndPage() {
      const { total } = this.pageSplit
      return this.pageSplit.listCount >= total
    },
    couponConditionsOfUse() {
      // const {couponConditionsOfUse: useTips} = this.$route.query
      // return useTips && decodeURIComponent(useTips) || ''
      return this.useTipsRoute && decodeURIComponent(this.useTipsRoute) || ''
    }
  },
  beforeCreate() {
    miniInit('shopStore')
    miniInit('deliveryStore')
    miniInit('specStore')
  },
  onShow() {
    this.shopStore = ShopStore.state()
    this.deliveryStore = DeliveryStore.state()
    this.specStore = SpecStore.state()
    this.isFalg = true
  },
  onHide() {
    this.isFalg = false
  },
  onLoad(option) {
    const { gmName, gcId , keyword,pjId,couponInfoId,couponConditionsOfUse} = commonMethod.getRouteParams(option, 'gmName', 'gcId','keyword','pjId','couponInfoId','couponConditionsOfUse')
    this.pjIdRoute = pjId?pjId:''
    this.couponInfoIdRoute = couponInfoId?couponInfoId:''
    this.useTipsRoute = couponConditionsOfUse?couponConditionsOfUse:''
    this.searchStore.searchValue = gmName?gmName:keyword
    this.searchStore.categoryId = gcId

    this.refresh()
  },
  // 下拉刷新
  async onPullDownRefresh() {
    await this.refresh()

    uni.stopPullDownRefresh()
  },
  // 上拉加载
  async onReachBottom() {
    if (this.isEndPage) return

    this.pageSplit.current += 1
    this.pageSplit.loading = true

    const res = await this.getShopList()
    this.pageSplit.listCount += res.length
    // 瀑布流组件追加列表数据
    this.$refs.elWaterfall?.append(res)

    this.pageSplit.loading = false
  },
  methods: {
    linkTo(val, ...arg) {
      switch (val) {
        case 'category':
          uni.switchTab({ url: '/pages-mall/category/category' })
          break
        case 'shopCart':
          uni.switchTab({ url: '/pages-mall/shopping-cart/shopping-cart' })
          window.location.reload()
          break
        case 'shopInfo':
          const info = arg[0]
          uni.navigateTo({ url: '/pages-mall-a/shopping-info/shopping-info?shopId=' + info.gmId })
          break
        case 'backHome':
          uni.switchTab({ url: '/pages-mall/index/index' })
          break  
        default:
          break
      }
    },
    // 搜索商品
    async getShopList() {
      const { projectId } = commonMethod.storageAction({ action: 'get', key: this.$constant.PROJECT_INFO })
      // const { pjId, couponInfoId} = this.$route.query // couponInfoId: 优惠券去使用时带过来
      const { size, current } = this.pageSplit
      const { searchValue: keyword, categoryId: gcId, saleValue, priceValue, filterValue } = this.searchStore
      const params = {
        pathParams: `/${size}/${current}`,
        data: {
          keyword,
          gcId,
          queryPromotion: filterValue,
          sortBySaleCount: this.transformSortToNumber(saleValue),
          sortBySalePrice: this.transformSortToNumber(priceValue),
          projectId: this.pjIdRoute || projectId,
          couponInfoId: this.couponInfoIdRoute
        }
      }
      const res = await this.$mallApi.shop.getGoodsList(params)
      const { data = {} } = handleDataOfNull(res)
      const { records = [], total = 0 } = handleDataOfNull(data)

      this.pageSplit.total = total
      return records
    },
    async refresh() {
      this.pageSplit.current = 1

      const res = (this.cardList = await this.getShopList())
      this.pageSplit.listCount = res.length

      // 瀑布流组件更新列表数据
      this.$refs.elWaterfall?.refresh(res)
    },
		//点击搜索框跳搜索页面
		goSearch(){
			let url = ""
			if(this.searchStore.searchValue){
				url = "/pages-mall-b/search/history-search?searchKey="+this.searchStore.searchValue
			}else{
				url = "/pages-mall-b/search/history-search"
			}
			uni.redirectTo({url})
		},
    // 将销量和价格的排序(asc, desc)转换为数字(1, -1)
    transformSortToNumber(sort) {
      if (!['asc', 'desc', ''].includes(sort)) return

      const temp = {
        asc: 1,
        desc: -1
      }
      return !sort ? undefined : temp[sort]
    },
    async openModel({ gmId }) {
      this.resetModel()
      await this.getGoodsById(gmId)

      this.isShowModel = true
    },
    // 重置弹窗的数据
    resetModel() {
      SpecStore.mutations.setShopNum(1)
    },
    // 根据商品id获取规格信息
    async getGoodsById(gmId) {
      const params = {
        data: {
          gmId
        }
      }
      const { data } = await this.$mallApi.shop.getGoodsById(params)
      const { specList = [], deliveries = [], deliveryMethod, deliveryParam } = data

      DeliveryStore.mutations.setDeliveryMethod(deliveries)
      DeliveryStore.mutations.setSelDeliveryId(DeliveryStore.defaultDeliId())
      SpecStore.mutations.setSpecMap(specList)
      SpecStore.mutations.setSelSpecId(SpecStore.defaultSpecId())
      SpecStore.mutations.setShopNum(1)
      ShopStore.mutations.setShopInfo({ ...data, deliveryMethod, deliveryParam })
    },
    // 加入购物车
    async joinCartList() {
      // 未授权登录不允许进入当前页面
      if (!commonMethod.checkAuth()) return

      const { companyId, memberId: userId } = commonMethod.getUserStatusInfo()
      const { gmName, gmId, sellerId, sellerName, gcId, gcIds } = this.shopStore.shopInfo
      const { price: gmPrice, gsId: specId, gsName: specName, image: gmPicture } = this.getSelSpec
      const params = {
        data: {
          companyId,
          deliveryMode: DeliveryStore.getDeliveryMode(),
          gmId,
          gmName,
          gmPrice,
          numbers: this.specStore.shopNum,
          // numbers: 0,
          salePrice: this.getDefaultPrice,
          sellerId,
          sellerName,
          specId,
          specName,
          userId,
          gcId,
          gcIds,
          gmPicture: gmPicture || this.shopStore.shopInfo.logo || '',
          invoiceStatus: this.shopStore.shopInfo.invoiceStatus
        }
      }

      const { success = false } = await this.$mallApi.shop.addShopCart(params)
      const message = success ? '成功加入购物车' : '失败加入购物车'

      this.$refs.elMessage.open({
        message,
        position: 'middle'
      })
    },
    // 销量和价格只能选择一个进行筛选
    filterChange(data, val) {
      const arr = ['priceValue', 'saleValue']
      if (!arr.includes(data)) return

      // 先把销量和价格的值置空
      arr
        .filter(item => item !== val)
        .forEach(key => {
          this.searchStore[key] = ''
        })
      this.searchStore[data] = val
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box-top {
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.header {
  width: 100%;
  box-sizing: border-box;
  @include flx-dsp(flex-start, center);
  padding: 20rpx 20rpx 16rpx;
  position: fixed;
  left: 0;
  z-index: 1;
  background-color: #fff;
  top: 0;

  .list-icon {
    width: 44rpx;
    height: 36rpx;
    @include flx-size('keep');
    padding-left: 8rpx;
    padding-right: 26rpx;
  }
  ::v-deep .cl-input {
    @include flx-size('stretch');
  }
  shop-input-search {
    @include flx-size('stretch');
  }
}
::v-deep .cl-filter-bar__wrap,
cl-filter-bar {
  width: 100%;
  position: fixed;
  left: 0;
  z-index: 1;
  top: 100rpx;
}
.placeholder {
  width: 100%;
  height: 186rpx;
  @include flx-size('keep');
}
::v-deep .shop-detail-card {
  margin-bottom: 20rpx;
}
.coupon-info {
  width: 100%;
  display: block;
  font-size: 26rpx;
  color: $uni-color-assist;
  padding-bottom: 20rpx;
  text-align: center;
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
.shop-cart {
  position: fixed;
  bottom: 40rpx;
  right: 20rpx;
  width: 92rpx;
  height: 92rpx;
  background-image: url('~@/pages-mall/static/shop/shop_cart_susp_icon.png');
  background-size: 100% 100%;
}
.back2home{
  position: fixed;
  bottom: 142rpx;
  right: 20rpx;
  width: 92rpx;
  height: 92rpx;
  background-image: url('~@/pages-mall/static/shop/home_icon.png');
  background-size: 100% 100%;
}
.click-pd{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
