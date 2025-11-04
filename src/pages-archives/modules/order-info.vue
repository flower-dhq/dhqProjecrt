<template>
  <view :class="['order-info', { show }]">
    <view class="tab-title" @click="linkTo">
      <text>日常服务</text>
      <u-icon name="arrow-right" />
    </view>

    <order-item v-for="(item, index) in orderList" :key="index" :data="item" customStyle="border-bottom: 1px solid #DDDDDD;" />
  </view>
</template>

<script>
import OrderItem from '@/pages-archives/modules/order-item.vue'
import { getQuestionTasksByOwnerInfoId } from '@/service/landcrm'

/**
 * 日常服务
 * @property {boolean} show 是否显示
 * @method getQuestionTasksByOwnerInfoId
 */
export default {
  name: 'OrderInfo',
  components: {
    OrderItem
  },
  props: {
    show: Boolean
  },
  data() {
    return {
      ownerId: '',
      projectIds: '',
      orderList: []
    }
  },
  methods: {
    linkTo() {
      const query = uni.$u.queryParams({
        ownerId: this.ownerId,
        projectIds: this.projectIds
      })
      uni.navigateTo({ url: '/pages-archives/owner-order/list' + query })
    },
    /**
     * 外部调用
     * 获取账单列表
     * @param {string} ownerId 业主id
     */
    async getQuestionTasksByOwnerInfoId(ownerId, projectIds) {
      this.ownerId = ownerId || ''
      this.projectIds = projectIds || ''
      const params = {
        data: {
          startIndex: 1,
          pageSize: 3,
          ownerInfoId: ownerId,
          projectIds
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await getQuestionTasksByOwnerInfoId(params)
      this.orderList = res.data || []
    }
  }
}
</script>

<style lang="scss" scoped>
.order-info {
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
</style>