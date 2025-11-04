<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="table-panel">
      <view class="border">
        <uni-table>
          <uni-tr>
            <uni-th width="120rpx" align="center">房号</uni-th>
            <uni-th width="180rpx" align="center">账单期限</uni-th>
            <uni-th width="140rpx" align="center">账单金额</uni-th>
            <uni-th width="140rpx" align="center">是否结清</uni-th>
            <uni-th width="100rpx" align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item, index) in dataList" :key="index">
            <uni-td align="center">{{ item.code }}</uni-td>
            <uni-td align="center">{{ item.chargePeriod }}</uni-td>
            <uni-td align="center">{{ item.totalReceivableAmount }}</uni-td>
            <uni-td align="center">{{ item.settlementStatus == 1 ? '是' : '否' }}</uni-td>
            <uni-td align="center">
              <text class="btn-operate" @click="linkTo(item)">查看</text>
            </uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
    <u-safe-bottom />
  </view>
</template>

<script>
import { selectBillRecordByOwnerInfoId } from '@/service/leasing'
import { setAccountDetail } from '@/pages-archives/modules/accountStore'

/**
 * 账款列表
 */
export default {
  data() {
    return {
      ownerId: '',
      projectIds: '',
      pageForm: {
        current: 1,
        size: 9999,
        total: 0,
      },
      dataList: []
    }
  },
  onLoad(options) {
    this.ownerId = options.ownerId || ''
    this.projectIds = options.projectIds || ''
    this.initData()
  },
  methods: {
    // 获取数据
    async getData(pageIndex = 1) {
      this.pageForm.current = pageIndex

      const params = {
        data: {
          pageIndex,
          pageSize: this.pageForm.size,
          ownerInfoId: this.ownerId,
          projectIds: this.projectIds
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await selectBillRecordByOwnerInfoId(params)

      let data = res?.data?.records ?? []
      this.dataList = data
      this.pageForm.total = res?.data.total || 0
    },
    initData() {
      this.getData(1)
    },
    linkTo(item) {
      setAccountDetail(item.detail || [])
      uni.navigateTo({ url: '/pages-archives/billing-info/detail' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
  padding: 24rpx 20rpx;
}
.table-panel {
  padding: 30rpx;
  background-color: #fff;
  border-radius: 12rpx;

  .border {
    border-top: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
  }
  ::v-deep .uni-table-tr:first-child {
    background-color: #f8f8f8;
  }
  ::v-deep .uni-table-th, ::v-deep .uni-table-td {
    font-size: 24rpx;
    color: #333;
    font-weight: normal;
    padding: 24rpx 10rpx;
  }
}
.btn-operate {
  color: var(--app-primary-color);
}
</style>