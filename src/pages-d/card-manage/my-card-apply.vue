<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <!-- 卡片信息 -->
    <view class="form-title cell-border">卡片信息</view>
    <view style="padding: 0 15px">
      <cell-text label="卡片名称" :labelWidth="85">{{ queryObj.cardName }}</cell-text>
      <cell-text label="办理业务" :labelWidth="85">{{ queryObj.businessName }}</cell-text>
      <cell-text label="购买数量" :labelWidth="85" contentAlign="flex-end" border="none">
        <u-number-box v-model="formObj.cardnum" :max="inputMaxNum" />
      </cell-text>
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 申请类型 -->
    <view class="form-title cell-border">卡片信息</view>
    <view style="padding: 0 15px">
      <cell-text :labelWidth="0" contentAlign="center" border="none">
        <u-radio-group v-model="formObj.cardradio" placement="row" @change="formObj.cardnum = 1">
          <u-radio label="个人申请" :name="1" v-if="applyType == 'all' || applyType == 'person'" :customStyle="{ marginRight: '10px' }" />
          <u-radio label="企业申请" :name="2" v-if="applyType == 'all' || applyType == 'company'" />
        </u-radio-group>
      </cell-text>
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 申请资料 -->
    <view class="form-title cell-border">申请资料</view>
    <view class="list-form" style="padding: 0 15px; display: flex;">
      <u-form labelPosition="left" :model="formObj" :rules="formRules" ref="elFormModel" labelWidth="85px" style="width: 100%;">
        <u-form-item label="联系人" borderBottom prop="contactName">
          <u-input v-model="formObj.contactName" placeholder="请输入" border="none" />
        </u-form-item>
        <u-form-item label="联系电话" borderBottom prop="contactNumber">
          <u-input v-model="formObj.contactNumber" placeholder="请输入" border="none" :maxlength="11" />
        </u-form-item>
        <u-form-item label="房号" borderBottom prop="houseRoom" @click="houseObj.isShow = true">
          <u-input v-model="formObj.houseRoom" disabled disabledColor="#ffffff" placeholder="请选择" border="none" />
          <u-icon slot="right" name="arrow-right" />
        </u-form-item>
        <u-form-item label="公司名称" borderBottom prop="enterpriseName">
          <u-input v-model="formObj.enterpriseName" placeholder="请输入" border="none" />
        </u-form-item>
        <u-form-item label="车牌号" borderBottom prop="fieldvalue">
          <u-input v-model="formObj.fieldvalue" placeholder="请输入" border="none" />
        </u-form-item>
      </u-form>
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 身份证资料 -->
    <view class="form-title form-title--between cell-border">
      <text>身份证资料</text>
      <u-icon name="plus-circle-fill" :color="THEME_COLOR" @click="addIDCardItem" />
    </view>
    <view style="padding: 0 15px; display: flex;" v-for="(item, index) in idCardList" :key="index">
      <view class="idcard-num">{{ index + 1 }}</view>
      <view>
        <cell-text label="姓名" border="none" isRight :labelWidth="100" :isDesc="!!item.nameError" descAlign="content">
          <u-input v-model="item.name" placeholder="请输入" border="none" />
          <u-icon slot="right" name="minus-circle-fill" :color="THEME_COLOR" @click="delIDCardItem(index)" />
          <text slot="desc" style="color: #f56c6c;">{{ item.nameError }}</text>
        </cell-text>
        <cell-text label="身份证号码" border="none" isRight :labelWidth="100" :padding="0" :isDesc="!!item.idNumberError" descAlign="content">
          <u-input v-model="item.idNumber" placeholder="请输入" border="none" />
          <text slot="desc" style="color: #f56c6c;">{{ item.idNumberError }}</text>
        </cell-text>
        <cell-text label="白底电子照片" border="none" :labelWidth="100" :isDesc="!!item.imgUrlError" descAlign="content">
          <text slot="desc" style="color: #f56c6c;">{{ item.imgUrlError }}</text>
        </cell-text>
        <u-upload :fileList="item.imgUrl" :maxCount="1" :previewFullImage="true" @afterRead="uploadPic($event, item.imgUrl)" @delete="deletePic($event, item.imgUrl)" />
      </view>
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />
    
    <!-- 资料上传 -->
    <view class="form-title cell-border">资料上传</view>
    <cell-text label="驾驶证及行驶证" :labelWidth="120" :customStyle="{ margin: '0 15px' }" border="none" isDesc descColor="#c8c9cc">
      <text slot="desc">最多可上传6张照片</text>
    </cell-text>
    <view style="padding: 0 15px;">
      <u-upload class="upload-img" :fileList="formObj.fileList" :maxCount="6" :previewFullImage="true" @afterRead="uploadPic($event, formObj.fileList)" @delete="deletePic($event, formObj.fileList)" />
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 办理须知 -->
    <view class="form-title cell-border">办理须知</view>
    <view style="padding: 10px 15px; font-size: 14px;">{{ cardObj.cardNeedToKnow }}</view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 按钮 -->
    <view class="footer-panel">
      <view class="footer-panel--unit">
        <text>￥</text><text class="footer-panel--stress">{{ sumPrice }}</text><text>元</text><text style="color: initial; margin-left: 5px;">已选{{ formObj.cardnum }}张</text>
      </view>
      <u-button type="primary" text="提交申请" @click="handleSubmit" style="width: 144px;flex: 0 0 auto;" />
    </view>

    <!-- 房产地址选择 -->
    <house-auth-popup :isShow="houseObj.isShow" @select="onHouseSelect" />
    <u-toast ref="elToast" />
  </view>
