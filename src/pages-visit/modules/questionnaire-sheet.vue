<template>
  <view class="questionnaire-sheet" @click="linkTo(data)">
    <yb-circle-progress :percent="data.finishRateNum">
      <text style="font-size: 40rpx; color: #333; font-weight: bold;">{{ data.finishRate == '- -' ? data.finishRate : (data.finishRateNum + '%') }}</text>
      <text style="font-size: 22rpx; color: #999;">完成率</text>
    </yb-circle-progress>
    <view class="sheet-right">
      <view class="right-title">
        <text class="title-h1">{{ data.name }}</text>
        <text class="title-status">{{ data.formatStatus }}</text>
      </view>
      <text class="right-desc">{{ getStartDate }} 至 {{ getEndDate }}</text>
      <view class="right-desc">
        <view class="desc-icon" style="margin-right: 60rpx;">
          <image :src="require(`@/static/${[THEME_NAME]}/common/yellow_target.png`)"></image>
          <text>{{ data.limitNum | getLimitNum }}</text>
        </view>
        <view class="desc-icon">
          <image :src="require(`@/static/${[THEME_NAME]}/common/green_check.png`)"></image>
          <text>{{ data.participantsNum }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import YbCircleProgress from './yb-circle-progress.vue'

export default {
  name: 'QuestionnaireSheet',
  components: {
    YbCircleProgress
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {}
  },
  computed: {
      // 拜访开始日期
    getStartDate() {
      if (!this.data?.startDate) return ''
      return uni.$u.timeFormat(this.data.startDate, 'yyyy-mm-dd')
    },
    // 拜访结束日期
    getEndDate() {
      if (!this.data?.endDate) return ''
      return uni.$u.timeFormat(this.data.endDate, 'yyyy-mm-dd')
    }
  },
  filters: {
    getLimitNum(val) {
      return !val && val != '0' ? '未设置' : val
    }
  },
  methods: {
    linkTo(data) {
      if (data.buildingIdList && data.buildingIdList.length>0) {
        uni.navigateTo({ url: `/pages-visit/questionnaire/investigation?surveyId=${data.id}&projectId=${data.projectId}&buildingValue=${data.buildingIdList[0]}&buildingIdList=${data.buildingIdList}` }) 
      }else {
        uni.navigateTo({ url: `/pages-visit/questionnaire/investigation?surveyId=${data.id}&projectId=${data.projectId}&buildingValue=` }) 
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.questionnaire-sheet {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx 30rpx;
}
.sheet-right {
  display: flex;
  flex-direction: column;
  margin-left: 24rpx;
  width: 100%;
}
.right-title {
  display: flex;
  justify-content: flex-start;
}
.title-h1 {
  flex: 1 1 auto;
  font-size: 30rpx;
  color: #333;
  font-weight: bold;

  @include ellipsis(2);
}
.title-status {
  flex: 0 0 auto;
  font-size: 28rpx;
  color: #2761FF;
  margin-left: 40rpx;
}
.right-desc {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #666;
  padding-top: 16rpx;
}
.desc-icon {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #666;

  &>image {
    width: 32rpx;
    height: 32rpx;
    margin-right: 12rpx;
  }
}
</style>