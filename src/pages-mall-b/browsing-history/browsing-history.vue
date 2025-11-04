<template>
  <view class="page">
    <view class="mod">
      <cl-scroller ref="scroller" @up="onUp" @down="onDown">
        <view v-for="(bItem,bIndex) in browsingList" :key="bIndex">
          <h3>{{bItem.date}}</h3>
          <view class="mod-line" v-for="(rItem,rIndex) in bItem.recordsList" :key="rIndex" @tap="toGoodsDetail(rItem)">
            <view class="mod-item">
              <image :src="rItem.logo"/>

              <view class="mod-info">
                <view>
                  <p>{{rItem.gmName}}</p>
                  <span>{{rItem.favorites}}人收藏</span>
                </view>
                <view class="mod-info-price">￥{{rItem.price}}</view>
              </view>
            </view>
          </view>
        </view>

        <cl-loadmore v-if="browsingList.length > 0" :loading="loading" :finish="noMore"></cl-loadmore>
      </cl-scroller>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageNum: 1, // 当前页数
      pagesize: 5,  // 每页显示的条数
      pageCount: 0,  // 总页数
      loading: false,
      noMore: false,
      browsingList:[]
    }
  },
  methods: {
    async getBrowsingRecordsList(){
      const {memberId} = this.$cmMth.getUserStatusInfo() || {};
      const data = {
        size: this.pagesize,
        current: this.pageNum,
        memberId,
      }
      return await this.$mallApi.shop.selectBrowsingRecords({data})
    },
    onUp() {
      this.loading = true;

      setTimeout(async() => {
        this.pageNum++;
        if(this.pageNum <= this.pageCount){
          const res = await this.getBrowsingRecordsList()
          this.browsingList.push(res.data.records)
          this.loading = false;
        } else {
          this.loading = false;
          this.noMore = true;
          this.$refs["scroller"].end();
        }
      }, 1000);
    },
    onDown() {
      setTimeout(async() => {
        const res = await this.getBrowsingRecordsList()
        this.pageCount = res.pages;
        this.browsingList = res.data.records
        if(res.data.total < 5){
          this.noMore = true;
        }
        this.$refs["scroller"].end();
      }, 1000);
    },
    toGoodsDetail(item){
      console.log("item======",item);
      if(item.state == "有效"){
        uni.navigateTo({
          url: `/pages-mall-a/shopping-info/shopping-info?shopId=${item.gmId}`
        });
      }
      
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

  h3 {
    font-size: 36rpx;
    color: #333333;
    line-height: 50rpx;
    padding-left: 40rpx;
    padding-top: 30rpx;
  }

  .mod-line {
    width: 100%;
    height: 280rpx;
    box-sizing: border-box;
    padding-left: 40rpx;

    .mod-item {
      width: 100%;
      height: 100%;
      border-bottom: 1rpx solid #e1e1e1;
      display: flex;
      align-items: center;

      image {
        width: 220rpx;
        height: 220rpx;
      }

      .mod-info {
        flex: 1;
        height: 220rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 20rpx;

        p {
          margin-bottom: 10rpx;
          font-size: 28rpx;
          line-height: 40rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;

          color: #333333;
        }

        span {
          display: inline-block;
          color: #999999;
          font-size: 24rpx;
        }

        .mod-info-price {
          font-size: 26rpx;
          color: #fd8444;
          font-weight: bold;
        }
      }
    }
  }
}
</style>

