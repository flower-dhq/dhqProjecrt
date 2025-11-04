<template>
  <view class="page-box" :style="[THEME_CSS_VAR]">
    <u-list @scrolltolower="scrolltolower" v-if="noticeList.length>0">
      <view class="data-item-box" v-for="(item,i) in noticeList" @click="toDetail(item)">
        <view class="title" :class="{'read':item.readingStatus==1}">{{ item.taskTitle }}</view>
        <view class="cont-text">{{ item.taskSummary.replace(/<[^>]*>?/gm, '') }}</view>
        <view class="time">
          <text class="text">{{ item.taskCreatedData }}</text>
          <image src="@/static/icon-img/icon_right.png" style="width:24rpx;height:24rpx;"></image>
        </view>
      </view>
    </u-list>
    <view class="no-data-cont" v-else>
      <image class="img" :src="require(`@/static/${[THEME_NAME]}/common/no-data.png`)" style="width:500rpx;height:500rpx;"></image>
      <view class="no-data-tips">暂无系统公告</view>
    </view>
  </view>
</template>

<script>
import { getPendingTaskPageList, updateReadingStatus } from "../../service/datawarehouse"

export default{
  data(){
    return{
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
    this.getDataList()
  },

  

  methods:{
    getInfo(){
      let { O_USER_INFO } = this.$constant;
      this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      this.companyId = this.userInfo.companyId ? this.userInfo.companyId : this.$appConfig.COMPLANY_ID;
    },

     //获取待办列表数据
    getDataList(){
      let params = {
        data:{
          companyId: this.companyId,
          transactStatus: 1,
          processors: this.userInfo.userAccount,
          businessKey: 'XTGG', 
          pageSize: this.pageSize,
          current: this.current
        }
      }
      getPendingTaskPageList(params).then(res =>{
        if(res.status==200){
          this.pages = res.data.pages
          if(this.current==1){
            this.noticeList = res.data.records
          }else{
            this.noticeList = this.noticeList.concat(res.data.records)
          }
        }
      })
    },
    
    scrolltolower(){
      if (this.current < this.pages) {
        this.current++;
        this.getDataList()
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
          this.getDataList()
        }
      })
    },

    toDetail(item){
      this.changeStatus(item)
      uni.navigateTo({url:'/pages-todoTask/system-notice/noticeDetail?noticeId='+item.thirdPartyId})
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
.u-list {
  // height: calc(100vh - 163px) !important;
  padding: 24rpx;
  box-sizing: border-box;
  overflow: auto;
}
.data-item-box{
  border-radius: 10rpx;
  background: #fff;
  margin-bottom: 24rpx;
  .title{
    position: relative;
    padding: 30rpx 50rpx 0 30rpx;
    font-size: 24rpx;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .cont-text{
    padding: 30rpx 30rpx 0;
    font-size: 24rpx;
    color: #666;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .time{
    display: flex;
    border-top: 1px solid #eee;
    color: #999;
    font-size: 24rpx;
    padding: 30rpx;
    margin-top: 30rpx;
    .text{
      flex: 1;
    }
  }
}
.read::after{
  content: '';
  position: absolute;
  height: 16rpx;
  width: 16rpx;
  border-radius: 8rpx;
  background-color: red;
  right: 24rpx;
  top: 24rpx;
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