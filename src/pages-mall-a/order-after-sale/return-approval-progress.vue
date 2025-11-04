<template>
  <view class="page-box-top">
    <view class="box">
      <view class="box-card">
        <setup-line-vertical-auto :setupList="setupList" />
      </view>
    </view>
  </view>
</template>

<script>
import setupLineVerticalAuto from '@/components/setup-line-bilateral/setup-line-vertical-auto.vue'
import commonMethod from '@/js/commonMethod'

// 地址参数 ?afterSaleId=(售后订单id)
export default {
  options: { styleIsolation: 'shared' },
  components: { setupLineVerticalAuto },
  data() {
    return {
      afterSaleId: '', // 售后订单id
      setupList: []
    }
  },
  onLoad(option) {
    // 未授权登录不允许进入当前页面
    if (!commonMethod.checkAuth()) return

    const params = commonMethod.getRouteParams(option, 'afterSaleId')
    this.afterSaleId = params.afterSaleId || ''

    this.getOperationRecord()
  },
  methods: {
    async getOperationRecord() {
      const params = {
        pathParams: `/${this.afterSaleId}`,
        data: {}
      }
      let { data } = await this.$mallApi.shop.getOperationRecord(params)
      data = data || []

      this.setupList = data.map(item => ({
        title: this.transformIntToText(item.operationType),
        dateTime: item.createTime,
        descript: item.operationDesc,
        imageList: item.afterSaleFiles ? item.afterSaleFiles.split('||') : null
      }))
    },
    // 将operationType转换为文字
    transformIntToText(operationType) {
      switch (operationType) {
        case 1:
          return '提交申请'
        case 2:
          return '审核不通过'
        case 3:
          return '审核通过'
        case 4:
          return '已发货'
        case 5:
          return '收到退货'
        case 6:
          return '退款成功'
        case 7:
          return '退款失败'
        case 8:
          return '退款中'
        case 9:
          return '已取消'
        case 10:
          return '等待审核'
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box-top {
  background-color: #f7f7f7;
}
.box {
  padding: 20rpx;
  width: 100%;
  box-sizing: border-box;
  background-color: #f7f7f7;
  // height: 100%;
}
.box-card {
  background-color: #fff;
  padding: 22rpx;
  border-radius: 8rpx;
  box-sizing: border-box;
  width: 100%;
  // height: inherit;
}
</style>