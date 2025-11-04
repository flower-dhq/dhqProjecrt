<template>
  <view class="shop-comment">
    <view class="header">
      <text class="header-title">商品评价</text>
      <text class="read-all" @click="readAllComment">查看全部</text>
    </view>
    <template v-if="commentList.length">
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
    </template>
    <!-- 空数据 -->
    <text v-else class="comment-none">暂无评论数据</text>
  </view>
</template>

<script>
import CommentCard from './comment-card.vue'

/**
 * 商品详情下的商品评论，只展示前两条评论
 * @property {string} gmId 商品id
 */
export default {
  options: { styleIsolation: 'shared' },
  components: {
    CommentCard
  },
  props: {
    gmId: String
  },
  data() {
    return {
      commentList: []
    }
  },
  created() {
    let unwatch = this.$watch(
      'gmId',
      newVal => {
        if (!newVal) return
        this.getCommentById()

        unwatch && unwatch()
      },
      { immediate: true }
    )
  },
  methods: {
    async getCommentById() {
      const params = {
        data: {
          size: 2,
          current: 1,
          gmId: this.gmId
        }
      }

      const { data = {} } = await this.$mallApi.shop.getCommentbyGmId(params)
      const { records = [] } = data

      this.commentList = records.map(item => ({
        ...item,
        filePaths: Boolean(item.filePaths) ? item.filePaths?.split(',') : [],
        children: item.children.map(child => child.reviewDesc)
      }))
    },
    readAllComment() {
      uni.navigateTo({ url: `/pages-mall-a/shopping-info/shopping-comment?gmId=${this.gmId}` })
    },
    // 解码用户名
    getUserName(val) {
      return decodeURIComponent(val || '')
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-comment {
  display: flex;
  flex-direction: column;
  padding: 20rpx 28rpx;

  & > .header {
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;
    padding-bottom: 30rpx;

    & > .header-title {
      font-weight: bold;
    }
    & > .read-all {
      color: $uni-color-main;
    }
  }
  & > .content:not(:last-child) {
    padding-bottom: 40rpx;
    margin-bottom: 30rpx;
    border-bottom: 1px solid #e1e1e1;
  }
  .comment-none {
    display: block;
    width: 100%;
    font-size: 26rpx;
    color: #666;
    text-align: center;
  }
}
</style>