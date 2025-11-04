<template>
  <view class="page-box">
    <view class="rating-tab-panel">
      <cl-radio-group v-model="ratingValue" border @change="refresh">
        <cl-radio class="rating-tag" label="all">全部 {{ countComm.all }}</cl-radio>
        <cl-radio class="rating-tag" label="good">好评 {{ countComm.good }}</cl-radio>
        <cl-radio class="rating-tag" label="average">中评 {{ countComm.average }}</cl-radio>
        <cl-radio class="rating-tag" label="bad">差评 {{ countComm.bad }}</cl-radio>
      </cl-radio-group>
    </view>
    <!-- 用户评价 -->
    <view class="list-scroll" v-if="getCount">
      <comment-card
        class="content"
        style="width: 100%;"
        v-for="(item, index) in commentList"
        :key="index"
        :userSrc="item.userAvatarUrl"
        :userName="getUserName(item.submitName)"
        :date="item.submitTime"
        :rate="item.grade"
        :text="item.reviewDesc"
        :imgList="item.filePaths"
        :replyList="item.children"
      ></comment-card>
      <cl-loadmore :loading="pageSplit.loading" :finish="isEndPage"></cl-loadmore>
    </view>
    <view class="list-scroll" v-else>
      <image class="list-none" src="@/pages-mall-a/static/empty/comment_none_icon.png" mode="aspectFit" />
      <text class="list-none-text">抱歉~没找到商品</text>
    </view>
    <!-- <cl-scroller ref="elScroller" @down="downRefresh" @up="upLoad" :show-back-top-button="false"></cl-scroller> -->
  </view>
</template>

<script>
import commonMethod from '../../js/commonMethod'
import CommentCard from './module/comment-card.vue'
import handleDataOfNull from '@/js/handleDataOfNull'

// 页面传参, ?gmId=
export default {
  options: { styleIsolation: 'shared' },
  components: {
    CommentCard
  },
  data() {
    return {
      gmId: '', // 商品id
      ratingValue: 'all', // 被选中的商品评价项
      // radio-group评论数量
      countComm: {
        all: 0, // 全部
        good: 0, // 好评
        average: 0, // 中评
        bad: 0 // 差评
      },
      commentList: [], // 评价列表
      pageSplit: {
        // 分页
        size: 10,
        current: 1,
        total: 0,
        loading: false
      }
    }
  },
  filters: {
    // 解码用户名
    getUserName(val) {
      return decodeURIComponent(val)
    }
  },
  computed: {
    isEndPage() {
      const { current, size, total } = this.pageSplit
      return (current - 1) * size + this.getCount >= total
    },
    getCount() {
      return this.commentList.length
    }
  },
  onLoad(option) {
    const { gmId } = commonMethod.getRouteParams(option, 'gmId')

    this.gmId = gmId || ''

    this.refresh()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.refresh()
  },
  // 上拉加载
  async onReachBottom() {
    if (this.isEndPage) return
    this.pageSplit.current += 1
    this.pageSplit.loading = true

    const res = await this.getCommentById()
    this.commentList = this.commentList.concat(res)
    this.pageSplit.loading = false
  },
  methods: {
    // 上拉加载
    upLoad() {
      this.pageSplit.loading = true

      setTimeout(() => {
        this.pageSplit.loading = false
      }, 700)
    },
    // 根据商品id获取所有评论
    async getCommentById() {
      const ratmp = {
        all: '',
        good: '好评',
        average: '中评',
        bad: '差评'
      }
      const params = {
        data: {
          size: this.pageSplit.size,
          current: this.pageSplit.current,
          gmId: this.gmId,
          rating: ratmp[this.ratingValue]
        }
      }

      const res = await this.$mallApi.shop.getCommentbyGmId(params)
      const { data = {} } = handleDataOfNull(res)
      const { records = [], total = 0 } = handleDataOfNull(data)

      this.pageSplit.total = total
      const tempRes = records.map(item => ({
        ...item,
        filePaths: Boolean(item.filePaths) ? item.filePaths.split(',') : [],
        children: item.children.map(child => child.reviewDesc)
      }))
      return tempRes
    },
    // 获取radio-group的评论数量
    async getCountOfComment() {
      const params = {
        data: {
          gmId: this.gmId
        }
      }
      let res = await this.$mallApi.shop.getCountOfComment(params)
      const { data = {} } = handleDataOfNull(res, { deep: true })
      this.countComm = {
        all: data['全部'],
        good: data['好评'],
        average: data['中评'],
        bad: data['差评']
      }
    },
    // 解码用户名
    getUserName(val) {
      return decodeURIComponent(val || '')
    },
    async refresh() {
      this.pageSplit.current = 1

      this.getCountOfComment()
      this.commentList = await this.getCommentById()

      uni.stopPullDownRefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  @include flx-dsp(flex-start, flex-start, column);
}
.rating-tab-panel {
  width: 100%;
  height: 160rpx;
  border-bottom: 20rpx solid #f7f7f7;
  padding: 40rpx 34rpx;
  box-sizing: border-box;

  .rating-tag,
  .rating-tag::v-deep .cl-radio {
    padding: 0;
    width: 156rpx;
    height: 56rpx;
    box-sizing: border-box;
    border-width: 0rpx;
    background-color: #f7f7f7;
    border-radius: 28rpx;
    font-size: 26rpx;
    color: $uni-text-color;
    text-align: center;
    line-height: 54rpx;

    &.is-checked {
      border: 1rpx solid $uni-color-main;
      background-color: rgba($uni-color-main, 0.1);
      color: $uni-color-main;
    }
  }
}
::v-deep .cl-radio-group {
  display: flex;
}
.cl-scroller__wrap,
cl-scroller {
  width: 100%;
  @include flx-size('stretch');
}
.list-scroll {
  width: 100%;
  @include flx-dsp(space-between, flex-start, column);
  padding: 26rpx;
  box-sizing: border-box;

  &::v-deep>.content:not(:nth-last-child(2)) {
    width: 100%;
    padding-bottom: 40rpx;
    margin-bottom: 30rpx;
    border-bottom: 1px solid #e1e1e1;
  }
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
::v-deep .cl-loadmore__wrap,
cl-loadmore {
  width: 100%;
}
</style>