<style scoped lang="scss" >
.staff_info_cont{
  padding:0 30rpx 20rpx;
  border-radius: 16rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
  .top_cont{
    overflow: hidden;
    padding: 30rpx 0 20rpx;
    .info_label{
      float: left;
      font-size: 30rpx;
      font-weight: bold;
      color:#333
    }
    .state_label{
      float: right;
      padding: 6rpx 20rpx;
      border-radius: 22rpx;
      font-size: 24rpx;
      color: #44BCFE;
      background-color: #ECF8FF;
    }
    .refuse_label{
      color: #999;
      background-color: #f2f2f2;
    }
    .approve_label{
      color: #21C743;
      background-color: #E8F9EC;
    }
    .other_label{
      color: #C8924B;
      background-color: #C8924B1f;
    }
  }
  .center_cont{
    font-size: 24rpx;
    color: #666;
    padding-bottom: 16rpx;
  }
  .btn_cont{
    text-align: right;
    button{
      display: inline-block;
      width: 144rpx;
      border-radius: 8rpx;
      font-size: 28rpx;
    }
    .refuse_btn{
      color: #aaa;
      margin-right: 10rpx;
      background-color: #fff;
    }
    .approve_btn{
      color: #fff;
      background-color: var(--app-primary-color);
    }
  }
}
.center_conts {
  font-size: 24rpx;
    color: #666;
    padding-bottom: 16rpx;
    display: flex;
    align-items: baseline;
  .center_title {
    flex: 1;
    line-height: 45rpx;
    font-size: 24rpx;
    color: #666;
    word-wrap: break-word;
    word-break: break-all;
}
}
.all_wa{
  display: flex;
  align-items: center;
  .car_box_bg{
    width: 40rpx;
    height: 40rpx;
  }
  .txt{
    font-size: 28rpx;
    padding: 0 14rpx 0 20rpx;
  }
  .btn_set{
    width: 80rpx;
    height: 34rpx;
    font-size: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 10rpx;
    background: #C8924B;
    cursor: pointer;
  }
  .btn_set_long{
    background: #999999;
    width: 128rpx;
  }
}
.all_bottom{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
<template>
  <view>
    <view class="staff_info_cont" v-for="(item,i) in staffInfoList" :key="i" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
      <view class="top_cont">
        <text class="info_label">{{item.employeeName}}：{{item.phoneNumber}}</text>
        <text class="state_label" v-if='item.applyStatus==0'>审核中</text>
        <text class="state_label approve_label" v-if='item.applyStatus==1 || item.applyStatus==3 || item.applyStatus==4'>已通过</text>
        <text class="state_label refuse_label" v-if='item.applyStatus==2'>已拒绝</text>
        <text class="state_label refuse_label" v-if='item.applyStatus==5'>已取消</text>
        <text class="state_label refuse_label" :class="{'other_label':item.employeeStatusName=='在职'}" v-if='item.employeeStatusName'>{{item.employeeStatusName}}</text>
      </view>
      <view class="center_cont">
        <text v-if="item.department">所在部门：{{item.department}}</text>
      </view>
      <view class="center_conts">
        <text v-if="item.rejectReason && item.applyStatus==2">拒绝理由：</text><text class="center_title">{{item.rejectReason}}</text>
      </view>
      <view class="all_bottom">
        <view class="all_wa">
        <image class="car_box_bg" :src="require(`@/static/${[THEME_NAME]}/multiplexing/icon-wallet.png`)"></image>
          <view class="txt">企业钱包</view>
          <view class="btn_set" @click="ischeck(item.employeeId,item.employeeName,'1')" v-if="item.walletAuthorizeType == 0">授权</view>
          <view class="btn_set btn_set_long" @click="cancalcheck(item.employeeId,item.employeeName,'2')" v-else>取消授权</view>
        </view>
        <view class="btn_cont" v-show='item.applyStatus==0'>
          <button class="refuse_btn" @click="examineApply(item.id,2)">拒绝</button>
          <button class="approve_btn" @click="examineApply(item.id,1)">通过</button>
        </view>
        <view class="btn_cont" v-if='item.applyStatus==1 || item.applyStatus==3 || item.applyStatus==4'>
          <button class="refuse_btn" @click="examineApply(item.id,0)">离职</button>
        </view>
      </view>
    </view>

  </view>
  
</template>

<script>
export default {
  props:['staffInfoList'],
  
  methods:{
    examineApply(id,state){
      this.$emit('getStaffInfo',id,state)
    },
    ischeck(id,employeeName,type){
      this.$emit('authorityThat',id,employeeName,type)
    },
    cancalcheck(id,employeeName,type){
      this.$emit('authorityThat',id,employeeName,type)
    },
  }
}
</script>
