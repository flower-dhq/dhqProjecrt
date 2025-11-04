<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="image-wrap">
      <u--image :src="actDetail.coverUrl" width="100%" height="360rpx" mdoe="aspectFit" radius="16rpx">
        <view slot="error" style="font-size: 28rpx;">加载失败</view>
      </u--image>
    </view>
    
    <view class="content-wrap">
      <text class="content-title">{{ actDetail.title }}</text>
      <cell-text label="报名截止时间：" labelWidth="auto" padding="12rpx 0 24rpx" border="bottom" isRight :labelStyle="descStyle" :customStyle="descStyle">
        <text style="color: #FC0B0B;">{{ actDetail.signUpEndDate | getDate }}</text>
        <template v-slot:right>
          <view>已报名<text :style="[{color: THEME_COLOR}]">{{ actDetail.signUpNum || 0 }}</text>人</view>
        </template>
      </cell-text>

      <view class="gap"></view>

      <cell-text v-for="(item, index) in descForm" :key="index" :label="item.label" :labelStyle="descStyle" border="none" padding="16rpx 0 0" :isDesc="item.label == '活动简介：'" descAlign="content" :descColor="THEME_COLOR">
        <text :style="[descStyle]">{{ item.value }}</text>
        <template slot="desc">
          <text class="desc-expand" @click="linkTo">查看详情 ></text>
        </template>
      </cell-text>
    </view>

    <view class="page-footer">
      <button :class="['footer-btn', 'active']" @click="handleShare">发送</button>
    </view>

    <u-safe-bottom />
    <yb-complete ref="completeMsgEl" />
  </view>
</template>

<script>
import { getActivityDetail } from '@/service/wxmanage'
import CellText from '@/components/cell-text.vue'
import YbComplete from '@/components/yb-complete/yb-complete.vue'
import { getShareConfig, sendChatMessage, shareToExternalContact, getActivitySheetUrl } from '@/js/sharePage'

/**
 * 会员活动详情
 */
export default {
  components: {
    CellText,
    YbComplete
  },
  data() {
    return {
      activityId: '', // 活动id
      actDetail: {},
      descForm: [
        { label: '活动时间：', value: '' },
        { label: '活动地点', value: '' },
        { label: '活动费用：', value: '' },
        { label: '人数限制：', value: '' },
        { label: '联系人：', value: '' },
        { label: '咨询电话：', value: '' },
        { label: '活动简介：', value: '' },
      ],
      descStyle: {
        fontSize: '28rpx',
        color: '#666'
      },
      shareConfig: {
        // 分享按钮的配置信息
        type: '',
        materialTitle: '',
        materialDesc: '',
        materialPicUrl: '',
        materialUrl: '',
        appId: '',
      }
    }
  },
  filters: {
    getDate(val) {
      return uni.$u.timeFormat(val, 'yyyy-mm-dd')
    }
  },
  onLoad(query) {
    this.activityId = query.activityId

    this.getActivityDetail()
    getShareConfig('分享会员活动').then(res => {
      this.shareConfig = res
    })
  },
  methods: {
    // 获取活动详情
    async getActivityDetail() {
      const params = {
        data: {
          aid: this.activityId
        }
      }
      const res = await getActivityDetail(params)
      const _detail = this.actDetail = res.data || {}
      this.descForm[0].value = _detail.startDate + '至' + _detail.endDate
      this.descForm[1].value = _detail.location
      this.descForm[2].value = _detail.isFree ? '免费' : _detail.money + '元/人'
      this.descForm[3].value = _detail.perLimit
      this.descForm[4].value = _detail.contacts
      this.descForm[5].value = _detail.contactPhone
      this.descForm[6].value = _detail.description
    },
    // 查看活动文章
    linkTo() {
      uni.navigateTo({ url: '/pages-activity/member-activity/article?url=' + this.actDetail.summaryUrl })
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
      console.log('materialUrl===', materialUrl, this.actDetail.aid)
      console.log('返回配置==', appType, appIdentifier)

      const queryStr = '&aid=' + this.actDetail.aid
      wx.qy.getContext({
        success: (res) => {
          if (res.entry == 'single_chat_tools') {
            // 从单聊进入
            sendChatMessage({
              type: appType,
              appid: appIdentifier,
              title: this.actDetail.title,
              desc: '分享会员活动',
              imgUrl: this.actDetail.coverUrl,
              pageUrl: materialUrl + queryStr
            })
          } else {
            shareToExternalContact({
              type: appType,
              appid: appIdentifier,
              title: this.actDetail.title,
              desc: '分享会员活动',
              imgUrl: this.actDetail.coverUrl,
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
.page-panel {
  padding-bottom: 20rpx;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
}
.image-wrap {
  padding: 24rpx 20rpx 0;
  box-sizing: border-box;
  background-color: #fff;
}
.content-wrap {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0 30rpx 24rpx;
}
.content-title {
  font-size: 36rpx;
  font-weight: bold;
  line-height: 46rpx;
  color: #333;
  padding-top: 24rpx;
}
.desc-expand {
  font-size: 28rpx;
}
.page-footer {
  padding: 40rpx 40rpx 0;
}
.footer-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 8rpx;
  text-align: center;
  line-height: 88rpx;
  font-size: 28rpx;
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
.gap {
  width: 100%;
  padding-top: 8rpx;
}
</style>