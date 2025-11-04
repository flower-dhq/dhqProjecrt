<style scoped>
.page_box {
    /* padding: 20rpx; */
    background: #ffffff;
    height: 100%;
    box-sizing: border-box;
}
  .hui-home-lists{
    margin:0 15px 15px 15px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fff;
  }
  .hui-home-list{
    padding: 15px;
    border-bottom: 1px solid #f5f0f0;
    position: relative;
  }
  .hui-home-list:last-child{
    border-bottom: none;
  }
  .nodata {
    height: calc(100vh - 100rpx);
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    background-position: center 25%;
    background-color: #ffffff;
}
.nodata::after {
    content: "暂无数据~";
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
<template>
  <view class="page_box"  :class="[THEME_NAME]" :style="[THEME_CSS_VAR]" >
      <u-list :border="false" :enableFlex="true" >
      <view v-if="!facilitiesData.length" class="nodata"></view>
      <view v-else>
        <view style="padding: 20px 15px; font-size: 28.6rpx; color:#555;">关键设备共{{totalNum}}台</view>
        <view class="hui-home-lists">
          <view  v-for="(item,index) in facilitiesData" :key="index" class="hui-home-list">
            <view style="height: 20px; line-height: 20px; color:#333; font-size: 32rpx;">{{item.deviceName}}</view>
            <view style="height: 20px; line-height: 20px; margin-top: -20px; text-align: right; font-size: 30rpx;">{{item.deviceNumber}}</view>
          </view>
        </view>
        
        <u-loadmore :show-loading="hasMoreData"   :status="status" 
        :nomore-text="nomoreText"  background-color="#fbf9fe" v-if="hasMoreData" color="#999999" 
				line></u-loadmore>
      </view>
    </u-list>
    <u-loading-icon :show="loading" text="加载中"></u-loading-icon>
  </view>
</template>

<script>
  import util from '@/js/utils';
  import {selectFacilitiesCount,selectFacilitiesCountNumber, } from "@/service/wxmanage.js";
  export default {
    name: "huiHomeScene",
    data() {
      return {
        status:'nomoreText',
        nomoreText:"已无其它内容",
        loading: false,
        // loading: true,
        hasMoreData: true,
        areaId: '',
        projectId: '',
        current: 1,
        pageSize: 20,
        totalNum: 0,
        facilitiesData: [],
        totalCount: 0,
        isMpaas:true,
      }
    },
    onLoad() {
      let self = this;
      const { AREA_ID, PROJECT_ID } = this.$constant;
      console.log(87,this.$constant)
      let projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
      let areaId = util.storageAction({ key: AREA_ID, action: 'get' });
      self.areaId = areaId;
      self.projectId = projectId;
      self.getTotalNum();
      self.loadMoreData();
    },
    methods: {
      //获取设备总数
      getTotalNum(){
        let self = this;
        self.loading = true;
        let params = {
          data:{
            "areaId": self.areaId,
            "projectId": self.projectId
          }
        };
        selectFacilitiesCountNumber(params,'汇景家园','获取汇景设备总数失败').then(res => {
          self.loading = false;
          if (res.status === '200') {
             self.totalNum = res.data
          }else{
          }
        }).catch((err) => {
          self.loading = false;
        });
      },

      //刷新列表数据
      refreshData(){
        let self = this;
        self.current = 1;
        let params = {
          data:{
            "areaId": self.areaId,
            "projectId": self.projectId,
          }
        };
        selectFacilitiesCount(params,'汇景家园','获取设备信息统计列表失败').then(res => {
          if(res.status === '200'){
            self.facilitiesData = res.data;
          }else{
          }
          self.checkListData();
        }).catch((err) => {
          self.util.debugLog(err);
          self.showTips('获取数据失败');
        });
        self.getTotalNum();
      },

      // 加载更多数据
      loadMoreData() {
        let self = this;
        if(!self.hasMoreData){
          return
        }
        let params = {
          data:{
            "areaId": self.areaId,
            "projectId": self.projectId,
          }
        };
        selectFacilitiesCount(params,'汇景家园','获取设备信息统计列表失败').then(res => {
          console.log(163,params)
          if(res.status === '200'){
            self.facilitiesData = res.data;
          }else{
          }
          self.donePullup();
          self.checkListData();
        }).catch((err) => {
          self.loading = false;
        });
        self.getTotalNum();
      },
      showTips (tip) {
        this.$vux.toast.show({
          type: 'text',
          text: tip,
          position: 'bottom'
        });
      },
      checkListData() {
        if(this.totalCount <= this.facilitiesData.length){
          this.hasMoreData = false
        }else{
          this.hasMoreData = true
        }
      },
      // 下拉刷新
  async onPullDownRefresh() {
    console.log("下拉刷新");
    await this.refreshData();
    uni.stopPullDownRefresh();
  },

  // 判断是否当前页面到底,--上滑加载数据
  onReachBottom() {
    console.log("已经到底了");
    this.loadMoreData()
  },
  // 加载下一页数据
    },
    watch: {
      hasMoreData: function (newVal) {
        if(newVal){
          this.$refs.facilitiesData.enablePullup();
        }else{
          this.$refs.facilitiesData.disablePullup();
        }
      }
    }
  };
</script>

