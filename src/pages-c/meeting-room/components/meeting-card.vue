<template>
  <view class="meeting-card flex-row">
    <!-- 图片 -->
    <u--image width="80px" height="80px" radius="6px" fit="cover" class="card-image flex-fixed" :src="data.mainResPath"></u--image>
    <view class="flex-column flex-stretch">
      <!-- 会议厅名称 -->
      <h3 class="card-title ellipsis-one">{{ data.meetingName }}</h3>
      <view class="card-flag">
        <!-- 楼层 -->
        <text>{{ data.floorNum }}层</text>
        <text>最多可容纳{{ data.capacity }}人</text>
      </view>
      <view class="flex-row align-bottom">
        <view class="card-tag">
          <!-- 标签 -->
          <u-tag color="#fdf2e2" text-color="#f5c47b" v-for="(tag, index) in data.typeListFront" :key="index">{{ tag }}</u-tag>
        </view>
        <view class="meeting-price">
          <!-- <text class="price-12">{{ isSign ? '￥' : '' }}</text> -->
          <text class="price-12">￥</text>
          <text class="price-22">{{ getTotalPrice }}</text>
          <text class="price-12">{{ getPriceUnit }}</text>
        </view>
        <!-- <meeting-price :number="getTotalPrice" :suffix="getPriceUnit" /> -->
      </view>
    </view>
  </view>
</template>

<script>
// import MeetingPrice from './meeting-price.vue'

/**
 * 会议厅列表
 */
export default {
  name: 'MeetingCard',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    // MeetingPrice
  },
  computed: {
    // 获取价格
    getTotalPrice() {
      // chargesType: 收费标准 （0.按时段收费、1.按天首费）
      return this.data.chargesType === 0 ? this.data.timeCost : this.data.priceByDay
    },
    // 获取价格的单位
    getPriceUnit() {
      return this.data.chargesType === 0 ? '/小时' : '/天'
    }
  }
}
</script>

<style lang="scss" scoped>
/* @import "../style/meeting-style.scss"; */
// flex，水平
.flex-row {
  display: flex;
}
// flex，垂直
.flex-column {
  @extend .flex-row;
  flex-direction: column;
}
// flex，自由伸缩
.flex-stretch {
  flex: 1;
  overflow: hidden;
  margin-left: 14px;
}
// flex，固定大小
.felx-fixed {
  flex-grow: 0;
  flex-shrink: 0;
}
// 一行省略
.ellipsis-one {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meeting-card {
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 15px 13px;
  margin: 0 10px 10px 10px;
}
.card-image {
  margin-right: 10px;

  ::v-deep .van-image__img {
    border-radius: 6px;
  }
}
.card-title {
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
}
.card-flag {
  font-size: 11px;
  color: #666;
  margin-top: 8px;
  
  &>text:not(:last-child) {
    margin-right: 10px;
  }
}
.align-bottom {
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 14px;
}
.card-tag {

  &>.van-tag:not(:last-child) {
    margin-right: 10px;
  }
}
.meeting-price {
  color: #00C6D2;
  line-height: 16px;
}

.price-12 {
  font-size: 12px;
  line-height: 1;
  color: inherit;
}
.price-22 {
  font-size: 22px;
  line-height: 1;
  color: inherit;
}
.meeting-price {
  color: #00C6D2;
}
</style>