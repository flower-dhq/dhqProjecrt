<template>
  <view class="page-box">
    <!-- <cl-list-item label="修改密码" :border="true" @click="linkTo">
      <cl-icon slot="append" name="cl-icon-arrow-right" />
    </cl-list-item> -->
    <!-- <cl-list-item label="注销登录" :border="true" @click="logout">
      <cl-icon slot="append" name="cl-icon-arrow-right" />
    </cl-list-item> -->
    <cl-list-item label="关于我们" :border="true" @click="aboutCompany">
      <cl-icon slot="append" name="cl-icon-arrow-right" />
    </cl-list-item>
  </view>
</template>

<script>
export default {
  components: {
  },
  methods: {
    // 退出登录
    logout() {
      const { X_APPLET_ID } = this.$constant
      const appletId = this.$cmMth.storageAction({ key: X_APPLET_ID, action: 'get' })

      this.$mallApi.data.logout({hideLoading: true, responseToast: false}).then(res => {
        if (res.statusCode === 200) {
          uni.clearStorageSync()

          // 设置 X_APPLET_ID
          this.$cmMth.storageAction({ key: X_APPLET_ID, value: appletId, action: 'set' })

          uni.reLaunch({ url: '/pages-mall/index/index' })
        }
      })
      
    },
    linkTo() {
      uni.navigateTo({ url: '/pages-mall-b/setting/change-password' })
    },
    aboutCompany() {
      uni.navigateTo({ url: '/pages-mall-b/about-company/about-company' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  background-color: #f7f7f7;
  padding: 14rpx;
  box-sizing: border-box;
}
</style>