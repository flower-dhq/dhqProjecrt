<template>
  <view :class="['room-tree', getCustomClass]" :style="[THEME_CSS_VAR, getCustomStyle]">
    <!-- 楼栋 -->
    <view class="build-list">
      <scroll-view :scroll-top="0" scroll-y style="width: 100%; height: 100%;">
        <text :class="['build-item', { selected: item.name == formObj.buildId }]" v-for="(item, index) in buildList" :key="index" @click="itemEvent('build', item, index)">{{ item.label }}</text>
      </scroll-view>
    </view>

    <view class="unit-panel">
      <!-- 单元 -->
      <view class="unit-list">
        <text :class="['unit-item', { selected: item.name == formObj.unitId }]" v-for="(item, index) in unitList" :key="index" @click="itemEvent('unit', item, index)">{{ item.label }}单元</text>
      </view>

      <!-- 描述 -->
      <view class="desc-list">
        <view class="desc-item" v-for="(item, index) in descList" :key="index">
          <text>{{ item.title }}</text>
          <text class="desc-item-num">{{ item.label }}</text>
        </view>
      </view>

      <view class="divider"></view>

      <!-- 房间 -->
      <scroll-view scroll-y scroll-top="0" style="height: 100%; overflow: hidden;">
        <view class="room-scroll">
          <block v-for="(item, i) in floorList" :key="i">
            <text class="room-title">{{ item.label }}F</text>
            <view class="room-list">
              <view class="room-item" v-for="(child, j) in item.children" :key="j" @click="itemEvent('room', child, j)">
                <!-- 房间插槽 -->
                <slot :slot-scope="{ item: child, index: j, flag: child.isArrears }">
                  <template v-if="filterData == 1 && child.roomBind == false">
                    <!-- 显示未拜访 -->
                    <text :class="['room-item-slot', { isBind: child.roomBind }]" style="margin: 12rpx 0 12rpx 24rpx;" @click="linkTo(child)">{{ child.label }}</text>
                  </template>
                  <template v-if="filterData == 2 && child.roomBind == true">
                    <!-- 显示已拜访 -->
                    <text :class="['room-item-slot', { isBind: child.roomBind }]" style="margin: 12rpx 0 12rpx 24rpx;" @click="linkTo(child)">{{ child.label }}</text>
                  </template>
                </slot>
              </view>
            </view>
          </block>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import { getVisitRoomListById, getCustomerVisitDetailById } from '@/service/returnVisit'

/**
 * 楼栋-单元-房间 三级选择
 * @slot default 房间插槽
 */
