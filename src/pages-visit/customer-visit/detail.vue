<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <customer-info-sheet :data="visitDetail" :houseInfoId="queryObj.houseInfoId" />

    <view class="card-panel">
      <view class="card-title">拜访信息</view>
      <cell-text
        v-for="(item, index) in visitInfo" :key="index"
        :label="item.label" labelColor="#666" :padding="index == 0 ? '30rpx 30rpx 0' : index == visitInfo.length - 1 ? '16rpx 30rpx 30rpx' : '16rpx 30rpx 0'"
        border="none" customStyle="font-size: 28rpx; color: #333;"
      >
        <text style="color: #333;">{{ item.value }}</text>
      </cell-text>
    </view>

    <view class="card-panel">
      <view class="card-title">问卷内容</view>
      <visit-question :subjectList="subjectList" questionType="read" />
    </view>

    <view class="card-panel">
      <view class="card-title">拜访结果</view>
      <cell-text label="拜访内容：" padding="30rpx 0" customStyle="font-size: 28rpx; color: #333; margin: 0 30rpx; width: auto;">
        <text style="color: #333;">{{ formObj.visitContent }}</text>
      </cell-text>
      <cell-text label="附件：" isDesc padding="30rpx 0" customStyle="font-size: 28rpx; color: #333; margin: 0 30rpx; width: auto;">
        <u-album slot="desc" :urls="formObj.fileList" />
      </cell-text>
    </view>

    <!-- 是否需要客户签名 -->
    <view class="card-panel" v-if="visitDetail.isSignature == 1">
      <view class="card-title">客户签名</view>
      <view class="card-content">
        <image mode="aspectFit" v-if="formObj.sigFileUrl" :src="formObj.sigFileUrl" />
        <text v-else style="color: #cacdd4;">无</text>
      </view>
    </view>

    <view class="placeholder"></view>
    <u-safe-bottom />
    
    <view class="footer-panel">
      <view class="footer-btn">
        <u--text :prefixIcon="require(`@/static/${THEME_NAME}/common/add.png`)" text="新建工单" type="primary" size="28rpx" align="center" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="createOrder" />
      </view>
      <u-safe-bottom />
    </view>
  </view>
</template>

<script>
import CustomerInfoSheet from '@/pages-visit/modules/customer-info-sheet.vue'
import CellText from '@/components/cell-text.vue'
import VisitQuestion from '@/pages-visit/modules/visit-question.vue'
import { getCustomerVisitDetailById } from '@/service/returnVisit'

export default {
  components: {
    CustomerInfoSheet,
    CellText,
    VisitQuestion
  },
  data() {
    return {
      queryObj: {
        visitRecordId: '', // 拜访任务id
        houseInfoId: '' // 房间id
      },
      visitDetail: {}, // 拜访任务详情
      // 拜访信息
      visitInfo: [
        { label: '拜访人：', value: '澹台烬、叶夕雾' },
        { label: '拜访方式：', value: '澹台烬、叶夕雾' },
        { label: '拜访时间：', value: '澹台烬、叶夕雾' },
        { label: '被访人：', value: '澹台烬、叶夕雾' },
        { label: '联系电话：', value: '澹台烬、叶夕雾' }
      ],
      formObj: {
        fileList: [],
        visitContent: '', // 拜访内容
        sigFileUrl: '', // 签名图片
      },
      subjectList: [], // 问卷题目，有可能包含了答案
    }
  },
  onLoad(query) {
    this.queryObj.visitRecordId = query.visitRecordId || ''
    this.queryObj.houseInfoId = query.houseInfoId || ''

    this.getCustomerVisitDetailById()
  },
  methods: {
    // 获取客户拜访详情
    async getCustomerVisitDetailById() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params= {
        data: {
          visitRecordId: this.queryObj.visitRecordId,
          houseInfoId: this.queryObj.houseInfoId,
          userId: userInfo.userId,
          userName: userInfo.userName
        }
      }
      const res = await getCustomerVisitDetailById(params)
      const _dataTmp = this.visitDetail = res.data.data?.[0] ?? {}
      this.visitInfo[0].value = _dataTmp.visitUserName || ''
      this.visitInfo[1].value = _dataTmp.visitType || ''
      this.visitInfo[2].value = _dataTmp.visitTime || ''
      this.visitInfo[3].value = _dataTmp.intervieweeName || ''
      this.visitInfo[4].value = _dataTmp.intervieweePhone || ''

      // 任务类型为 访谈 时，不显示拜访方式
      if (_dataTmp.interactionType == '0') {
        // 0: 访谈, 1: 互动
        this.visitInfo.splice(1, 1)
      }

      this.formObj.visitContent = _dataTmp.visitContent || ''
      this.formObj.fileList = _dataTmp.filesUrl ? _dataTmp.filesUrl.split(',') : []
      this.subjectList = _dataTmp.questionnaireAnswerData.subjectsList || []
      this.formObj.sigFileUrl = _dataTmp.sigFileUrl || ''
    },
    // 新建工单
    createOrder() {
      uni.navigateTo({ url: '/pages/workorder/index?houseInfoId=' + this.visitDetail.houseInfoId })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding: 24rpx 20rpx 20rpx;
  min-height: 100vh;
  background-color: #f3f5f9;
  box-sizing: border-box;
}
::v-deep .customer-info-sheet {
  margin-bottom: 20rpx;
}
.card-panel {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12rpx;
  margin-top: 20rpx;
}
.card-title {
  height: 102rpx;
  line-height: 102rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  border-bottom: 1px solid #d9dce7;
}
::v-deep .u-album {
  margin-top: 30rpx;
}
.card-content {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  width: 100%;
  box-sizing: border-box;
  
  image {
    border: 1px dashed #ebebeb;
    height: 700rpx;
  }
}

$height: 100rpx;

.placeholder {
  height: $height;
}
.footer-panel {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  background-color: #ffffff;
}
.footer-btn {

  display: flex;
  align-items: center;
  height: $height;

  ::v-deep .u-text {
    height: $height;
    line-height: $height;

    &:last-child {
      border-left: 1px solid #eaeaea;;
    }
  }
}
</style>