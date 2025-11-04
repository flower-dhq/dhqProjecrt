<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="content-panel auto-content">
      <cell-text label="费用信息(元)" padding="30rpx" customClass="panel-title" />
      <cell-text label="实际费用:" padding="30rpx" labelWidth="140rpx">
        <u--input v-model="formObj.realPrice" placeholder="请输入实际费用" border="none" @blur="realPriceFilter" />
      </cell-text>
      <cell-text label="支付类型：" :padding="0" labelWidth="140rpx" customClass="realtime-text" customStyle="font-size: 28rpx;" border="none">
        <view class="radio-panel">
          <text :class="['radio-box', { selected: item.name == formObj.payType }]" v-for="(item, index) in payTypeList" :key="index" @click="radioEvent(item)">{{ item.label }}</text>
        </view>
      </cell-text>
    </view>

    <u-button text="提交" type="primary" :customStyle="{ margin: '50rpx 20rpx 20rpx', width: 'initial' }" @click="handleSubmit" />
    <u-safe-bottom />

    <u-toast ref="messageEl" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text.vue'
import { getQuesTaskDetailRecord, saveBillToPay } from '@/service/landcrm'

export default {
  components: {
    CellText
  },
  data() {
    return {
      formObj: {
        taskId: '',
        realPrice: '',
        payType: 1
      },
      payTypeList: [
        { label: '现金支付', name: 1 },
        { label: '扫码支付', name: 2 }
      ],
      isLoading: false, // 防止重复点击
    }
  },
  onLoad(options) {
    this.formObj.taskId = options.taskId
    this.getTaskDetail()
  },
  methods: {
    // 实际费用需要过滤值
    realPriceFilter(num) {
      num = parseFloat(num)
      num = isNaN(num) ? 0 : num
      num = num < 0 ? 0 : num
      num = Math.floor(num * 100) / 100 // 保留两位小数
      this.formObj.realPrice = num
    },
    radioEvent(item) {
      this.formObj.payType = item.name
    },
    // 获取工单详情
    async getTaskDetail() {
      const params = {
        data: {
          quesTaskId: this.formObj.taskId
        },
        wrapResponse: true
      }
      const res = await getQuesTaskDetailRecord(params)
      const data = res.data.taskDetail || {}
      this.formObj.realPrice = data.price
      this.formObj.payType = data.payType
    },
    async handleSubmit() {
      if (!this.formObj.realPrice) {
        this.$refs.messageEl.show({
          type: 'default',
          message: '请填写金额'
        })
        return
      }

      if (this.isLoading) return
      this.isLoading = true

      const { success, message } = await this.saveBillToPay().catch(() => {
        this.isLoading = false
      })
      if (success) {
        if (this.formObj.payType == 1) {
          // 现金支付，直接返回
          uni.navigateBack({ delta: 1 })
          setTimeout(() => {
            uni.$emit('refresh')
          })
        } else {
          // 跳转到二维码页面
          uni.redirectTo({ url: '/pages-payment/workorder-pay/pay?taskId=' + this.formObj.taskId + '&price=' + this.formObj.realPrice })
        }
      } else {
        this.isLoading = false
        this.$refs.messageEl.show({
          type: 'default',
          message
        })
      }
    },
    // 保存订单，然后生成二维码
    async saveBillToPay() {
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const params = {
        data: {
          taskId: this.formObj.taskId,
          userId: userInfo.userId,
          money: this.formObj.realPrice,
          payType: this.formObj.payType
        },
        hideLoading: true
      }
      const res = await saveBillToPay(params)
      return {
        success: res.status == 200,
        message: res.message || '操作失败'
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  width: 100%;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24rpx 0 0.1px;
  font-family: initial;
}
.content-panel {
  @include flx-dsp(flex-start, flex-start, column);
  padding: 0px;
  border-radius: 7px;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0px 20rpx 24rpx;

  ::v-deep .cell-text {
    width: 100%;
    font-size: 30rpx;
  }
  ::v-deep .panel-title .cell-text-label {
    font-weight: bold;
    width: 100% !important;
  }
  ::v-deep .cell-text-content {
    color: #333;
  }
  ::v-deep .realtime-text .cell-text-label {
    padding: 30rpx 0 30rpx 30rpx;
  }
  ::v-deep .realtime-text input {
    height: 98rpx;
    padding-right: 30rpx;
  }
  &.auto-content ::v-deep .cell-text-panel {
    align-items: center;
  }
  ::v-deep .radio-panel {
    height: 98rpx;
    padding-right: 30rpx;
    flex: 1;
    display: flex;
    align-items: center;
  }
  ::v-deep .radio-box {
    display: inline-block;
    width: 150rpx;
    height: 60rpx;
    border-radius: 4rpx;
    background-color: #F7F7F7;
    color: #333;
    text-align: center;
    line-height: 56rpx;
    margin-right: 10rpx;
    font-size: 28rpx;
    border: 1px solid #F7F7F7;
    box-sizing: border-box;

    &.selected {
      background-color: #F1F8FF;
      border-color: var(--app-primary-color);
      color: var(--app-primary-color);
    }
  }
}
</style>