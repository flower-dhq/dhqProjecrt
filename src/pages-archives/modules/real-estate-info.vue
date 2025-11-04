<template>
  <view :class="['real-estate-info', { show }]">
    <view class="tab-title">房产信息</view>
    <view class="tab-content">
      <view class="border">
        <uni-table>
          <uni-tr>
            <uni-th width="200" align="center">房间</uni-th>
            <uni-th width="90" align="center">区域</uni-th>
            <uni-th width="90" align="center">房屋状态</uni-th>
            <uni-th width="90" align="center">产品类型</uni-th>
            <uni-th width="90" align="center">装修类型</uni-th>
          </uni-tr>
          <uni-tr v-for="(item, index) in roomList" :key="index">
            <uni-td align="center">{{ item.address }}</uni-td>
            <uni-td align="center">{{ item.areaName }}</uni-td>
            <uni-td align="center">{{ item.roomStateDictName || '-' }}</uni-td>
            <uni-td align="center">{{ item.buildingProperty || '-' }}</uni-td>
            <uni-td align="center">{{ item.houseRenovation || '-' }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
  </view>
</template>

<script>
import { getHouseListByOwnerId } from '@/service/neikong'

/**
 * 房地产信息
 * @property {boolean} show 是否显示
 * @method getHouseListByOwnerId
 */
export default {
  name: 'RealEstateInfo',
  props: {
    show: Boolean,
  },
  data() {
    return {
      roomList: [],
      ownerId: ''
    }
  },
  methods: {
    /**
     * 外部调用
     * 获取房产信息
     * @param {string} ownerId 业主id
     */
    async getHouseListByOwnerId(ownerId, projectIds) {
      this.ownerId = ownerId || ''
      const params = {
        data: {
          pageNum: 1,
          pageSize: 10000,
          ownerId: ownerId,
          projectIds
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await getHouseListByOwnerId(params)
      this.roomList = res.data.records ?? []
    }
  }
}
</script>

<style lang="scss" scoped>
.real-estate-info {
  display: none;
  &.show {
    display: block;
  }
}
.tab-title {
  background-color: #fff;
  width: 100%;
  height: 102rpx;
  color: #333;
  font-size: 30rpx;
  font-weight: bold;
  line-height: 102rpx;
  padding-left: 30rpx;
  border-bottom: 1px solid #efefef;
  position: relative;

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

  .border {
    border-top: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
  }
}
</style>