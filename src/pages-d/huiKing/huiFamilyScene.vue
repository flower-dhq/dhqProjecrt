<style scoped lang="scss">
  @mixin flx-dsp($jsc, $ali, $drt:row) {
    display: flex;
    flex-direction: $drt;
    justify-content: $jsc;
    align-items: $ali;
  }
  #app-page {
    height: initial;
    min-height: 100vh;
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    background: #ffffff;
    position: relative;
  }
  .hui-family-lists{
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fff;
    margin: 15px;
  }
  .hui-family-list{
    // min-height: 115px;
    padding: 30px 25px 30px 15px;
    border-bottom: 1px solid #e4e4e4;
  }
  .hui-family-list:last-child{
    border-bottom: none;
  }
  .hui-family-list-image{
    width: 55px;
    height: 55px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    overflow: hidden;
    background-size: cover;
  }

  .hui-family-info{
    margin-top: -55px;
    margin-left: 70px;
  }
  .hui-family-info-data{
    min-height: 26px;
    line-height: 26px;
  }
  .hui-family-info-data-name{
    font-weight: bold;
    font-size: 32rpx;
    float: left;
    margin-right:
      10px; color:#333;
  }
  .data-listempty{
    width: 100%;
    height:100vh;
    background: #FFFFFF;
    list-style: none;
    margin-top:-60rpx;

  }
  .imgempty{
    height: 175px;
    width: 175px;
    margin-top: 130px;
    background-size: 100%;
  }
  .empty-p{
    color: #999999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
}
  .hui-family-info-data-position{
    height: 26px;
    font-weight: lighter;
    font-size: 28rpx;
    float: right;
    width: 230rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .hui-family-info-details{
    margin-top: 10px;
    font-size: 26rpx;
    word-break: break-word;
  }
  .content-no-more-data-tip {
    width: 100%;
    height: 45px;
    font-size: 14px;
    color: #999;
    line-height: 45px;
    text-align: center;
  }
   .base-lien {
      position: relative;
      margin: 4.8px auto 3.2px auto;
      width: 380rpx;
      height: 23.6rpx;
      @include flx-dsp($jsc: center, $ali: center);
      font-size: 27rpx;
      & > p {
        width: 100%;
        height: 1px;
        background-color: #e0e0e0;
      }
      & > span {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 180rpx;
        // height: 12.8rpx;
        text-align: center;
        background-color: #F6F7F9;
        transform: translate(-50%, -50%);
        display: block;
        color: #ACACAC;
      }
    }

  .nodata {
    height: calc(100vh - 100rpx);
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    top:0;
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
    <view id="app-page"  :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
      <u-list :border="false" @scrolltolower="scrolltolower">
          <view class="hui-family-lists">
            <view class="hui-family-list" v-for="(item,index) in employeeInfo"  :key="index">
              <view class="hui-family-list-image">
                <image v-if="item.stewardHeadUrl == undefined" src="@/static/theme-default/sunHome/familyPortrait.jpg"></image>
                <image  style="height: 100%;width: 100%;" v-else :src="item.stewardHeadUrl"></image>
              </view>
              <view class="hui-family-info">
                <view  class="hui-family-info-data">
                  <span class="hui-family-info-data-name">{{item.name}}</span>
                  <span class="hui-family-info-data-position">
                    <span >{{item.station}}</span>
                  </span>
                </view>
                <view class="hui-family-info-details">{{item.individualInfo}}</view>
              </view>
            </view>
          </view>
           <!-- <view class="base-lien" v-show="!hasMoreData &&employeeInfo.length!=0">
                <p class="line"></p>
                <span>{{noMoreDataTips}}</span>
           </view> -->
           <view v-if="employeeInfo.length==0" class="nodata"></view>
           <!--<view v-if="employeeInfo.length==0" class="data-listempty" style="text-align: center;" >
                <image  :style="{backgroundImage:`url(@/static/${[THEME_NAME]}/sunHome/tips.png)`}" class="imgempty"/>
                <p class="empty-p">暂无数据</p>
           </view>-->
      </u-list>
      <u-loading-icon :show="loading" text="加载中"></u-loading-icon>
     
    </view>
</template>
<script>
  import util from '@/js/utils';
  import {  getEmployeeInfo } from "@/service/wxmanage.js";
  export default {
    name: "huiFamilyScene",
    data() {
      return {
        loading: false,
        projectId: '',
        areaId: '',
        pageSize: 10,
        pageNum: 1,
        employeeInfo: [],
        hasMoreData: true,
        noMoreDataTips: "已无其它内容",
        totalCount: 0,
        isMpaas:true,
      }
    },
    onLoad() {
      const { AREA_ID, PROJECT_ID } = this.$constant;
      console.log(87,this.$constant)
      let projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
      let areaId = util.storageAction({ key: AREA_ID, action: 'get' });
      this.projectId = projectId
      this.areaId = areaId
      this.loadMoreData();
    },
    methods: {
      // 加载更多数据
      loadMoreData() {
        if (!this.hasMoreData) {
          return
        }
        let params = {
          data:{
            "projectId": this.projectId,
            "areaId": this.areaId,
            "pageNum": this.pageNum,
            "pageSize": this.pageSize,
          }
        };
        console.log(201,params)
        getEmployeeInfo(params,'汇景家人','获取汇景家人员工列表失败').then(res => {
          console.log(209,res)
          this.loading = false;         
          if (res.status === '200'){
            const list = res.data.records || [];
            this.totalCount = res.data.total;
            //this.employeeInfo = res.data.records;
            console.log("this.employeeInfo=="+this.employeeInfo)
             const sort = list.sort((a, b) => a.sort - b.sort);   
             this.employeeInfo = this.employeeInfo.concat(sort);
             ++this.pageNum;
          } else {
            if(res.message){
            
            }else{
            this.showTips("网络异常");
            }
          }
          this.checkListData();
        }).catch((err) => {
          console.log(err)
        });
        console.log(226,this.employeeInfo.length)
      },

      // 刷新列表数据
      refreshData() {
        this.loading=true;
        this.pageNum = 1;
        let params = {
          data:{
            projectId: this.projectId,
            "areaId": this.areaId,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          }
        };
        getEmployeeInfo(params,'汇景家人','获取汇景家人员工列表失败').then(res => {
          this.loading = false;
          if (res.status === '200'){
            const list = res.data.records || [];
            const sort = list.sort((a, b) => a.sort - b.sort);   
            this.employeeInfo = sort; //res.data.records;
            this.totalCount = res.data.total;
            ++this.pageNum;
          } else {
             if(res.message){
              console.log(249,employeeInfo.length)
              this.showTips(res.message);
            }else{
              this.showTips("网络异常");
            }
          }
          this.donePulldown();
          this.checkListData();
        }).catch((err) => {
          this.util.debugLog(err);
          this.showTips('网络异常，获取数据失败');
          this.donePulldown();
        });
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
     scrolltolower(){
      console.log("已经到底了");
       this.loadMoreData()
     },
      showTips (tip) {
        this.$vux.toast.show({
          type: 'text',
          text: tip,
          position: 'bottom'
        });
      },

      // donePulldown() {
      //   this.$refs.employeeInfo.donePulldown();
      //   this.$refs.employeeInfo.reset({ top: 0 });
      // },

      // donePullup() {
      //   this.$refs.employeeInfo.donePullup();
      //   this.$refs.employeeInfo.reset();
      // },

      checkListData() {
        console.log(this.totalCount+" " + this.employeeInfo.length)
        if(this.totalCount === this.employeeInfo.length){
          this.hasMoreData = false;
        }else{
          this.hasMoreData = true;
        }
      },
      setBackButtonState (state) {
        window.AlipayJSBridge && AlipayJSBridge.call('setBackButtonHidden', {'hidden':state}, function(data){
          // alert('回调结果' + JSON.stringify(data));
        });
        if (state) {
          window.AlipayJSBridge && AlipayJSBridge.call('hideBackButton');
        } else{
          window.AlipayJSBridge && AlipayJSBridge.call('showBackButton');
        }
      },

    },
  // watch: {
  //   hasMoreData: function (newVal) {
  //     if (newVal) {
  //       this.$refs.employeeInfo.enablePullup()
  //     } else {
  //       this.$refs.employeeInfo.disablePullup()
  //     }
  //   }
  // }
};
</script>

