<template>
  <view :class="['activity-sheet', getCustomClass]" :style="[getCustomStyle]" @click="linkTo">
    <view class="sheet-content-wrap">
      <cell-text labelWidth="0" padding="24rpx 30rpx 0" isRight border="none">
        <text class="content-title">{{ data.title }}</text>
        <text slot="right" :style="{fontSize: '28rpx', color: THEME_COLOR}">{{ data.activityStatus | getStatus }}</text>
      </cell-text>
      <text class="content-info">活动时间：{{ data.startDate | getDate }}至{{ data.endDate | getDate }}</text>
      <text class="content-info">报名截止时间：{{ data.signUpEndDate | getDate }}</text>
      <text class="content-info info-pad">已报名人数：{{ data.signUpNum || 0 }}人</text>
    </view>
    <view class="sheet-footer-wrap">
      <button :class="['footer-btn', 'active']" @click.native.stop="handleShare">发送</button>
    </view>

    <yb-complete ref="completeMsgEl" />
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import CellText from '@/components/cell-text.vue'
import YbComplete from '@/components/yb-complete/yb-complete.vue'
import { getActivitySheetUrl, shareToExternalContact, sendChatMessage } from '@/js/sharePage'

/**
 * 会员活动列表下的子项目
 */
export default {
  name: 'ActivitySheet',
  mixins: [mpMixin],
  components: {
    CellText,
    YbComplete
  },
  props: {
    // 数据
    data: {
      type: Object,
      default: () => ({})
    },
    // 分享配置
    shareConfig: {
      type: Object,
      default: () => ({})
    }
  },
  filters: {
    getDate(val) {
      return uni.$u.timeFormat(val, 'yyyy-mm-dd')
    },
    getStatus(val) {
      const map = {
        1: '未开始',
        2: '报名中',
        3: '截止报名'
      }
      return map[val] || map[0]
    }
  },
  methods: {
    linkTo() {
      uni.navigateTo({ url: '/pages-activity/member-activity/detail?activityId=' + this.data.aid })
    },
    handleShare() {
      // 获取分享链接
      let materialUrl = getActivitySheetUrl()
      if (!materialUrl) {
        uni.showToast({ title: '请配置常用链接', icon: 'none' })
        return
      }

      let { APP_TYPE, APPID_ENTIFIER } = this.$constant;
      let appType = this.$utils.storageAction({ key: APP_TYPE, action: 'get' })
      let appIdentifier = this.$utils.storageAction({ key: APPID_ENTIFIER, action: 'get' })
      console.log('materialUrl===', materialUrl, this.data.aid)
      console.log('返回配置==', appType, appIdentifier)

      const queryStr = '&aid=' + this.data.aid
      wx.qy.getContext({
        success: (res) => {
          if (res.entry == 'single_chat_tools') {
            // 从单聊进入
            sendChatMessage({
              type: appType,
              appid: appIdentifier,
              title: this.data.title,
              desc: '',
              imgUrl: this.data.coverUrl,
              pageUrl: materialUrl + queryStr
            })
          } else {
            shareToExternalContact({
              type: appType,
              appid: appIdentifier,
              title: this.data.title,
              desc: '',
              imgUrl: this.data.coverUrl,
              pageUrl: materialUrl + queryStr
            })
          }
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.activity-sheet {
  @include flx-dsp(flex-start, flex-start, column);
  background-color: #fff;
  border-radius: 10rpx;
  font-family: "PingFang SC";
	margin: 24rpx 20rpx;
}
.sheet-content-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.content-title {
  font-size: 30rpx;
  color: #222;
  font-weight: bold;
  @include ellipsis(2);
}
.content-info {
  padding: 24rpx 30rpx 0;
  font-size: 28rpx;
  color: #666;
}
.info-pad {
  padding-bottom: 24rpx;
  border-bottom: 1px solid #ebebeb;
}
.sheet-footer-wrap {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 16rpx 30rpx;
  box-sizing: border-box;
}
.footer-btn {
  width: 120rpx;
  height: 60rpx;
  border-radius: 8rpx;
  text-align: center;
  line-height: 60rpx;
  font-size: 26rpx;
  color: #fff;
  margin: 0;
  border-width: 0;

  &.active {
    background-color: var(--app-primary-color);
  }
  &.disabled {
    background-color: #ccc;
  }
  &::after {
    border-width: 0;
  }
}
</style>