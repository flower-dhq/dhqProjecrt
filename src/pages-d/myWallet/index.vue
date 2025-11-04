<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="car_box">
      <image class="car_box_bg" :src="require(`@/static/${[THEME_NAME]}/multiplexing/wallet-card1.png`)" v-if="type == '1'"></image>
      <image class="car_box_bg" :src="require(`@/static/${[THEME_NAME]}/multiplexing/wallet-card2.png`)" v-if="type == '2'"></image>
      <view class="all_content">
        <view class="title">账户余额(元)</view>
        <view class="num">{{ balanceNum }}</view>
        <view class="btn_box">
          <view class="cha_btn">充值</view>
        </view>
      </view>
    </view>
    
    <view class="tabs">
      <view class="box" :class="changeType === ''?'box_select':''" @click="changeSelect('')">全部</view>
      <view class="box" :class="changeType === '1'?'box_select':''" @click="changeSelect('1')">收入</view>
      <view class="box" :class="changeType === '0'?'box_select':''" @click="changeSelect('0')">支出</view>
    </view>
    <view class="all_list">
      <view class="box" v-for="(item,index) in  historyList" :key="index">
        <view class="box_tle" @click="changeShow(item.height,item)">
          <text class="txt1">{{item.timeb}}</text>
          <text class="txt2">年</text>
          <text class="txt1">{{item.timee}}</text>
          <text class="txt2">月</text>
          <image class="img1" :src="require(`@/static/${[THEME_NAME]}/multiplexing/icon-array.png`)"></image>
        </view>
        <view class="list_all" :style="{height:item.height}">
          <view class="box_all" v-for="(tab,inx) in item.childrenList" :key="inx">
            <view class="top">
              <view class="type_txt">{{tab.source}}</view>
              <view class="num_txt">
                <text class="txt1">+</text>
                <text class="txt1">{{ tab.amount }}</text>
              </view>
            </view>
            <view class="bottom">{{tab.createTime}}</view>
          </view>
        </view>
      </view>
      <view v-if="historyList.length==0" class="nodata"></view>
    </view>
  </view>
</template>

<script>
import { getAccountBalance,getAppWalletDetailsList } from '@/service/community'
import Utils from '@/js/utils'

