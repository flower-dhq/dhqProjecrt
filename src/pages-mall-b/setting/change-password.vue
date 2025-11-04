<template>
  <view class="page-box">
    <view class="input-name">
      <text>输入新的密码：</text>
    </view>
    <cl-input v-model="password" />
    <text class="input-name">确认密码：</text>
    <cl-input v-model="confPassword" />
    <view class="btn-center">
      <cl-button type="primary" @click="submitData">保存</cl-button>
    </view>
    <cl-toast ref="elToast"></cl-toast>
  </view>
</template>

<script>
export default {
  data() {
    return {
      password: '',
      confPassword: '',
    }
  },
  methods: {
    // 保存数据
    submitData() {
      if (!this.password) {
        this.$refs.elToast.open({
          message: '密码为空',
          position: 'middle'
        })
        return
      }
      if (this.password !== this.confPassword) {
        this.$refs.elToast.open({
          message: '密码不一致',
          position: 'middle'
        })
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  box-sizing: border-box;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input-name {
  width: 400rpx;
  font-size: 28rpx;
  margin-bottom: 5rpx;
}
.cl-input {
  width: 400rpx;
  margin-bottom: 20rpx;
}
.btn-center {
  display: flex;
  justify-content: center;
  margin-top: 30rpx;
}
.cl-button {
  width: 250rpx;
}
</style>