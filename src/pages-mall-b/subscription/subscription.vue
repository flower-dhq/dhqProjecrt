<template>
  <view class="page">
    <view class="mod">
      <cl-scroller ref="scroller" @up="onUp" @down="onDown">
        <view class="mod-item" v-for="(item,i) in subscriptionList" :key="i" @click="linkTo(item.sellerId)">
          <image :src="item.logoFile" />
          <p>{{item.sellerName}}</p>
        </view>

        <cl-loadmore v-if="subscriptionList.length > 0" :loading="loading" :finish="noMore" finish-text="我是底线"></cl-loadmore>
      </cl-scroller>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageNum: 1, // 当前页数
      pagesize: 10, // 每页显示的条数
      pageCount: 0, // 总页数
      loading: false,
      noMore: false,
      subscriptionList: []
    }
  },
  methods: {
    async getSellersFavoritesList() {
      const { memberId } = this.$cmMth.getUserStatusInfo() || {}
      const data = {
        size: this.pagesize,
        current: this.pageNum,
        memberId
      }
      return await this.$mallApi.shop.selectSellersFavorites({ data })
    },
    onUp() {
      this.loading = true
      setTimeout(async () => {
        this.pageNum++
        if (this.pageNum <= this.pageCount) {
          const res = await this.getSellersFavoritesList()
          this.subscriptionList.push(res.data.records)
          this.loading = false
        } else {
          this.loading = false
          this.noMore = true
          this.$refs['scroller'].end()
        }
      }, 1000)
    },
    onDown() {
      setTimeout(async () => {
        const res = await this.getSellersFavoritesList()
        this.pageCount = res.pages
        this.subscriptionList = res.data.records
        if (res.data.total < 10) {
          this.noMore = true
        }
        this.$refs['scroller'].end()
      }, 1000)
    },
	//页面跳转详情
	linkTo(sellerId) {
	  uni.navigateTo({ url: `/pages-mall-a/shop/detail?shopId=${sellerId}` })
	}
  },
  onLoad() {
    this.onDown()
  }
}
</script>

<style lang="scss" scoped>
.page {
  background: #f7f7f7;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.mod {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  .mod-item {
    padding: 30rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      width: 92%;
      height: 10px;
      display: block;
      margin: 0 auto;
      border-bottom: 2rpx solid rgba(239, 239, 239, 1);
      position: absolute;
      top: -24rpx;
    }
    position: relative;
    image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }

    p {
      height: 80rpx;
      width: calc(100% - 80px);
      line-height: 80rpx;
      font-size: 30rpx;
      color: #333333;
      margin-left: 30rpx;
    }
  }
}
</style>