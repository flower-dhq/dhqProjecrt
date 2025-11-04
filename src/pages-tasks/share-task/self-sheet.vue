<template>
  <view class="self-sheet" @click="linkTo">
    <view class="sheet-title">
      <view class="title-left">
        <!-- 消息类型 -->
        <!-- <u-tag :text="getMessageType" size="mini" /> -->
        <view class="tag" :style="data.taskType=='1'?'background-color:#2A67FF':'background-color:#22ABCF'">
          {{ getMessageType }}
        </view>
        <!-- 计划任务名称 -->
        <text class="ellipse-text">{{ data.planName || '' }}</text>
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
    <view class="sheet-content">
      <view class="content-row">
        <text class="grey">{{ getFinishDate }}截止</text>
        <!-- 任务状态是未完成，且还没有超过截止时间，才显示 -->
        <text v-if="getTaskState.class == 'doing' && getDateFrom > 0" class="sub-text">还剩{{ getDateFrom }}天</text>
        <!-- 任务状态是超时重2，才显示 -->
        <text v-if="getTaskState.class == 'timeout' && getDateOver > 0" class="sub-text timeout">逾期{{ getDateOver }}天</text>
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
  name: 'SelfSheet',
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
      const state = this.data.sendStatus
      if (state == '0') {
        return {
          label: '进行中',
          class: 'doing'
        }
      } else if (state == '1') {
        return {
          label: '已完成',
          class: 'finished'
        }
      } else if (state == '2') {
        return {
          label: '已过期',
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
      const date = this.data.endTime || ''
      if (!date) return ''

      return uni.$u.timeFormat(date, 'yyyy年mm月dd日')
    },
    // 还剩多少天就结束任务
    getDateFrom() {
      const date = this.data.endTime || ''
      if (!date) return 0

      const finishDate = Utils.timeFormat(date).getTime()
      const nowDate = new Date().getTime()
      let manyDate = finishDate - nowDate
      manyDate = Math.floor(manyDate / (1000 * 3600 * 24))
      return manyDate > 0 ? manyDate : 0
    },
    // 已超过多少天还没完成任务
    getDateOver() {
      const date = this.data.endTime || ''
      if (!date) return 0

      const finishDate = Utils.timeFormat(date).getTime()
      const nowDate = new Date().getTime()
      let manyDate = nowDate - finishDate
      manyDate = Math.floor(manyDate / (1000 * 3600 * 24))
      return manyDate > 0 ? manyDate : 0
    }
  },
  methods: {
    // 打开我的任务详情
    linkTo() {
      const query = uni.$u.queryParams({
        employeeTaskId: this.data.employeeTaskId
      })
      uni.navigateTo({ url: '/pages-tasks/group-send/detail' + query })

      this.$emit('click')
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
.self-sheet {
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
.sheet-content {
  display: flex;
  flex-direction: column;
  font-size: 28rpx;
  padding-bottom: 24rpx;
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

.content-row {
  margin-top: 20rpx;
  margin-left: 10px;
  position: relative;

  .grey {
    font-size: 28rpx;
    color: #8d8d8d;
  }

  
  &.doing {
    color: #2d8cf0;
  }
}
.sub-text {
  font-size: 28rpx;
  color: #8d8d8d;
  margin-left: 20rpx;

  &.timeout {
    color: #ff0000;
  }
}
</style>