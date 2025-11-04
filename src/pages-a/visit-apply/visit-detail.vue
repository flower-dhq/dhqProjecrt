<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="page-bg" />

    <!-- 个人信息 -->
    <view class="pd-20 form-panel">
      <cell-text class="cell-title" :label="formType === 'invite' ? '访客信息' : '您的信息'" labelColor="#333" />
      <cell-text label="姓名" :labelWidth="80" padding="12px 0" labelColor="#666" isDesc>{{ formObj.visitPersonName }}</cell-text>
      <cell-text label="手机*" :labelWidth="80" padding="12px 0" labelColor="#666">{{ formObj.visitPersonPhone }}</cell-text>
      <cell-text label="日期*" :labelWidth="80" padding="12px 0" isRight labelColor="#666">{{ formObj.planVisitTime }}</cell-text>
      <cell-text label="事由*" :labelWidth="80" padding="12px 0" border="none" labelColor="#666" isDesc>{{ formObj.configDetailName }}</cell-text>
    </view>

    <!-- 被访人信息 -->
    <view class="pd-20 form-panel" v-if="formType === 'regist'">
      <cell-text class="cell-title" label="被访人信息" labelColor="#333" labelWidth="100px" />
      <cell-text label="姓名*" :labelWidth="80" padding="12px 0">{{ formObj.toVisitPersonName }}</cell-text>
      <cell-text label="手机号*" :labelWidth="80" padding="12px 0" border="none">{{ formObj.toVisitPersonPhone }}</cell-text>
    </view>

    <!-- 同行人信息 -->
    <view class="pd-20 form-panel">
      <cell-text class="cell-title" label="同行人信息" labelColor="#333" labelWidth="100px" :border="formObj.fellowPerson.length ? 'bottom' : 'none'" />
      <block v-for="(item, index) in formObj.fellowPerson" :key="index">
        <cell-text label="姓名" :labelWidth="80" padding="12px 0">{{ item.fellowPerson }}</cell-text>
        <cell-text label="手机号" :labelWidth="80" padding="12px 0">{{ item.fellowPersonPhone }}</cell-text>
      </block>
    </view>

    <!-- 车牌号 -->
    <view class="pd-20 form-panel">
      <cell-text class="cell-title" label="车牌号" labelColor="#333" labelWidth="100px" :border="formObj.carNum.length ? 'bottom' : 'none'" />
      <block v-for="(item, index) in formObj.carNum" :key="index">
        <cell-text label="车牌号" :labelWidth="80" padding="12px 0">{{ item }}</cell-text>
      </block>
    </view>
  </view>
</template>

<script>
import CellText from '@/components/cell-text/cell-text'
import { getVisitRecordDetailList } from '@/service/wxmanage'

/**
 * query: type
 */
export default {
  name: 'VisitRegist',
  components: {
    CellText
  },
  data() {
    return {
      formType: 'regist', // regist: 访客登记,  invite: 邀请访客
      formObj: {
        fellowPerson: [],
        carNum: [],
      }
    }
  },
  onLoad({ recordId }) {
    this.getVisitDetail(recordId)
  },
  methods: {
    async getVisitDetail(recordId) {
      if (!recordId) return

      const params = {
        recordId
      }
      const res = await getVisitRecordDetailList({ data: params })
      const data = res.data || {}
      this.formObj = {
        fellowPerson: [],
        carNum: [],
        ...data,
      }
      this.formType = data.recordType
      uni.setNavigationBarTitle({ title: this.formType == 'invite' ? '访客邀请' : '访客登记' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: #f4fafb;
  padding: 30px 15px 0;
  box-sizing: border-box;
}
.page-bg {
  background-image: url(@/static/components/visit-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 200px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}
.pd-20 {
  padding: 0 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  position: relative;
  z-index: 1;
}
.form-panel {
  background-color: #fff;
}
.cell-text {
  font-size: 14px;
}
::v-deep .cell-title .cell-text-label {
  font-size: 15px;
  font-weight: bold;
}
.gray-text {
  color: #c0c9db;
}
::v-deep .u-radio-group {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;

  .u-radio {
    margin-right: 6px;
  }
}
::v-deep .add-btn .u-icon {
  margin-right: 8px;
}
::v-deep .u-tag--mini {
  padding: 0 7px;
}
</style>