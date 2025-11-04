<template>
  <view class="list-item" @click="toDetail(itemData)">
    <view class="order-header">
      <uni-icons v-if="checkactive && !isChecked" type="circle" size="50rpx" color="#999999"></uni-icons>
      <uni-icons v-if="checkactive && isChecked" type="checkbox" size="50rpx" color="#0064FF"></uni-icons>
      <view class="order-title">{{ itemData.taskTypeName }}</view>
      <view class="order-type">{{ itemData.taskStateName }}</view>
    </view>
    <view class="order-desc" v-if="itemData.taskDesc">{{ itemData.taskDesc }}</view>
    <view>
      <view class="order-common-text" v-if="itemData.contactName || itemData.contactPhone">{{ itemData.contactName }} {{itemData.contactName && itemData.contactPhone ? ' | ' : ''}} {{ itemData.contactPhone || '' }}</view>
      <view class="order-common-text" v-if="itemData.location">{{ itemData.location }}</view>
      <view class="order-common-text">
        {{ filterData(itemData.createDate) }}
        <view class="order-state">{{ getOverDate(itemData) }}</view>
      </view>
    </view>
    <view v-if="!checkactive && action" class="order-btn">
      <view v-if="JSON.parse(itemData.operateBtn).some((item) => item.btnName == '派单') && itemData.userType == '1'" class="c-btn btn-1" @click.stop="handleSubmit('1')">派单</view>
      <view v-if="JSON.parse(itemData.operateBtn).some((item) => item.btnName == '领单' || item.btnName == '接单')" class="c-btn btn-2" @click.stop="handleSubmit('2')">领单</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    itemData: Object,
    action: {
      type: Boolean,
      default: true,
    },
    isChecked: {
      type: Boolean,
      default: true,
    },
    checkactive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    filterData(value) {
      return this.$dayjs(value).format('YYYY-MM-DD');
    },
    getOverDate(itemData) {
      if (itemData.taskState == 0 && itemData.giveoutDeadline && this.$dayjs().isAfter(this.$dayjs(itemData.giveoutDeadline))) {
        // 待派单
        let str = this.setDate(itemData.giveoutDeadline);
        return '｜派单超期' + str;
      }
      if (itemData.taskState == 1 && itemData.acceptDeadline && this.$dayjs().isAfter(this.$dayjs(itemData.acceptDeadline))) {
        // 待接单
        let str = this.setDate(itemData.acceptDeadline);
        return '｜接单超期' + str;
      }
      if (itemData.taskState == 2 && itemData.finishDeadline && this.$dayjs().isAfter(this.$dayjs(itemData.finishDeadline))) {
        // 待处理
        let str = this.setDate(itemData.finishDeadline);
        return '｜处理超期' + str;
      }
      if (itemData.taskState == 3 && itemData.closeDeadline && this.$dayjs().isAfter(this.$dayjs(itemData.closeDeadline))) {
        // 待关闭
        let str = this.setDate(itemData.closeDeadline);
        return '｜关闭超期' + str;
      }
      if (itemData.taskState == 6 && itemData.approveDeadline && this.$dayjs().isAfter(this.$dayjs(itemData.approveDeadline))) {
        // 待审核
        let str = this.setDate(itemData.approveDeadline);
        return '｜审核超期' + str;
      }
    },
    setDate(date) {
      let diffMinuets = this.$dayjs().diff(date, 'minutes');
      if (diffMinuets < 60) {
        // 不满一小时
        return diffMinuets + '分钟';
      } else if (diffMinuets < 24 * 60) {
        // 不满一天
        let hours = parseInt(diffMinuets / 60);
        let minutes = diffMinuets % 60;
        return hours + '小时' + minutes + '分钟';
      } else {
        let days = parseInt(diffMinuets / (24 * 60));
        let hours = parseInt((diffMinuets - 24 * 60 * days) / 60);
        let minutes = diffMinuets - 24 * 60 * days - 60 * hours;
        return days + '天' + hours + '小时' + minutes + '分钟';
      }
    },
    toDetail(item) {
      if(this.checkactive){
        this.$emit('updateCheck', this.itemData)
        return
      }
      uni.navigateTo({
        url: '/pages-order/order/detail?quesTaskId=' + item.quesTaskId,
      });
    },
    handleSubmit(btnType) {
      let operateBtn = JSON.parse(this.itemData.operateBtn);
      let btnObj = {};
      operateBtn.forEach((item) => {
        if (item.btnName == '派单' && btnType == '1') {
          btnObj = item;
        } else if ((item.btnName == '领单' || item.btnName == '接单') && btnType == '2') {
          btnObj = item;
        }
      });
      localStorage.setItem('btnInfo', JSON.stringify(btnObj));
      uni.navigateTo({
        url: '/pages-order/order/batchOperation?quesTaskId=' + this.itemData.quesTaskId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list-item {
  padding: 30rpx;
  background: #ffffff;
  border-radius: 12rpx;
  margin: 0 20rpx 20rpx 20rpx;
  .order-header {
    display: flex;
    align-items: center;
    column-gap: 12rpx;
    padding: 4rpx 0;
    .order-title {
      flex: 1;
      font-size: 30rpx;
      font-weight: bold;
      color: #333333;
    }
    .order-type {
      font-size: 24rpx;
      color: #ff9900;
    }
  }
  .order-desc {
    padding: 16rpx 0 0;
    font-size: 30rpx;
    color: #333333;
  }

  .order-common-text {
    display: flex;
    font-size: 26rpx;
    padding-top: 8rpx;
    color: #666666;
    &:first-child {
      padding-top: 40rpx;
    }
  }
  .order-state {
    display: inline;
    color: #ff0000;
  }

  .order-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 24rpx;

    .c-btn {
      display: inline-block;
      padding: 10rpx 36rpx;
      border-radius: 28rpx;
      font-size: 24rpx;
      text-align: center;
    }
    .btn-1 {
      margin-right: 12px;
      border: 1rpx solid #fe9901;
      color: #fe9901;
    }
    .btn-2 {
      border: 1rpx solid #2761ff;
      color: #2761ff;
    }
  }
}
</style>
