<template>
  <cl-popup :visible.sync="isShow" direction="center" padding="40rpx" size="450rpx" @close="handleClose">
    <view class="service-box">
      <image src="~@/pages-mall/static/shop/service-headImg.png" />
      <view class="service-info">
        <text class="info-title">客服电话</text>
        <text class="info-phone">{{ serviceInfo.telephone }}</text>
        <text class="info-time">工作时间: {{ serviceInfo.businessTime }}</text>
      </view>
      <view class="service-btn" @click="callPhone">立即拨打</view>
      <cl-confirm ref="callPhoneConfirm"></cl-confirm>
    </view>
  </cl-popup>
</template>

<script>
import * as ShopStore from './shopStore'

/**
 * 客服信息
 * @property {boolean} value 显示或隐藏，使用 v-model
 */
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      shopStore: ShopStore.state(),
      serviceInfo: {},
      isShow: false // value和isShow的值是同步的，你可以放心
    }
  },
  watch: {
    /**
     * 先判断getServiceInfo是否被调用，如果没有则不响应，如果有则判断getServiceType类型
     * getServiceType = 1，则弹出打电话窗口；= 2，则跳转页面
     */
    '$props.value': async function(newVal, oldVal) {
      if (newVal === false) return

      const isSuccess = [1, 2].includes(this.getServiceType)
      !isSuccess && await this.getServiceInfo()

      if (this.getServiceType === 1) {
        this.isShow = true
      } else if (this.getServiceType === 2) {
        this.handleClose()
        await this.createChatSession()
      } else {
        this.handleClose()
      }
    }
  },
  computed: {
    // { 1: 弹出打电话窗口, 2: 跳转到聊天页面 }
    getServiceType() {
      return this.serviceInfo.clientServiceType
    }
  },
  methods: {
    // 获取客服信息
    async getServiceInfo() {
      const { sellerId } = this.shopStore.shopInfo
      const isExist = Boolean(sellerId)
      if (!isExist) return

      const params = {
        pathParams: `/${sellerId}`,
        hideLoading: true
      }
      const { data: res } = await this.$mallApi.data.getShopDetail(params)
      const { clientServiceStartTime, clientServiceEndTime, telephone, clientServiceType, sellerName } = res

      this.isSuccess = true
      this.serviceInfo = {
        businessTime: `${clientServiceStartTime || ''} ~ ${clientServiceEndTime || ''}`,
        telephone,
        clientServiceType,
        sellerId,
        sellerName
      }
    },
    // 拨打客服电话
    callPhone() {
      // 唤起手机打电话功能
      uni.makePhoneCall({
        phoneNumber: this.serviceInfo.telephone,
        success: res => {
          this.isShow = false
        },
        fail: res => {
          console.log('拨打失败!')
        }
      })
    },
    // 创建商家聊天会话
    async createChatSession() {
      const { sellerId, sellerName } = this.serviceInfo
      const { data } = await this.$mallApi.data.createSession({ pathParams: `/${sellerId}` })

      const { sessionId } = data || {}
      uni.navigateTo({ url: `/pages-mall-b/chatroom/chatroom?sessionId=${sessionId}&shopName=${sellerName}` })
    },
    handleClose () {
      this.isShow = false
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.service-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  image {
    width: 190rpx;
    height: 190rpx;
    margin-bottom: 20rpx;
  }

  .service-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .info-title {
      color: #333333;
      font-size: 28rpx;
      margin-bottom: 10rpx;
    }
    .info-phone {
      color: #333333;
      font-size: 36rpx;
      margin-bottom: 10rpx;
    }
    .info-time {
      color: #cccccc;
      font-size: 22rpx;
    }
  }

  .service-btn {
    width: 100%;
    height: 64rpx;
    border-radius: 30rpx;
    text-align: center;
    line-height: 64rpx;
    color: #ffffff;
    background: $uni-color-primary;
    margin-top: 20rpx;
  }
}
</style>