<template>
  <view :class="['room-tree', getCustomClass]" :style="[THEME_CSS_VAR, getCustomStyle]">
    <!-- 楼栋 -->
    <view class="build-list">
      <scroll-view :scroll-top="0" scroll-y style="width: 100%; height: 100%;">
        <text :class="['build-item', { selected: item.buildingId == formObj.buildId }]" v-for="(item, index) in buildList" :key="index" @click="itemEvent('build', item, index)">{{ item.buildingLocation }}</text>
      </scroll-view>
    </view>

    <view class="unit-panel">
      <!-- 单元 -->
      <view class="unit-list">
        <text :class="['unit-item', { selected: item.Id == formObj.unitId }]" v-for="(item, index) in unitList" :key="index" @click="itemEvent('unit', item, index)">{{ item.Name }}</text>
      </view>

      <!-- 描述 -->
      <!-- <view class="desc-list">
        <view class="desc-item" v-for="(item, index) in descList" :key="index">
          <text>{{ item.title }}</text>
          <text class="desc-item-num">{{ item.label }}</text>
        </view>
      </view> -->

      <view class="divider"></view>

      <!-- 房间 -->
      <scroll-view scroll-y scroll-top="0" style="height: 100%; overflow: hidden;">
        <view class="room-scroll">
          <view class="room-list">
            <view v-for="(item,index) in roomList" :key="index" class="room" @click="goPage(item)">
              <view class="room-item">{{item.roomCode}}</view>
              <view :class="['common-item', 'no-radius', item.meterKind==2?'dian': '', item.meterKind==1?'water': '']">{{item.number}}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import { getMeterList } from "@/service/energy";
import { getBuildingDetailList } from '@/service/landcrm';
import { getCustomerTree, getFloorRoomInfoByCell, getCellInfo, getRoomIdListByBuildingId } from "@/service/leasing";

/**
 * 楼栋-单元-房间 三级选择
 * @slot default 房间插槽
 */