export default {
  data() {
    return {
      type:'',//1个人钱吧2企业钱包
      changeType:'',
      memberId:'',
      ownerId:'',
      employeeId:'',//企业会员id
      userType:'',//用户身份
      userTypeChange:'',//用户身份转化后
      balanceNum:'0',
      historyList:[],
    }
  },
  onLoad() {
    //没有认证过的，就是会员，有房产的就是业主，看下业主端是怎么判断显示企业员工或企业联系人的
    this.type = '1'
    const { MEMBER_ID,O_USER_INFO,USER_TYPE_NUM } = this.$constant;
    this.memberId = Utils.storageAction({ key: MEMBER_ID, action: 'get' });
    this.userType = Utils.storageAction({ key: USER_TYPE_NUM, action: 'get' });
    let data = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
    this.ownerId = data.ownerId || ''
    console.log(this.memberId,data,this.userType,'data===============')
    if([8].includes(this.userType)){//会员
      this.userTypeChange = 1
    }else if([2,1,3,10,11,13,14,15].includes(this.userType)){
      this.userTypeChange = 2
    }else if([6,9].includes(this.userType)){//企业员工
      this.userTypeChange = 3
    }
    // this.employeeId = data
    this.getAccountBalanceData()
    this.getAppWalletDetailsListData()
  },
  methods: {
    changeShow(height,item){
      let newH = height == 'unset' ? '0' : 'unset'
      this.$set(item,'height',newH)
    },
    getAccountBalanceData(){
      let params = {
        data:{
          memberId:this.memberId,
          ownerId:this.ownerId,
          employeeId:'',//企业员工id
          userType:this.userTypeChange,//用户身份
        }
      }
      getAccountBalance(params).then(res=>{
        if(res.status == 200){
          this.balanceNum = res.data || 0
        }else{
          this.balanceNum = 0
        }
      })
    },
    getAppWalletDetailsListData(){
      let params = {
        data:{
          memberId:this.memberId,
          ownerId:this.ownerId,
          employeeId:'',//企业员工id
          userType:this.userTypeChange,//用户身份
          integralType:this.changeType,//类型:0支出，1收入
        }
      }
      getAppWalletDetailsList(params).then(res=>{
        if(res.status == 200){
          this.historyList = this.dataSort(res.data)
        }else{
          this.historyList = []
        }
      })
    },
    //数据处理
    dataSort(obj){
      let list = []
      for(var key in obj){
        list.push({
          timeb:(key+'').split('-')[0],
          timee:(key+'').split('-')[1],
          height:'unset',
          childrenList:obj[key],
        })
      }
      return list
    },
    changeSelect(type){
      this.changeType = type
      this.getAppWalletDetailsListData()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .u-image {
  margin: 0 auto;
}
.page-panel{
  width: 100%;
  box-sizing: border-box;
  padding:20rpx;
  background: #F6F6F6;
  min-height: 100%;
}
.car_box{
  width: 100%;
  position: relative;
  height: 388rpx;
  .car_box_bg{
    width: 100%;
    height: 388rpx;
    position: absolute;
    left: 0;
    top: 0;
  }
  .all_content{
    width: 100%;
    position: relative;
    box-sizing: border-box;
    padding: 44rpx 40rpx 0;
    .title{
      padding-top: 30rpx;
      font-size: 36rpx;
      color:#fff;
      font-weight: bold;
      height: 50rpx;
      display: flex;
      align-items: center;
    }
    .num{
      font-size: 60rpx;
      color: #fff;
      padding-top: 20rpx;
      height: 84rpx;
      display: flex;
      align-items: center;
    }
    .btn_box{
      width: 100%;
      display: flex;
      justify-content: flex-end;
      .cha_btn{
        width: 240rpx;
        height: 80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FFf;
        border-radius: 40rpx;
        cursor: pointer;
        font-size: 30rpx;
        margin-top: 40rpx;
      }
    }
  }
}
.tabs{
  display: flex;
  align-items: center;
  padding: 38rpx 0 28rpx;
  .box{
    font-size: 32rpx;
    line-height: 44rpx;
    padding-right: 80rpx;
  }
  .box_select{
    color: #C8924B;
  }
}
.all_list{
  width: 100%;
  .box{
    width: 100%;
    background: #fff;
    padding: 30rpx 30rpx 0 30rpx;
    box-sizing: border-box;
    border-radius: 20rpx;
    margin-bottom: 10rpx;
    overflow: hidden;
    .box_tle{
      display: flex;
      align-items: flex-end;
      padding-bottom: 30rpx;
      border-bottom: 1px solid #EAEAEA;
      .txt1{
        font-size: 36rpx;
        font-weight: bold;
        line-height: 40rpx;
        // color: #000;
      }
      .txt2{
        font-size: 24rpx;
      }
      .img1{
        width: 28rpx;
        height: 28rpx;
        transform: rotate(90deg);
        position: relative;
        top: -6rpx;
        margin-left: 8rpx;
      }
    }
    .list_all{
      width: 100%;
      .box_all{
        width: 100%;
        border-bottom: 1px solid #EAEAEA;
        .top{
          display: flex;
          justify-content: space-between;
          padding-top: 20rpx;
          align-items: center;
          .type_txt{
            font-size: 30rpx;
            line-height: 42rpx;
          }
          .num_txt{
            display: flex;
            justify-content: flex-end;
            .txt1{
              font-size: 36rpx;
              color: #C8924B;
            }
          }
        }
        .bottom{
          padding-top: 20rpx;
          padding-bottom: 20rpx;
          line-height: 32rpx;
          font-size: 22rpx;
          color: #D8D8D8;
        }
      }
    }
  }
}
.nodata {
    height: calc(100vh - 60rpx);
    background-size: 175px;
    position: relative;
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