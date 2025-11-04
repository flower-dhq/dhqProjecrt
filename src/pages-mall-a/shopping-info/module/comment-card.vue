<template>
  <view class="comment-card">
    <view class="row-user">
      <icon-around :src="userSrc"
        :text="userName"
        direction="right"
        size="middle"
        round
      />
      <text class="row-user-date">{{ date | getFormatDate }}</text>
    </view>
    <cl-rate disabled v-model="rate" />
    <text class="row-text">{{ text }}</text>
    <view class="row-image">
      <cl-image :src="img" size="160rpx" mode="aspectFill" v-for="(img, index) in imgList" :key="index" :preview-list="imgList">
        <view slot="error" class="cl-image__placeholder">
          <cl-icon name="cl-icon-image" />
        </view>
      </cl-image>
    </view>
    <view class="row-reply" v-if="getReplyListCount !== 0">
      <view class="reply-tag"></view>
      <text class="reply-title">商家回复</text>
      <text class="reply-content" v-for="(item, index) in replyList" :key="index" :class="{ 'reply-content-hor': index !== 0 }">{{ item }}</text>
    </view>
  </view>
</template>

<script>
import IconAround from '@/pages-mall-a/components/icon-around.vue'
import dayjs from 'cl-uni/utils/dayjs'

/**
 * 卡片 —— 用户商品评价
 * @property {string} userSrc 用户头像地址
 * @property {string} userName 用户名称
 * @property {string} date 评论日期，例如 "2021-01-01"
 * @property {number} rate 评价等级。1-5。默认1
 * @property {string} text 评论内容
 * @property {array} imgList 评论图片
 * @property {array} replyList 商家回复内容
 */
export default {
  name: 'CommentCard',
  options: { styleIsolation: 'shared' },
  components: {
    IconAround,
  },
  props: {
    // 用户头像地址
    userSrc: {
      type: String,
      default: ''
    },
    // 用户名称
    userName: String,
    // 评论日期，例如 "2021-01-01"
    date: String,
    rate: {
      type: Number,
      default: 1,
      validator(val) {
        return [1, 2, 3, 4, 5].includes(val)
      }
    },
    // 评论内容
    text: String,
    // 评论图片
    imgList: {
      type: Array,
      default: () => ([])
    },
    replyList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {}
  },
  computed: {
    getReplyListCount() {
      return this.replyList.length
    }
  },
  filters: {
    // 格式化时间
    getFormatDate(val) {
      if (!val) return ''
      else return dayjs(new Date(val.replace(/-/g,"/"))).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-card {
  .row-user {
    display: flex;
    justify-content: space-between;
    align-items: center;

    ::v-deep .icon-panel>.icon-image {
      margin-right: 24rpx;
    }
    .row-user-date {
      font-size: 24rpx;
      color: $uni-text-color-grey;
    }
  }
  .row-text {
    font-size: 28rpx;
    color: $uni-text-color;
    line-height: 1;
    margin-top: 24rpx;
  }
  .row-image {
    display: flex;
    flex-wrap: wrap;

    ::v-deep .cl-image {
      border-radius: 8rpx;
      margin-top: 16rpx;
      margin-right: 20rpx;
      overflow: hidden;
    }
    ::v-deep .cl-image__placeholder {
      background-color: #ddd;
    }
  }
  .row-reply {
    width: 100%;
    background-color: #F7F7F7;
    border-radius: 8rpx;
    padding: 20rpx;
    box-sizing: border-box;
    margin-top: 24rpx;
    position: relative;

    .reply-tag {
      position: absolute;
      top: -10rpx;
      left: 30rpx;
      width: 20rpx;
      height: 20rpx;
      transform: rotate(45deg);
      background-color: #F7F7F7;
    }
    .reply-title {
      display: block;
      width: 100%;
      font-size: 24rpx;
      color: #999;
      line-height: 34rpx;
    }
    .reply-content {
      display: block;
      width: 100%;
      font-size: 24rpx;
      color: #666;
      line-height: 34rpx;
      margin-top: 10rpx;

      &.reply-content-hor {
        border-top: 2rpx solid #E1E1E1;
        padding-top: 10rpx;
      }
    }
  }
}
::v-deep .cl-rate {
  width: 100%;
  margin: 12rpx 0 4rpx;
}
</style>