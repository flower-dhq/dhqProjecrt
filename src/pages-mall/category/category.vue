<template>
  <view class="page-box">
    <!-- 搜索栏 -->
    <view class="header">
      <view class="h-input" @click="searchShop">
        <cl-icon name="cl-icon-search" />
        <text>点击输入搜索商品名称</text>
      </view>
    </view>
    <view class="content">
      <!-- 分类列表 -->
      <scroll-view class="side-scroll" scroll-y>
        <view
          :class="['category-item', { 'is-active': item.gcId === selCategoryId }]"
          v-for="item in categoryList"
          :key="item.gcId"
          @click="sideChange(item.gcId)"
        >{{ item.gcName }}</view>
      </scroll-view>
      <!-- 分类内容 -->
      <scroll-view class="cart-list" scroll-y>
        <view class="cart-panel" v-for="item in categoryContent" :key="item.gcId">
          <text class="cart-title">{{ item.gcName }}</text>
          <view class="cart-content">
            <view class="cart-item" v-for="cate in item.children" :key="cate.gcId" @click="linkTo(cate)">
              <image :src="cate.url" />
              <text>{{ cate.gcName }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 底部导航栏 -->
    <m-tabbar :value="1"></m-tabbar>
  </view>
</template>

<script>
import mTabbar from '@/pages-mall/components/m-tabbar.vue'
export default {
  options: { styleIsolation: 'shared' },
  data() {
    return {
      isFocus: false, // 是否聚焦，来改变搜索框样式
      selCategoryId: '', // 一级分类的被选中项
      categoryList: [], // 商品分类列表
      categoryContent: [], // 商品分类内容
    }
  },
  components: {
    mTabbar
  },
  async onLoad() {
    await this.getCategorySide()
    this.sideChange(this.selCategoryId)
  },
  async onPullDownRefresh() {
    this.selCategoryId = ''
    await this.getCategorySide()
    this.sideChange(this.selCategoryId)
    uni.stopPullDownRefresh()
  },
  methods: {
    // 获取一级分类
    async getCategorySide() {
      let { data = [] } = await this.$mallApi.shop.getFirstLevelCategory({ hideLoading: true })
      data = !data ? [] : data

      this.categoryList = data
      this.selCategoryId = (data[0] && data[0].gcId) || ''
    },
    /**
     * 获取一级分类下的所有子分类和内容
     * gcId 一级分类id
     */
    async getCategoryContent(gcId) {
      const params = {
        pathParams: `/${gcId}`,
        data: {
          recursion: true, // 是否递归查询所有子分类
        },
        hideLoading: true,
        responseToast:false,
      }
      let { data = {} } = await this.$mallApi.shop.getCategoryChildById(params)
      data = !data ? {} : data
      const children = !data.children ? [] : data.children

      this.categoryContent = children
    },
    sideChange(gcId) {
      this.selCategoryId = gcId

      this.getCategoryContent(gcId)
    },
    searchShop({ detail }) {
      uni.navigateTo({ url: '/pages-mall-a/search-list/search-list' })
    },
    linkTo(item) {
      console.log('item=====',item)
      uni.navigateTo({ url: '/pages-mall-a/search-list/search-list?gcId=' + item.gcId })
    }
  }
}
</script>

<style scoped lang="scss">
.page-box {
  display: flex;
  flex-direction: column;

  .header {
    padding: 20rpx 20rpx 10rpx;
  }
  .content {
    width: 100%;
    flex: 1;
    display: flex;
    overflow: hidden;
  }
}

.h-input {
  width: 100%;
  height: 68rpx;
  background-color: #F6F6F6;
  color: #CCCCCC;
  border-radius: 34rpx;
  text-align: center;
  line-height: 68rpx;
  font-size: 28rpx;

  &>text {
    margin-left: 20rpx;
  }
}
.side-scroll {
  flex-shrink: 0;
  width: 180rpx;
  background-color: #f6f6f6;
  margin-top: 10rpx;
}
.category-item {
  width: 100%;
  height: 100rpx;
  text-align: center;
  font-size: 26rpx;
  color: $uni-text-color;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  &.is-active {
    background-color: #fff;
    position: relative;

    &::before {
      display: inline-block;
      content: '';
      width: 8rpx;
      height: 32rpx;
      background-color: $uni-color-assist;
      position: absolute;
      left: 0;
    }
  }
}
.cart-list {
  flex: 1;
  margin-top: 10rpx;
}
.cart-panel {
  background-color: #fff;
  margin: 10rpx 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(#e3e3e3, 0.5);

  .cart-title {
    font-size: 26rpx;
    line-height: 36rpx;
    padding: 28rpx 20rpx;
    display: block;
  }
  .cart-content {
    display: flex;
    // justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
    padding-top: 30rpx;
  }
  .cart-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 33%;
    margin-bottom: 30rpx;

    & > image {
      width: 116rpx;
      height: 116rpx;
      flex-shrink: 0;
    }
    & > text {
      display: block;
      font-size: 24rpx;
      line-height: 36rpx;
      flex-shrink: 0;
      text-align: center;
    }
  }
}
</style>
