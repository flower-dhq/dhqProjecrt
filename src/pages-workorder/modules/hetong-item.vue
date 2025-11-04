<template>
  <view :class="getBoxClass" @click="goDetailPage(data)">
    <view :class="['title-line',isShowFlag?'':'mar-b']" >
      <text class="title">
        {{isShowFlag == 'room'?data.houseRooms:isShowFlag == 'pay'?data.contractName:isShowFlag == 'car'?data.parkingNumber:data.resourceNames }}
      </text>
      <text class="state" :class="[data.contractStatusDesc == '已终止'||data.contractStatusDesc == '已废弃'||data.contractStatusText == '已终止'||data.contractStatusText == '已废弃'||data.contractStatus == '已终止'||data.contractStatus == '已废弃'?'grey':'']">
        {{ isShowFlag == 'car' ? data.contractStatusDesc : data.contractStatusText || data.contractStatus }}{{data.surrenderTenancy=='1'?'（提前退租）':''}}{{data.expireFlag=='1' || data.toExpire  == 1?'（即将过期）':''}}
      </text>
    </view>
    <view class="pf-line" v-if="isShowFlag == 'room'">
      <view class="icon">
        <image class="img-icon" :src="require(`@/static/${[THEME_NAME]}/hetong/icon-zong.png`)" />
        <text>{{data.buildArea}}m²</text>
      </view>
      <view class="icon">
        <image class="img-icon" :src="require(`@/static/${[THEME_NAME]}/hetong/icon-fen.png`)" />
        <text>{{data.publicArea}}m²</text>
      </view>
      <view class="icon">
        <image class="img-icon" :src="require(`@/static/${[THEME_NAME]}/hetong/icon-ji.png`)" />
        <text>{{data.rateArea}}m²</text>
      </view>
    </view>
    <view class="company-line">
      <text style="margin-right: 16rpx;">{{data.serialNumber}}</text>
      <text>{{data.customerName}}</text>
      <text v-if="data.vehicleLicenseNumber" style="margin-left: 16rpx;">| {{data.vehicleLicenseNumber}}</text>
    </view>
    <view class="time-line">
      <view>
        <text v-if="isShowFlag == 'car'">{{data.createDate}}</text>
        <text v-else>{{data.minStartDate || data.startDate}}-{{data.maxEndDate || data.actualEndDate || data.endDate}}</text>
      </view>
      <view class="time-btn" v-if="isShowFlag == 'pay'">
        <view class="btn" v-if="data.approveStatus" :class="[data.approveStatus == '待提交'?'red':'',data.approveStatus == '1'?'yellow':'',data.approveStatus == '审批通过'?'green':'',data.approveStatus == '3'?'purple':'',]">{{data.approveStatus}}</view>
      </view>
      <view class="time-btn" v-else-if="isShowFlag == 'car'">
        <view class="btn blue" :class="[data.saleFlag == '2'?'green':'',data.saleFlag == '0'?'blue':'',data.saleFlag == '1'?'yellow':'',]" style="margin-right: 20rpx;">{{data.saleFlagText}}</view>
        <view class="btn" :class="[data.approveStatus == '0'?'red':'',data.approveStatus == '1'?'yellow':'',data.approveStatus == '2'?'green':'',data.approveStatus == '3'?'purple':'',]">{{data.approveStatusDesc}}</view>
      </view>
      <view class="time-btn" v-else>
        <view class="btn blue" v-if="data.subletFlag == '1'" style="margin-right: 20rpx;">转租</view>
        <view class="btn" v-if="data.approveStatus" :class="[data.approveStatus == '0'?'red':'',data.approveStatus == '1'?'yellow':'',data.approveStatus == '2'?'green':'',data.approveStatus == '3'?'purple':'',]">{{data.approveStatusText}}</view>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
export default {
  name: "HetongItem",
  props: {
    class: {
      type: [String, Array],
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    },
    isShowFlag: {
      type: String,
      default: 'room'
    }
  },
  data() {
    return {}
  },
  computed: {
    getBoxClass() {
      return ['workorder-sheet'].concat(this.class)
    }
  },
  methods: {
    goDetailPage(item) {
      let url;
      if (this.isShowFlag == 'room') {
        url = `/pages-workorder/contract/contractDetailRoom?serialNumber=${item.serialNumber}`
      }else if(this.isShowFlag == 'pay') {
        url = `/pages-workorder/contract/contractDetailPay?serialNumber=${item.serialNumber}`
      }else if(this.isShowFlag == 'ziyuan') {
        url = `/pages-workorder/contract/contractDetailZy?serialNumber=${item.serialNumber}`
      }else {
        url = `/pages-workorder/contract/contractDetailCar?serialNumber=${item.serialNumber}`
      }
      uni.navigateTo({
        url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.workorder-sheet {
  @include flx-dsp(flex-start, flex-start, column);
  background-color: #fff;
  border-radius: 12rpx;
  font-family: "PingFang SC";
  padding: 30rpx 24rpx 16rpx;
}

.title-line {
  width: 100%;
  @include flx-dsp(space-between, center, row);
  margin-bottom: 10rpx;
  .title {
    font-size: 30rpx;
    color: #333;
    font-weight: bold;
  }
  .state {
    width: 270rpx;
    text-align: right;
    font-size: 28rpx;
    color: #FF8A15;
    flex-shrink: 0;
  }
}

.mar-b {
  margin-bottom: 8rpx;
}
.pf-line {
  width: 100%;
  display: flex;
  margin-top: 20rpx;
  margin-bottom: 12rpx;
  .icon {
    font-size: 28rpx;
    color: #666;
    display: flex;
    align-items: center;
    margin-right: 80rpx;
  }
}
.company-line {
  width: 100%;
  font-size: 28rpx;
  color: #666;
  height: 36px;
  line-height: 36px;
  border-bottom: 1px solid #EBEBEB;
  margin-bottom: 4rpx;
}

.time-line {
  width: 100%;
  @include flx-dsp(space-between, center, row);
  font-size: 26rpx;
  color: #666;
  height: 36px;
  line-height: 36px;
  .time-btn {
    display: flex;
    .btn {
      height: 30rpx;
      line-height: 30rpx;
      padding: 8rpx;
      font-size: 22rpx;
      border-radius: 6rpx;
      &.blue {
        color: #1989F7;
        background-color: #e6f3fe;
      }
      &.green {
        color: #16CE92;
        background-color: #e6faf4;
      }
      &.red {
        color: #FC0B0B;
        background-color: #ffe6e7;
      }
      &.yellow {
        color: #FF8A15;
        background-color: #fff3e8;
      }
      &.purple {
        color: #858BFF;
        background-color: #f3f3ff;
      }
      &.ngreen {
        color: #20CFE7;
        background-color: #f0f2f5;
      }
      &.grey {
        color: #999;
        background-color: #ebebeb;
      }

    }
  }
}

.grey {
  color: #999 !important;
}

.img-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
}
</style>
