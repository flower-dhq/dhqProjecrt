<template>
  <view class="page-box" :style="[THEME_CSS_VAR]">
    <view class="tab-box">
      <u-tabs :current="currentTab" :list="tabList" @click="tabChange" lineColor="#0064FF" lineWidth="172" :scrollable="false"></u-tabs>
    </view>
    <u-list @scrolltolower="scrolltolower" v-if="noticeList.length>0">
      <view class="data-item-box" v-for="(item,i) in noticeList" @click="toDetail(item)">
        <view class="title">{{ item.taskTitle }}</view>
        <view class="time">{{ item.taskCreatedData }}</view>
        <view class="detail-box">
          <text class="text">查看详情</text>
          <image src="@/static/icon-img/icon_right.png" style="width:26rpx;height:26rpx;"></image>
        </view>
      </view>
    </u-list>
    <view class="no-data-cont" v-else>
      <image class="img" :src="require(`@/static/${[THEME_NAME]}/common/no-data.png`)" style="width:500rpx;height:500rpx;"></image>
      <view class="no-data-tips">暂无{{currentTab==0?'未':'已'}}读公告</view>
    </view>
  </view>
</template>

<script>
import { getPendingTaskPageList, updateReadingStatus } from "../../service/datawarehouse"
export default{
  options:{
    styleIsolation: 'shared'
  },
  data(){
    return{
      currentTab:0,
      tabList:[
        { name:'未读(0)' },
        { name:'已读(0)' },
      ],
      noticeList:[],
      pageSize: 10,
      current: 1,
      pages:1,
      userInfo:{},
      companyId:'',
    }
  },

  created(){
    this.getInfo()
    this.getDataList(0) //未读
    this.getDataList(1) //已读
  },

  methods:{
    getInfo(){
      let { O_USER_INFO } = this.$constant;
      this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      this.companyId = this.userInfo.companyId ? this.userInfo.companyId : this.$appConfig.COMPLANY_ID;
    },

     //获取待办列表数据
    getDataList(type){
      let params = {
        data:{
          companyId: this.companyId,
          transactStatus: 1,
          processors: this.userInfo.userAccount,
          businessKey: 'XTGG',
          pageSize: this.pageSize,
          current: this.current,
          readingStatus: type==0 ? '1': '2'  //阅读状态(1.待阅,2.已阅)  
        }
      }
      getPendingTaskPageList(params).then(res =>{
        if(res.status==200){
          //type传入参数和当前tab-index相同时，才需要取列表相关数据，否则只是取总数
          if(type==this.currentTab){
            this.pages = res.data.pages
            if(this.current==1){
              this.noticeList = res.data.records
            }else{
              this.noticeList = this.noticeList.concat(res.data.records)
            }
          }
          this.tabList[type].name = `${type==0 ? '未' : '已'}读(${res.data.total})`
        }
      })
    },
    
    scrolltolower(){
      if (this.current < this.pages) {
        this.current++;
        this.getDataList(this.currentTab)
      }
    },

    // 修改公告是否已读状态
    changeStatus(item){
      let params = {
        data:{
          officeIdList:[item.officeId]
        },
      }
      updateReadingStatus(params).then(res=>{
        if(res.status==200){
          this.current = 1
          this.getDataList(0)
          this.getDataList(1)
        }
      })
    },

    toDetail(item){
      this.changeStatus(item)
      uni.navigateTo({url:'/pages-todoTask/system-notice/noticeDetail?noticeId='+item.thirdPartyId})
    },

    tabChange(e){
      this.currentTab = e.index
      this.current = 1
      this.getDataList(this.currentTab)
    }
  }
}
</script>

<style scoped lang="scss">
.page-box{
  min-height: 100vh;
  background-color: #f9f9f9;
  width: 100%;
}
.tab-box{
  background-color: #fff;
  padding: 20rpx 30rpx;
}
.u-list {
  height: calc(100vh - 88px) !important;
  padding: 24rpx;
  box-sizing: border-box;
  overflow: auto;
}
.data-item-box{
  border-radius: 10rpx;
  background: #fff;
  margin-bottom: 24rpx;
  .title{
    padding: 30rpx 50rpx 0 30rpx;
    font-size: 24rpx;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .time{
    padding: 30rpx 30rpx 0;
    color: #999;
    font-size: 24rpx;
  }
  .detail-box{
    display: flex;
    border-top: 1px solid #eee;
    // color: #999;
    font-size: 28rpx;
    padding: 30rpx;
    margin-top: 30rpx;
    .text{
      flex: 1;
    }
  }
}
.tab-box ::v-deep .u-tabs{
  background-color: #eee;
  height: 66rpx;
  border-radius: 12rpx;
  border:4rpx solid #eee
}
.tab-box ::v-deep .u-tabs__wrapper__nav__item{
  height: unset !important;
  line-height: 66rpx;
  // border-radius: 12rpx;
  // background-color: #eee;
}
.tab-box ::v-deep .u-tabs__wrapper__nav__item__text{
  z-index: 9;
}
.tab-box ::v-deep .u-tabs__wrapper__nav__line{
  height: 66rpx !important;
  top: 0 !important;
  bottom: 0 !important;
  border-radius: 12rpx;
  background-color: #fff !important;
}
.no-data-cont{
  padding-top: 200rpx;
  text-align: center;
}
.img{
  width:500rpx;
  height:500rpx;
}
.no-data-tips{
  margin-top: 60rpx;
  color: #999;
}
</style>