export default {
  name: 'RoomTree',
  mixins: [mpMixin],
  props: {
    buildData: {
      type: Object,
      default: () => ({})
    },
    searchForm: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      // 楼栋数据
      buildList: [],
      // 单元数据
      unitList: [
        { label: '1单元', name: 1 },
        { label: '2单元', name: 2 },
        { label: '3单元', name: 3 },
        { label: '4单元', name: 4 }
      ],
      // 描述数据
      descList: [
        { title: '全部', label: 180 },
        { title: '欠费', label: 20 }
      ],
      // 房间
      roomList: [],
      formObj: {
        areaId: '',
        projectId: '',
        buildId: 1,
        unitId: 1,
        roomId: ''
      },
      roomIdList: [],
    }
  },
  methods: {
    itemEvent(type, item, index) {
      if (type == 'build') {
        this.formObj.buildId = item.buildingId
        this.getCellList()
      } else if (type == 'unit') {
        this.formObj.unitId = item.Id
        this.getRoomIdListByBuildingList()
      } else if (type == 'room') {
        this.formObj.roomId = item.name
      }
    },
    // 获取楼栋
    getBuildingData(option) {
      const { projectId,areaId, name: courtyard } = option || {};
      this.formObj.projectId = projectId
      this.formObj.areaId = areaId

      const params = {
        data: {
          areaId,
          projectId,
          courtyard,
          startIndex: 1,
          pageSize: 100000,
        },
        responseToast: false,
      };
      getBuildingDetailList(params).then((res) => {
        console.log('楼栋信息===',res)
        if (res.success) {
          // const data = res.data || [];
          this.buildList = res.data || [];
          this.formObj.buildId = res.data?.[0].buildingId
          this.getCellList()
        }
      });
    },
    // 获取单元信息
    getCellList() {
      let params = {
        data: {
          buildId: this.formObj.buildId
        }
      }
      getCellInfo(params).then(res => {
        if (res.status == 200) {
          this.unitList = res.data || [];
          this.formObj.unitId = res.data?.[0].Id
          console.log('单元楼信息===', this.unitList);
          this.getRoomIdListByBuildingList()
        }
      });
    },
    // 获取单元所有房间
    getRoomIdListByBuildingList() {
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      let params = {
        header: {
          'content-type': 'application/json',
          'x-userId-header': userInfo.userId,
          // 'x-userId-header': 2063435,    //个人userId无法查看数据时候用

          // 'userId': 2063435,
          // 'x-companyId-header': 300,
          // 'x-user-header': 2063435,
          // 'x-userAccount-header': 'ybwlkjadmin',
          // 'x-userId-header': 2063435,
          // 'x-userName-header': '%E7%AE%A1%E7%90%86%E5%91%98',
          // 'x-userPhone-header': 17899990000
        },
        data: {
          projectId: this.formObj.projectId,
          buildIds: this.formObj.buildId,
          cellIds: this.formObj.unitId,
          nodeCategory: 1,
        }
      }
      this.roomIdList = []
      getRoomIdListByBuildingId(params).then(res=>{
        this.roomIdList = res?.data?.map(item=> item.roomId) || []
        console.log('单元所有房间====', this.roomIdList)
        this.getData()
      })
    },
    // 获取单元房间
    getRoomData(){
      var params = {
        data: {
          cellId: this.formObj.unitId
        },
        hideLoading: true,
        responseToast: false,
      }
      getFloorRoomInfoByCell(params).then(res => {
        console.log('单元房间==',res)
        // this.roomList = res.data;
      })
    },
    // 查询抄表列表    data父组件传值
    getData(parentData) {
      const startTime = this.searchForm.startTime
      const endTime = this.searchForm.endTime
      let params = {
        data: {
          // areaId: this.formObj.areaId,
          // number: '',   //表种类
          projectId: this.formObj.projectId,  //项目id
          openFlag: this.$parent.searchForm.openFlag,    //是否开通标识  0-未开通 1-已开通
          meterKind: this.$parent.searchForm.meterKind,  //表号
          roomIdList: this.roomIdList,   //房间
          pageIndex: 1,
          pageSize: 500,
          customList: [],
          keyWord: this.$parent.searchForm.keyWord, //输入框
          readFlag: this.$parent.searchForm.readFlag, // 0 未炒   1已抄
          startReadDate: startTime ? startTime + ' 00:00:00' : '',
          endReadDate: endTime ? endTime + ' 00:00:00' : '',
        }
      }
      // 特殊处理   没有单元房间时候不加载 仪表接口
      if (this.roomIdList.length == 0) return
      getMeterList(params).then(res=>{
        console.log('抄表房间==',res)
        this.roomList = res?.data?.records || []
        // console.log('roomList===',this.roomList)
        if (!res.success) {
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 跳转到业主档案
    linkTo(item) {
      uni.navigateTo({ url: '/pages-archives/owner-document/detail' })
    },
    // 跳转仪表信息
    goPage(item) {
      this.$emit('goPage', {data: item, projectId: this.formObj.projectId})
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 30rpx 40rpx 0;
    background-color: #fff;
    .room {
      display: flex;
      margin-bottom: 24rpx;
    }
    .room-item {
      width: 84rpx;
      height: 52rpx;
      background: #1989F7;
      color: #fff;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border: 1px solid #1989F7;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .no-radius {
      border-top-left-radius: 0px !important;
      border-bottom-left-radius: 0px !important;
      border-left: none !important;
      margin-bottom: 0rpx !important;
    }
    .common-item {
      width: 172rpx;
      height: 52rpx;
      line-height: 52rpx;
      @include ellipsis(1);
      text-align: center;
      color: #666;
      font-size: 26rpx;
      border: 1px solid #999999;
      border-radius: 4px;
      position: relative;
      margin-bottom: 48rpx;
    }
    .ranqi::after {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      background-image: url('@/static/theme-default/common/icon-ranqi.png');
      background-size: 100%;
      width: 44rpx;
      height: 44rpx;
    }
    .xuni::after {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      background-image: url('@/static/theme-default/common/icon-xuni.png');
      background-size: 100%;
      width: 44rpx;
      height: 44rpx;
    }
    .water::after {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      background-image: url('@/static/theme-default/common/icon-water.png');
      background-size: 100%;
      width: 44rpx;
      height: 44rpx;
    }
    .dian::after {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      background-image: url('@/static/theme-default/common/icon-dian.png');
      background-size: 100%;
      width: 44rpx;
      height: 44rpx;
    }
  }
</style>
