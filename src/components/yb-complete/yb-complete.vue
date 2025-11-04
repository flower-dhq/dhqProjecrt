<template>
  <view class="yb-complete">
    <u-modal :show="errShow" title="提示">
      <view class="slot-content">
        <text class="u-modal__content__text">{{ errMessage }}</text>
      </view>
      <view slot="confirmButton">
        <!-- 退出小程序 -->
        <navigator v-if="exist" open-type="exit" target="miniProgram" class="close-btn complete">确定</navigator>
        <!-- 正常的确认操作 -->
        <text v-else class="close-btn complete" @click="handleComplete">确定</text>
      </view>
    </u-modal>
  </view>
</template>

<script>
/**
 * 确认消息的弹窗
 * @property {boolean} exist 默认false。确认操作，是否退出小程序
 * @method showMessage 只有在 exist=false 时才有效
 */
export default {
  name: 'YbMessage',
  props: {
    exist: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.completeEvent = (next) => {}

    return {
      errShow: false,
      errMessage: '',
    }
  },
  methods: {
    // 外部调用，弹出错误提示
    showMessage(msg, complete) {
      this.errMessage = msg || ''
      this.completeEvent = complete || (next => next())
      this.errShow = true
    },
    // 处理确认事件
    handleComplete() {
      const next = () => {
        this.errShow = false
      }
      this.completeEvent(next)
    }
  }
}
</script>

<style lang="scss" scoped>
.close-btn {
  display: block;
  text-align: center;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 16px;
  color: #606266;

  &:active:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
.u-modal__content__text {
  font-size: 15px;
  color: #606266;
}
</style>