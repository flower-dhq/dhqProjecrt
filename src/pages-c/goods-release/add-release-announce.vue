<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <!-- 用户信息表单 -->
    <view class="form-title cell-border">用户信息</view>
    <u-form labelPosition="left" :model="formModel" :rules="formRules" ref="elFormUser" labelWidth="112px">
      <u-form-item label="房源地址" borderBottom prop="userAddress" @click="addressObj.isShow = true">
        <u-input v-model="formModel.userAddress" disabled disabledColor="#ffffff" placeholder="请选择房源地址" border="none" />
        <u-icon slot="right" name="arrow-right" />
      </u-form-item>
      <u-form-item label="用户姓名" borderBottom prop="ownerName">
        <u-input v-model="formModel.ownerName" disabled disabledColor="#ffffff" placeholder="请输入业主姓名" border="none" />
      </u-form-item>
      <u-form-item label="联系电话" borderBottom prop="contactPhone">
        <u-input v-model="formModel.contactPhone" disabled disabledColor="#ffffff" placeholder="请输入联系电话" border="none" :maxlength="11" />
      </u-form-item>
    </u-form>

    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 物品详情表单 -->
    <view class="form-title cell-border">详情</view>
    <u-form labelPosition="left" :model="formModel" :rules="formRules" ref="elFormGoods" labelWidth="112px">
      <u-form-item label="物品搬出人" borderBottom prop="releaseName">
        <u-input v-model="formModel.releaseName" placeholder="请输入物品搬出人姓名" border="none" />
      </u-form-item>
      <u-form-item label="联系号码" borderBottom prop="releasePhone">
        <u-input v-model="formModel.releasePhone" placeholder="请输入物品搬出人手机号码" border="none" />
      </u-form-item>
      <u-form-item label="身份证号码" borderBottom prop="releaseIdCard">
        <u-input v-model="formModel.releaseIdCard" placeholder="请输入物品搬出人身份证号码" border="none" />
      </u-form-item>
      <u-form-item label="开始时间" borderBottom prop="startTime" @click="startDateObj.isShow = true">
        <u-input v-model="formModel.startTime" disabled disabledColor="#ffffff" placeholder="请选择放行开始时间" border="none" />
        <u-icon slot="right" name="arrow-right" />
      </u-form-item>
      <u-form-item label="结束时间" borderBottom prop="startTime" @click="endDateObj.isShow = true">
        <u-input v-model="formModel.endTime" disabled disabledColor="#ffffff" placeholder="请选择放行结束时间" border="none" />
        <u-icon slot="right" name="arrow-right" />
      </u-form-item>
      <u-form-item label="事由" borderBottom prop="releaseDescription">
        <u-textarea v-model="formModel.releaseDescription" placeholder="请填写具体搬出大件贵重物品及数量" border="none" />
      </u-form-item>
    </u-form>

    <view class="flex-around">
      <u-button type="primary" shape="circle" :customStyle="{ width: '80%', 'flex-shrink': 0 }" @click="handleSubmit">一键申请</u-button>
    </view>

    <u-picker :show="addressObj.isShow" :columns="addressObj.list" keyName="address" @cancel="addressObj.isShow = false" @confirm="addressConfirm" />
    <u-datetime-picker ref="elDateTimeStart" :show="startDateObj.isShow" v-model="startDateObj.value" mode="datetime" :minDate="startDateObj.minDate" @cancel="startDateObj.isShow = false" @confirm="DateConfirm('start', $event)" />
    <u-datetime-picker ref="elDateTimeEnd" :show="endDateObj.isShow" v-model="endDateObj.value" mode="datetime" :minDate="endDateObj.minDate" @cancel="endDateObj.isShow = false" @confirm="DateConfirm('end', $event)" />
    <u-toast ref="elToast" />
    <annouce-modal :show.sync="modalObj.isShow" :releaseNumber="modalObj.releaseNumber" />
  </view>
</template>

<script>
import AnnouceModal from './modules/annouce-modal.vue'
import Utils from '@/js/utils'
import { getOwnerBuildingListComm } from '@/service/community'
import { insertDecpass } from '@/service/wxmanage'

