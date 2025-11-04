<template>
  <view :class="['workorder-sheet', getCustomClass]" :style="[getCustomStyle]" @click="linkTo">
    <view class="sheet-title-wrap">
      <view class="title-tag-wrap">
        <view class="title-tag" :class="[data.originSource==0?'neibu':'kehu']">{{data.originSource==0?'内部':'客户'}}</view>
        <!-- 问题描述 -->
        <view class="title">{{ data.quesDesc }}</view>
      </view>
      <!-- 工单状态 -->
      <text class="title-state">{{ getStateText }}</text>
    </view>
    <view class="sheet-content-wrap">
      <!-- 楼栋地址 -->
      <text>{{ data.contactAddress || data.houseBuilding || data.projectName }}</text>
      <text>{{ data.submitDate }}</text>
    </view>
    <view class="sheet-footer-wrap">
      <view class="sheet-footer-left">
        <!-- 超期时间 -->
        <text style="margin: 0 8px 0 0; color: #e93636;font-size: 26rpx;">{{ getTimeText }}</text>
        <!-- 标签 -->
        <block v-for="(item, index) in getTagList" :key="index">
          <yb-tag :text="item" size="mini" plain plainFill :type="item == '一般' ? 'warning' : item == '紧急' ? 'error' : 'primary'" customStyle="padding: 0 6rpx; border-color: rgba(0,0,0,0); margin-right: 10rpx" />
        </block>
      </view>
      <!-- 工单子状态 -->
      <yb-tag v-if="!!getChildStateText" :text="getChildStateText" size="mini" type="error" customStyle="padding: 0 6rpx;background-color: #E71E1E;border-color: #E71E1E;" />
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import YbTag from '@/components/yb-tag/yb-tag.vue'

export default {
  name: 'WorkorderSheet',
  mixins: [mpMixin],
  components: {
    YbTag
  },
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
    // 工单状态
    getStateText() {
      const dataTmp = this.data
      return dataTmp.quesTaskStateName
    },
    getChildStateText() {
      const dataTmp = this.data

      if (dataTmp.closeStatus == 1) return '作废申请中'
      else if (dataTmp.closeStatus == 2 && dataTmp.quesTaskState != 4) return '已作废'
      else if (dataTmp.pauseStatus == 1) return '暂停申请中'
      // 因为 quesTaskState=5 时，quesTaskStateName = '已暂停' 了，就不需要再判断了
      else if (dataTmp.pauseStatus == 2 && dataTmp.quesTaskState != 5) return '已暂停'
      else if (dataTmp.abnormityCloseStatus == 1) return '非正常关闭申请中'
      else if (dataTmp.abnormityCloseStatus == 2) return '非正常关闭'
      else if (dataTmp.houseFixCloseStatus == 1) return '房修申请中'
      // 代客录单的有偿维修单，处理完成后，会同时显示对外回复申请中，和显示待支付。这时候需要先显示待支付。如果支付完成了，才能显示对外回复申请
      else if (dataTmp.waitStatus == 1) return '待料中'
      else if (dataTmp.payStatus == '0' && dataTmp.isPaid == 1) return '待支付'
      else if (dataTmp.replyReviewStatus == 1) return '对外申请中'
      else if (dataTmp.replyReviewStatus == 2) return '对外回复申请通过'
      else if (dataTmp.refuseBaseFlag == 1) return '拒单'
      return ''
    },
    // 标签列表
    getTagList() {
      const dataTmp = this.data
      const tmp = []

      let repaireFlag = false
      if ([3, 5].some(item => item == dataTmp.biProblemCategory)) {
        repaireFlag = true
        tmp.push('维修')
      }
      if (dataTmp.biProblemCategory == 10) {
        tmp.push('表扬')
      }
      if (dataTmp.biProblemCategory == 11) {
        tmp.push('报事')
      }
      if (dataTmp.biProblemCategory == 9) {
        tmp.push('咨询')
      }
      if (dataTmp.biProblemCategory == 6) {
        tmp.push('投诉')
      }
      if (dataTmp.emergencyDegreeName) {
        tmp.push(dataTmp.emergencyDegreeName)
      }
      if (dataTmp.repairNumView) {
        tmp.push('返修')
      }
      if (dataTmp.compensateView) {
        tmp.push('赔付')
      }
      if (dataTmp.oemCheckStatusView) {
        tmp.push('第三方')
      }
      // if (dataTmp.isPaid == 0) {
      //   tmp.push('有偿')
      // }
      // if (dataTmp.isPaid == 1) {
      //   tmp.push('无偿')
      // }
      if (repaireFlag && dataTmp.isPaid == 0 && dataTmp.payStatus) {
        tmp.push(dataTmp.payStatus)
      }

      return tmp
    },
    // 时间过程描述
    getTimeText() {
      const dataTmp = this.data

      const diffTime = (expectDate, noExpect = '', expected = '') => {
        if (!expectDate) return ''
        const nowDate = Date.now()
        expectDate = this.convertTime(expectDate)
        if (nowDate < expectDate) {
          // 未超期
          return noExpect + this.calculationTime(nowDate, expectDate)
        } else {
          // 已超期
          return expected + this.calculationTime(expectDate, nowDate)
        }
      }

      if (dataTmp.quesTaskState == 0) return diffTime(dataTmp.giveOutDateLine, '派单剩余', '派单超期')
      else if (dataTmp.quesTaskState == 1) return diffTime(dataTmp.acceptDateLine, '接单剩余', '接单超期')
      else if (dataTmp.quesTaskState == 2) return diffTime(dataTmp.acceptDateLine, '处理剩余', '处理超期')
      else if (dataTmp.quesTaskState == 3) return diffTime(dataTmp.acceptDateLine, '关闭剩余', '关闭超期')

      return ''
    }
  },
  methods:{
    linkTo() {
      const pages = getCurrentPages()
      const curPage = pages.slice(-1)[0]?.route || ''
      
      if (curPage == 'pages-workorder/graborder-pool/list') {
        // 抢单池页面
        uni.navigateTo({ url: `/pages-workorder/workorder-detail/detail?taskId=${this.data.quesTaskId}&type=graborderPool` })
      } else {
        uni.navigateTo({ url: `/pages-workorder/workorder-detail/detail?taskId=${this.data.quesTaskId}` })
      }
    },
    convertTime(val) {
      val = val.replace(/-/g, '/').split('.0')[0]
      return new Date(val).getTime()
    },
    calculationTime(minTime, maxTime) {
      let dateDiff = maxTime - minTime; //时间差的毫秒数
      let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
      let leave1 = dateDiff%(24*3600*1000); //计算天数后剩余的毫秒数
      let hours = Math.floor(leave1/(3600*1000)); //计算出小时数
      return dayDiff + '天' + hours + '小时'
    }
  }
}
</script>

