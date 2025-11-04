<template>
  <!-- 链接注销动能 -->
  <div class="logout">

  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "logout",
  data() {
      return {}
  },
  components: {},
  created() {
    this.clearToken()
  },
  methods: {
    clearToken() {
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
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
