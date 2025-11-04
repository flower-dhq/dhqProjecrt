<template>
  <view :class="['order-item', getCustomClass]" :style="[getCustomStyle]">
    <view class="date-panel">
      <text>{{ data.submitDate }}</text>
      <text :class="['task-status', getStateClass]">{{ data.quesTaskState }}</text>
    </view>
    <text class="desc-panel">任务单号：{{ data.quesTaskCode }}</text>
    <text class="desc-panel">任务类型：{{ data.questionType }}</text>
    <view class="btn-panel">
      <text class="desc-panel flex1">任务描述：{{ data.quesTaskDesc }}</text>
      <u-button text="查看详情" size="small" type="primary" plain :customStyle="{color: '#1989F7 !important',borderColor:'#1989F7 !important', width: '120rpx', height: '50rpx', flex: '0 0 auto' }" @click="linkTo" />
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'

/**
 * 日常服务列表的节点
 */
export default {
  name: 'OrderItem',
  mixins: [mpMixin],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    getStateClass() {
      const state = this.data.quesTaskState
      if (state == '待派单') {
        return 'orange'
      } else if (state == '待确认') {
        return 'red'
      } else if (state == '已关闭') {
        return 'green'
      }
    }
  },
  methods: {
    linkTo() {
      uni.navigateTo({ url: '/pages-workorder/workorder-detail/detail?taskId=' + this.data.quesTaskId })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-item {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  font-family: "PingFang SC";
  background-color: #fff;
}
.order-item:last-child {
  border-bottom-left-radius: 12rpx;
  border-bottom-right-radius: 12rpx;
}

.date-panel {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  padding-bottom: 8rpx;
}
.task-status {
  font-size: 26rpx;
  font-weight: 400;
  
  &.orange {
    color: #FF8A15;
  }
  &.red {
    color: #FC0B0B;
  }
  &.green {
    color: #16CE92;
  }
}
.desc-panel {
  font-size: 24rpx;
  color: #333;
  padding-top: 8rpx;
}
.flex1 {
  flex: 1 1 auto;
}
.btn-panel {
  display: flex;
  align-items: flex-end;

  .desc-panel {
    padding-bottom: 8rpx;
  }
}
</style>