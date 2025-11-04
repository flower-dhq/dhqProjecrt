<template>
  <view class="page-box">
    <!-- 搜索栏 -->
    <view class="header">
      <!-- <image class="list-icon" src="@/static/shop/category_list_icon.png" @click="linkTo('category')" /> -->
      <!-- <view class="h-input" @click="linkTo('searchList')">
        <cl-icon name="cl-icon-search" />
        <text>点击输入搜索商品名称</text>
      </view> -->
      <shop-input-search class="h-input" v-model="textSearch" placeholder="输入商品名称搜索" @confirm="getFavoritesList($event, 1)" />
      <text class="header-operator" @click="statusChange">{{ isEditor ? '完成' : '管理' }}</text>
    </view>
    <!-- 列表区域 -->
    <view :class="['list-scroll', { 'is-editor': isEditor }]">
      <view class="card-panel" v-for="(item, index) in listData" :key="index">
        <view class="checkbox-panel" v-show="isEditor">
          <cl-checkbox :label="index" round v-model="item.isSelected" @change="checkboxChange(item)" />
        </view>
        <favorites-card
          :imgUrl="item.logoPath"
          :name="item.gmName"
          :price="item.displayPrice"
          :number="item.goodsFavoritesCount"
          :favState="item.favoritesState"
          @linkTo="linkTo('shopInfo', item)"
        />
      </view>
      <!-- 加载更多 -->
      <cl-loadmore v-if="listData.length" :loading="pageSplit.loading" :finish="isEndPage" finish-text="我是底线"></cl-loadmore>
      <!-- 空数据 -->
      <view class="list-scroll" v-else>
        <image class="list-none" src="@/pages-mall-a/static/empty/shop_list_none_icon.png" mode="widthFix" />
        <text class="list-none-text">抱歉~没找到收藏</text>
      </view>
    </view>
    <!-- 底部 -->
    <view class="footer" :style="[vShow(isEditor)]">
      <cl-checkbox label="all" round v-model="allCheckbox" @change="allCheckboxChange" :disabled="isEmptyOfList">全选</cl-checkbox>
      <cl-button plain type="primary" @click="cancelFavorites" :disabled="isEmptyOfList">取消收藏</cl-button>
    </view>
    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import ShopInputSearch from '@/pages-mall-a/components/input-search/shop-input-search.vue'
import FavoritesCard from './module/favorite-card.vue'
import commonMethod from '@/js/commonMethod'