<style lang="scss" scoped>
.workorder-sheet {
  @include flx-dsp(flex-start, flex-start, column);
  background-color: #fff;
  border-radius: 10rpx;
  font-family: "PingFang SC";
	margin: 24rpx 20rpx
}
.sheet-title-wrap {
  @include flx-dsp(flex-start, flex-start);
  box-sizing: border-box;
  width: 100%;
  padding: 24rpx 30rpx;
  font-size: 30rpx;

  .title-state {
    flex: 0 0 auto;
    color: var(--app-primary-color);
    padding-left: 40rpx;
		font-size: 28rpx;
		max-width: 130rpx;
		text-align: right;
  }
}
.title-tag-wrap {
  flex: 1 1 auto;
  position: relative;

  .title-tag {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 60rpx;
    height: 40rpx;
    font-size: 24rpx;
    line-height: 40rpx;
    text-align: center;
    border-top-right-radius: 8rpx;
    border-bottom-left-radius: 8rpx;
    color: #fff;

    &.neibu {
      background-color: var(--app-primary-color);
    }
    &.kehu {
      background-color: #faad13;
    }
  }
  .title {
    @include ellipsis(2);
    font-weight: bold;
    text-indent: 74rpx;
		font-size: 30rpx;
		line-height: 40rpx;
    color: #222;
  }
}
.sheet-content-wrap {
  @include flx-dsp(flex-start, flex-start, column);
  box-sizing: border-box;
  width: 100%;
  font-size: 28rpx;
  padding: 0rpx 30rpx 16rpx;
  color: #9d9d9d;
  line-height: 44rpx;
  border-bottom: 1px solid #EAEAEA;
}
.sheet-footer-wrap {
  @include flx-dsp(space-between, center);
  box-sizing: border-box;
  width: 100%;
  font-size: 24rpx;
  color: #9d9d9d;
  padding: 16rpx 30rpx;
}
.sheet-footer-left {
  @include flx-dsp(flex-start, center);
}
::v-deep .u-tag-wrapper {
  padding-left: 10rpx !important;
}
</style>