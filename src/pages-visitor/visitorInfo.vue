<template>
  <view class="container">
    <view class="form">
      <view class="field">
        <text class="leftLabel">到访地址</text>
        <text class="rightLabel">{{visitorAddress}}</text>
      </view>
      <view class="field">
        <text class="leftLabel">访客姓名</text>
        <text class="rightLabel">{{visitorName}}</text>
      </view>
      <view class="field">
        <text class="leftLabel">访客电话</text>
        <text class="rightLabel"> {{ visitorPhone }}</text>
      </view>
      <view class="field">
        <text class="leftLabel">来访时间</text>
        <text class="rightLabel">{{ arrivalTime }}</text>
      </view>
      <view class="field">
        <text class="leftLabel">来访事由</text>
        <text class="rightLabel">{{ arrivalReason }}</text>
      </view>
      <view class="field">
        <text class="leftLabel">车牌号</text>
        <text class="rightLabel">{{ carNumber }}</text>
      </view>
    </view>
    <u-button v-if="status==1" class="button" @click="submit">放行</u-button>
  </view>
</template>
  
<script>
  import {
    getVisitorDetail,passThrough 
  } from '@/service/wxmanage'
  export default {
    data() {
      return {
        canSubmit:true,
        visitorAddress: '',
        visitorName: '',
        visitorPhone: '',
        arrivalTime: '',
        arrivalReason: '',
        carNumber: '',
        recordId:'',
        status:''
      };
    },
    onLoad(options) {
      this.recordId = options.recordId
      this.requestInfo();
    },
    methods:{
      requestInfo(){
        let self = this;
        getVisitorDetail(this.recordId).then(res=>{
          if(res.status == '200') {
            let data = res.data;
            self.visitorName = data.name;
            self.visitorPhone = data.phone;
            self.arrivalTime = data.visitTime;
            self.arrivalReason = data.reason;
            self.visitorAddress = data.roomInfo;
            self.carNumber = data.carNumber;
            self.status = data.status

          } else {
            uni.showToast({
              title: res.message,
              duration: 2000,
              icon: 'none',
            });
          }
        })
      },
      //放行
      submit(){
        const { O_USER_INFO } = this.$constant
        const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
        const params = {
          data: {
            "recordId": this.recordId,
            userId:userInfo.userId,
            userName:userInfo.userName
          }
        }  
        
        let self = this;
        passThrough(params).then(res => {
          if(res.status == '200') {
            uni.showToast({
              title: '操作成功',
              duration: 2000,
              icon: 'none',
            });
            self.requestInfo();
          }
          else {
            uni.showToast({
              title: res.message,
              duration: 2000,
              icon: 'none',
            });
          }
        })
      }
    }
  };
</script>
  
  <style scoped>
  .container {
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    height: 100vh;
  }
  .form {
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: flex-start;
  }

  .field {
    width: 100%;
    height: 104rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom-style: solid;
    border-width: 1rpx;
    border-color: #ebebeb;
  }
  
  .leftLabel {
    margin-left: 40rpx;
    margin-right: 100rpx;
    font-size: 32rpx;
    min-width: 128rpx;
  }

  .rightLabel{
    font-size: 32rpx;
  }
 
  button {
    margin-top: 82rpx;
    width: 300rpx !important;
    height: 66rpx;
    background-color: blue !important;
    color: white !important;
    border-radius: 30rpx !important;
    font-size: 30rpx;
  }
  </style>
  