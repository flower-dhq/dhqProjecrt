<template>
  <view :class="['account-info', { show }]">
    <view class="tab-title" @click="linkTo('list')">
      <text>账款信息</text>
      <u-icon name="arrow-right" />
    </view>
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
              <text class="btn-operate" @click="linkTo('detail', item)">查看</text>
            </uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
  </view>
</template>

<script>
import { selectBillRecordByOwnerInfoId } from '@/service/leasing'
import { setAccountDetail } from './accountStore'

/**
 * 账款信息
 * @property {boolean} show 是否显示
 * @method selectBillRecordByOwnerInfoId
 */
export default {
  name: 'AccountInfo',
  props: {
    show: Boolean
  },
  data() {
    return {
      dataList: [],
      ownerId: '',
      projectIds: ''
    }
  },
  methods: {
    /**
     * 外部调用
     * 获取账单列表
     * @param {string} ownerId 业主id
     */
    async selectBillRecordByOwnerInfoId(ownerId, projectIds) {
      this.ownerId = ownerId || ''
      this.projectIds = projectIds || ''
      const params = {
        data: {
          pageIndex: 1,
          pageSize: 3,
          ownerInfoId: ownerId,
          projectIds
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await selectBillRecordByOwnerInfoId(params)
      this.dataList = res?.data?.records ?? []
    },
    linkTo(type, item) {
      if (type == 'list') {
        const query = uni.$u.queryParams({
          ownerId: this.ownerId,
          projectIds: this.projectIds
        })
        uni.navigateTo({ url: '/pages-archives/billing-info/list' + query })
      }
      if (type == 'detail') {
        setAccountDetail(item.detail || [])
        uni.navigateTo({ url: '/pages-archives/billing-info/detail' })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.account-info {
  display: none;

  &.show {
    display: block;
  }
}
.tab-title {
  position: relative;
  background-color: #fff;
  width: 100%;
  height: 102rpx;
  color: #333;
  font-size: 30rpx;
  font-weight: bold;
  border-bottom: 1px solid #efefef;
  padding: 30rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;

  /* &::before {
    content: '';
    width: 8rpx;
    height: 32rpx;
    background-color: #1989F7;
    position: absolute;
    top: 35rpx;
    left: 0rpx;
  } */
}
.tab-content {
  width: 100%;
  background-color: #fff;
  padding: 30rpx;
  box-sizing: border-box;
  border-bottom-left-radius: 12rpx;
  border-bottom-right-radius: 12rpx;

  .border {
    border-top: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
  }
}
.btn-operate {
  color: var(--app-primary-color);
}
</style>