</template>

<script>
import Utils from '@/js/utils'
import CellText from '@/components/cell-text/cell-text'
import HouseAuthPopup from '@/pages-d/card-manage/modules/house-auth-popup'
import { uploadMutiFile } from '@/service/landcrm'
import { getCardDetail, saveCardHandle, selectCardHandleById, commitCardHandle } from '@/service/returnVisit'

export default {
  name: 'MyCardApply',
  components: {
    CellText,
    HouseAuthPopup
  },
  data() {
    const { MEMBER_ID, AREA_ID, PROJECT_ID, COMPLANY_ID, O_USER_INFO, PROJECT_NAME } = this.$constant
    let userInfo = {}
    try {
      userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
    } catch (err) { }

    return {
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      userInfo,
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      projectName: Utils.storageAction({ key: PROJECT_NAME, action: 'get' }),
      queryObj: {
        id: '',
        cardName: '',
        businessName: '',
        businessPrice: 0,
        maxNumber: 0,
        maxNumberCompany: 0
      },
      formObj: {
        cardnum: 1,
        cardradio: 1,
        contactName: '',
        contactNumber: '',
        houseRoom: '',
        enterpriseName: '',
        fieldvalue: '',
        fileList: [],
        cardNeedToKnow: ''
      },
      formRules: {
        contactName: { type: 'string', required: true, message: '请填写完整' },
        contactNumber: [
          { type: 'string', required: true, message: '请填写完整' },
          { validator: (rule, value, callback) => uni.$u.test.mobile(value), required: true, message: '手机号码不正确' }
        ],
        houseRoom: { type: 'string', required: true, message: '请选择房号' },
        enterpriseName: { type: 'string', required: true, message: '请填写完整' },
        fieldvalue: { type: 'string', required: true, message: '请填写完整' },
        idCardName: { type: 'string', required: true, message: '请填写完整' },
        idCardIdNumber: [
          { type: 'string', required: true, message: '请填写完整' },
          { validator: (rule, value, callback) => uni.$u.test.idCard(value), required: true, message: '身份证格式错误' }
        ],
        idCardImgUrl: { type: 'array', required: true, message: '请上传身份证白底照片' }
      },
      houseObj: {
        isShow: false,
        value: {}
      },
      cardObj: {},
      idCardList: []
    }
  },
  computed: {
    // 总价格
    sumPrice() {
      return this.queryObj.businessPrice * this.formObj.cardnum
    },
    applyType() {
      return this.queryObj.maxNumber == 0 ? 'company' : this.queryObj.maxNumberCompany == 0 ? 'person' : 'all'
    },
    inputMaxNum() {
      const applyTypeTmp = this.applyType
      const maxNumberTmp = this.queryObj.maxNumber
      const companyNumberTmp = this.queryObj.maxNumberCompany
      if (applyTypeTmp === 'person') return maxNumberTmp
      if (applyTypeTmp === 'company') return companyNumberTmp
      if (applyTypeTmp === 'all') return this.formObj.cardradio == 2 ? companyNumberTmp : maxNumberTmp
    }
  },
  onLoad(option) {
    console.log('option===',option)
    this.queryObj = {
      ...option,
      businessPrice: parseFloat(option.businessPrice) || 0,
      maxNumber: Number(option.maxNumber) || 0,
      maxNumberCompany: Number(option.maxNumberCompany) || 0
    }
    this.initFormObj()
    this.getCardDetail()

    console.log('applyTypeTmp===',this.applyType,this.queryObj.maxNumber)
  },
  created() {
    // this.getUrlQuery()
    // this.initFormObj()
    // this.getCardDetail()
  },
  methods: {
    initFormObj() {
      this.formObj.cardradio = ['all', 'person'].includes(this.applyType) ? 1 : 2
    },
    async getUrlQuery() {
      const query = this.$route.query
      this.queryObj = {
        ...query,
        businessPrice: parseFloat(query.businessPrice) || 0,
        maxNumber: Number(query.maxNumber) || 0,
        maxNumberCompany: Number(query.maxNumberCompany) || 0
      }
    },
    // 获取办卡详情
    async getCardDetail() {
      const res = await getCardDetail({ id: this.queryObj.id })
      
      this.cardObj = res.data || {}
      this.cardObj.cardNeedToKnow = '办卡须知请保证提供信息真实有效，若因个人信息造成的后果，办卡中心概不负责'
    },
    // 房产地址选择
    onHouseSelect(item) {
      this.houseObj.isShow = false
      this.houseObj.value = item
      this.formObj.contactName = item.ownerName
      this.formObj.contactNumber = item.ownerPhones
      this.formObj.houseRoom = item.address
    },
    // 上传图片
    async uploadPic(event, arrObj) {
      const fileList = {
        ...event.file,
        status: 'uploading',
        message: '上传中',
      }
      arrObj.push(fileList)

      const res = await uploadMutiFile(fileList.url)
      const fileInfo = res.fileInfo

      let lastIndex = arrObj.length - 1
      let item = arrObj[lastIndex]
      arrObj.splice(lastIndex, 1, {
        ...item,
        url: fileInfo.resPath,
        fileId: fileInfo.fid,
        status: 'success',
        message: ''
      })
    },
    /**删除图片 */
    deletePic(event, arrObj) {
      arrObj.splice(event.index, 1)
    },
    addIDCardItem() {
      this.idCardList.push({
        name: '',
        idNumber: '',
        imgUrl: [],
        // 以下后面带 Error 是用来展示错误消息的
        nameError: '',
        idNumberError: '',
        imgUrlError: '',
      })
    },
    delIDCardItem(index) {
      this.idCardList.splice(index, 1)
    },
    async handleSubmit() {
      const vali = await this.$refs.elFormModel.validate().catch(err => [false])
      if (vali[0] === false) return

      const valiOther = this.otherFormValidate()
      if (valiOther === false) return

      const idCardListTmp = this.idCardList.map(item => ({
        ...item,
        imgUrl: item.imgUrl[0]?.url || ''
      }))
      const params = {
        contactName: this.formObj.contactName,
        applicationType: this.formObj.cardradio,
        applicant:  this.formObj.contactName, // 申请人
        createUser: this.userInfo.fullName,
        memberId: this.memberId,
        operator: this.userInfo.fullName, // 修改人
        number: this.formObj.cardnum, // 数量
        cardInfo: JSON.stringify(idCardListTmp),
        applicationInformation: JSON.stringify(this.getApplicationInformation()) ,//申请信息
        cardBusiness: this.queryObj.businessName,//办理业务
        cardId: this.queryObj.id,
        cardType: this.queryObj.cardName, // 卡片类型
        companyId: this.companyId,
        enterpriseName: this.formObj.enterpriseName,
        payState: this.sumPrice == 0 ? 4 : 1, // 支付状态（0-未支付，1-待支付，2-已支付，3-已退款 ）
        contactNumber: this.formObj.contactNumber,
        payAmount: this.sumPrice, // 支付金额
        handleState: this.sumPrice == 0 ? 3 : 1, // 办理状态（1-待支付 2-待确认收款 3-待审核  4-处理中　5-已完成 6-已驳回 7-已取消 )
        houseRoom: this.formObj.houseRoom, // 房号
        areaId: this.areaId,
        buildingId: this.houseObj.value.buildingId,
        contactAddress: this.formObj.houseRoom, // 路址
        infoId: this.houseObj.value.addrId, // 房间ID
        projectId: this.projectId,
        projectName: this.projectName,
        memberPhone: this.userInfo.phoneNumber,
      }
      const res = await saveCardHandle(params)
      if(res.status == 200){
        this.$refs.elToast.show({
              type: 'success',
            message: '提交成功'
          })
        if (this.sumPrice == 0) {
           this.commitCardHandle(res.data)
         } else {
           this.linkToPayment(res.data)
         }
      }else {
          this.$refs.elToast.show({
              type: 'error',
            message: res.message
          })
      }
      
    },
    otherFormValidate() {
      if (this.idCardList.length <= 0) {
        this.$refs.elToast.show({
          type: 'error',
          message: '请填写身份证资料'
        })
        return false
      }

      // 校验身份证资料
      let idCardError = false
      this.idCardList.forEach(item => {
        item.nameError = this.checkValByRule(item.name, this.formRules.idCardName).message
        item.idNumberError = this.checkValByRule(item.idNumber, this.formRules.idCardIdNumber).message
        item.imgUrlError = this.checkValByRule(item.imgUrl, this.formRules.idCardImgUrl).message

        if (!idCardError) {
          idCardError = !!item.nameError || !!item.idNumberError || !!item.imgUrlError
        }
      })
      if (idCardError) return false

      if (this.formObj.fileList.length <= 0) {
        this.$refs.elToast.show({
          type: 'error',
          message: '请上传驾驶证及行驶证照片'
        })
        return false
      }

      return true
    },
    // 根据 rule 规则校验 value，必须存在 required 才能完成校验
    checkValByRule(value, rule) {
      const type = Utils.kindOf(rule)
      if (type === 'object') {
        if (!rule.required) return { success: true, message: '' }

        let typeMatch = rule.type ? (Utils.kindOf(value) === rule.type && !this.isEmpty(value)) : null // 如果存在 type，则 匹配类型 和 判空
        let valiMatch = rule.validator ? Utils.kindOf(rule.validator) === 'function' && rule.validator(rule, value) : null // 如果存在 validator，则 根据函数进行校验
        // 如果其中某一种规则出现不匹配，则校验失败
        if (Utils.kindOf(typeMatch) !== 'null' && !typeMatch) return { success: false, message: rule.message }
        if (Utils.kindOf(valiMatch) !== 'null' && !valiMatch) return { success: false, message: rule.message }
      } else if (type === 'array' && rule.length) {
        // 如果是数组，则其中一条规格显示校验失败则停止
        let res = {}
        rule.some(item => {
          res = this.checkValByRule(value, item)
          return !res.success
        })
        return res
      }

      return { success: true, message: '' }
    },
    isEmpty(value) {
      const type = Utils.kindOf(value)
      if (type === 'object') return Object.keys(value).length === 0
      if (type === 'array') return value.length === 0
      if (type === 'string') return value.length === 0
      return true
    },
    getApplicationInformation() {
      return [
        { key: '联系人', value: this.formObj.contactName },
        { key: '联系电话', value: this.formObj.contactNumber },
        { key: '公司名称', value: this.formObj.enterpriseName },
        { key: '房号', value: this.formObj.houseRoom },
        { key: '身份信息(姓名/身份证号/白底电子照片)', value: this.idCardList.map(item => ({
          ...item,
          imgUrl: item.imgUrl[0]?.url || ''
        })) },
        { key: '驾驶证及行驶证', value: this.formObj.fileList.map(item => item.url).join(',') },
        { key: '车牌号', value: this.formObj.fieldvalue }
      ]
    },
    async commitCardHandle(id) {
      const params = {
        companyId: this.companyId,
        handleId: id,
        ownerName: this.formObj.contactName,
        processKey: 'kfCardApplication',
        projectId: this.projectId
      }
      const res = await commitCardHandle(params)
      if (res.status == 200) {
        this.$refs.elToast.show({
          type: 'success',
          message: '提交成功'
        })

        uni.navigateBack()
      } else {
        this.$refs.elToast.show({
          type: 'error',
          message: res.message
        })
      }
    },
    // 跳转到支付页面
    async linkToPayment(id) {
      const res = await selectCardHandleById({ id })
      const data = res.data || {}
      // 支付截至时间
      const endPayDate = new Date(data.createDate.replace(/-/g, '/'))
      endPayDate.setMinutes(endPayDate.getMinutes() + (parseInt(data.payTimelimit) || 0))
      const enterpriseName = this.formObj.enterpriseName
      const other = `${this.queryObj.cardName}-${this.queryObj.businessName}/${this.formObj.contactName}/${this.formObj.contactNumber}${enterpriseName ? '/' + enterpriseName : ''}/${data.handleCode}`

      const orderInfo = {
        orderId: data.handleId, // 订单ID
        totalAmount: data.payAmount, // 缴费金额
        isCountdown: true, // 是否倒计时
        countdownDate: uni.$u.timeFormat(endPayDate, 'yyyy-mm-dd hh:MM:ss'), // 倒计时时间  2020-12-01 17:00:00
        PaymentInfo: `${data.cardType}-${data.cardBusiness}`, // 支付信息
        returnUrl: Utils.spliceGetUrl('/pages-d/card-manage/my-card-detail', { id: data.handleId, cardId: data.cardId }), // 支付成功跳转页面
        notifyUrl: data.notifyUrl,
        banktransferUrl: data.banktransferUrl,
        model: 'card',
        other
      }
      // 跳转到支付页面
      uni.redirectTo({ url: Utils.spliceGetUrl('', { orderInfo: encodeURIComponent(JSON.stringify(orderInfo)) }) })
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
  padding-left: 23px;
  padding-right: 15px;
  position: relative;

  &::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 18px;
    background-color: var(--app-primary-color);
    margin-right: 2px;
    position: absolute;
    left: 15px;
    top: 10px;
  }
  &.form-title--between {
    justify-content: space-between;
  }
}
.cell-border {
  border-bottom: 1px solid #D9D9D9;
}
.u-form {
  padding: 0 15px;
}
.footer-panel {
  background-color: #fff;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: stretch;
}
.footer-panel--unit {
  display: flex;
  align-items: center;
  flex: 1;
  padding-left: 10px;
  font-size: 12px;
  color: var(--app-primary-color);
}
.footer-panel--stress {
  font-weight: bold;
  font-size: 22px;
  margin-top: -7px;
}
/* .upload-img {
  padding: 0 15px;
} */
.idcard-num {
  background-color: var(--app-primary-color);
  width: 15px;
  height: 15px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
  line-height: 15px;
  text-align: center;
  margin-top: 15px;
  margin-right: 20px;
}
 ::v-deep .footer-panel .u-button {
  width: 144px !important;
  flex: 0 0 auto;
  height: 40px;
  position: relative;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  flex-direction: row;
  background-color: var(--app-primary-color) !important;
  border-color: var(--app-primary-color) !important;
}
::v-deep .list-form .u-form {
  width: 100%;
}
</style>