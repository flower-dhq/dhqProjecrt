<template>
  <div class="page-box-top aaa">
    <!-- <cl-button type="warning" @click="scanCode">点我扫码</cl-button> -->
    <cl-message ref="message"></cl-message>
  </div>
</template>

<script>
import commonMethod from '@/js/commonMethod'

export default {
  data() {
    return {}
  },
  mounted(options) {
    this.scanCode()
  },
  methods: {
    // 扫码
    scanCode() {
      uni.scanCode({
        success: res => {
          console.log('条码类型：' + res.scanType)
          console.log('条码内容：' + res.result)
          this.bindSellerUser(res.result)
        }
      })
    },
    // 绑定商家账号
    async bindSellerUser(sellerUserId) {
      const { memberId } = commonMethod.getUserStatusInfo()
      const params = {
        data: {
          memberId, // 会员id
          sellerUserId // 商家账号id
        }
      }
      const { success } = await this.$mallApi.data.bindSellerUser(params)
      if (success) {
        this.$refs['message'].open({
          message: '恭喜您成为商家！',
          icon: 'cl-icon-smile-border'
        })
      } else {
        this.$refs.message.open({
          message: '操作失败',
          icon: 'cl-icon-cry-border'
        })
      }

      uni.switchTab({ url: '/pages-mall/mine/mine' })
    }
  },
  onLoad() {
    // this.scanCode()
  }
}
</script>

<style scoped>
.aaa {
  display: flex;
  justify-content: center;
}
</style>