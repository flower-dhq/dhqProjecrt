<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="box-panel" v-if="getBoxType == 'info'">
      <view class="box-fluttering">业主已同意放行！</view>
      <text class="box-title">信息详情</text>
      <view class="box-content-info">
        <cell-text label="房产地址" :labelWidth="100" border="none">{{ releaseDetail.address }}</cell-text>
        <cell-text label="物品搬出人" :labelWidth="100" border="none">{{ releaseDetail.pedestriansName }}</cell-text>
        <cell-text label="联系号码" :labelWidth="100" border="none">{{ releaseDetail.telephone }}</cell-text>
        <cell-text v-if="releaseDetail.IDCardNum" label="物品搬出人ID" :labelWidth="100" border="none">{{ releaseDetail.IDCardNum }}</cell-text>
        <cell-text label="放行时间" :labelWidth="100" border="none">{{ releaseDetail.submitterName }}</cell-text>
        <cell-text label="事由" :labelWidth="100" border="none">{{ releaseDetail.descriptionContent }}</cell-text>
      </view>
    </view>

    <block v-else-if="getBoxType == 'progress'">
      <text class="box-title">进度详情</text>
      <view class="box-content">
        <u-steps current="1" dot :activeColor="THEME_COLOR">
          <u-steps-item title="已提交" :desc="getCreateDate" />
          <u-steps-item title="审核中" :desc="getCreateDate" />
          <u-steps-item :title="getAuthType == 2 ? '已通过' : getAuthType == 3 ? '已拒绝' : '已通过'" :desc="getApproveDate" />
        </u-steps>
        <u-button shape="circle" type="primary" text="生成放行条" :disabled="getAuthType == 2" style="width: 80%;" @click="createDecpass" />
      </view>
    </block>

    <block v-else-if="getBoxType == 'check'">
      <text class="box-title">审核详情</text>
      <view class="box-content font-14">
        <text class="subtitle">申请信息</text>
        <cell-text label="申请姓名" border="none">{{ releaseDetail.submitterName }}</cell-text>
        <cell-text label="联系电话" border="none">{{ releaseDetail.submitterPhone }}</cell-text>
        <cell-text label="房产地址" border="none">{{ releaseDetail.address }}</cell-text>
        <cell-text label="放行时间" border="none">{{ getDateRange }}</cell-text>
        <cell-text label="申请内容">{{ releaseDetail.descriptionContent }}</cell-text>
        <view class="content-footer">
          <u-button v-if="getAuthType == 1" shape="circle" type="primary" text="拒绝" color="#d9dce7" style="width: 40%;" @click="authDecpass('refuse')" />
          <u-button v-if="getAuthType == 1" shape="circle" type="primary" text="放行" style="width: 40%;" @click="authDecpass('pass')" />
          <u-text v-if="getAuthType == 2" type="success" size="18" align="center" text="已通过" />
          <u-text v-if="getAuthType == 3" type="error" size="18" align="center" text="已拒绝" />
        </view>
      </view>
    </block>

    <u-toast ref="elToast" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text/cell-text.vue'
import Utils from '@/js/utils'
import { getApplyVisitDetail, authDecpass, createDecpass } from '@/service/wxmanage'

export default {
  name: 'ReleaseAnnounceProgress',
  components: {
    CellText
  },
  data() {
    const { MEMBER_ID } = this.$constant

    return {
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      releaseDetail: {},
      passId:''
    }
  },
  computed: {
    getDateRange() {
      return uni.$u.timeFormat(this.releaseDetail.startTime, 'yyyy-mm-dd hh:MM') + ' ~ ' + uni.$u.timeFormat(this.releaseDetail.endTime, 'yyyy-mm-dd hh:MM')
    },
    getAuthType() {
      return this.releaseDetail.authType
    },
    getBoxType() {
      /**
       * @property {number} whetherOwner 0：不是业主 1：业主
       * @property {number} authType 1：待审核 2：审核通过 3：审核拒绝
       */
      const { whetherOwner, authType, createPass, submitter } = this.releaseDetail
      if (authType == 2 && (whetherOwner == 1 || (whetherOwner == 0 && createPass == 1))) {
        return 'info'
      } else if (whetherOwner == 0 && createPass == 0 && submitter == this.memberId) {
        return 'progress'
      } else {
        return 'check'
      }
    },
    getCreateDate() {
      return uni.$u.timeFormat(this.releaseDetail.createDate, 'mm-dd')
    },
    getApproveDate() {
      const tmp = this.releaseDetail.approveDate
      return tmp ? uni.$u.timeFormat(tmp, 'mm-dd') : ''
    }
  },
  // created() {
  //   this.getApplyVisitDetail()
  // },
  onLoad(e) {
    this.passId = e.passId
    this.getApplyVisitDetail()
    console.log(102,e)
  },
  methods: {
    async getApplyVisitDetail() {
      const res = await getApplyVisitDetail(this.passId)
      const data = res.data || {}
      this.releaseDetail = Object.assign({}, data, {
        createPass: data.createPass == 1 ? 1 : 0
      })
    },

    /**生成放行条 */
    async createDecpass() {
      const params = {
        releaseId: this.passId
      }
      const res = await createDecpass(params)
      if (res.status != 200) {
        this.$refs.elToast.show({
          type: 'error',
          message: '生成失败，请稍后再试'
        })
        return
      }

      this.$refs.elToast.show({
        type: 'success',
        message: '放行条生成成功'
      })
      this.getApplyVisitDetail()
    },
    /**
     * 审核
     * @param {'pass'|'refuse'} type
     */
    async authDecpass(type) {
      const params = {
        authType: type == 'pass' ? 2 : 3,
        decpassAuthId: this.releaseDetail.decpassAuthId,
        operateId: this.memberId,
        operateName: ''
      };
      const res = await authDecpass(params)

      if (res.status == 200) {
        this.$refs.elToast.show({
          type: 'success',
          message: type == 'pass' ? '放行成功' : '拒绝成功'
        })

        this.getApplyVisitDetail()
      } else {
        this.$refs.elToast.show({
          type: 'error',
          message: type == 'pass' ? '放行失败，请稍后再试' : '拒绝失败，请稍后再试'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: #f6f7f9;

  &::before {
    content: '';
    width: 100%;
    height: 0.1px;
    display: block;
  }
}
.box-title {
  font-size: 15px;
  height: 50px;
  line-height: 50px;
  margin: 0 15px;
  font-weight: bold;
}
.box-content {
  border-radius: 8px;
  background-color: #fff;
  margin: 0 15px;
  padding: 15px 15px;

  .subtitle {
    font-weight: bold;
    padding: 10px 15px;
  }
}
.box-content-info {
  display: flex;
  flex-direction: column;
  padding: 0 15px;
}
.box-panel {
  min-height: calc(100vh - 29px);
  background-color: #fff;
  border-radius: 8px;
  margin: 15px 20px;
  overflow: hidden;
}
.box-fluttering {
  position: relative;
  height: 60px;
  background-color: var(--app-primary-color);
  margin-bottom: 30px;
  text-align: center;
  line-height: 80px;
  color: #fff;
  font-size: 20px;

  &::after {
    content: '';
    width: 0;
    height: 0;
    display: block;
    border-top: 30px solid var(--app-primary-color);
    border-left: calc(50vw - 15px) solid transparent;
    border-right: calc(50vw - 15px) solid transparent;
    position: absolute;
    bottom: -30px;
  }
}
.font-14 {
  font-size: 14px;
}
.u-steps {
  padding-bottom: 20px;
}
.content-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px 0;
}
</style>