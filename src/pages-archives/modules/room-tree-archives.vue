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
                  <text :class="['room-item-slot', { flag: child.isArrears }]" @click="linkTo([child.data.houseAddrInfoId])">{{ child.label }}</text>
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
import roomTree from './roomStore'
import { getHouseAddrInfoListToPageForUnion } from '@/service/landcrm'

/**
 * 楼栋-单元-房间 三级选择
 * @slot default 房间插槽
 */
export default {
  name: 'RoomTreeArchives',
  mixins: [mpMixin],
  props: {
    roomData: {
      type: Object,
      default: () => ({ areaId: '', projectId: '', parkId: '', keywords: '' })
    }
  },
  data() {
    return {
      // 楼栋数据
      buildList: [],
      // 描述数据
      descList: [
        // { title: '全部', label: 180 },
        // { title: '欠费', label: 20 }
      ],
      formObj: {
        buildId: 1,
        unitId: 1,
        roomId: ''
      }
    }
  },
  computed: {
    // 单元数据
    unitList() {
      const index = this.buildList.findIndex((item) => item.name == this.formObj.buildId)
      const res = index == -1 ? [] : this.buildList[index].children

      this.formObj.unitId = res[0]?.name ?? ''

      return res
    },
    // 楼层-房间 数据
    floorList() {
      const index = this.unitList.findIndex((item) => item.name == this.formObj.unitId)
      const res = index == -1 ? [] : this.unitList[index].children

      return res
    }
  },
  watch: {
    roomData: {
      handler(newVal) {
        this.getRoomList(newVal)
      }
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
    linkTo(addrIdArr = []) {
      const id = addrIdArr.join(',')
      let url = '/pages-archives/owner-document/list?pageType=room&id=' + id
      uni.navigateTo({ url })
    },
    // 获取房间列表
    async getRoomList({ areaId, projectId, parkId, keywords }) {
      const params = {
        data: {
          areaId,
          projectId,
          houseCompound: parkId,
          keywords
        },
        responseToast: false
      }
      const res = await getHouseAddrInfoListToPageForUnion(params)
      const data = res.data || []

      const arrTmp = this.buildList = roomTree(data)
      this.formObj.buildId = arrTmp[0]?.name ?? ''
    },
    getCharCode(str = '') {
      let res = 0
      for (let i = 0; i < str.length; i++) {
        res += str.charCodeAt(i)
      }
      return res
    }
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
  margin: 12rpx 0 12rpx 24rpx;
  position: relative;
}
.room-item-slot {
  display: block;
  min-width: 90rpx;
  height: 52rpx;
  background-color: var(--app-primary-color);
  border-radius: 4rpx;
  color: #fff;
  font-size: 26rpx;
  line-height: 52rpx;
  text-align: center;
  padding: 0 10rpx;
  box-sizing: border-box;

  &.flag::after {
    content: '欠费';
    display: block;
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    z-index: 1;
    width: 62.225rpx;
    height: 62.225rpx;
    background-color: #fc0b0b;
    font-size: 16rpx;
    text-align: center;
    line-height: 45rpx;
    clip-path: polygon(0 50%, 50% 0, 100% 50%);
    transform: rotate(45deg);
  }
}
</style>