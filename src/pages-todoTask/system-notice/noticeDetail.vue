<template>
  <view class="page-box">
    <view class="content">
      <view class="title">{{ detailObj.title }}</view>
      <view class="time">{{ detailObj.createTime }}</view>
      <view class="main-text">
        <rich-text :nodes="detailObj.noticeContent"></rich-text>
      </view>
    </view>
  </view>
</template>

<script>
import { getNoticeDetail } from "../../service/knowledgeBase"
export default{
  data(){
    return{
      detailObj:{
        title:'',
        createTime:'',
        noticeContent:''
      },
      noticeId:''
    }
  },
  onLoad(option){
    console.log(option)
    this.noticeId = option.noticeId
    this.getDetail()
  },

  methods:{
    getDetail(){
      let params = {
        data:{
          noticeId: this.noticeId
        },
        header: {
          'content-type': 'application/json'
        },
      }
      getNoticeDetail(params).then(res =>{
        if(res.status==200){
          this.detailObj = res.data.notice
        }
      })
    }
  }

}
</script>

<style scoped lang="scss">
.page-box{
  padding: 24rpx;
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  background-color: #f9f9f9;
}
.content{
  padding: 10rpx;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  .title{
    padding: 14rpx;
    font-size: 28rpx;
    font-weight: bold;
  }
  .time{
    font-size: 24rpx;
    color: #999;
    border-bottom: 1rpx solid #eee;
    padding: 10rpx 14rpx 24rpx;
    margin-bottom: 24rpx;
  }
}
.main-text{
  padding: 0 10rpx 10rpx;
}
</style>