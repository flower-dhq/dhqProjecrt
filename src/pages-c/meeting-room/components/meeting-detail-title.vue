<template>
  <view class="meeting-detail-title"  :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <!-- 标题，价格 -->
    <view class="box-title flex-row">
      <h1 class="flex-stretch ellipsis-one">{{ data.meetingName }}</h1>
      <meeting-price :number="getPriceText" :suffix="getPriceUnit" color="#00C6D2" />
    </view>

    <!-- 标签 -->
    <view class="box-tag flex-row">
      <u-tag color="#fdf2e2" text-color="#f5c47b" v-for="(item, index) in getTagList" :key="index">{{ item }}</u-tag>
    </view>

    <!-- 内容 -->
    <view class="box-content">{{ data.introduction }}</view>
    
    <!-- 信息 -->
    <view class="box-info flex-row">
      <view class="box-info-item flex-column flex-stretch">
        <text class="info-number">{{ data.acreage || 0 }}</text>
        <text class="info-desc">使用面积</text>
      </view>
      <view class="box-info-item flex-column flex-stretch">
        <text class="info-number">{{ data.floorNum || 0 }}层</text>
        <text class="info-desc">楼层</text>
      </view>
      <view class="box-info-item flex-column flex-stretch">
        <text class="info-number">{{ data.capacity || 0 }}人</text>
        <text class="info-desc">容纳人数</text>
      </view>
    </view>
  </view>
</template>

<script>
import MeetingPrice from './meeting-price.vue'

/**
 * 会议厅详情页面(/meetingRoomDetail)的标题信息
 * @property {object} data 数据
 */
export default {
  name: 'MeetingDetailTitle',
  components: {
    MeetingPrice,
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 获取标签列表
    getTagList() {
      return this.data.typeListFront || []
    },
    // 收费标准 { 0: 按时段收费, 1: 按天收费 }
    getPriceUnit() {
      return this.data.chargesType === 0 ? '/小时' : '/天'
    },
    // 获取收费价格
    getPriceText() {
      return this.data.chargesType === 0 ? this.data.timeCost : this.data.chargesPriceByDay
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/meeting-style.scss";

.meeting-detail-title {
  /* width: 100%; */
  padding: 20px 20px 16px;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}
.box-title {
  margin-bottom: 5px;

  h1 {
    font-size: 20px;
    font-weight: bold;
  }
}
.box-tag {
  .u-tag {
    height: 20px;
    padding: 0 7px;
    line-height: 20px;
    margin-right: 20px;
    margin-bottom: 13px;
  }
}
.box-content {
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 30px;
}
.box-info {
  margin-left: -20px;
  margin-right: -20px;
}
.box-info-item {
  align-items: center;

  &:not(:last-of-type) {
    border-right: 1px solid #F5F0F0;
  }
  .info-number {
    font-size: 16px;
    font-weight: bold;
  }
  .info-desc {
    font-size: 12px;
    color: #ccc;
  }
}
</style>