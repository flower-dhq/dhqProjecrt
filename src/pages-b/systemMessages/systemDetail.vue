<template>
  <view id="announcement-detail-page">
    <view class="announcement-article">
      <view class="title">{{ messageDetail.title }}</view>
      <view class="stemDate">{{ messageDetail.pushDate }}</view>
      <view  class="textcontent" v-if="messageDetail.content">
        {{ messageDetail.content }}
      </view>
      <view class="content"  v-if="messageDetail.newContent" v-html="messageDetail.newContent"></view>
      <!-- <view id="htmlDataId" class="content" v-if="messageDetail.newContent"> -->
      <!-- </view> -->
    </view>
  </view>
</template>

<script>
import {  getMassPushById } from '../../service/wxmanage'
export default {
  name: "MessageDetail",
  data() {
    return {
      messageDetail:{}
    };
  },
  onLoad(options) {
    this.getMassPushById(options.id)
    // let par = JSON.parse(decodeURIComponent(options.para)); 
    // console.log(24,options,par)
    // this.messageDetail = par
    // if(this.messageDetail.newContent){
    //   document.getElementById("htmlDataId").innerHTML = this.messageDetail.newContent;
    // }
  },

  computed: {
    /**
     * 消息时间
     */
    // msgDate() {
    //   let res
    //   let self = this
    //   if(this.messageDetail.createDate){
    //    res = self.formatDuring(parseInt(this.messageDetail.createDate)) || ''
    //   }
    //   return res;
    // },
  },
  methods: {
    //获取详情
    getMassPushById(id){
      let params = {
        pathParams:id
      }
      getMassPushById(params).then(res =>{
        if(res.status=='200'){
          this.messageDetail = res.data.mediaDetail
          this.messageDetail.pushDate = res.data.pushDate ? this.formatDuring(res.data.pushDate) : ''
          this.messageDetail.newContent = res.data.newContent ? res.data.newContent : ''
        }
      })
    },
    add0(m){ // 将后台毫秒转换成时间和日期;
      return m < 10 ? '0' + m : m;
    },
    formatDuring(date){  // 将后台毫秒转换成时间和日期;
      let time = new Date(date);
      let y = time.getFullYear();
      let m = time.getMonth()+1;
      let d = time.getDate();
      let h = time.getHours();
      let mm = time.getMinutes();
      let s = time.getSeconds();
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm)+ ':' + this.add0(s);
    },
  }
};
</script>

<style scoped>
#announcement-detail-page {
  height: 100vh;
  background: #f5f5f5;
  -webkit-overflow-scrolling: touch;
  overflow: scroll;
  padding: 10px;
}
.announcement-article {
  padding: 15px;
  background: #ffffff;
  border-radius: 8px;
}
.title {
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
}
.stemDate {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  margin: 4px 0 12px 0;
}
.textcontent {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
  word-wrap: break-word;
  word-break: break-all;
}
.content {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
}
</style>