export default {
  name: 'AddReleaseAnnounce',
  components: {
    AnnouceModal
  },
  data() {
    const { MEMBER_ID, AREA_ID, PROJECT_ID, COMPLANY_ID } = this.$constant

    return {
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      formModel: {
        userAddress: '',
        ownerName: '',
        contactPhone: '',
        releaseName: '',
        releasePhone: '',
        releaseIdCard: '',
        startTime: '',
        endTime: '',
        releaseDescription: '',
      },
      formRules: {
        userAddress: { type: 'string', required: true, message: '请选择房源地址' },
        ownerName: { type: 'string', required: true, message: '请填写完整' },
        contactPhone: [
          { type: 'string', required: true, message: '请填写完整' },
          { validator: (rule, value, callback) => uni.$u.test.mobile(value), message: '手机号码不正确' }
        ],
        releaseName: { type: 'string', required: true, message: '请填写完整' },
        releasePhone: [
          { type: 'string', required: true, message: '请填写完整' },
          { validator: (rule, value, callback) => uni.$u.test.mobile(value), message: '手机号码不正确' }
        ],
        releaseIdCard: [
          { type: 'string', required: true, message: '请填写完整' },
          { validator: (rule, value, callback) => uni.$u.test.idCard(value), message: '身份证格式错误' }
        ],
        startTime: { type: 'string', required: true, message: '请选择' },
        endTime: { type: 'string', required: true, message: '请选择' },
        releaseDescription: { type: 'string', required: true, message: '请填写完整' },
      },
      addressObj: {
        isShow: false,
        list: [[]],
        value: ''
      },
      startDateObj: {
        isShow: false,
        minDate: new Date().getTime(),
        value: ''
      },
      endDateObj: {
        isShow: false,
        minDate: new Date().getTime(),
        value: ''
      },
      modalObj: {
        isShow: false,
        releaseNumber: undefined
      }
    }
  },
  created() {
    this.getBuildingList()
  },
  mounted() {
  },
  methods: {
    addressConfirm({ indexs, value, values }) {
      this.addressObj.isShow = false
      if (indexs.length <= 0) return

      this.addressObj.value = indexs[0]
      this.formModel.userAddress = value[0].address
      this.formModel.ownerName = value[0].regName
      this.formModel.contactPhone = value[0].ownerPhones
    },
    DateConfirm(type, data) {
      if (type == 'start') {
        this.formModel.startTime = uni.$u.timeFormat(data.value, 'yyyy-mm-dd hh:MM')
        this.startDateObj.isShow = false
      } else if (type == 'end') {
        this.formModel.endTime = uni.$u.timeFormat(data.value, 'yyyy-mm-dd hh:MM')
        this.endDateObj.isShow = false
      }
    },
    // 获取房源地址数据
    async getBuildingList() {
      const params = {
        companyId: this.companyId,
        memberId: this.memberId
      }
      const res = await getOwnerBuildingListComm({ data: params })
      const list = res.data || []
      if (!list.length) return

      this.addressObj.value = list[0]
      this.addressObj.list = [list]
      this.formModel.userAddress = list[0].address
      this.formModel.ownerName = list[0].regName
      this.formModel.contactPhone = list[0].ownerPhones
    },
    async handleSubmit() {
      const vali = await Promise.all([this.$refs.elFormUser.validate(), this.$refs.elFormGoods.validate()]).catch(err => [false])
      if (vali[0] === false) return

      const params = {
        addrId: this.addressObj.value.addrId, // 房产id
        address: this.addressObj.value.address, // 房产地址
        areaId: this.areaId, // 区域id
        projectId: this.projectId, // 项目id
        ownerInfoId: this.memberId, // 业主ownerId
        ownerName: this.formModel.ownerName, // 业主姓名
        ownerPhone: this.formModel.contactPhone, // 业主电话
        source: 1,
        submitter: this.memberId, // 提交人(申请人memberId)
        submitterName: this.formModel.ownerName,
        submitterPhone: this.formModel.contactPhone,
        pedestriansName: this.formModel.releaseName, // 放行人姓名
        telephone: this.formModel.releasePhone, // 放行人电话 
        startTime: this.formModel.startTime + ':00', // 放行开始时间
        endTime: this.formModel.startTime + ':00', // 放行结束时间
        descriptionContent: this.formModel.releaseDescription || '无', // 事由
        type: 1, // 1、放行，2、来访
        idCardNum: this.formModel.releaseIdCard
      }
      const res = await insertDecpass(params)
      if (res.status == 400) {
        this.$refs.elToast.show({
          type: 'error',
          message: '该房间没有业主，请联系管家'
        })
        return
      } else if (res.status != 200) {
        this.$refs.elToast.show({
          type: 'error',
          message: '提交失败，请联系管家'
        })
        return
      }

      if (this.addressObj.value.houseState == 2) {
        uni.redirectTo({ url: Utils.spliceGetUrl('/pages-c/goods-release/release-announce-progress', { passId: res.data.releaseId }) })
      } else {
        this.modalObj.isShow = true
        this.modalObj.releaseNumber = res.data.decpassCode
      }
    },
    linkTo() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
}
.form-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  height: 38px;
  line-height: 1;
  font-weight: bold;
  padding-left: 20px;

  &::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 18px;
    background-color: var(--app-primary-color);
    margin-right: 2px;
  }
}
.cell-border {
  border-bottom: 1px solid #D9D9D9;
}
::v-deep .u-form-item .u-form-item__body {
  padding: 10px 15px;
}
.gap {
  background-color: rgb(245, 245, 245);
  color: rgb(153, 153, 153);
  font-size: 12px;
  line-height: 2;
  padding: 10px 15px;
}
.flex-around {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}
::v-deep .u-form-item__body .u-textarea {
  padding: 0;
}
</style>