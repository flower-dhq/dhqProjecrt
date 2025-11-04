<template>
  <view class="page-panel">
    <view class="header-panel">门禁列表</view>
    <view class="scroll-panel">
      <view class="item-box" v-for="item in devicesList" :key="item.deviceId" @click="linkTo(item)">
        <u--text :text="item.deviceName" />
        <u-icon name="arrow-right" />
      </view>
    </view>
    <u-loadmore v-if="devicesList.length == 0" :status="loadStatus" line />
    <u-modal :show="isShowModal" content="检测到您认证的房间尚未关联有效的设备" @confirm="isShowModal = false" />
  </view>
</template>

<script>
import Util from '@/js/utils'
import { setDeviceData } from './deviceStorage'
import { getDeviceList } from '@/service/community'

/**
 * 门禁列表
 */
export default {
  data() {
    return {
      doorType: '', // openDoorByNPD: 诺普顿
      devicesList: [],
      loadStatus: 'loading', // loading, nomore
      isShowModal: false,
    }
  },
  onLoad(options) {
    this.doorType = options.menuCode || 'openDoorByNPD'

    this.getDeviceList()
  },
  onPullDownRefresh() {
    this.getDeviceList()
  },
  methods: {
    // 获取门禁设备列表
    async getDeviceList() {
      this.loadStatus = 'loading'

      const { PROJECT_ID, MEMBER_ID } = this.$constant
      const projectId = Util.storageAction({ key: PROJECT_ID, action: 'get' })
      const memberId = Util.storageAction({ key: MEMBER_ID, action: 'get' })
      const params = {
        data: {
          projectId,
          memberId,
          deviceType: 1, // 1: 蓝牙; 2: 网络; 3: 二维码
        }
      }
      const res = await getDeviceList(params).finally(() => {
        this.loadStatus = 'nomore'
        uni.stopPullDownRefresh()
      })
      const data = res?.data?.devices ?? []

      this.devicesList = this.arrayExpansion(data)
      if (this.devicesList.length == 0) {
        this.isShowModal = true
      }
    },
    // 数组展开
    arrayExpansion(list = []) {
      let res = [
        // {
        //   "address": "广州一碑科技-丽景蓝湾A区-1dong-4",
        //   "deviceVendor": "nuopudun",
        //   "deviceId": "drb26262",
        //   "deviceName": "测试显示名称导入",
        //   "key": "dr001261",
        //   "mac": "设备MAC26",
        //   "projectId": "2932157",
        //   "projectName": "广州一碑科技"
        // }
      ]
      list.forEach(group => {
        const { devices = [], ...other } = group

        res = res.concat(devices.map(item => Object.assign({}, item, other)))
      })

      return res
    },
    linkTo(item) {
      setDeviceData(item)
      uni.navigateTo({
        url: '/pages-d/keyopen/nuopudun',
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  background-color: #F5F5F5;
  min-height: 100vh;
  box-sizing: border-box;
}
.header-panel {
  padding: 14rpx 24rpx;
  color: #666;
}
.scroll-panel {
  background-color: #fff;
  padding: 0 24rpx;
}
.item-box {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  font-size: 30rpx;
  box-sizing: border-box;

  &:not(:last-child) {
    border-bottom: 1px solid #EAEAEA;
  }
}
</style>