<template>
  <view class="page-panel" :style="THEME_CSS_VAR">
    <cell-text label="订单号" isRight padding="10px 15px" border="none">
      <text>{{ detailObj.handleCode }}</text>
      <text slot="right" :style="stateColor">{{detailObj.handleState}}</text>
    </cell-text>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 卡片信息 -->
    <view class="form-title cell-border">卡片信息</view>
    <view style="padding: 0 15px">
      <cell-text label="卡片名称" :labelWidth="85" border="none">{{ detailObj.cardType }}</cell-text>
      <cell-text label="办理业务" :labelWidth="85" border="none">{{ detailObj.cardBusiness }}</cell-text>
      <cell-text label="卡片数量" :labelWidth="85" border="none">{{ detailObj.number }}张</cell-text>
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 申请类型 -->
    <view class="form-title cell-border">申请类型</view>
    <view style="padding: 0 15px">
      <cell-text :labelWidth="0" contentAlign="center" border="none">
        <u-radio-group placement="row" disabled v-model="detailObj.applicationType">
          <u-radio label="个人申请" name="1" :customStyle="{ marginRight: '10px' }" />
          <u-radio label="企业申请" name="2" />
        </u-radio-group>
      </cell-text>
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 申请资料 -->
    <view class="form-title cell-border">申请资料</view>
    <view style="padding: 0 15px">
      <block v-for="(item, index) in detailObj.applicationInformation" :key="index">
        <cell-text v-if="item.key === '联系人'" :label="item.key" :labelWidth="85" border="none">{{ item.value }}</cell-text>
        <cell-text v-if="item.key === '联系电话'" :label="item.key" :labelWidth="85" border="none">{{ item.value }}</cell-text>
        <cell-text v-if="item.key === '公司名称'" :label="item.key" :labelWidth="85" border="none">{{ item.value }}</cell-text>
        <cell-text v-if="item.key === '房号'" :label="item.key" :labelWidth="85" border="none">{{ item.value }}</cell-text>
        <cell-text v-if="item.key === '车牌号'" :label="item.key" :labelWidth="85" border="none">{{ item.value }}</cell-text>
      </block>
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 身份证资料 -->
    <view class="form-title cell-border">身份证资料</view>
    <view style="padding: 0 15px; display: flex;" v-for="(item, index) in detailObj.cardInfo" :key="index">
      <view class="idcard-num">{{ index + 1 }}</view>
      <view>
        <cell-text label="姓名" :labelWidth="100" border="none">{{ item.name }}</cell-text>
        <cell-text label="身份证号码" :labelWidth="100" :padding="0" border="none">{{ item.idNumber }}</cell-text>
        <cell-text label="白底电子照片" :labelWidth="100" border="none">
          <u-image :src="item.imgUrl" width="80px" height="50px" mode="aspectFit" />
        </cell-text>
      </view>
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 驾驶证 -->
    <view class="form-title cell-border">驾驶证</view>
    <view style="padding: 10px 15px">
      <u-album :urls="detailObj.notifyUrl" />
    </view>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 办理须知 -->
    <view class="form-title cell-border">办理须知</view>
    <cell-text :labelWidth="0" padding="10px 15px" border="none">
      <text style="font-size: 14px;">{{ detailObj.cardNeedToKnow }}</text>
    </cell-text>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 按钮 -->
    <view class="footer-panel" v-if="detailObj.handleState === '待支付'">
      <view class="footer-panel--unit">
        <text>￥</text><text class="footer-panel--stress">{{ detailObj.payAmount }}</text><text>元</text><text style="color: initial; margin-left: 5px;width: 100rpx;">已选{{ detailObj.number }}张</text>
      </view>
      <u-button type="primary" text="提交申请" style="width: 144px;flex: 0 0 auto;" @click="linkToPayment" />
    </view>
  </view>
</template>

<script>
import Utils from '@/js/utils'
import CellText from '@/components/cell-text/cell-text'
import { selectCardHandleById, getCardDetail } from '@/service/returnVisit'

export default {
  name: 'MyCardDetail',
  components: {
    CellText
  },
  data() {
    return {
      detailObj:{
        handelCode: '',
        cardType: '',
        cardBusiness: '',
        number: 0,
        applicationType: '1',
        applicationInformation: [],
        cardInfo: [],
        notifyUrl: [],
        cardNeedToKnow: ''
      }
    }
  },
  onLoad(option) {
    this.selectCardHandleById(option.id)
    this.getCardDetail(option.cardId)
  },
  computed: {
    stateColor() {
      let tmp = this.detailObj.handleState
      let obj = {
        '待支付': { color: '#ff0167' },
        '待审核处理中': { color: '#00b1ff' },
        default: { color: '#9d9c9f' }
      }
      return obj[tmp] || obj.default
    }
  },
  methods: {
    async selectCardHandleById(id) {
      const params = {
        id: id
      }
      const res = await selectCardHandleById(params)

      let applicationInformation = []
      try {
        applicationInformation = JSON.parse(res.data.applicationInformation)
      } catch (error) {}

      let cardInfo = []
      try {
        cardInfo = JSON.parse(res.data.cardInfo)
      } catch (error) { }

      this.detailObj = Object.assign({}, res.data, {
        applicationInformation,
        cardInfo,
        notifyUrl:res.data.applicationInformation ? JSON.parse(res.data.applicationInformation)[5].value.split(',') : []
      })
    },
    async getCardDetail(cardId) {
      const params = {
        id: cardId
      }
      const res = await getCardDetail(params)

      this.detailObj.cardNeedToKnow = res.data?.cardNeedToKnow || '办卡须知请保证提供信息真实有效，若因个人信息造成的后果，办卡中心概不负责'
    },
    // 跳转到支付页面
    async linkToPayment() {
      const data = this.detailObj
      // 支付截至时间
      const endPayDate = new Date(data.createDate.replace(/-/g, '/'))
      endPayDate.setMinutes(endPayDate.getMinutes() + (parseInt(data.payTimelimit) || 0))
      const enterpriseName = data.enterpriseName
      const other = `${data.cardType}-${data.cardBusiness}/${data.contactName}/${data.contactNumber}${enterpriseName ? '/' + enterpriseName : ''}/${data.handleCode}`

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
}
.cell-border {
  border-bottom: 1px solid #D9D9D9;
}
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
::v-deep .u-radio__icon-wrap--disabled--checked {
  border-color: var(--app-primary-color) !important;
  background-color: var(--app-primary-color) !important;

  .u-icon__icon.uicon-checkbox-mark {
    color: #fff !important;
  }
}
.footer-panel {
  background-color: #fff;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: stretch;
  height: 80rpx;
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
</style>