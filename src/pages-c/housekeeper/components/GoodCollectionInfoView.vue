<template>
  <view class="parent-list">
    <image class="list-img" src="/static/housekeeper/express_icon.png"/>
    <view class="parent-column">
      <view v-for="(record, index) in collectionInfo1.expressRecords" style="width: 100%;" :key="index">
        <view v-show="index>0">
          <text class="divider-vertical-view"></text>
        </view>
        <view class="parent-row">
          <text :class="!record.isAdditional?'index-text-select':'index-text'">{{index + 1}}</text>
          <view class="item-value">
            <text :class="record.isDone?'value-text-select':'value-text'">
              {{showStatus(record,collectionInfo1)}}
            </text>
          </view>
          <text class="value-text">{{record.operateDate}}</text>
        </view>
      </view>
      <text class="tip-style">{{tipStatus}}</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'GoodCollectionInfoView',
    data() {
      return {
        tipStatus:'',
        collectionInfo1:{}
      }
    },
    props:{
      collectionInfo: {
        type: Object,
        default: {},
      },
    },
    created() {
      this.collectionInfo1 = this.collectionInfo
    },
    methods: {//(0:待接收，1:已签收，2:已代收，3:已拒收，4:已关闭)
      showStatus(record,collectionInfo){
        let value = record.status
          if (value === 0){
            this.tipStatus = "请耐心等待";
            return '已通知';
          } else if (value === 1){
            this.tipStatus = "已签收，祝您生活愉快";
            return '已签收';
          } else if (value === 2){
            this.tipStatus = "无异常，请于18:00之前来领取";
            return '已代收';
          } else if (value === 3){
          if (collectionInfo.reason) {
            this.tipStatus = collectionInfo.reason;
          }else {
            this.tipStatus = "由于特殊原因，快递已拒收";
          }
            return '已拒收';
          } else if (value === 4){
            this.tipStatus = "当天未收到快递";
            return '已关闭';
          }
      }
    }
  }
</script>

<style scoped lang="scss">
  .tip-style{
    margin-left: 88rpx;
    font-size: 28rpx;
    margin-top: 10rpx;
    color: gray;

  }
  .parent-list{
    display: flex;
    flex-direction: row;
    padding: 20rpx;
    align-items: center;
    .list-img {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-self: center;
    }
  }
  .parent-row{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .parent-column{
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: 60rpx;
  }
  .index-text{
    display: flex;
    width: 40rpx;
    height: 40rpx;
    font-size: 28rpx;
    justify-content: center;
    align-items: center;
    color: white;
    border-style: solid;
    border-width: 2rpx;
    border-color: #B8B8B8;
    border-radius: 20rpx;
    background: #B8B8B8;
  }
  .index-text-select{
    display: flex;
    width: 40rpx;
    height: 40rpx;
    font-size: 28rpx;
    justify-content: center;
    align-items: center;
    color: white;
    border-style: solid;
    border-width: 2rpx;
    border-color: #D5A864;
    border-radius: 20rpx;
    background: #D5A864;
  }
  .value-text{
    display: flex;
    font-size: 28rpx;
    color: #666666;
  }
  .value-text-select{
    display: flex;
    font-size: 28rpx;
    color: #333333;
  }
  .divider-vertical-view {
    display: flex;
    width: 2rpx;
    height: 20rpx;
    margin-left: 20rpx;
    background: #B8B8B8;
  }
  .divider-view {
    display: flex;
    flex: 1;
    height: 2rpx;
    margin-left: 40rpx;
    margin-right: 40rpx;
    background: #B8B8B8;
  }
  .item-value {
    display: flex;
    margin-left: 40rpx;
    flex: 1;
  }
</style>
