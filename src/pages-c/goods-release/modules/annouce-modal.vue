<template>
  <view class="announce-modal">
    <u-modal :show="isShow">
      <view class="content">
        <u-icon name="checkmark-circle-fill" size="50" color="#5ac725" />
        <text style="font-size: 18px; line-height: 40px;">申请成功！</text>
        <text style="font-size: 14px; line-height: 20px; color: #a1a6bb; text-align: center;">请耐心等待业主审核，审核信息可在消息通知栏查看</text>
        <text style="font-size: 14px; line-height: 40px;">申请编号：{{ releaseNumber }}</text>
      </view>
      <u-button slot="confirmButton" shape="circle" type="primary">返回首页</u-button>
    </u-modal>
  </view>
</template>

<script>
export default {
  name: 'AnnouceModal',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    releaseNumber: Number
  },
  data() {
    return {
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>