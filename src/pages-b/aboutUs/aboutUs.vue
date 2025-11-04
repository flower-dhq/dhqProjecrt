<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <u--image showLoading :src="ownerLogo" mode="aspectFill" width="186rpx" height="186rpx" />
    <text class="title-text">{{ ownerName }}</text>
    <text class="subtitle-text">版本号 {{ versionNum ? ('V' + versionNum) : '' }}</text>
    <cell-text v-if="platform != 'web'" label="备案号" contentAlign="flex-end" padding="24rpx 30rpx" customStyle="border-top: 1px solid #ecedf3;" @click="openCanse">
      <text>{{ canseNum }}</text>
    </cell-text>
    <cell-text v-if="userAgreementStatus" label="用户协议" contentAlign="flex-end" padding="24rpx 30rpx" @click="linkTo('userAgreement')">
      <text style="color: #5c94f3">《用户协议》</text>
    </cell-text>
    <cell-text v-if="PrivacyAgreementStatus" label="隐私协议" contentAlign="flex-end" padding="24rpx 30rpx" @click="linkTo('privacyAgreement')">
      <text style="color: #5c94f3">《隐私协议》</text>
    </cell-text>
  </view>
</template>

<script>
import CellText from '@/components/cell-text/cell-text.vue'
import { getPrivacyAgreement } from '@/service/community'

/**
 * 关于我们
 */
export default {
  components: {
    CellText
  },
  data() {
    return {
      platform: '', // 平台 web: 公众号; mp-weixin: 小程序; app: APP
      osName: '', // 系统 android, ios
      ownerLogo: '',
      ownerName: '',
      versionNum: '', // 版本号
      canseNum: '', // 备案号
      userAgreementStatus: false, // 用户协议状态
      PrivacyAgreementStatus: false, // 隐私协议状态
    }
  },
  created() {
    const systemInfo = uni.getSystemInfoSync()
    this.platform = systemInfo.uniPlatform
    this.osName = systemInfo.uniPlatform

    this.getDetailData()
  },
  methods: {
    async getDetailData() {
      const res = await getPrivacyAgreement()
      const data = res.data || {}

      this.ownerLogo = data.ownerLogo || ''
      this.ownerName = data.ownerName || ''
      this.userAgreementStatus = data.userAgreementStatus == '1'
      this.PrivacyAgreementStatus = data.PrivacyAgreementStatus == '1'
      if (this.platform == 'mp-weixin') {
        // 微信小程序
        this.versionNum = data.miniProgramVersion || ''
        this.canseNum = data.miniProgramNumber || ''
      } else if (this.platform == 'web') {
        // 公众号
        this.versionNum = data.officialAccountVersion || ''
        this.canseNum = ''
      } else if (this.platform == 'app' && this.osName == 'android') {
        // 安卓 APP
        this.versionNum = data.androidVersion || ''
        this.canseNum = data.appNumber || ''
      } else if (this.platform == 'app' && this.osName == 'ios') {
        // ios APP
        this.versionNum = data.iosVersion || ''
        this.canseNum = data.appNumber || ''
      }
    },
    linkTo(type) {
      uni.navigateTo({ url: '/pages-b/aboutUs/agreement?type=' + type })
    },
    // 打开小程序的备案号
    openCanse() {
      if (this.platform == 'mp-weixin') {
        uni.navigateTo({ url: '/pages-b/aboutUs/canse?url=' + encodeURIComponent('https://beian.miit.gov.cn') })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  display: flex;
  flex-direction: column;
}
::v-deep .u-image {
  margin: 0 auto;
  padding-top: 118rpx;

  .u-image__loading, .u-image__error {
    top: initial;
  }
}
.title-text {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin: 34rpx 0 26rpx;
  color: var(--app-primary-color);
}
.subtitle-text {
  font-size: 28rpx;
  text-align: center;
  margin-bottom: 72rpx;
}
.cell-text {
  font-size: 26rpx !important;

  ::v-deep .cell-text-panel {
    align-items: center;
  }
}
</style>