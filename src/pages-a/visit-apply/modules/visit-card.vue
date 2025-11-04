<template>
  <view class="visit-card" @click.stop="linkTo">
    <cell-text class="visit-card-label" :label="getLabel" isRight customStyle="font-size: 14px" labelColor="#333" :labelWidth="100">
      <text>预约时间：{{ data.planVisitTime | date('yyyy-mm-dd') }}</text>
      <text slot="right" :style="[getStatusStyle]">{{ data.recordStatusText }}</text>
    </cell-text>
    <cell-text class="visit-card-label" label="预约人员：" customStyle="font-size: 13px" labelColor="#666" :labelWidth="70" border="none" padding="10px 0 4px">
      <text>{{ data.visitPersonName }}</text>
    </cell-text>
    <cell-text class="visit-card-label" label="预约事由：" customStyle="font-size: 13px" labelColor="#666" :labelWidth="70" padding="4px 0 10px" :border="(data.recordStatus == 1 || getBtnStatus) ? 'bottom' : 'none'">
      <text>{{ data.configDetailName }}</text>
    </cell-text>
    <cell-text contentAlign="flex-end" border="none" :labelWidth="0" v-if="data.recordStatus == 1 || getBtnStatus">
      <u-button v-if="data.recordStatus == 1" :customStyle="{ width: '80px', height: '32px', margin: '0 0 0 12px' }" text="取消" shape="circle" type="primary" plain @click.native.stop="openModal(4)" />
      <u-button v-if="getBtnStatus" :customStyle="{ width: '80px', height: '32px', margin: '0 0 0 12px' }" text="拒绝" shape="circle" @click.native.stop="openModal(3)" />
      <u-button v-if="getBtnStatus" :customStyle="{ width: '80px', height: '32px', margin: '0 0 0 12px' }" text="通过" shape="circle" type="primary" plain @click.native.stop="openModal(1)" />
    </cell-text>

    <u-toast ref="elToast" />
    <u-modal :show="modalShow" showCancelButton asyncClose @confirm="handleVisitRecord" @cancel="closeModal">
			<view class="slot-content">
				<text style="margin: 0 auto;">{{modalContent}}</text>
			</view>				
		</u-modal>
  </view>
</template>

<script>
import CellText from '@/components/cell-text/cell-text'
import { auditVisitApproval } from '@/service/wxmanage'

export default {
  name: 'VisitCard',
  components: {
    CellText
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  options: {
    virtualHost: true
  },
  data() {
    return {
      modalShow: false,
      modalSel: 0,
      modalContent: ''
    }
  },
  computed: {
    /**
     * 获取状态的样式
     * 0: 待审核, 1: 已审核（待拜访）, 2: 已完成, 3: 已拒绝, 4: 已取消, 5: 已过期
     */
    getStatusStyle() {
      const status = this.data.recordStatus
      let style = { color: '' }
      if (status == 0) style.color = this.THEME_COLOR
      if (status == 1) style.color = '#f42323'
      if (status == 2) style.color = '#01aa77'
      if ([3, 4, 5].includes(status)) style.color = '#a0a0a0'
      return style
    },
    getBtnStatus() {
      const stat = !(this.data.visitPersonPhone == this.data.phoneNumber && [4, 6].includes(this.data.userType)) && this.data.isAudit == 1
      return this.data.recordStatus == 0 && stat
    },
    getLabel() {
      const type = this.data.recordType // 1: 访客登记, 2: 访客邀请
      return type == 2 ? '【邀请登记】' : '【预约登记】'
    }
  },
  methods: {
    // 显示确定弹窗
    openModal(status) {
      this.modalSel = status
      this.modalContent = status == 1 ? '是否通过' : status == 3 ? '是否拒绝' : status == 4 ? '是否确认取消？' : '是否确认操作'

      this.modalShow = true
    },
    closeModal() {
      this.modalShow = false
    },
    async handleVisitRecord() {
      let params = {
        recordId: this.data.recordId, // 访客记录id
        recordStatus: this.modalSel,                 // 审核通过：1，审核不通过：3，取消：4
        operator: this.data.memberId
      }
      if (this.data.toVisitCompanyContactPhone === this.data.phoneNumber) {
        params.toVisitCompanyContactPhone = this.data.phoneNumber // 企业联系人
        params.operateType = 3 // 操作类型，1: 访客, 2: 被访人, 3: 企业联系人
      } else if (this.data.toVisitPersonPhone === this.data.phoneNumber) {
        params.toVisitPersonPhone = this.data.phoneNumber // 企业员工
        params.operateType = 2
      } else {
        params.toVisitPersonPhone = this.data.phoneNumber
        params.operateType = 1
      }
      const res = await auditVisitApproval({ data: params }).finally()

      if (res.status == 200) {
        this.$refs.elToast.show({
          type: 'success',
          message: '成功'
        })
        this.modalShow = false
      } else {
        this.$refs.elToast.show({
          type: 'error',
          message: res.message
        })
      }

      setTimeout(()=> {
				this.$emit('submit')
			}, 500);
    },
    linkTo() {
			let BtnStatus = this.getBtnStatus?'1':'2'
      uni.navigateTo({ url: '/pages-d/visit-apply/myVisitorsRecordDetail?recordId=' + this.data.recordId+'&BtnStatus'+BtnStatus })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .visit-card-label .cell-text-label {
  font-weight: bold;
}
.visit-card {
  background-color: #fff;
  padding: 15px 15px 0;
}
</style>