export default {
  name: 'RoomTreeArchives',
  mixins: [mpMixin],
  props: {
    // 拜访任务id
    visitTaskId: {
      type: String,
      default: ''
    },
    // 数量
    totalData: {
      type: Object,
      default: () => ({
        waitVisitCount: 0, // 未拜访
        hasVisitCount: 0 // 已拜访
      })
    },
    // 条件筛选。1: 未拜访; 2: 已拜访
    filterData: {
      type: String,
      default: '1',
      validator(val) {
        return ['1', '2'].includes(val)
      }
    }
  },
  data() {
    return {
      // 楼栋数据
      buildList: [],
      // 描述数据
      descList: [],
      formObj: {
        buildId: 1,
        unitId: 1,
        roomId: ''
      },
      isLoading: false, // 是否正在请求数据
    }
  },
  computed: {
    // 单元数据
    unitList() {
      const index = this.buildList.findIndex((item) => item.name == this.formObj.buildId)
      let res = index == -1 ? [] : this.buildList[index].cells
      res = res.map(item => ({
        ...item,
        label: item.houseCell,
        name: item.cellId
      }))

      this.formObj.unitId = res[0]?.name ?? ''

      return res
    },
    // 楼层-房间 数据
    floorList() {
      const index = this.unitList.findIndex((item) => item.name == this.formObj.unitId)
      let res = index == -1 ? [] : this.unitList[index].floors
      res = res.map(item => ({
        ...item,
        label: item.houseFloor,
        children: (item.rooms || []).map(item => ({
          ...item,
          label: item.houseRoom,
          name: item.houseInfoId
        }))
      }))

      return res
    }
  },
  watch: {
    visitTaskId: {
      handler(newVal) {
        if (!newVal) return
        this.getRoomList(newVal)
      },
      immediate: true
    }
  },
  methods: {
    itemEvent(type, item, index) {
      if (type == 'build') {
        this.formObj.buildId = item.name
      } else if (type == 'unit') {
        this.formObj.unitId = item.name
      } else if (type == 'room') {
        this.formObj.roomId = item.name
      }
    },
    // 跳转到业主档案
    async linkTo(item) {
      // 防止重复点击
      if (this.isLoading) return
      this.isLoading = true

      const query = uni.$u.queryParams({
        visitRecordId: item.visitRecordId,
        houseInfoId: item.name
      })
      let _badReq = false // 是否为错误请求

      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params= {
        data: {
          visitRecordId: item.visitRecordId,
          houseInfoId: item.name,
          userId: userInfo.userId,
          userName: userInfo.userName
        }
      }
      const res = await getCustomerVisitDetailById(params).catch(() => {
        _badReq = true
        this.isLoading = false
      })
      const _dataTmp = res.data.data?.[0] ?? {}
      if (_badReq) return

      const hasAuth = this.isEditAuth(_dataTmp.visitTaskEnd, _dataTmp.visitState)

      setTimeout(() => {
        this.isLoading = false
      }, 1000)
      if (!item.roomBind && hasAuth) {
        // 未拜访
        uni.navigateTo({ url: '/pages-visit/customer-visit/edit' + query })
      } else {
        // 已拜访
        uni.navigateTo({ url: '/pages-visit/customer-visit/detail' + query })
      }
    },
    // 获取房间列表
    async getRoomList(visitTaskId) {
      const params = {
        data: {
          userId: '',
          visitTaskId,
        },
        responseToast: false,
      }
      const res = await getVisitRoomListById(params)
      const data = res.data.data || {}

      const arrTmp = this.buildList = (data.houseBuildings || []).map(item => ({
        ...item,
        label: item.houseBuilding,
        name: item.buildingId
      }))
      this.formObj.buildId = arrTmp[0]?.name ?? ''

      this.$emit('update:totalData', {
        waitVisitCount: data.waitVisitCount,
        hasVisitCount: data.hasVisitCount
      })
    },
    // 当前时间在拜访结束日期之内，并且拜访任务是未拜访，则才能跳转到填写的页面
    isEditAuth(visitTaskEnd, visitState) {
      // 拜访结束日期
      let endTime = 0

      let dateTmp = visitTaskEnd || ''
      if (dateTmp) {
        dateTmp = dateTmp.replace(/-/ig, '\/')
        endTime = new Date(dateTmp).getTime()
      }
      
      const nowTime = new Date().getTime()
      return nowTime - endTime < 0 && visitState == '0'
    },
    // 获取客户拜访详情
    async getCustomerVisitDetailById(visitRecordId, houseInfoId) {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params= {
        data: {
          visitRecordId,
          houseInfoId,
          userId: userInfo.userId,
          userName: userInfo.userName
        }
      }
      const res = await getCustomerVisitDetailById(params)
      const _dataTmp = res.data.data?.[0] ?? {}

      return _dataTmp
    },
  }
}
</script>

<style lang="scss" scoped>
.room-tree {
  display: flex;
  height: 100%;
  overflow: hidden;
  font-family: "PingFang SC";
}
.build-list {
  flex: 0 0 auto;
  width: 140rpx;
  height: 100%;
  overflow: hidden;
  background-color: #f4f6f9;
}
.build-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 102rpx;
  color: #333;
  font-size: 30rpx;
  word-break: break-all;
  padding: 10rpx;
  box-sizing: border-box;

  &.selected {
    background-color: #fff;
    color: var(--app-primary-color);
  }
}
.unit-panel {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
}
.unit-list {
  display: flex;
  flex-wrap: wrap;
}
.unit-item {
  width: 120rpx;
  height: 48rpx;
  background-color: #f7f7f7;
  color: #999;
  font-size: 24rpx;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 4rpx;
  margin-left: 24rpx;
  margin-top: 24rpx;
  text-align: center;
  line-height: 46rpx;
  box-sizing: border-box;

  &.selected {
    background-color: #e7f3ff;
    color: var(--app-primary-color);
    border-color: var(--app-primary-color);
    border-radius: 4rpx;
  }
}
.desc-list {
  display: flex;
  flex-wrap: wrap;
}
.desc-item {
  display: flex;
  align-items: center;
  font-size: 20rpx;
  line-height: 1;
  color: #666;
  margin: 16rpx 16rpx 0 24rpx;
}
.desc-item-num {
  color: #333;
  font-size: 32rpx;
  margin-left: 6rpx;
  font-weight: bold;
}
.divider {
  margin: 16rpx 24rpx 6rpx;
  border-bottom: 1px solid #EBEBEB;
}
.room-scroll {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.room-title {
  width: 100%;
  padding: 18rpx 24rpx 0;
  box-sizing: border-box;
  font-size: 30rpx;
  color: #151515;
  font-weight: bold;
}
.room-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.room-item {
  position: relative;
}
.room-item-slot {
  display: block;
  min-width: 90rpx;
  height: 52rpx;
  background-color: #CCCCCC;
  border-radius: 4rpx;
  color: #fff;
  font-size: 26rpx;
  line-height: 52rpx;
  text-align: center;
  padding: 0 10rpx;
  box-sizing: border-box;

  &.isBind {
    background-color: var(--app-primary-color);
  }
}
</style>