<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="select-compound">
      <text style="margin-right:10rpx;" @click="selectProject" class="project-name">{{ projectName }}</text>
      <u-icon name="arrow-down-fill" color="#80848F" size="12"></u-icon>
    </view>
    <view class="search">
      <u-search placeholder="房号/客户名称/车位编号/资源名称" v-model="keyword" :showAction="false" @search="onSearch"></u-search>
    </view>
    <view v-for="(item, index) in customerList" :key="index" class="customer-list" @click="goToPay(item)">
        {{item.nodeDesc}}
    </view>
    <selectCompound ref="selectProject" top="88rpx" @on-selected="onProjectSelected" type="2"></selectCompound>
  </view>
</template>

<script>
import selectCompound from './components/selectCompound.vue'
import { getBuildingQuesTaskList } from '@/service/landcrm'
import {getInfoByKeyword,getFloorRoomInfoByCell} from "@/service/leasing";

export default {
  components: {
    selectCompound
  },
  data() {
    return {
      searchForm: {
        areaName: '',
        projectName: '',
        areaId: '',
        projectId: '',
        buildingId: '',
        cellId: '',
      },
      keyword: '',
      buildingList: [],
      cellList: [],
      roomList: [],
      parkingList: [],
      bills: {},
      customerList: [],
    }
  },
  computed: {
    projectName(){
      if(this.searchForm.areaName){
        return [this.searchForm.areaName, this.searchForm.projectName ].join('-');
      }
    }
  },
  methods: {
    selectProject(){
      this.$refs.selectProject.open();
    },
    onProjectSelected(data){
      this.searchForm = Object.assign(this.searchForm, data);
      this.keyword = '';
      this.customerList = [];
    },
    onSearch(){
      var params = {
        data: {
          projectId: this.searchForm.projectId,
          keyword: this.keyword,
        },
        hideLoading: true,
        responseToast: false,
      }
      getInfoByKeyword(params).then(res => {
        if(res.status == 200){
          this.customerList = res.data;
          this.customerList.forEach(item => {
            item.nodeId = item.customerPropertyId;
          })
        }
      })
    },
    goToPay(item){
      if(item.nodeCategory == 1){
        item.nodeId = item.customerId;
      }
      let itemInfo =encodeURIComponent(JSON.stringify(item));
      uni.navigateTo({
        url: `/pages-leasing/staffPayment?item=${itemInfo}`
      });
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
  .select-compound{
    height: 88rpx;
    padding-left: 30rpx;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    .project-name{
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
    margin-top: 24rpx;
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
        margin-right: 30px;
        font-size: 24rpx;
        color: #999999;
        padding-left: 30rpx;
      }
      &:nth-of-type(2){
        color: #1989F7;
        font-size: 26rpx;
      }
    }
  }
  .customer-list{
    padding: 30rpx;
    background-color: #fff;
    font-size: 28rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #333333;
    opacity: 1;
    border-bottom: 1px solid #EBEBEB;
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