export default {
  options: { styleIsolation: 'shared' },
  components: {
    ShopInputSearch,
    FavoritesCard
  },
  data() {
    return {
      isEditor: false, // true: 显示一堆checkbox, false: 不显示checkbox
      textSearch: '',
      listData: [],
      allCheckbox: false, // 全选
      // 分页
      pageSplit: {
        size: 10,
        current: 1,
        total: 0,
        loading: false
      }
    }
  },
  computed: {
    isEndPage() {
      const { current, size, total } = this.pageSplit
      return (current - 1) * size + this.listData.length >= total
    },
    isEmptyOfList() {
      return !this.listData.length
    }
  },
  onLoad() {
    // 未授权登录不允许进入当前页面
    if (!commonMethod.checkAuth()) return

    this.refresh()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.refresh()
  },
  // 上拉加载
  async onReachBottom() {
    if (this.isEndPage) return

    this.pageSplit.loading = true
    this.pageSplit.current += 1

    await this.getFavoritesList()

    this.pageSplit.loading = false
  },
  methods: {
    // 获取我的收藏列表数据
    async getFavoritesList(evt, isSearch) {
      const userInfo = commonMethod.getUserStatusInfo()
      const params = {
        data: {
          size: this.pageSplit.size,
          current: this.pageSplit.current,
          memberId: userInfo.memberId,
          gmName: this.textSearch
        },
      }
      let { data = {} } = await this.$mallApi.shop.getFavoritesList(params)
      data = data || []
      const { records = [], total = 0 } = data
      if (isSearch) this.listData = []
      this.pageSplit.total = total
      records.map(item => {
        this.listData.push({
        ...item,
        displayPrice: commonMethod.precision.divide(item.salePrice, 100),
        isSelected: false,
        favoritesState: item.favoritesState === '有效' // 商品是否失效。['有效', '失效']
      })})
    },
    statusChange() {
      this.isEditor = this.isEmptyOfList ? false : !this.isEditor
    },
    checkboxChange(item) {
      const res = this.listData.filter(item => item.isSelected)
      const length = this.listData.length

      this.allCheckbox = res.length >= length
    },
    allCheckboxChange(val) {
      this.listData.forEach(item => {
        item.isSelected = val
      })
    },
    async refresh() {
      // 重置
      this.pageSplit.current = 1
      this.allCheckbox = false
      
      this.listData = []
      await this.getFavoritesList()

      uni.stopPullDownRefresh()
    },
    linkTo(type, ...arg) {
      switch (type) {
        case 'category':
          uni.switchTab({ url: '/pages-mall/category/category' })
          break
        case 'searchList':
          uni.navigateTo({ url: '/pages-mall-a/search-list/search-list' })
          break
        case 'shopInfo':
          const info = arg[0]
          uni.navigateTo({ url: '/pages-mall-a/shopping-info/shopping-info?shopId=' + info.gmId })
          break
        default:
          break
      }
    },
    async cancelFavorites() {
      const { companyId, memberId } = commonMethod.getUserStatusInfo()
      const favoriteList = this.listData.reduce((pre, item) => {
        if (item.isSelected) {
          pre.push({
            companyId, // 公司id
            memberId, // 用户id
            gcId: item.gcId, // 商品分类id
            // gcPath: (item.gcIds || []).join(','), // String, 商品分类路由，用逗号隔开
            gcPath: item.gcPath, // String, 商品分类路由，用逗号隔开
            gmId: item.gmId, // 商品id
            price: commonMethod.formatSum({ value: item.lowestPrice }) // number，商品价格
          })
        }

        return pre
      }, [])

      if(favoriteList.length==0){
        this.$refs.elMessage.open({
          message:"请选择商品哦",
          position: 'middle'
        })
        return
      }

      const params = {
        data: {
          favoriteList
        },
        responseToast: false
      }
      const { success } = await this.$mallApi.shop.editorFavorites(params)
      const message = success ? '操作成功' : '操作失败'

      this.$refs.elMessage.open({
        message,
        position: 'middle'
      })

      if (success) {
        this.refresh()
      }
    },
    vShow(flag) {
      return { 'display': flag ? undefined : 'none' }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  position: relative;
}
.header {
  position: fixed;
  left: 0;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
  @include flx-dsp(flex-start, center);
  padding: 20rpx 20rpx 16rpx;
  background-color: #fff;

  .list-icon {
    width: 44rpx;
    height: 36rpx;
    @include flx-size('keep');
    padding-left: 8rpx;
    padding-right: 26rpx;
  }
  .h-input {
    @include flx-size('stretch');
    // width: 100%;
    // height: 68rpx;
    // background-color: #f6f6f6;
    // color: #cccccc;
    // border-radius: 34rpx;
    // text-align: center;
    // line-height: 68rpx;
    // font-size: 28rpx;

    // & > text {
    //   margin-left: 20rpx;
    // }
  }
  .header-operator {
    font-size: 28rpx;
    color: #888;
    @include flx-size('keep');
    padding-left: 26rpx;
  }
}
.list-scroll {
  background-color: #f7f7f7;
  width: 100%;
  @include flx-dsp(flex-start, flex-start, column);

  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 106rpx;
  }
  &.is-editor::after {
    content: '';
    display: block;
    width: 100%;
    height: 96rpx;
  }
  .card-panel {
    width: 100%;
    height: 288rpx;
    padding: 20rpx 20rpx 0;
    box-sizing: border-box;
    @include flx-dsp(flex-start, flex-start, row);

    &:last-child {
      margin-bottom: 20rpx;
    }
  }
  .checkbox-panel {
    height: 100%;
    padding-top: 100rpx;
    padding-right: 12rpx;
    box-sizing: border-box;
  }
  favorites-card {
    width: 100%;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 96rpx;
  background-color: #fff;
  @include flx-dsp(space-between, center, row);

  ::v-deep .cl-checkbox {
    margin-left: 22rpx;
  }
  ::v-deep .cl-button {
    margin-right: 40rpx;
  }
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
::v-deep .cl-loadmore__wrap,
cl-loadmore {
  width: 100%;
}
</style>