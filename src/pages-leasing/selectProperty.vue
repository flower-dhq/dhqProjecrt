<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="select-compound" @click="selectCompound">
      <text style="margin-right:10rpx;" class="compound-name">{{ compoundName }}</text>
      <u-icon name="arrow-down-fill" color="#80848F" size="16rpx"></u-icon>
    </view>
    <view class="search">
      <view class="search-item" @click="quickSearch">
        <u-icon name="search" color="#999" size="30rpx"></u-icon>
        快捷查询
      </view>
      <view class="search-item" :class="{'show-arrears': showArrears}" @click="viewArrears" v-if="searchForm.nodeCategory == 2">只看欠费
        <image :src="require(`@/static/${[THEME_NAME]}/leasing/icon-filter.png`)"
                       style="width:24rpx;height:24rpx;margin-left: 5rpx"></image>
      </view>
    </view>
    <view class="main">
      <view class="main-left">
        <view class="building-item" :class="{ 'building-item-active': searchForm.buildingId == item.Id }"
              v-for="(item, index) in buildingList" :key="index" @click="changeBuilding(item)">{{ item.Name }} </view>
      </view>
      <view class="main-right" v-if="searchForm.nodeCategory == 2">
        <u-tabs :list="cellList" @click="cellClick" keyName="Name" lineHeight="0" :current="current"
        :activeStyle="{
            background: 'rgba(25,137,247,0.1)',
            border: '1px solid #1989F7',
            borderRadius: '4rpx',
            color: '#1989F7',
            padding: '8rpx 30rpx',
            width: '100%',
            fontSize: '24rpx',
        }"
        :inactiveStyle="{
            background: '#F7F7F7',
            borderRadius: '4rpx',
            color: '#999999',
            padding: '8rpx 30rpx',
            width: '100%',
            fontSize: '24rpx',
        }"></u-tabs>
        <view v-for="(item, index) in roomList" :key="index" class="room-container">
          <view style="padding:0 10px" class="floor">{{item.Name}}F</view>
          <view class="room-info">
            <view  v-for="(ele,index2) in item.rooms" :key="index2" class="room-item" @click="selectRoom(ele)" v-if="(showArrears && ele.arrear && ele.arrear == '1') || (!showArrears)">
                <view class="room-name">{{ele.Name}}</view>
              <image class="arrearsFlag" :src="require(`@/static/${[THEME_NAME]}/leasing/icon-arrears.png`)" v-if="ele.arrear && ele.arrear == '1'"
                     style="width:44rpx;height:44rpx;"></image>
              </view>
          </view>
        </view>

      </view>
      <view class="main-right" v-else>
        <view class="parking-container">
          <view v-for="(item, index) in parkingList" :key="index" class="parking-item" @click="selectRoom(item)">
            <view class="parking-name">{{item.Name}}</view>
          </view>
        </view>
      </view>
    </view>

    <selectCompound ref="selectCompound" top="88rpx" @on-selected="onCompoundSelected"></selectCompound>
    <yb-complete exist ref="completeMsgEl" />
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import selectCompound from './components/selectCompound.vue'
import { getBuildingQuesTaskList } from '@/service/landcrm'
import {getCustomerTree,getFloorRoomInfoByCell,getCustomerDetailByUnionId} from "@/service/leasing";
import Utils from '@/js/utils'

