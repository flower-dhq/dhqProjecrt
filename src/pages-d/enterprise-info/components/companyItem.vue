<style lang="scss" scoped>
.list_cont{
  padding: 20rpx 0 0;
}
.company_item{
  margin-bottom: 20rpx;
  padding: 12rpx 44rpx;
  background-color: #fff;
  .company_title{
    padding: 20rpx 0;
    overflow: hidden;
    font-size: 30rpx;
    color: #333333;
    font-weight: bold;
    .l_name{
      float: left;
    }
    .r_state{
      float: right;
      padding: 6rpx 20rpx;
      border-radius: 24rpx;
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
  .reason{
    word-break: break-all;
    white-space: break-spaces;
      text{
       color: #999;
       font-size: 24rpx;
       }
    }
}
</style>
<template>
  <view class="list_cont" v-if="companyList.length>0" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="company_item" v-for="(item,i) in companyList" :key='i' @click="seletCompany(item)">
      <view class="company_title">
        <text class="l_name">{{item.name}}</text>
          <text class="r_state" v-if='item.applyStatus==0'>审核中</text>
        <text class="r_state approve_label" v-if='item.applyStatus==1 || item.applyStatus==3 || item.applyStatus==4'>已认证</text>
        <text class="r_state refuse_label" v-if='item.applyStatus==2'>已拒绝</text>
        <text class="r_state refuse_label" v-if='item.applyStatus==5'>已取消</text>
      </view>
      <view class="reason" v-if="item.applyStatus==2 && item.rejectReason">
             <text>拒绝原因：{{ item.rejectReason }}</text>
        </view> 
    </view>
  </view>
</template>
<script>
export default {
  props:['companyList','onlyShow'],
  methods:{
    seletCompany(item){
      if(!this.onlyShow){
        this.$emit('company-info', item)
      }
    },
  }
}
</script>
