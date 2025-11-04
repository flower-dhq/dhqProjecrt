<template>
  <u-action-sheet :show="isShow" :title="title" :closeOnClickOverlay="true" :closeOnClickAction="true" @close="isShow=false">
    <view>
      <view class="content" v-html="text"></view>
      <view class="bottom-box">
        <view class="box-btn f-btn"  @click="handleConfirm(false)">取消</view>
        <view class="box-btn t-btn"  @click="handleConfirm(true)">我已知晓</view>
      </view>
    </view>
  </u-action-sheet>
</template>

<script>
/**
 * 弹框，协议说明
 * @property {boolean} value 显示
 * @property {string} title 标题
 * @property {string} text 内容
 * @event confirm 确认事件
 * @event cancel 取消事件
 */
export default {
  props: {
    value: Boolean,
    title: String,
    text: String
  },
  data() {
    return {
    }
  },
  computed: {
    isShow: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    // 确认或取消
    handleConfirm(type = false) {
      this.isShow = false

      if (type) {
        this.$emit('confirm')
      } else {
        this.$emit('cancel')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* @import '~@/assets/themes/base/default.scss'; */

.van-action-sheet ::v-deep .van-action-sheet__header {
  height: 56px;
  line-height: 56px;
  font-weight: bold;
}
.content {
  padding: 0 18px;
}
.bottom-box {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.box-btn {
  width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  font-size: 14px;
}
.t-btn {
  background-color: var(--app-primary-color);
  border-color: var(--app-primary-color);
  color: #fff;
}
.f-btn {
  background-color: #fff;
  border:1px solid var(--app-primary-color);
  color: var(--app-primary-color);

  &:first-child {
    margin-right: 15px;
  }
}
</style>