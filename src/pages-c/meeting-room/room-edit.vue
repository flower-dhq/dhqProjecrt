<template>
  <view class="page-box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <!-- 轮播图 -->
    <u-swiper
      :list="bannerList"
      height="230"
    ></u-swiper>

    <!-- 标题信息 -->
    <meeting-detail-title style="margin-bottom: 10px;" :data="submitStore.meetingData" />

    <!-- 填写预约人信息 -->
    <view class="pd-css">
      <u-form class="form-data" labelPosition="left" :model="submitStore" ref="elFormUser" labelWidth="112px">
        <u-form-item prop="enterpriseName" borderBottom>
          <text slot="label" class="laber-text"><text class="icon_x">*</text>企业名称</text>
          <u-input v-model="submitStore.enterpriseName" placeholder="请填写" border="none"/>
        </u-form-item>
        <u-form-item prop="contactName" borderBottom>
          <text slot="label" class="laber-text"><text class="icon_x">*</text>预约人</text>
          <u-input v-model="submitStore.contactName" placeholder="请填写" border="none"/>
        </u-form-item>
        <u-form-item prop="contactPhone" borderBottom>
          <text slot="label" class="laber-text"><text class="icon_x">*</text>联系电话</text>
          <u-input v-model="submitStore.contactPhone" placeholder="请填写" border="none"/>
        </u-form-item>
        <u-form-item prop="meetingAgenda" borderBottom>
          <text slot="label" class="laber-text"><text class="icon_x">*</text>会议议程</text>
          <u--textarea v-model="submitStore.meetingAgenda" placeholder="请简要说明会议议程" border="none"></u--textarea>
        </u-form-item>
        <u-form-item prop="meetingNumber" borderBottom>
          <text slot="label" class="laber-text"><text class="icon_x"></text>参会人数</text>
          <u-input v-model="submitStore.meetingNumber" type="number"  placeholder="请填写" border="none"/>
        </u-form-item>
      </u-form>
    </view>

    <u-gap height="10" bgColor="#f5f5f5" />
    <view class="pd-css">
      <u-form class="form-data" labelPosition="left" :model="submitStore" ref="elFormUser" labelWidth="112px" style="padding: 0 20rpx;margin-bottom: 10px;">
        <u-form-item prop="reserveDate" @click="startDateObj.isShow = true" borderBottom>
          <text slot="label" class="laber-text">会议日期</text>
          <u-input v-model="submitStore.reserveDate" disabled disabledColor="#ffffff" placeholder="请选择" border="none" />
          <u-icon slot="right" name="arrow-right" />
        </u-form-item>
        <u-form-item prop="meetingTime" borderBottom>
          <text slot="label" class="laber-text">会议时间</text>
          <u-input v-model="submitStore.meetingTime" disabled disabledColor="#ffffff" placeholder="会议时间" border="none" />
        </u-form-item>
        <u-form-item prop="meetingNumber">
          <text slot="label" class="laber-text">预约时段</text>
          <view class="time-flag flex-row">
            <text class="flag-selected">已选中</text>
            <text class="flag-useable">可预定</text>
            <text class="flag-disabled">不可用</text>
          </view>
        </u-form-item>
        <!-- 上/下午 -->
        <view class="appointment-time-value">
          <button :class="amCss" @click="selectMeetingTime('am')">上午</button>
          <button :class="pmCss" @click="selectMeetingTime('pm')">下午</button>
        </view>
        <!-- 一周预约情况 -->
        <view class="appointment-time-week">
          <view class="head-explain">
            <text style="font-size: 14px;">预约情况</text>
            <view>
              <view>
                <view class="hl"></view>
                <text>占用</text>
              </view>
              <view>
                <view></view>
                <text>空闲</text>
              </view>
            </view>
          </view>
          <view class="week-situation">
              <view class="one-day">
                <view>上午</view>
                <view>下午</view>
              </view>
              <view class="one-week">
                <view v-for="(item, index) in appointmentSituation" :key="index">
                  <view>
                    <view>{{item.day}}</view>
                    <text>{{item.week}}</text>
                  </view> 
                  <view class="square" :class="{'selected-time': item.am}"></view>
                  <view class="square" :class="{'selected-time': item.pm}"></view>
                </view>
              </view>
          </view>
        </view>
      </u-form>
    </view>

    <!-- 是否需要物业协助 -->
    <!-- 上传图片 -->
    <!-- <u-gap height="10" bgColor="#f5f5f5" />
    <view class="pd-css">
      <u-form class="form-data" labelPosition="left" :model="submitStore" ref="elFormUser" labelWidth="112px" style="padding: 0 20rpx;">
        <u-form-item prop="meetingNumber" borderBottom>
          <text slot="label" class="laber-text" style="width: 130px;"><text class="icon_x">*</text>是否需要物业协助</text>
          <u-radio-group  placement="row" v-model="submitStore.propertyAssistance">
            <u-radio label="是" name="1" :customStyle="{marginRight: '16px',marginLeft: '10px'}">是</u-radio>
            <u-radio label="否" name="0">否</u-radio>
          </u-radio-group>
        </u-form-item>
        <template v-if="submitStore.propertyAssistance == '1'">
          <u-form-item prop="clothFieldTime" borderBottom  @click="isClothFieldTime = true">
            <text slot="label" class="laber-text" style="width: 130px;"><text class="icon_x">*</text>布场时间</text>
            <u-input v-model="submitStore.clothFieldTime" disabled disabledColor="#ffffff" placeholder="请选择" border="none" />
            <u-icon slot="right" name="arrow-right" />
          </u-form-item>
          <u-form-item prop="clothFieldTime" class="cell-upload" borderBottom>
            <text slot="label" class="laber-text" style="width: 130px;"><text class="icon_x">*</text>请上传布场图</text>
            <u-upload :fileList="submitStore.imageList" :maxCount="5" :previewFullImage="true" @afterRead="uploadPic" @delete="deletePic" />
          </u-form-item>
        </template>
      </u-form>
    </view> -->
    
    <!-- 增值服务 -->
    <!--  v-show="submitStore.propertyAssistance == '1'" -->
    <u-cell-group class="box-form">
      <u-cell class="box-form-title" title="增值服务"></u-cell>
      <template>
        <view  v-for="item in typeListMiddle" :key="item.dictId" style="display: flex;justify-content: space-between;padding: 5px 16px;">
          <view style="display: inline-block;color: #a9a9a9;font-size: 28rpx;">
            {{item.dictName}}
          </view>
          <view style="display: flex;">
            <meeting-price :number="item.price" :suffix="item.unit" :isBigSize="isBigSize" />
            <view style="margin-top: 3px;">
							<u-checkbox-group @change="getItemName($event,item.dictId)">
								<u-checkbox activeColor="#00C6D2" checked-color="#00C6D2" icon-size="15px" shape="square" style="margin-left: 10px;" :name="item.dictId"></u-checkbox>
							</u-checkbox-group>
            </view>
          </view>
        </view>
      </template>
    </u-cell-group>
    <view class="box-form-desc" style="padding-top: 8px;padding-bottom: 12px;font-size: 12px;color: #999;padding-left:11px;">说明：除了按次收费，其余费用皆是按实际算(人数*小时*单价)</view>

    <!-- 选择发票抬头 -->
    <!-- <view class="pd-css">
      <u-form class="form-data" labelPosition="left" :model="submitStore" ref="elFormUser" labelWidth="112px" style="padding: 0 20rpx;">
        <u-form-item prop="reserveDate" @click="isShowInvoice = true" borderBottom>
          <text slot="label" class="laber-text">发票抬头</text>
          <u-input v-model="submitStore.invoiceVal.text" disabled disabledColor="#ffffff" placeholder="请选择" border="none" />
          <u-icon slot="right" name="arrow-right" />
        </u-form-item>
        <u-form-item prop="emailVal">
          <text slot="label" class="laber-text">电子邮箱</text>
          <u-input v-model="submitStore.emailVal" disabledColor="#ffffff" placeholder="请填写电子邮箱接收发票" border="none" />
        </u-form-item>
      </u-form>
    </view> -->

    <view class="threshold-bottom"></view>
    <view class="btn-bottom">
      <!-- <view class="yy-btn"  @click="submitOrder">预约</view> -->
      <u-button class="yy-btn"  @click="submitOrder" :loading="btnLoading" loadingText="预约中">预约</u-button>
    </view>

    <!-- 底部按钮 -->
    <!-- <view class="btn-bottom">
      <van-button block round type="primary" loading-text="预约" :loading="btnLoading" :disabled="btnLoading" @click="submitOrder">预约</van-button>
    </view> -->

    <!-- 弹窗，用于 选择会议预定日期，格式 'YYYY-MM-DD' -->
    <!-- <van-popup round position="bottom" v-model="isShowDate">
      <van-datetime-picker type="date" title="选择会议日期" v-model="dateVal" :min-date="minDate" :max-date="maxDate" @confirm="handleDatePicker" @cancel="isShowDate = false" />
    </van-popuview> -->
    <!-- 弹窗，用于 选择开始时间 和 选择结束时间，格式 'hh:mm' -->
    <!-- <van-popup round position="bottom" v-model="isShowTime">
      <van-picker title="选择开始时间" show-toolbar :columns="getTimeColumns" @confirm="handleTimePicker" @cancel="isShowTime = false" />
    </van-popuview> -->
    <!-- 弹窗，用于 布场时间，格式 'YYYY-MM-DD hh:mm:dd' -->
    <!-- <van-popup round position="bottom" v-model="isShowTimeCloth">
      <van-datetime-picker
        type="time" title="选择布场时间" v-model="clothVal"
        @confirm="handleClothPicker"
        @cancel="isShowTimeCloth = false"
      />
    </van-popuview> -->
    <!-- 弹窗，用于 选择发票抬头 -->

    <!-- 新发票抬头UI -->
    <u-popup :show="isShowInvoice" round position="bottom" @click-overlay="isShowInvoice = false">
      <view class="invoice-popup">
        <view class="invoice-popup__toolbar">
          <view>发票抬头</view>
          <view @click="isShowInvoice = false" class="close-icon"><u-icon name="close" /></view>
        </view>
        <view class="invoice-popup__body">
          <view class="cell-wrapper" v-if="invoiceList.length">
            <view class="cst-cell" v-for="(item, index) in invoiceList" :key="index" @click="selectInvoice(index)">
                <view class="cst-cell__left">
                    <view>{{item.invoiceLabel}}</view>
                    <text>{{item.taxpayerIdentNum}}</text>
                </view>
                <view class="cst-cell__right">
                    <u-icon v-show="item.selected" name="success" />
                </view>
            </view>  
          </view>
          <view v-else class="empty-div">
            <u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
          </view>
          <view class="info-tips">
            <u-icon name="info" />  发票信息请到【我的】-【开票抬头】中维护
          </view>
        </view>
      </view>
    </u-popup>
    <!-- 会议日期弹窗 -->
    <u-calendar :show="startDateObj.isShow" mode="single" :minDate="smallDate" :defaultDate="submitStore.reserveDate" :maxDate="startDateObj.maxDate" @close="startDateObj.isShow = false" @confirm="startDateConfirm" />
    <!-- 布场时间选择 -->
    <u-datetime-picker :show="isClothFieldTime" mode="time" @confirm="clothFieldTimeConfirm"></u-datetime-picker>
  </view>
