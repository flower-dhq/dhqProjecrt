<template>
  <view class="my-message-card">
    <view class="header">
      <cl-image class="user-image" src="" size="48rpx" mode="aspectFill">
        <view slot="error" class="cl-image__placeholder">
          <cl-icon name="cl-icon-my" size="30rpx" />
        </view>
        <view slot="placeholder" class="cl-image__placeholder">
          <cl-icon name="cl-icon-my" size="30rpx" />
        </view>
      </cl-image>
      <text class="text-name">滕子静</text>
      <text class="text-name">给您留言了</text>
    </view>
    <view class="content">
      <text>我想要，这个锅两个人使用的话够用吗？</text>
    </view>
    <view class="footer">
      <text>{{ dateTime | timeDiff }}</text>
    </view>
  </view>
</template>

<script>
import IconAround from '@/pages-mall-a/components/icon-around.vue'
import dayjs from 'cl-uni/utils/dayjs'

export default {
  name: 'MyMessageCard',
  options: { styleIsolation: 'shared' },
  components: {
    IconAround
  },
  props: {
    dateTime: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {}
  },
  filters: {
    timeDiff(dateTime) {
      const now = new Date().getTime()
      const val = new Date(dateTime).getTime()
      const dayTime = 24 * 60 * 60 * 1000
      const diff = now - val

      if (now < val || diff > dayTime) return dayjs(new Date(dateTime)).format('YYYY-MM-DD HH:mm:ss')

      let second = diff / 1000
      if (second < 60) {
        return '刚刚'
      }

      let minute = second / 60
      if (minute < 60) {
        return Math.floor(minute / 60) + '分钟前'
      }

      let hour = minute / 60
      return Math.floor(hour) + '小时前'
    }
  },
  onLoad() {},
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.my-message-card {
  width: 100%;
  background-color: #fff;
  padding: 16rpx 20rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
}
user-image::v-deep .cl-image, ::v-deep .cl-image {
  background-color: #F7F7F7;
  color: #ccc;
  border-radius: 24rpx;
}
.header {
  width: 100%;
  @include flx-dsp(flex-start, center, row);

  .text-name {
    font-size: 28rpx;
    font-weight: bold;
    margin-left: 24rpx;
  }
}
.content {
  width: 100%;
  font-size: 28rpx;
  margin-top: 16rpx;
}
.footer {
  width: 100%;
  font-size: 22rpx;
  color: #999999;
  margin-top: 10rpx;
}
</style>