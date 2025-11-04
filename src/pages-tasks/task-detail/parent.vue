<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="item-panel">
      <view class="item-title">
        <text>基础信息</text>
        <u-button :text="getTaskState.label" size="small" :customStyle="'min-width: 0px; width: auto; height: 25px; margin: 0; padding: 0 3px; color: #fff;' + getTaskState.style" />
      </view>
      <view class="line"></view>
      <view class="item-content">
        <cell-text label="计划名称：" border="none" padding="14rpx 0" :labelStyle="{fontSize:'28rpx',color:'#666666',fontWeight: '500'}">
          <text class="value">{{ dataInfo.planName || '' }}</text>
        </cell-text>
        <cell-text label="计划类型：" border="none" padding="14rpx 0" :labelStyle="{fontSize:'28rpx',color:'#666666',fontWeight: '500'}">
          <text class="value">{{ getTaskType }}</text>
        </cell-text>
        <cell-text label="计划编码：" border="none" padding="14rpx 0" :labelStyle="{fontSize:'28rpx',color:'#666666',fontWeight: '500'}">
          <text class="value">{{ dataInfo.planCode || '' }}</text>
        </cell-text>
        <cell-text label="总任务名称：" border="none" :labelWidth="170" padding="14rpx 0" :labelStyle="{fontSize:'28rpx',color:'#666666'}">
          <text class="value">{{ dataInfo.taskName || '' }}</text>
        </cell-text>
      </view>
    </view>

    <view class="item-panel">
      <view class="item-title">
        <text>任务时间</text>
      </view>
      <view class="line"></view>
      <view class="item-content">
        <cell-text label="计划开始时间：" border="none" :labelWidth="210" padding="14rpx 0" :labelStyle="{fontSize:'28rpx',color:'#666666'}">
          <text class="value">{{ getStartDate }}</text>
        </cell-text>
        <cell-text label="计划结束时间：" border="none" :labelWidth="210" padding="14rpx 0" :labelStyle="{fontSize:'28rpx',color:'#666666'}">
          <text class="value">{{ getEndDate }}</text>
        </cell-text>
      </view>
    </view>

    <view class="item-panel">
      <view class="item-title">
        <text>任务内容与附件</text>
      </view>
      <view class="line"></view>
      <view class="item-content">
        <text class="appendix-title">内容：</text>
        <text style="text-indent: 40rpx;font-size: 28rpx;overflow-wrap: break-word;color: #333;">{{ dataInfo.contentText || '' }}</text>
        <view style="margin-top: 20rpx;display: flex;align-items: center;">
          <text class="appendix-title">附件：</text>
          <view class="appendix-list" style="display: flex; align-items: center;">
            <text v-if="dataInfo.contentAttachmentList.length == 0" style="font-size: 28rpx;color: #333;">暂无附件</text>
            <share-attachments :data="dataInfo.contentAttachmentList" customStyle="margin: 0 40rpx 30rpx;" />
          </view>
        </view>
        <view style="margin-top: 32rpx;">
          <text class="appendix-title">备注：</text>
          <text style="margin-bottom: 14rpx; text-indent: 40rpx;overflow-wrap: break-word;">{{ dataInfo.remark || '' }}</text>
        </view>
      </view>
    </view>

    <u-safe-bottom />
  </view>
</template>

<script>
import CellText from '@/components/cell-text.vue'
import ShareAttachments from '@/pages-tasks/modules/share-attachments.vue'
import { formatAttachments } from '@/pages-tasks/modules/toAttachments'
import mpMixin from '@/js/mixin/mpMixin'
import { getMassSendingTaskDetail } from '@/service/api-gateway'

/**
 * 任务详情
 */
export default {
  mixins: [mpMixin],
  components: {
    CellText,
    ShareAttachments
  },
  props: {
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataInfo: {}
    }
  },
  computed: {
    // 任务类型
    getTaskType() {
      const taskType = this.dataInfo.taskType
      if (taskType == 1) {
        return '消息群发'
      } else if (taskType == 2) {
        return '朋友圈转发'
      } else {
        return ''
      }
    },
    // 计划开始时间
    getStartDate() {
      const date = this.dataInfo.startDate
      if (!date) return ''
      return uni.$u.timeFormat(date, 'yyyy年mm月dd日')
    },
    // 计划结束时间
    getEndDate() {
      const date = this.dataInfo.endDate
      if (!date) return ''
      return uni.$u.timeFormat(date, 'yyyy年mm月dd日')
    },
    // 任务状态
    getTaskState() {
      const state = this.dataInfo.taskStatus
      const toStyle = (label, className) => {
        let color = ''
        switch (className) {
          case 'doing':
            color = '#2761FF'
            break
          case 'finished':
          case 'timeoutFinished':
            color = '#19be6b'
            break
          case 'timeout':
            color = '#ff0000'
            break
          case 'expired':
          case 'abolished':
            color = '#bbbec4'
            break
        }

        return { label, class: className, style: `background-color: ${color};` }
      }

      if (state == '0') return toStyle('进行中','doing')
      else if (state == '1') return toStyle('已结束', 'expired')
      else if (state == '2') return toStyle('已结束（全部完成）', 'expired')
      else if (state == '3') return toStyle('超时进行中', 'timeout')
      else if (state == '4') return toStyle('超时完成', 'timeoutFinished')
      else if (state == '5') return toStyle('已作废', 'abolished')
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const res = await getMassSendingTaskDetail(this.taskId)

      const data = res.data || {}
      this.dataInfo = data
      this.dataInfo.contentAttachmentList = formatAttachments(data.contentAttachmentList || [])
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  font-family: PingFang SC;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f9;
}
.item-panel {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin: 20rpx 14rpx 0;
  /* padding: 12rpx 30rpx; */
  font-size: 26rpx;
  border-radius: 12rpx;
}
.item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
  position: relative;
  font-size: 30rpx;
  /* font-weight: bold; */
  color: #333333;
  padding: 30rpx;
}
.value{
  font-weight: 500;
  font-size: 28rpx;
  color: #333333;
}
.appendix-title {
  padding: 14rpx 0;
  font-size:28rpx;
  color:#666666;
  font-weight: 500;
}
.appendix-content {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}
.line {
  height: 1px; 
  background-color: #ebebeb;
}
.item-content {
  padding: 30rpx;
}
</style>