</template>

<script>
import Utils from '@/js/utils'
import { getAuthCompanyList } from '@/service/community'
import { getMeetingReserveDetail, getInvoiceInfoByPhone, submitMeetingReserve } from '@/service/meeting'
import MeetingDetailTitle from './components/meeting-detail-title.vue'
import MeetingPrice from './components/meeting-price.vue'
import { uploadMutiFile } from '@/service/landcrm'
import { savePageTitle } from '@/js/router/router-utils'

export default {
  name: 'RoomEdit',
  components: {
    MeetingDetailTitle,
    MeetingPrice
  },
  data() {
    const { MEMBER_ID, COMPLANY_ID, PROJECT_ID, PROJECT_NAME, O_USER_INFO } = this.$constant
    const { fullName, phoneNumber } = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
    return {
      startDateObj: {
        isShow: false,
        maxDate: Utils.formatDate({ value: Utils.getFutureDate(365, 'back'), type: 's2d', format: 'YY-MM-DD' }),
        value: []
      },
      isClothFieldTime: false,
      smallDate: this.formatDateTimeOfYMD(this.getTomorrow().getTime()),
      submitStore: {
        // enterpriseName: Utils.storageAction({ key: PROJECT_NAME, action: 'get' }),
        enterpriseName: '',
        contactName: fullName,
        contactPhone: phoneNumber,
        meetingAgenda: '',
        meetingNumber: '1',
        meetingData: {},
        reserveDate: this.formatDateTimeOfYMD(this.getTomorrow().getTime()),
        meetingTime: '',
        startTime: '',
        endTime: '',
        propertyAssistance: '0',
        clothFieldTime: '',
        imageList: [],
        invoiceVal: {
          text: ''
        },
        emailVal: '',
      },
      authCompany: '', // 已认证的企业
      meetingId: '',
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      bannerList: [], // 轮播图，[src]
      dateVal: '', // 绑定值
      isShowDate: false, // 弹窗，选择日期
      minDate: new Date(), // 限制最小时间
      maxDate: new Date(), // 限制最大时间
      isShowTime: false, // 弹窗，选择时间
      timePickerType: 'start', // 如果点击开始时间，则为'start'；如果点击结束时间，则为'end'。因为时间弹窗只有一个，但是要被“开始时间”，“结束时间”，“布场时间”使用，只能增加类型来判断
      periodTimes: { am: [], pm: [] }, // { am: 上午时段，同objTmp, pm: 下午时段，同objTmp }，objTmp: [{ text: '08:00', disabled: 是否被禁止, selected: 是否被选中 }]
      isShowTimeCloth: false, // 弹窗，选择时间
      clothVal: '', // 绑定值
      uploadIcon: '', // 上传图片预览区的图标
      isShowInvoice: false, // 弹窗，选择发票抬头
      invoiceList: [], // 发票列表
      btnLoading: false, // 如果为true，提交按钮就不能被点击。用于只能在提交完成后才能再提交
      typeListMiddle: [], // 增值服务数据
      appointmentSituation: [], // 一周预约情况 
      meetingTime: {
        amState: 0,
        amSelected: 0,
        pmState: 0,
        pmSelected: 0,
      },
      isBigSize: true
    }
  },
  computed: {
    // 用于 弹窗，选择时间 里的columns
    getTimeColumns() {
      return this.periodTimes.am.concat(this.periodTimes.pm)
    },
    // 用于 弹窗，选择布场时间 里的max-hour
    getClothMaxHour() {
      const startTmp = this.splitStr(this.submitStore.startTime)
      console.log('this.submitStore.startTime=====',this.submitStore.startTime)
      console.log('startTmp=====',startTmp)
      // 提前2小时
      let hourTmp = startTmp.hours
      hourTmp = hourTmp < 0 ? 0 : hourTmp

      // return startTmp.seconds !== -1 ? { hour: hourTmp, minute: strTmp.minutes } : { hour: 23, minute: 59 }
      return startTmp.seconds !== -1 ? { hour: hourTmp, minute: startTmp.minutes } : { hour: 23, minute: 59 }
    },
    amCss() {
      const disabled = this.meetingTime['amState'];
      const selected = this.meetingTime['amSelected'];
      return disabled ? 'disabled-cl' : selected ? 'selected-cl' : ''
    },
    pmCss() {
      const disabled = this.meetingTime['pmState'];
      const selected = this.meetingTime['pmSelected'];
      return disabled ? 'disabled-cl' : selected ? 'selected-cl' : ''
    },
  },
  onLoad(option) {
    const { meetingId } = option
    this.meetingId = meetingId
  },
  async created() {
    const { O_USER_INFO } = this.$constant
    const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
    this.setMinAndMaxDate()
    await this.getEnterpriseAuthList()
    await this.getMeetingData()
    this.getInvoiceData() // 不需要同步
    console.log('this.smallDate====',this.smallDate)
  },
  methods: {
    // 获取会议厅详情，必填 serveDate ，因为需要查询出这一天的 时段情况
    async getMeetingData() {
      const params = {
        data: {
          meetingId: this.meetingId,
          // reserveDate: this.submitStore.reserveDate,
          reserveDate: this.formatDateTimeOfYMD(this.getTomorrow().getTime()),
          enterpriseIds: this.authCompany
        }
      }
      const res = await getMeetingReserveDetail(params)
      const data = res.data.data || {}

      // 赋值
      this.submitStore.meetingData = data
      this.bannerList = (data.bannerList || []).map(item => item.img)
      this.periodTimes = {
        am: (data.periodTimes.am || []).map(item => ({ text: item.time, disabled: item.state == 1, selected: false })),
        pm: (data.periodTimes.pm || []).map(item => ({ text: item.time, disabled: item.state == 1, selected: false }))
      }
      this.updateMeetingTimeData(data);
    },
    // 根据会议日期获取时段情况
    async getPeriodTimesData() {
      const params = {
        data: {
          meetingId: this.meetingId,
          reserveDate: this.submitStore.reserveDate
        }
      }
      const res = await getMeetingReserveDetail(params)
      const data = res.data.data || {}

      // 赋值
      this.submitStore.meetingData.periodTimes = data.periodTimes
      this.periodTimes = {
        am: (data.periodTimes.am || []).map(item => ({ text: item.time, disabled: item.state == 1, selected: false })),
        pm: (data.periodTimes.pm || []).map(item => ({ text: item.time, disabled: item.state == 1, selected: false }))
      }
      this.updateMeetingTimeData(data);
    },
    // 上传图片返回地址
    async uploadImageToURL(file, detail) {
      // 状态，上传中
      file.status = 'uploading'
      file.message = '上传中...'

      let formData = new FormData()
      formData.set('file', file.file)
      const res = await uploadMutiFile(formData)
        .then(({ fileInfo }) => ({ success: true, data: fileInfo }))
        .catch(err => ({ success: false, message: err }))

      if (res.success) {
        // 状态，上传完成
        file.status = 'done'
        file.message = '上传完成'

        // 实际需要用到的是这个图片链接
        console.log('res====',res)
        file.url = res.data.resPath
      } else {
        // 状态，上传失败
        file.status = 'failed'
        file.message = '上传失败'
      }
    },
    // 查询发票抬头
    async getInvoiceData() {
      // const { companyId, projectId, phoneNumber: phone } = this.submitStore.getProject()
      const { USER_INFO } = this.$constant
      const { phoneNumber: phone } = Utils.storageAction({ key: USER_INFO, action: 'get' })
      const companyId = this.companyId
      const projectId = this.projectId
      let params = {
        data: { companyId, projectId, phone }
      }
      const res = await getInvoiceInfoByPhone(params)
      if (res.status === 200) {
        // 例如 [{ taxpayerIdentNum: 纳税人识别号, bankCode: 开户行账号, invoiceLabel: 开票抬头, customerId: 用户id, ...其他 }]
        this.invoiceList = (res.data.invoiceList || []).map(item => ({ ...item, text: item.invoiceLabel, selected: false }))
      } else {
        this.invoiceList = []
      }
    },
		getItemName(detail,id){
			// console.log('detail=========',detail)
			this.typeListMiddle.map(item=>{
				if(item.dictId == id){
					item.selected = !item.selected
				}
			})
		},	
    // 提交会议预定
    async submitOrder() {
      if (!this.submitStore.enterpriseName) {
        uni.showToast({
          title: '请填写企业名称',
          icon: 'none'
        })
        return false
      }

      if (!this.submitStore.contactName) {
        uni.showToast({
          title: '请填写预约人',
          icon: 'none'
        })
        return false
      }

      if (!this.submitStore.meetingAgenda) {
        uni.showToast({
          title: '请填写会议议程',
          icon: 'none'
        })
        return false
      }

      if (Number(this.submitStore.meetingNumber)>Number(this.submitStore.meetingData.capacity)) {
        uni.showToast({
          title: '参会人数不能大于最大容纳人数',
          icon: 'none'
        })
        return false
      }

      if (this.submitStore.contactPhone) {
        let isPhone = /^1[3456789]\d{9}$/
        let isMob = /^((0\d{2,3})-)?(\d{7,8})$/
        console.log('isMob.test(this.submitStore.contactPhone)===',isMob.test(this.submitStore.contactPhone),this.submitStore.contactPhone)
        console.log('isPhone.test(this.submitStore.contactPhone===',isPhone.test(this.submitStore.contactPhone))
        if(isMob.test(this.submitStore.contactPhone)||isPhone.test(this.submitStore.contactPhone)){
          
        }
        else{
          uni.showToast({
            title: '电话号码格式错误！',
            icon: 'none'
          })
          return false
        }
      }else {
        uni.showToast({
          title: '请填写联系电话',
          icon: 'none'
        })
        return false
      }

      if (!this.submitStore.meetingTime) {
        uni.showToast({
          title: '请选择预约时段',
          icon: 'none'
        })
        return false
      }
			if (!this.submitStore.contactName) {
				uni.showModal({
					title:'提示',
					content:'需要在个人信息填写真实名字',
					showCancel:true,
					confirmText:'马上去填',
					success: (result) => {
						if (result.confirm) {
              savePageTitle({title:'个人信息'})
							uni.navigateTo({
								url:'/pages-a/profile/profile'
							})
						}
					}
				})
			  return false
			}

      const params = {
        data: {
          enterpriseIds: this.authCompany, // 已认证的企业
          meetingTime: this.meetingTime,
          addValueServe: this.typeListMiddle,
          
          meetingId: this.meetingId,
          enterpriseName: this.submitStore.enterpriseName,
          contactName: this.submitStore.contactName,
          contactPhone: this.submitStore.contactPhone,
          agenda: this.submitStore.meetingAgenda,
          numberOfParticipants: Number(this.submitStore.meetingNumber),
          dateList: [{ reserveDate: this.submitStore.reserveDate, reserveStartTime: this.submitStore.startTime, reserveEndTime: this.submitStore.endTime }],
          // dateList: [{ reserveDate: this.submitStore.reserveDate, reserveStartTime: this.submitStore.reserveDate, reserveEndTime: '2022-12-31' }],
          propertyAssistance: this.submitStore.propertyAssistance,   // '2000-01-01 08:09:00'，如果为空，则 ''
          clothFieldTime: this.submitStore.reserveDate && this.submitStore.clothFieldTime ? this.submitStore.reserveDate + ' ' + this.submitStore.clothFieldTime + ':00' : '',
          clothFieldImg: this.submitStore.imageList.map(file => file.url).join(','),
          addService: this.getAddServiceArg(this.typeListMiddle), // 增值服务
          orderRemark: '', // 备注
          // invoice: JSON.stringify(this.submitStore.invoiceVal) === '{}' ? '' : JSON.stringify(this.submitStore.invoiceVal),   
          invoice: '',    // 置空发票参数就不会校验邮箱
          email: this.submitStore.emailVal,
          orderPrice: this.calcPriceByOne({meetingTime: this.meetingTime, addValueServe: this.typeListMiddle}),
        }
      }
      // const params = this.submitStore.formatDataToOutput(otherParams)
      // const iteRes = this.submitStore.forEachCheckParams(params)
      
      // if (!iteRes.success) {
      //   this.$toast(iteRes.message)
      //   return
      // }

      this.btnLoading = true
      console.log('params===',params)
      const res = await submitMeetingReserve(params)
      this.btnLoading = false
      if (res.data.status == 10000) {
        uni.navigateTo({
          url: '/pages-c/meeting-room/meeting-examine'
        })
      } else {
        uni.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    },
    // 设置minDate为明天，maxDate为5个月内，且第5个月的天数为当前月的最大天数
    setMinAndMaxDate() {
      const curDate = new Date()
      const YYYY = curDate.getFullYear()
      const MM = curDate.getMonth()
      const DD = curDate.getDate()

      // 设置minDate为明天的日期
      this.minDate = new Date(YYYY, MM, DD + 1)

      // 当前月份加上5个月
      const MMAdd5 = MM + 5
      // 返回 MMAdd5 这个月的总天数
      const totalDate = new Date(YYYY, MMAdd5 + 1, 0).getDate()
      
      // 设置maxDate为5个月后的日期
      this.maxDate = new Date(YYYY, MMAdd5, totalDate)

      // 设置dateVal为明天的日期
      this.dateVal = this.getTomorrow()
    },
    // 处理日期选择
    handleDatePicker(val) {
      this.submitStore.reserveDate = this.formatDateTimeOfYMD(val)

      this.clearSelectTime()

      this.getPeriodTimesData()
      this.isShowDate = false
    },
    // 处理时间弹窗的显示隐藏
    handleShowTimeModal(type) {
      if (!['start', 'end'].includes(type)) return

      this.timePickerType = type
      this.isShowTime = true
    },
    // 处理时间选择
    handleTimePicker(item, index) {
      if (this.timePickerType === 'end' && this.submitStore.startTime === '') {
        // 还没选开始时间，是不能选结束时间的
        this.$toast('请先选择开始时间')
        this.isShowTime = false
        return
      }
      if (this.timePickerType === 'start') {
        // 如果有开始时间，再次选开始时间，则重置开始时间和结束时间
        this.submitStore.startTime = ''
        this.submitStore.endTime = ''
      }

      this.handleTimePartClick(item, index)

      this.isShowTime = false
    },
    /**
     * 处理点击时间。点击“开始时间”/“结束时间”的单元格，或者选择“时段情况”的时间小段，
     * 1、然后先判断如果没有开始时间，则赋值给开始时间；如果有开始时间,但没有结束时间，则赋值给结束时间；
     * 2、如有都有，则都清空，然后回到第1步；
     * 注意，如果开始时间大于结束时间，则不能赋值，且提示；如果选择的范围内，有禁止块，则不能赋值，且提示（只能连续选中，中间不能中断）；开始时间可以等于结束时间。
     */
    handleTimePartClick(item, index, arr) {
      // 被禁止的是不能点击的
      if (item.disabled) return

      // 选清空选择
      let periodTmp = {
        am: this.periodTimes.am.map(item => ({ ...item, selected: false })),
        pm: this.periodTimes.pm.map(item => ({ ...item, selected: false }))
      }

      const timeRes = this.calcMaxAndMinTime(this.submitStore.startTime, this.submitStore.endTime, item.text)
      if (!timeRes.success) {
        // 开始时间是不能小于结束时间的
        this.$toast(timeRes.message)
        return
      }

      const arrRes = this.calcPartByStartAndEnd(timeRes.data.start, timeRes.data.end, periodTmp)
      if (!arrRes.success) {
        // 如果选择的范围内，有禁止块，则不能赋值
        this.$toast(arrRes.message)
        return
      }

      this.submitStore.startTime = timeRes.data.start
      this.submitStore.endTime = timeRes.data.end

      this.periodTimes.am = this.periodTimes.am.map(item => ({
        ...item,
        selected: arrRes.data.some(interval => interval.text === item.text)
      }))
      this.periodTimes.pm = this.periodTimes.pm.map(item => ({
        ...item,
        selected: arrRes.data.some(interval => interval.text === item.text)
      }))
    },
    // 清空 开始时间 和 结束时间
    clearSelectTime() {
      this.submitStore.startTime = ''
      this.submitStore.endTime = ''
      this.submitStore.meetingTime = ''

      this.periodTimes = {
        am: this.periodTimes.am.map(item => ({ ...item, selected: false })),
        pm: this.periodTimes.pm.map(item => ({ ...item, selected: false }))
      }
      this.meetingTime = {
        amState: 0,
        amSelected: 0,
        pmState: 0,
        pmSelected: 0,
      }
    },
    /**
     * @param {string} val 被选中的时间，格式同$data.startTime
     * 求出他们三中的开始时间和结束时间，也就是最小时间和最大时间
     */
    calcMaxAndMinTime(startTime, endTime, val) {
      const startTimeTmp = this.splitStr(startTime).seconds
      const endTimeTmp = this.splitStr(endTime).seconds
      const valTmp = this.splitStr(val)

      // 如果开始时间小于结束时间
      if (startTimeTmp !== -1 && endTimeTmp === -1 && valTmp.seconds < startTimeTmp) {
        return { success: false, message: '开始时间必须小于结束时间' }
      }

      if (startTimeTmp === -1) {
        // 如果没有开始时间，则保留结束时间，然后赋值给开始时间
        return { success: true, data: { start: valTmp.str, end: endTime } }
      } else if (endTimeTmp === -1) {
        // 如果没有结束时间，则保留开始时间，然后赋值给结束时间
        return { success: true, data: { start: startTime, end: valTmp.str } }
      } else {
        // 已经选了开始时间和结束时间，再次选择时间，就要清空他们的值，然后重新赋值给开始时间
        return { success: true, data: { start: valTmp.str, end: '' } }
      }
    },
    /**
     * @param {object} periodTimes 同$data.periodTimes
     * 点击“开始时间”/“结束时间”单元格时候，根据他们两的值，计算出一段连续被选中的时间段区间，在“时段情况”里展示出来
     */
    calcPartByStartAndEnd(startTime, endTime, periodTimes) {
      const arrTmp = periodTimes.am.concat(periodTimes.pm)
      const startTmp = this.splitStr(startTime).seconds
      const endTmp = this.splitStr(endTime).seconds

      if (startTmp === -1) {
        // 如果没有开始时间
        return { success: false, message: '请选择开始时间' }
      } else if (endTmp === -1) {
        // 如果没有结束时间，则返回只有开始时间的区间
        return { success: true, data: [arrTmp.find(item => item.text === startTime)] }
      }

      // 求出区间
      const interval = arrTmp.filter(item => {
        const valTmp = this.splitStr(item.text).seconds
        
        return valTmp >= startTmp && valTmp <= endTmp
      })

      if (interval.length === 0) {
        return { success: false, message: '' }
      }

      const isError = interval.some(item => item.disabled)
      if (isError) {
        // 如果选择的范围内，有禁止块，则不能赋值
        return { success: false, message: '必须连续选择时间段' }
      } else {
        return { success: true, data: interval }
      }
    },
    // 处理布场时间的选择。如果还没有选择开始时间，则不能选择布场时间
    handleClothPicker(val) {
      if (this.submitStore.startTime === '') {
        this.$toast('请先选择开始时间')
      } else {
        this.submitStore.clothFieldTime = val
      }

      this.isShowTimeCloth = false
    },
    // 弹窗的确认按钮，选择发票
    confirmPickerOfInvoice(item, index) {
      this.submitStore.invoiceVal = item || {}

      this.isShowInvoice = false
    },
    // 用正则判断邮箱是否正确
    handleEmailChange() {
      const val = this.submitStore.emailVal
      if (val === '') return

      const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/

      const isCorrect = reg.test(val)
      if (!isCorrect) {
        this.submitStore.emailVal = ''
        this.$toast('邮箱不正确')
      }
    },
    // 选中发票
    selectInvoice(index) {
      const invoiceList = this.invoiceList;
      const invoice = this.invoiceList[index] || {};
      const [lastIvc] = invoiceList.filter(item => item.selected);
      const {invoiceInfoId} = lastIvc || {};
      this.invoiceList.forEach(item => item.selected = false);
      if (invoiceInfoId  && invoiceInfoId === invoice.invoiceInfoId) {
        invoiceList[index].selected = false;
        this.submitStore.invoiceVal = {};
      } else {
        invoice.selected = true;
        this.submitStore.invoiceVal = invoice;
      }
    },
    // 上/下午状态颜色
    meetingTimeColor(key) {
      console.log('this.meetingTime[`${key}State`]===',this.meetingTime[`${key}State`])
      console.log('selected',this.meetingTime[`${key}Selected`])
      const disabled = this.meetingTime[`${key}State`];
      const selected = this.meetingTime[`${key}Selected`];
      return disabled ? 'disabled-cl' : selected ? 'selected-cl' : ''
    },
    // 选择上/下午
    selectMeetingTime(key) {
      const disabled = this.meetingTime[`${key}State`];
      if (!disabled) {
        const lastSelected = this.meetingTime[`${key}Selected`];
        this.meetingTime[`${key}Selected`] = lastSelected ? 0 : 1;
        const amSelected = this.meetingTime.amSelected;
        const pmSelected = this.meetingTime.pmSelected;
        const startTime = amSelected ? '08:30' : pmSelected ? '13:00' : ''; 
        const endTime = pmSelected ? '17:00' : amSelected ? '12:30' : ''; 
        const fullTime = startTime && startTime ? `${startTime} ~ ${endTime}` : '';
        this.submitStore.startTime = startTime;
        this.submitStore.endTime = endTime;
        this.submitStore.meetingTime = fullTime;
      }
    },
    // 初始化更新会议时间数据及状态
    updateMeetingTimeData(data) {
      console.log('会议时间===', data)
      const {typeListMiddle, aWeekReservationInfo} = data || {}
      const appointmentSituation = Array.isArray(aWeekReservationInfo) ? aWeekReservationInfo : []
      const addValLst = Array.isArray(typeListMiddle) ? typeListMiddle : [];
      const {am, pm} = appointmentSituation[0] || {};

      this.typeListMiddle = addValLst.map(item => ({...item, selected: false}));
      this.appointmentSituation = appointmentSituation;
      this.meetingTime.amState = Number(am) ? 1 : 0;
      this.meetingTime.pmState = Number(pm) ? 1 : 0;
    },
    // 已认证企业
    getEnterpriseAuthList(){
      const { O_USER_INFO } = this.$constant
      const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
      let params={
        data:{
          memberId:this.memberId,
          companyId:this.companyId,
          applyStatus:9  //已通过企业
        }
      }; 
      return new Promise(resolve => {
        getAuthCompanyList(params).then(res =>{
          if(res.status == "200"){
              let list=res.data || []
              this.authCompany = list.map(item => item.enterpriseId + '')
              this.submitStore.enterpriseName = list.map(item => item.enterpriseName)[0]
              this.submitStore.contactName = list.map(item => item.employeeName)[0]
              this.submitStore.contactPhone = list.map(item => item.phoneNumber)[0]
              if(this.submitStore.contactPhone == undefined){
                this.submitStore.contactPhone = userInfo.ownerPhone || userInfo.phoneNumber || userInfo.contactPhone
              }
              resolve(list)
          }else{
            resolve([])
          }
        })
      })        
    },
    // 时间转换
    formatDateTimeOfYMD(timeStamp) {
      var date = new Date();
      date.setTime(timeStamp);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;

      return y + '-' + m + '-' + d;
    },
    // 明天日期
    getTomorrow() {
      const curDate = new Date()
      const YYYY = curDate.getFullYear()
      const MM = curDate.getMonth()
      const DD = curDate.getDate()

      return new Date(YYYY, MM, DD + 1)
    },
    // 会议日期 --- 确认
    startDateConfirm(val) {
      this.submitStore.reserveDate = val[0]
      this.clearSelectTime()
      this.getPeriodTimesData()
      this.startDateObj.isShow = false
    },
    clothFieldTimeConfirm(value) {
      console.log('value====',value)
      this.submitStore.clothFieldTime = value.value
      this.isClothFieldTime = false
    },
    // 上传图片
    async uploadPic(event) {
      const fileList = {
        ...event.file,
        status: 'uploading',
        message: '上传中',
      }
      this.submitStore.imageList.push(fileList)

      const res = await uploadMutiFile(fileList.url)
      // console.log('res图片====', res)
      // const data = JSON.parse(res)
      const fileInfo = res.fileInfo

      let lastIndex = this.submitStore.imageList.length - 1
      let item = this.submitStore.imageList[lastIndex]
      this.submitStore.imageList.splice(lastIndex, 1, {
        ...item,
        url: fileInfo.resPath,
        fileId: fileInfo.fid,
        status: 'success',
        message: ''
      })
    },
    /**删除图片 */
    deletePic(event) {
      this.submitStore.imageList.splice(event.index, 1)
    },
    getAddServiceArg(addValueServe) {
      console.log('addValueServe=====',addValueServe)
      const addService = {}
      const propertyAssistance = this.submitStore.propertyAssistance;
      const isGet = Array.isArray(addValueServe) && propertyAssistance;
      isGet && addValueServe.forEach(item => {
        const {selected, dictId} = item;
        if (selected) {
          addService[dictId] = 1;
        }
      })
      return addService;
    },
    // 计算价格
    calcPriceByOne(params = {}) {
      const {meetingTime: {amSelected, pmSelected}, addValueServe} = params;
      const {chargesType, chargesPriceByDay, acrossMoney, timeCost, minCost, maxCost, periodTimes, serviceState} = this.submitStore.meetingData;
      const selectedServer = addValueServe.filter(item => item.selected);
      const propertyAssistance = this.propertyAssistance;
      let totalPrice = 0;
      // 时间价格
      if (chargesType) {
        const halfDayPrice = this.floatDiv(chargesPriceByDay, 2);
        totalPrice = this.floatMul(amSelected + pmSelected, halfDayPrice);
      } else {
        const allDay = amSelected && pmSelected;
        const acrossMoneyNum = Number(acrossMoney);
        const useAcrossMoney = allDay && acrossMoneyNum > 0;
        if (useAcrossMoney) {
          totalPrice = acrossMoneyNum;
        } else {
          const timeCostNum = Number(timeCost)
          const maxCostNum = Number(maxCost)
          const minCostNum = Number(minCost)
          const list = periodTimes.am.concat(periodTimes.pm);
          const timePrice = this.floatMul(list.length, timeCostNum);
          totalPrice = timePrice >= maxCostNum ? maxCostNum : timePrice <= minCostNum ? minCostNum : timePrice;
        }
      }
      // 增值服务价格
      // 此逻辑暂时由于暂无物业协助隐藏
      // if (propertyAssistance && Number(serviceState) === 1) { // serviceState 0.不参与计算、1.参与计算
      if (Number(serviceState) === 1) { // serviceState 0.不参与计算、1.参与计算
        selectedServer.forEach(item => {
          const priceNum = Number(item.price)
          totalPrice = this.floatAdd(totalPrice, priceNum);
        });
      }
      return totalPrice;
    },
    splitStr(str) {
      let arrTmp = str.split(':')

      return {
        str,
        hours: str ? Number(arrTmp[0]) : -1, // 小时
        minutes: str ? Number(arrTmp[1]) : -1, // 分钟
        seconds: str ? (Number(arrTmp[0]) * 60 * 60 + Number(arrTmp[1]) * 60) : -1 // 总秒数
      }
    },
    //除 
    floatDiv(arg1,arg2){
      var t1=0,t2=0,r1,r2;
      try{t1=arg1.toString().split(".")[1].length}catch(e){}
      try{t2=arg2.toString().split(".")[1].length}catch(e){}

      r1=Number(arg1.toString().replace(".",""));

      r2=Number(arg2.toString().replace(".",""));
      return (r1/r2)*Math.pow(10,t2-t1);
    },
    // 乘
    floatMul(arg1,arg2)   {
      var m=0,s1=arg1.toString(),s2=arg2.toString();
      try{m+=s1.split(".")[1].length}catch(e){}
      try{m+=s2.split(".")[1].length}catch(e){}
      return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    },
    // 加
    floatAdd(arg1,arg2){
      var r1,r2,m;
      try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
      try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
      m=Math.pow(10,Math.max(r1,r2));
      return (arg1*m+arg2*m)/m;
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style/meeting-style.scss';
.meeting-detail-title {
  position: relative;
  margin-top: -33px;
}
.van-cell {
  padding: 15px 20px;
  line-height: 20px;

  ::v-deep .van-cell__title {
    width: 5.6em;
  }
  ::v-deep .van-icon-arrow {
    color: #d7d7d7;
  }
  &.cell-title-max ::v-deep .van-cell__title {
    width: 8.6em;
  }
  &.cell-upload ::v-deep .van-cell__label {
    margin-top: 15px;
  }
  &.cell-time-flag ::v-deep .van-cell__value {
    width: 180px;
    flex: 0 0 auto;
  }
}
.time-flag {
  font-size: 10px;
  line-height: 20px;
  justify-content: space-between;
  align-items: center;

  @mixin flag {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 5px;
  }
  .flag-selected {
    vertical-align: text-bottom;
  }
  .flag-useable {
    vertical-align: text-bottom;
  }
  .flag-disabled {
    vertical-align: text-bottom;
  }
  .flag-selected::before {
    @include flag;
    background-color: var(--app-primary-color);
    vertical-align: -1px;
  }
  .flag-useable::before {
    @include flag;
    border: 1px solid #e0e0e0;
    vertical-align: -2px;
  }
  .flag-disabled::before {
    @include flag;
    vertical-align: -1px;
    background-color: #f0f0f0;
  }
}
.cell-time-header {
  padding: 0px 20px 5px;
  font-weight: bold;

  &::before {
    content: '';
    display: inline-block;
    width: 2px;
    height: 20px;
    background-color: var(--app-primary-color);
    margin-right: 5px;
  }
}
.time-checkbox-group {
  background-color: #fbfbfb;
  padding: 15px 15px 10px;
  margin: 0 20px;
  flex-wrap: wrap;

  .time-checkbox {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    color: #b9b9b9;
    font-size: 10px;
    padding: 0 8px;
    box-sizing: border-box;
    margin-right: 10px;
    margin-bottom: 5px;

    &.selected {
      border-color: var(--app-primary-color);
      background-color: var(--app-primary-color);
      color: #fff;
    }
    &.disabled {
      border-color: #f0f0f0;
      background-color: #f0f0f0;
    }
  }
}
.van-radio {
  ::v-deep .van-radio__label {
    color: #b7b7b7;
  }
  ::v-deep .van-radio__icon--checked .van-icon {
    background-color: var(--app-primary-color);
    border-color: var(--app-primary-color);
  }
}
.van-uploader ::v-deep .van-icon>img {
  width: 60px;
  height: 60px;
}
.threshold-bottom {
  padding-bottom: 64px;
}
.threshold-bottom-15 {
  padding-bottom: 15px;
}
.btn-bottom {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 10px 52px 20px;
  background-color: #f5f5f5;
  /* z-index: 999999; */
  .van-button {
    height: 34px;
    background-color: var(--app-primary-color);
    border-color: var(--app-primary-color);
  }
}
.invoice-popup{
  ::v-deep .van-checkbox-group{
    .van-cell{
      padding: 10px 16px !important;
      line-height: 24px !important;
      min-height: auto;
      .van-cell__title{
        @include flx-dsp($jsc: flex-start, $ali: center);
      }
      .van-checkbox__icon--checked .van-icon{
        background-color: $m-c;
        border-color: $m-c;
      }
    }
  }
  &__toolbar{
    @include flx-dsp($jsc: center, $ali: center);
    position: relative;
    height: 50px;
    view{
        font-size: 16px;
    }
    .close-icon{
        @include flx-dsp($jsc: center, $ali: center);
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 100%;
        i {
            font-size: 15px;
        }
    }
    &::before {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        bottom: 0;
        left: 0;
        width: 100%;
        border-bottom: 1px solid #ebedf0;
        transform: scaleY(0.5);
    }
  }
  &__body{
      
    .cell-wrapper{
        max-height: 308px;
        overflow: auto;
    }
    .cst-cell{
        position: relative;
        @include flx-dsp($jsc: space-between, $ali: center);
        padding: .2rem .3rem;
        &:last-child{
            &::before{
              display: none;
            }
        }
        &::before {
            position: absolute;
            box-sizing: border-box;
            content: " ";
            pointer-events: none;
            bottom: 0;
            left: 0;
            width: 100%;
            border-bottom: 1px solid #ebedf0;
            transform: scaleY(0.5);
        }
        &__left{
            p{
              font-size: .3rem;
              margin-bottom: 0.1rem;
            }
            span{
              font-size: .28rem;
              min-height: .2rem;
            }
        }
        &__right{
            i{
              font-size: .4rem;
              color: $m-c;
            }
        }
    }
    .empty-div{
        position: relative;
    }
    .info-tips{
        position: relative;
        height: 1rem;
        @include flx-dsp($jsc: flex-start, $ali: center);
        color: $m-c;
        font-size: .28rem;
        text-indent: 0.1rem;
        i{
            margin-right: 0.1rem;
            position: relative;
            top: 1px;
        }
        &::before {
            position: absolute;
            box-sizing: border-box;
            content: " ";
            pointer-events: none;
            top: 0;
            left: 0;
            width: 100%;
            border-top: 1px solid #ebedf0;
            transform: scaleY(0.5);
        }
    }
  }
}
.box-form {
  margin-bottom: 10px;

  .van-cell {
    padding: 5px 20px;
    line-height: 20px;
  }
  .box-form-title {
    padding-top: 15px;

    ::v-deep .van-cell__title {
      font-weight: bold;
    }
  }
  .box-form-content {
    ::v-deep .van-cell__title {
      color: #999;
    }
    .meeting-price {
      color: #333;
    }
    ::v-deep .price-12 {
      font-size: 10px;
    }
    ::v-deep .price-22 {
      font-size: 15px;
    }
    &::after {
      border-width: 0px;
    }
    .cell-right{
      display: flex;
      justify-content: flex-end;
      align-content: center;
      ::v-deep .van-checkbox__icon{
        margin-left: 4px;
      }
    }
  }
  .box-form-desc {
    padding-top: 8px;
    padding-bottom: 12px;
    font-size: 12px;
    color: #999;
    &::before {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 16px;
      top: 0;
      left: 16px;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
    }
    ::v-deep .van-cell__label {
      font-size: 12px;
      color: #999;
    }
  }
  .box-form-tag {
    &::after {
      border-width: 0px;
    }
    ::v-deep .van-cell__label {
      font-size: 13px;
      color: #999;
      margin-top: 5px;
    }

  }
}
.appointment-time-value {
  position: relative;
  padding: 0.1rem 20px 0.3rem 20px;
  margin-bottom: 0.3rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &::before {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    bottom: 0;
    left: 50%;
    width: calc(100% - 40px);
    border-bottom: 1px solid #ebedf0;
    transform: scaleY(0.5) translateX(-50%);
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 34px;
    font-size: 13px;
    /* border: 1px solid #cecece; */
    color: #999;
    background-color: transparent;
    border-radius: 2px;
    margin-right: 20px;
    font-size: 12px;
    &.selected-cl {
      color: #fff;
      background-color: var(--app-primary-color);
      border-color: var(--app-primary-color);
    }
    &.disabled-cl {
      background-color: #f0f0f0;
      color: #b9b9b9;
      border-color: #e0e0e0;
    }
  }
}
.appointment-time-week {
  margin: 0 10px;
  background-color: #f2f2f2;
  border-radius: 2px;
  padding: 15px 1px 14px 1px;
  box-sizing: border-box;
  .head-explain{
    @include flx-dsp($jsc: space-between, $ali: center);
    padding: 0 10px;
    margin-bottom: 12px;
    & > view {
      @include flx-dsp($jsc: flex-end, $ali: center);
      & > view{
        @include flx-dsp($jsc: center, $ali: center);
        margin-left: 10px;
        view {
          &.hl{
            background-color: var(--app-primary-color);
          }
          width: 12px;
          height: 12px;
          border-radius: 2px;
          background-color: #fff;
          margin-right: 5px;
        }
        text{
          font-size: 12px;
        }
      }
    }
  }
  .week-situation{
    @include flx-dsp($jsc: flex-start, $ali: flex-start);
    $w: 35px;
    $h: 38px;
    .one-day{
      padding-top: $h;
      width: $w;
      view {
        margin-top: 10px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 12px;
      }
      
    }
    .one-week{
      overflow-x: auto;
      white-space: nowrap;
      width: calc(100% - #{$w});
      & > view{
        display: inline-block;
        margin-right: 10px;
        & > view:nth-child(1){
          height: $h;
          font-size: 12px;
          @include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
        }
        &:last-child{
          margin-right: 0;
        }
        .square{
          margin: 10px auto 0 auto;
          width: 32px;
          height: 24px;
          border-radius: 2px;
          background-color: #fff;
        }
        .selected-time{
          background-color: var(--app-primary-color);
        }
        
      }
    }
  }
}
.laber-text {
  padding-top: 2px;
  width: 112px;
}
.icon_x {
  /* color: var(--app-primary-color); */
  color: red;
  margin-right: 6px;
}

.btn-bottom {
  width: 100%;
  position: fixed;
  bottom: 0;
  /* padding: 10px 52px 20px; */
  background-color: #f5f5f5;
  padding: 14px 0;
  z-index: 2;
  ::v-deep .u-button {
    width: 70%;
    margin: 0 auto;
    color: #fff;
    text-align: center;
    line-height: 34px;
    border-radius: 22px;
    height: 34px;
    background-color: var(--app-primary-color);
    border-color: var(--app-primary-color);
  }
}

.pd-css {
  padding: 0 20rpx;
}

::v-deep .u-form-item__body .u-textarea {
  /* padding: 8rpx 0 0 0 !important; */
  padding: 0 !important;
  /*  #ifdef  MP-WEIXIN  */
  padding: 0 !important;
  /*  #endif  */
}
::v-deep .u-textarea {
  /*  #ifdef  MP-WEIXIN  */
  padding: 0 !important;
  /*  #endif  */
}
::v-deep .u-form-item__body__right .time-flag {
  flex: 1;
  justify-content: space-around;
  font-size: 13px;
}
/*  #ifdef  MP-WEIXIN  */
  ::v-deep .u-form-item__body__right .time-flag {
    justify-content: space-around;
    font-size: 13px;
  }
/*  #endif  */
</style>