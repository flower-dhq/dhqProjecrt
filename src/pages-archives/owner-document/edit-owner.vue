<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="form-panel">
      <cell-text label="姓名 *" labelWidth="160rpx" padding="30rpx 0" customStyle="font-size: 28rpx; width: auto;">
        <u--input placeholder="请输入姓名" v-model="formObj.ownerName" inputAlign="right" clearable border="none" fontSize="28rpx" />
      </cell-text>
      <cell-text label="性别 *" labelWidth="160rpx" padding="30rpx 0" customStyle="font-size: 28rpx; width: auto;" isRight @click="cellEvent('sex')">
        <text style="width: 100%; text-align: right; color: #303133;">{{formObj.sex | getSexText}}</text>
        <u-icon slot="right" name="arrow-right" />
      </cell-text>
      <cell-text label="联系电话 *" labelWidth="160rpx" padding="30rpx 0" border="none" customStyle="font-size: 28rpx; width: auto;">
        <u--input placeholder="联系电话" v-model="formObj.ownerPhone" inputAlign="right" clearable border="none" fontSize="28rpx" />
      </cell-text>
    </view>

    <view class="footer-panel">
      <u-button text="保存" type="primary" customStyle="height: 88rpx; font-size: 30rpx;" @click="saveOwnerInfo" />
    </view>

    <u-picker :show="sexObj.isShow" :columns="sexObj.list" keyName="label" @cancel="sexObj.isShow = false" @confirm="sexConfirm" />
    <u-toast ref="messageEl" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text'
import pageRefresh from '@/js/pageRefresh'
import { getOwnerInfoById } from '@/service/landcrm'
import { updateCrmOnwerInfo } from '@/service/landcrm'

export default {
  components: {
    CellText
  },
  data() { 
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
    return {
      companyId:companyId,
      ownerId: '',
      ownerData: {}, // 业主信息
      formRule: [
        // { label: '昵称', name: 'nickName' },
        { label: '姓名', name: 'ownerName', required: true },
        { label: '性别', name: 'sex', icon: 'arrow-right' },
        { label: '联系电话', name: 'ownerPhone', required: true },
        // { label: '验证码', name: 'code', slot: true }
      ],
      formObj: {
        ownerName: '',
        sex: '',
        ownerPhone: '',
      },
      sexObj: {
        isShow: false,
        list: [[
          { label: '男', name: 0 },
          { label: '女', name: 1 }
        ]]
      },
      codeObj: {
        isStart: false,
        seconds: 60,
        value: '获取验证码',
        id: null
      }
    }
  },
  computed: {
    // 是否换了新的手机号码
    isNewPhone() {
      return this.ownerData.ownerPhone !== this.formObj.ownerPhone
    }
  },
  filters: {
    getSexText(val) {
      const map = {
        0: '男',
        1: '女'
      }
      return map[val] || ''
    }
  },
  onLoad(options) {
    this.ownerId = options.ownerId

    this.getOwnerInfoById()
  },
  methods: {
    cellEvent(type) {
      if (type == 'sex') {
        this.sexObj.isShow = true
      }
    },
    sexConfirm({ value }) {
      const selItem = value[0]
      if (!selItem) return

      this.formObj.sex = selItem.name
      this.sexObj.isShow = false
    },
    // 获取业主信息
    async getOwnerInfoById() {
      const params = {
        data: {
          companyId: this.companyId,
          ownerId: this.ownerId
        },
        hideLoading: true
      }
      const res = await getOwnerInfoById(params)
      const data = this.ownerData = res.data ?? {}
      this.formObj.ownerName = data.ownerName || ''
      this.formObj.ownerPhone = data.ownerPhone || ''
      this.formObj.sex = data.sex || ''

      // 如果是游客，则不显示昵称
      // memberFlag: 1: 会员; 0: 游客
      if (data.memberFlag == 0) {
        this.formRule = this.formRule.slice(1)
      }
    },
    // 保存业主信息
    async saveOwnerInfo() {
      let validMsg = ''
      if (!this.formObj.ownerName) {
        validMsg = '请填写姓名'
      } else if (!this.formObj.ownerPhone) {
        validMsg = '请填写联系电话'
      }
      if (validMsg) {
        this.$refs.messageEl.show({
          message: validMsg
        })
        return
      }

      const _ownerData = this.ownerData
      const params = {
        data: {
          companyId: this.companyId,
          ownerInfoId: this.ownerId,
          unifiedMemberId: _ownerData.memberFlag == 1 ? _ownerData.unifiedMemberId : '',
          ownerName: this.formObj.ownerName,
          ownerSex: this.formObj.sex,
          ownerPhone: this.formObj.ownerPhone,
        }
      }
      const res = await updateCrmOnwerInfo(params)
      if (res.success) {
        pageRefresh.setRefresh('OWNER_INFO')
        this.$refs.messageEl.show({
          message: '保存成功'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 400)
      } else {
        this.$refs.messageEl.show({
          message: res.message || ''
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: initial;
}
.form-panel {
  background-color: #fff;
  padding: 0 30rpx;
  font-size: 30rpx;
  color: #333;
}
::v-deep .u-button__text {
  font-size: 28rpx !important;
}
.footer-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  bottom: 100rpx;
  padding: 0 40rpx;
}
</style>