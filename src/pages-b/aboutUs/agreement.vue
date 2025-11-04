<template>
  <view class="page-panel">
    <text class="title-text">{{ title }}</text>
    <rich-text :nodes="content"></rich-text>
  </view>
</template>

<script>
import { getPrivacyAgreement } from '@/service/community'

/**
 * 用户协议，隐私协议
 */
export default {
  data() {
    return {
      queryObj: {
        type: '', // privacyAgreement: 隐私协议; userAgreement: 用户协议
      },
      title: '',
      content: ''
    }
  },
  onLoad(query) {
    this.queryObj.type = query.type || 'userAgreement'
    if (query.type == 'privacyAgreement') {
      this.title = '《隐私协议》'
    } else if (query.type == 'userAgreement') {
      this.title = '《用户协议》'
    }

    this.getDetailData()
  },
  methods: {
    async getDetailData() {
      const res = await getPrivacyAgreement()
      const data = res.data || {}

      if (this.queryObj.type == 'privacyAgreement') {
        this.content = this.repairContent(data.privacyAgreementContent || '')
      } else if (this.queryObj.type == 'userAgreement') {
        this.content = this.repairContent(data.userAgreementContent || '')
      }
    },
    repairContent(val) {
      const res = val.replace(
        /\<img/ig,
        `<img style="width: 100%; height: auto; object-fit: contain; vertical-align: middle;"`
      )
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 20rpx 30rpx;
  box-sizing: border-box;
}
.title-text {
  text-align: center;
  font-size: 34rpx;
  font-weight: bold;
  padding: 30rpx 0 40rpx;
}
</style>