export default {
  mixins: [menuAuthMixin],
  components: {
    selectCompound
  },
  authName: '应收管理',
  data() {
    return {
      searchForm: {
        areaName: '',
        projectName: '',
        compoundName: '',
        buildingId: '',
        cellId: '',
      },
      buildingList: [],
      cellList: [],
      roomList: [],
      parkingList: [],
      bills: {},
      showArrears: false,
      userInfo: {},
      current: 0,
    }
  },
  computed: {
    compoundName(){
      if(this.searchForm.areaName){
        return [ this.searchForm.projectName, this.searchForm.compoundName].join('-');
      }
    },
    filterRoomList(){
      if(this.showArrears){
        return this.roomList.filter(item => {
          return item.rooms.every(ele =>  ele.arrear && ele.arrear == '1')
        })
      }else{
        return this.roomList;
      }
    }
  },
  onLoad(){
    var O_USER_INFO = this.$constant.O_USER_INFO;
    this.userInfo = this.$utils.storageAction({
      key: O_USER_INFO,
      action: 'get'
    });
    console.log('userInfo', this.userInfo);


  },
  async onShow() {
    // 认证登录
    await this.$onLaunched
    this.dealShow()
  },
  methods: {
   dealShow() {
      let self= this; 
      wx.qy.getContext({
        success:async function(res){
          var entry = res.entry;//返回进入小程序的入口类型
          console.log('entry', entry);
          if(entry == 'single_chat_tools') {
            // 判断是否有菜单权限
            let flag = await Utils.toolbarPermissions()
            if(!flag) return
      
            wx.qy.getCurExternalContact  ({
              success: function(res) {
                var userId = res.userId //返回当前联系人userId
                console.log('userId', userId);
                var params = {
                  data: {
                    companyId: self.$appConfig.COMPLANY_ID,
                    userId: userId,
                    stewardId: self.userInfo.userId,
                  },
                  hideLoading: true,
                  responseToast: false,
                }
                console.log('params:', params.data);
                getCustomerDetailByUnionId(params).then(res => {
                  console.log('getCustomerDetailByUnionId',res);
                  if(res.status == 200){
                    if(!res.data.length ){
                      self.$refs.completeMsgEl.showMessage('该业主未认证，请先邀请业主认证后使用')
                      return;
                    }
                    let customers =encodeURIComponent(JSON.stringify(res.data));
                    uni.navigateTo({
                      url: `/pages-leasing/staffPayment?customers=${customers}`
                    });
                  }else{
                    self.$refs.completeMsgEl.showMessage(res.message)
                  }
                })
              },
              fail: function (res){
                console.log('fail', res);
              }
            })
          }
        },
        fail: function (res){
          console.log('fail', res);
        }
      })
    },
    selectCompound(){
      this.$refs.selectCompound.open();
    },
    onCompoundSelected(data){
      this.searchForm = Object.assign(this.searchForm, data);
      this.getTreeData(this.searchForm);
    },
    changeBuilding(item){
      this.searchForm.buildingId = item.Id;
      this.current = 0;
      this.getTreeData(item);
    },
    getTreeData(parentData) {
      var self = this;
      var params = {
        data: {
          pId: parentData.Id,
          nodeCategory: parentData.nodeCategory,
          nodeType: parentData.nodeType,
          projectId: parentData.projectId,
        },
        hideLoading: false,
        responseToast: false,
      }
      getCustomerTree(params).then(res => {
        if((parentData.nodeCategory == 2 && parentData.nodeType == 1)  ){
          self.buildingList =res.data;
          if(self.buildingList.length){
            let build = self.buildingList[0];
            this.searchForm.buildingId = build.Id;
            this.getTreeData(build);
          }
        }else if((parentData.nodeCategory == 2 && parentData.nodeType == 2) ){
          self.cellList = res.data;
          if(self.cellList.length){
            let cell = self.cellList[0];
            this.searchForm.cellId = cell.Id;
            this.getRoomData();
          }
        }else if((parentData.nodeCategory == 3 ||  parentData.nodeCategory == 4)){
          if(parentData.Id == 0){
            self.buildingList =res.data;
            if(self.buildingList.length){
              let build = self.buildingList[0];
              this.searchForm.buildingId = build.Id;
              this.getTreeData(build);
            }
          }else{
            self.parkingList =res.data;
          }
        }

      })
    },
    getRoomData(){
      var params = {
        data: {
          cellId: this.searchForm.cellId
        },
        hideLoading: false,
        responseToast: false,
      }
      getFloorRoomInfoByCell(params).then(res => {
        this.roomList = res.data;
      })
    },
    cellClick(item){
      this.searchForm.cellId = item.Id;
      this.current = item.index;
      this.getRoomData()
    },
    selectRoom(item){
      let itemInfo = {
        projectId: this.searchForm.projectId,
        nodeCategory: this.searchForm.nodeCategory,
        nodeId: item.Id,
      }
      itemInfo =encodeURIComponent(JSON.stringify(itemInfo));
      uni.navigateTo({
        url: `/pages-leasing/staffPayment?item=${itemInfo}`
      });
    },
    quickSearch(){
      uni.navigateTo({
        url: `/pages-leasing/quickSearch`
      });
    },
    viewArrears(){
      this.showArrears = !this.showArrears;
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding-bottom: 10px;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
  width: 100%;
  .select-compound{
    height: 88rpx;
    padding-left: 30rpx;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    .compound-name{
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
      opacity: 1;
    }
  }
  .search{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 88rpx;
    margin-top: 30rpx;
    padding: 0 30rpx;
    background-color: #fff;
    &-item{
      display: flex;
      flex-direction: row;
      align-items: center;
      &:nth-of-type(1){
        flex: 1;
        height: 60rpx;
        background: #F5F5F5;
        opacity: 1;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #999999;
        padding-left: 30rpx;
      }
      &:nth-of-type(2){
        color: #333;
        font-size: 26rpx;
        margin-left: 30px;
      }
    }
  }
  .show-arrears{
    color: #1989F7!important;
  }
  .main{
    display: flex;
    flex-direction: row;
    height: calc(100vh - 206rpx);
    &-left{
      width: 140rpx;
      display: flex;
      height: 100%;
      flex-direction: column;
      flex-shrink: 0;
      .building-item{
        min-height: 102rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333333;
        &-active{
          color: #1989F7;
          background-color: #fff;
        }
      }
    }
    &-right{
      flex: 1;
      height: 100%;
      background-color: #fff;
      padding: 0 30rpx;
      overflow-x: hidden;
      overflow-y: scroll;
      .room-container{
        display: flex;
        flex-direction: column;
        .floor{
          font-size: 30rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #151515;
          margin-bottom: 10rpx;
        }
        .room-info{
          display: grid;
          flex-direction: column;
          grid-gap: 30rpx;
          grid-template-columns: repeat(5, 1fr);
          .room-item{
            height: 52rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #1989F7;
            opacity: 1;
            border-radius: 4rpx;
            padding: 5rpx 0;
            position: relative;
            .room-name{
              font-size: 26rpx;
              font-family: PingFang SC;
              font-weight: 400;
              color: #FFFFFF;
              opacity: 1;
            }
            .arrearsFlag{
              position: absolute;
              right: 0;
              top: 0;
            }
          }
        }
      }
      .parking-container{
        padding: 30rpx 0 0;
        display: grid;
        flex-direction: column;
        grid-gap: 30rpx;
        grid-template-columns: repeat(3,1fr);
        .parking-item{
          height: 52rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #1989F7;
          opacity: 1;
          border-radius: 4rpx;
          padding: 5rpx 0;
          position: relative;
          .parking-name{
            font-size: 26rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            opacity: 1;
          }
        }
      }
    }
  }
}
::v-deep .u-sticky {
  border-bottom: 1px solid #EAEAEA;
}
::v-deep .u-tabs__wrapper__nav__line {
  bottom: 16rpx !important;
}
::v-deep .u-search {
  padding: 14rpx 24rpx;
  border-bottom: 1px solid #EAEAEA;
  background-color: #fff;
  z-index: 10;
  position: relative;

  .u-search__content__input {
    height: 56rpx !important;
  }
}
::v-deep .workorder-sheet {
  margin: 24rpx 20rpx 0;
}
</style>
