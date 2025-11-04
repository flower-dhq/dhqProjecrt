<template>
  <view :class="getBoxClass">
    <view class="sheet-title-wrap" @click="linkTo">
      <text class="title">{{ getApprovalType }}</text>
      <text :class="['title-state', getStatus.color]">{{ getStatus.label }}</text>
    </view>
    <view class="sheet-content-wrap" @click="linkTo">
      <text class="content-title">申请说明：{{ data.approvalDesc || '' }}</text>
      <text class="sheet-desc">申请人：{{ data.followUpProcessorName || '' }}</text>
      <text class="sheet-desc">申请时间：{{ data.nsdDate || '' }}</text>
      <text class="sheet-desc">服务地址：{{ data.location || '' }}</text>
    </view>
    <view class="sheet-footer-wrap" v-if="data.statusId == 1">
			<view class="btn btn-reject" @click="handleBtn('reject')">拒绝</view>
      <view class="btn btn-agree" @click="handleBtn('agress')">同意</view>
    </view>
  </view>
</template>

<script>
/**
 * 工单审批
 * @event submit 同意/拒绝事件
 */
export default {
  name: 'WorkorderSheet',
  options: {
    virtualHost: true
  },
  props: {
    class: {
      type: [String, Array],
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    getBoxClass() {
      return ['workorder-sheet'].concat(this.class)
    },
    // 获取审批类型
    getApprovalType() {
      const map = {
        1: '暂停审批',
        2: '作废审批',
        3: '非正常关闭审批',
        4: '对外回复审批'
      }
      return map[this.data.approvalType]
    },
    // 获取审批状态
    getStatus() {
      const map = {
        1: { label: '待审批', color: 'wait' },
        2: { label: '已通过', color: 'agress' },
        3: { label: '已拒绝', color: 'reject' }
      }

      return map[this.data.statusId]
    },
  },
  data() {
    return {
      
    }
  },
  methods: {
    linkTo() {
      uni.navigateTo({ url: `/pages-workorder/workorder-detail/detail?type=approval&taskId=${this.data.recordId}` })
    },
    handleBtn(type) {
      this.$emit('submit', { type, data: this.data })
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
	margin: 24rpx 20rpx 0;
}
.sheet-title-wrap {
  @include flx-dsp(flex-start, flex-start);
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid #EBEBEB;
  padding: 30rpx;
}
.title {
  @include ellipsis(2);
  flex: 1 1 auto;
  font-weight: bold;
  font-size: 30rpx;
  color: #222;
}
.title-state {
  flex: 0 0 auto;
  font-size: 28rpx;

  &.wait {
    color: #e9964d;
  }
  &.agress {
    color: var(--app-primary-color);
  }
  &.reject {
    color: #ff0403;
  }
}
.sheet-content-wrap {
  @include flx-dsp(flex-start, flex-start, column);
  box-sizing: border-box;
  width: 100%;
  padding: 24rpx 30rpx 16rpx;
  border-bottom: 1px solid #f8f8f8;
}
.content-title {
  font-weight: bold;
  color: #222;
  line-height: 36rpx;
  font-size: 28rpx;
  margin-bottom: 8rpx;
}
.sheet-desc {
  font-size: 28rpx;
  color: #666;
  margin-top: 16rpx;
}
.sheet-footer-wrap {
  @include flx-dsp(space-between, center);
  box-sizing: border-box;
  width: 100%;
  font-size: 28rpx;

  .btn {
    flex: 1 1 auto;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
  }
  .btn-reject {
    color: #ff0403;
  }
  .btn-agree {
    color: var(--app-primary-color);
    border-left: 1px solid #f8f8f8;
  }
}
</style>