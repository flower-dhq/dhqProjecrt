<template>
  <view class="customer-visit-sheet" @click="linkTo">
    <yb-circle-progress :percent="data.percentage">
      <text style="font-size: 40rpx; color: #333; font-weight: bold;">{{ data.percentage || 0 }}%</text>
      <text style="font-size: 22rpx; color: #999;">完成率</text>
    </yb-circle-progress>
    <view class="sheet-right">
      <view class="right-title">
        <text class="title-h1">{{ data.visitTaskName }}</text>
        <text class="title-status">{{ data.visitTaskState | getVisitState }}</text>
      </view>
      <text class="right-desc">{{ data.visitUserNames || '' }}</text>
      <text class="right-desc">{{ getStartDate }} 至 {{ getEndDate }}</text>
    </view>
  </view>
</template>

<script>
import YbCircleProgress from './yb-circle-progress.vue'

export default {
  name: 'CustomerVisitSheet',
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
      if (!this.data?.visitTaskStart) return ''
      return uni.$u.timeFormat(this.data.visitTaskStart, 'yyyy-mm-dd')
    },
    // 拜访结束日期
    getEndDate() {
      if (!this.data?.visitTaskEnd) return ''
      return uni.$u.timeFormat(this.data.visitTaskEnd, 'yyyy-mm-dd')
    }
  },
  filters: {
    // 获取拜访任务状态
    getVisitState(val) {
      const map = {
        0: '未开始',
        1: '进行中',
        2: '已结束'
      }
      return map[val]
    }
  },
  methods: {
    // 跳转到房间
    linkTo() {
      uni.navigateTo({ url: '/pages-visit/customer-visit/room-list?visitTaskId=' + this.data.visitTaskId })
    }
  }
}
</script>

<style lang="scss" scope>
.customer-visit-sheet {
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
  font-size: 28rpx;
  color: #666;
  padding-top: 16rpx;
}
</style>