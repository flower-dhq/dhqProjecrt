<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
   <view class="allList">
    <view class="listBox">
      <view class="title">
        <view class="top">详细信息</view>
        <view class="bottom">
          <view class="txt1">{{allDetail.decpssCode}}</view>
          <view class="right_txt right_txt_color1" v-if="allDetail.decpassState == '2'">待放行</view>
          <view class="right_txt right_txt_color2" v-else>已放行</view>
        </view>
        
      </view>
      <view class="all-content">
        <view class="con_txt">公司名称：{{ allDetail.companyName }}</view>  
        <view class="con_txt">房源地址：{{allDetail.address}}</view>  
        <view class="con_txt">放行人员：{{ allDetail.pedestriansName }}</view>  
        <view class="con_txt">放行日期：{{ allDetail.startTime }}</view>  
        <view class="con_txt">放行物品：{{ allDetail.items.length > 0 ? '':'无'}}</view>    
        <view class="con_release" v-if="allDetail.items.length > 0">
          <view class="box_list">
            <view class="box_t right_line">物品名称</view>
            <view class="box_t">数量/单位</view>
          </view>
          <view class="box_list" v-for="(item,index) in allDetail.items" :key="index">
            <view class="box_t right_line">{{item.itemName}}</view>
            <view class="box_t">{{ item.itemNum }}</view>
          </view>
        </view>
        <view class="con_txt">备注信息：{{ allDetail.descriptionContent }}</view>  
        <view class="con_txt" @click="lookImg">
          <view class="img-box" v-for="(item,index) in allDetail.fileList" :key="index">
            <image :src="item" mode="scaleToFill" class="img-image"/>
          </view>
        </view>
      </view>
    </view>
   </view>
   <view class="show-btn" v-if="allDetail.decpassState == '2'">
    <view class="btns" @click="updateDecPassData">物品放行</view>
   </view>
    <u-safe-bottom />
  </view>
</template>

<script>
import { findPassDetail,updateDecPass } from '@/service/wxmanage'

export default {
  data() {
    return {
      showType:'1',
      boxList:[1,2],
      //new
      tabList: [
      ],//    :,最快更新!无广告!
      searchForm: {
        selTabId: 'selfTask',
        endDate: '', // 截止日期
        selfState: '', // 我的任务的状态
        allState: '', // 总任务的状态
        type: '', // 类型
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'loading', // loading, nomore
        clickPageIndex: 1, // 记录当前点击的页面位置
      },
      dataList: [],
      releaseId:'',
      allDetail:{
        decpssCode:'',
        companyName:'',
        address:'',
        createDate:'',
        pedestriansName:'',
        idcardNum:'',
        startTime:'',
        items:[],
        descriptionContent:'',
        fileList:[],
        startTime:'',
        decpassState:1,
      }
    }
  },
  computed: {
    isLastPage() {
      return this.dataList.length >= this.pageForm.total
    }
  },
  onPullDownRefresh() {
    this.initData()
  },
  async onLoad(options) {
    this.releaseId = options.passId
    this.showType = options.showType
    this.geDetail()
  },
  methods: {
    lookImg(){
      uni.previewImage({
		  	urls: this.allDetail.fileList,
		  	// longPressActions: {
		  	// 	itemList: ['发送给朋友', '保存图片', '收藏'],
		  	// 	success: function(data) {
		  	// 		console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
		  	// 	},
		  	// 	fail: function(err) {
		  	// 		console.log(err.errMsg);
		  	// 	}
		  	// }
		  });
    },
    // 物品放行
    updateDecPassData(){
      uni.showLoading({title: '加载中',})
      let params = {
        data:{
          decpassState:3,// 放行传3
          releaseId:this.releaseId,// 放行ID
          // filePaths:'',// 放行图片（全路径，用逗号隔开）
        }
      }
      updateDecPass(params).then(res=>{
        if(res.status == '200'){
          setTimeout(()=>{
            uni.showToast({title:'成功放行',icon:'none'})
          },1000)
          this.geDetail()
        }else{
          uni.showToast({
            title:res.message,
            icon:'none'
          })
        }
      })
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
      
      var strDate = Y+M+D;
      return strDate;
    },
    geDetail(){
      findPassDetail({},this.releaseId).then(res=>{
        if(res.status == '200'){
          let data = res.data
          this.allDetail.decpssCode = data.decpssCode?data.decpssCode:''
          this.allDetail.decpassState = data.decpassState?data.decpassState:''
          this.allDetail.companyName = data.companyName?data.companyName:''
          this.allDetail.address = data.address?data.address:''
          this.allDetail.createDate = data.createDate?data.createDate:''
          this.allDetail.pedestriansName = data.pedestriansName?data.pedestriansName:''
          this.allDetail.idcardNum = data.idcardNum?data.idcardNum:''
          this.allDetail.startTime = data.startTime?this.timestampToTime(data.startTime):''
          this.allDetail.items = data.items?JSON.parse(data.items):[]
          this.allDetail.descriptionContent = data.descriptionContent?data.descriptionContent:''
          this.allDetail.fileList = data.notePicture? JSON.parse(data.notePicture) :[]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding-bottom: 20rpx;
  padding-top: 20rpx;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
}

.allList{
  width: 100%;
  box-sizing: border-box;
  padding: 0 32rpx;
  .listBox{
    width: 100%;
    background: #fff;
    border-radius: 16rpx;
    margin-top: 20rpx;
    box-sizing: border-box;
    .title{
      padding: 0 32rpx;
      box-sizing: border-box;
      width: 100%;
      height: 140rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid #FBF9F9;
      .top{
        font-size: 28rpx;
        font-weight: bold;
        padding-bottom: 20rpx;
        line-height: 28rpx;
      }
      .bottom{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .txt1{
          font-size: 28rpx;
          line-height: 28rpx;
        }
        .left_txt{
          font-size: 28rpx;
          font-weight: bold;
        }
        .right_txt{
          font-size: 28rpx;
        }
        .right_txt_color1{
          color: #D99915;
        }
        .right_txt_color2{
          color: #2EB01C;
        }
      }
    }
    .all-content{
      padding: 30rpx 32rpx;
      box-sizing: border-box;
      width: 100%;
      .con_txt{
        font-size: 28rpx;
        padding-bottom: 30rpx;
        .img-box{
          padding: 16rpx;
          .img-image{
            width: 170rpx;
            height: 200rpx;
          }
        }
      }
      .con_release{
        width: 100%;
        border-top: 1px solid #DDDDDD;
        padding-bottom: 30rpx;
        .box_list{
          width: 100%;
          height: 88rpx;
          border-bottom: 1px solid #DDDDDD;
          display: flex;
          .box_t{
            width: 49.5%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
          }
          .right_line{
            border-right: 1px solid #DDDDDD;
          }
        }
      }
    }
  }
}
.show-btn{
  position: fixed;
  bottom: 60rpx;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  .btns{
    width: 638rpx;
    height: 104rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 16rpx;
    background: linear-gradient(to right,#2760FF,#4F99FF);
    color: #fff;
  }
}
::v-deep .u-tabs {
  border-bottom: 1px solid #EAEAEA;
}
::v-deep .self-sheet {
  margin: 24rpx 20rpx 0;
}
::v-deep .all-sheet {
  margin: 24rpx 20rpx 0;
}
::v-deep .u-tag {
  height: 20px !important;
  line-height: 20px !important;
  margin-right: 10px !important;
}
</style>