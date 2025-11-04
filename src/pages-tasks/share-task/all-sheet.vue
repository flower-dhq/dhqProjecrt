<template>
  <view class="all-sheet" @click="linkTo">
    <view class="sheet-title">
      <view class="title-left">
        <!-- 消息类型 -->
        <!-- <u-tag :text="getMessageType" size="mini"/> -->
        <view class="tag" :style="data.taskType=='1'?'background-color:#2A67FF':'background-color:#22ABCF'">
          {{ getMessageType }}
        </view>
        <!-- 任务名称 -->
        <text class="ellipse-text">{{ data.taskName }}</text>
      </view>
      <!-- 任务状态 -->
      <text :class="['title-state', getTaskState.class]">{{ getTaskState.label }}</text>
    </view>
    <view class="sheet-tip">
      <view class="tip-content">
        <text class="grey" style="margin-bottom: 10rpx;">尊敬的业主，您好！</text>
        <text class="grey">系统显示您有物业费账单未结清，请点击下方…</text>
      </view>
    </view>
    <view class="sheet-progress">
      <view class="progress-left">
        <text style="margin-right: 16rpx;">发送人数</text>
        <u-line-progress :percentage="percentageFn(data)" height="16" activeColor="#2761FF"></u-line-progress>
      </view>
      <view class="progress-right">
        <text class="blue">{{data.completedCount || 0}}</text>
        /
        <text class="gery">{{data.remainingCount + data.completedCount}}</text>
      </view>
    </view>
    <view class="sheet-content">
      <view class="content-top">
        <!-- 截止日期 -->
        <text class="plainText">{{ getFinishDate }}截止</text>
        <!-- 任务状态不是已结束，且还没有超过截止时间，才显示 -->
        <text v-if="getTaskState.class != 'finished' && getDateFrom > 0" class="sub-text">还剩{{ getDateFrom }}天</text>
      </view>
    </view>
  </view>
</template>

<script>
import Utils from '@/js/utils'

/**
 * 我的任务-列表项
 */
export default {
  name: 'AllSheet',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  computed: {
    // 消息类型：1-消息群发，2-朋友圈转发
    getMessageType() {
      const messageType = this.data.taskType || '1'
      if (messageType == '1') {
        return '消息群发'
      } else if (messageType == '2') {
        return '朋友圈转发'
      }
    },
    // 获取任务状态
    getTaskState() {
      const state = this.data.taskStatus
      if (state == '0') {
        return {
          label: '进行中',
          class: 'doing'
        }
      } else if (state == '1') {
        return {
          label: '已结束',
          class: 'expired'
        }
      }else if (state == '2') {
        return {
          label: '已结束（全部完成）',
          class: 'expired'
        }
      } else if (state == '3') {
        return {
          label: '超时进行中',
          class: 'timeout'
        }
      } else if (state == '4') {
        return {
          label: '超时完成',
          class: 'timeoutFinished'
        }
      } else if (state == '5') {
        return {
          label: '已作废',
          class: 'abolished'
        }
      }
    },
    // 获取任务截止日期
    getFinishDate() {
      const date = this.data.endDate || ''
      if (!date) return ''

      return uni.$u.timeFormat(date, 'yyyy年mm月dd日')
    },
    // 还剩多少天就结束任务
    getDateFrom() {
      const date = this.data.endDate || ''
      if (!date) return 0

      const endDate = Utils.timeFormat(date).getTime()
      const nowDate = new Date().getTime()
      let manyDate = endDate - nowDate
      manyDate = Math.floor(manyDate / (1000 * 3600 * 24))
      return manyDate > 0 ? manyDate : 0
    }
  },
  methods: {
    // 打开任务详情
    linkTo() {
      const query = uni.$u.queryParams({
        taskId: this.data.taskId
      })
      uni.navigateTo({ url: '/pages-tasks/task-detail/index' + query })

      this.$emit('click')
    },
    // 计算进度条
    percentageFn(data) {
      let completedCount =  data.completedCount || 0
      let remainingCount =  data.remainingCount || 0
      let total = completedCount + remainingCount || 0

      let num = parseInt((completedCount / total) * 100)
      if (num > 100) {
        return 100
      } else {
        return num
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tag{
  padding: 9rpx;
  color: white;
  font-size: 21rpx;
  margin-right: 16rpx;
}
.plainText {
  font-size: 28rpx;
  font-weight: 400;
  color: #666666;
}
.all-sheet {
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 0 30rpx;
}
.sheet-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  padding: 25rpx 0;
  font-size: 28rpx;
}
.title-left {
  flex: 1;
  width: 0px;
  display: flex;
  align-items: center;
}
.ellipse-text {
  font-size: 30rpx;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 60%;
  overflow: hidden;
}
.title-state {
  font-size: 28rpx;
  flex: 0 0 auto;

  &.doing {
    color: #2A67FF;
  }
  &.finished, &.timeoutFinished {
    color: #19be6b;
  }
  &.timeout {
    color: #ff0000;
  }
  &.expired, &.abolished {
    color: #bbbec4;
  }
}
.sheet-tip {
  background-color: #F3F5F4;
  border-radius: 8rpx;
  .tip-content {
    padding: 24rpx;
    font-size: 28rpx;
    color: #666;
    display: flex;
    flex-direction: column;
    .grey {
      font-family: PingFang SC;
      font-size: 28rpx;
      color: #666;
      font-weight: 400;
    }
  }
}

.sheet-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0 20rpx;
  .progress-left {
    width: 75%;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #666;
    .u-line-progress {
      width: 100%;
    }
  }
  .progress-right {
    flex: 0 0 auto;
    font-size: 28rpx;
    color: #666;
  }
}

.sheet-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 28rpx;
  padding-top: 6rpx;
  padding-bottom: 20rpx;
}
.content-top {
  /* margin-bottom: 24rpx; */
  width:calc(100% - 30rpx);
  font-size: 28rpx;
  position: relative;

  
  .sub-text {
    font-size: 24rpx;
    color: #8d8d8d;
    margin-left: 20rpx;
  }
}
.content-bottom {
  display: flex;
  width: 100%;

  .text-num-container {
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin-left: 28rpx;

    .completed {
      color: #19be6b;
      font-size: 40rpx;
    }
    .paused {
      color: #ff9900;
      font-size: 40rpx;
    }
  }
}

.blue {
  color: #2A67FF;
  font-size: 28rpx;
}
.gery {
  color: #999;
  font-size: 28rpx;
}
</style>