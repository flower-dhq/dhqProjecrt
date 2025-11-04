<style lang="scss" scoped>
.customer-repaire {
  width: 100%;
  min-height: 100vh;
  background-color: #f3f4f7;
  font-family: initial;

  .radio-button {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 30rpx 30rpx;
    @include flx-dsp($jsc: flex-start, $ali: center);

    &__label {
      font-size: 30rpx;
      font-weight: 400;
      color: #333;
      width: 180rpx;
      display: block;
    }

    &__content {
      @include flx-dsp($jsc: flex-start, $ali: center);

      text {
        @include flx-dsp($jsc: center, $ali: center);
        width: 240rpx;
        height: 60rpx;
        line-height: 60rpx;
        border: 1px solid #999;
        color: #666;
        background-color: transparent;
        outline: none;
        font-size: 24rpx;
        border-radius: 6rpx;

        &:first-child {
          margin-right: 24rpx;
        }
      }

      text.active_button {
        background-color: var(--app-primary-color);
        color: #fff;
        border-color: var(--app-primary-color);
      }
    }
  }

  .gap {
    width: 100%;
    height: 24rpx;
  }

  .radio-gap {
    display: inline-block;
    margin: 0 5px;
  }

  .scan-qrcode {
    @include flx-dsp($jsc: space-between, $ali: center);

    &>view {
      position: relative;
      padding-left: 20rpx;

      &::before {
        position: absolute;
        top: 50%;
        left: 0;
        display: block;
        content: '';
        width: 2rpx;
        height: 90%;
        transform: translateY(-50%);
        background-color: #eaeaea;
      }

    }
  }

  .bottom-section {
    background-color: #fff;
    box-sizing: border-box;
    padding: 30rpx;
  }

  .button-box {
    margin: 60rpx auto 0 auto;
    padding-bottom: 30rpx;
    width: 640rpx;

    @include flx-dsp($jsc: center, $ali: center);

    text {
      @include flx-dsp($jsc: center, $ali: center);
      width: 320rpx;
      height: 80rpx;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: 400;
      border-radius: 6rpx;
      border: 1rpx solid var(--app-primary-color);
    }

    .storage {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      color: var(--app-primary-color);
      background-color: transparent;
    }

    .submit {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      color: #fff;
      background-color: var(--app-primary-color);
    }
  }
}
</style>

<template>
  <view class="customer-repaire" :style="[THEME_CSS_VAR]">
    <view class="radio-button" v-if="radioList.length">
      <view class="radio-button__label">
        <text>{{ radioLabel }}</text>
      </view>
      <view class="radio-button__content">
        <text :class="[{ active_button: radioIndex == index }]" v-for="(item, index) in radioList" :key="index"
          @click="radioSwitch(index)">{{ item.label }}</text>
      </view>
    </view>

    <template v-if="!selfCheck">
      <view class="gap" v-if="pageCode !== 'complaint'"></view>
      <label-cell label="客户" :placehoderVisible="!form.customer" arrow @click="navigate('select-project')">
        <text>{{ form.customer }}</text>
      </label-cell>
      <label-cell label="联系人" placehoder="选择客户后自动填充" :placehoderVisible="!form.contact"
        @click="pickerEvent('open', 'roomInfo')">
        <text>{{ form.contact }}</text>
      </label-cell>
      <label-cell label="联系电话" :border="false" placehoder="请填写" :placehoderVisible="false" :arrow="false">
        <u--input type="number" placeholder="请填写" border="none" v-model="form.phone"></u--input>
      </label-cell>
    </template>

    <view class="gap" v-if="!selfCheck"></view>
    <label-cell v-if="selfCheck" label="区域项目" :placehoderVisible="!form.project"
      @click="navigate('select-project', { goback: 1 })">
      <text>{{ form.project }}</text>
    </label-cell>
    <label-cell label="问题类型" :placehoderVisible="!form.questionType" @click="navigate('repair-category', { typeReport: tastType })">
      <text>{{ form.questionType }}</text>
    </label-cell>
    <label-cell v-if="pageCode !== 'self-report'" label="位置" :placehoderVisible="false" :arrow="false">
      <u--input placeholder="请填写" border="none" v-model="form.place" />
    </label-cell>
    <label-cell label="投诉渠道" v-if="pageCode === 'complain'" :border="false" :placehoderVisible="!form.complaintChannel"
      @click="pickerEvent('open', 'complaintChannel')">
      <text>{{ form.complaintChannel }}</text>
    </label-cell>

    <view class="gap"></view>
    <label-cell label="紧急程度" :placehoderVisible="!form.emergency" @click="pickerEvent('open', 'emergencyDegree')">
      <text>{{ form.emergency }}</text>
    </label-cell>
    <label-cell label="是否有偿" v-if="needPayVisible" :required="false" :placehoderVisible="false" :arrow="false">
      <u-radio-group size="15" v-model="form.needPay">
        <u-radio :name="1">有偿维修</u-radio>
        <text class="radio-gap"></text>
        <u-radio :name="0">无偿维修</u-radio>
      </u-radio-group>
    </label-cell>
    <label-cell v-if="settingAuth.showAutoSend" label="是否指定人员接单" :required="false" :placehoderVisible="false" :arrow="false">
      <u-radio-group size="15" v-model="form.acceptOrder">
        <u-radio :name="1">是</u-radio>
        <text class="radio-gap"></text>
        <u-radio :name="0">否</u-radio>
      </u-radio-group>
    </label-cell>
    <label-cell label="关联设备" v-if="selfCheck && false" :required="false" :placehoderVisible="false" :arrow="false">
      <view class="scan-qrcode">
        <text>{{ form.device }}</text>
        <view @click="getDeviceInfo">
          <u-icon size="30" :color="THEME_COLOR" name="scan"></u-icon>
        </view>
      </view>
    </label-cell>
    <label-cell v-if="form.acceptOrder == 1" label="接单人" :placehoderVisible="!form.acceptStaffName" @click="navigate('handler', { type: 'followUpProcessor' })">
      <text>{{ form.acceptStaffName }}</text>
    </label-cell>
    <block v-if="selfCheck">
      <label-cell :label="getStaffText" :placehoderVisible="!form.handlerName" @click="navigate('handler', { type: 'followUser' })">
      <text>{{ form.handlerName }}</text>
      </label-cell>
      <label-cell label="联系电话" :required="false" :border="false" placehoder="请填写" :placehoderVisible="false"
        :arrow="false">
        <u--input type="number" placeholder="请填写" border="none" v-model="form.phone"></u--input>
      </label-cell>
    </block>
    <template v-if="!selfCheck">
      <label-cell label="受理人" :placehoderVisible="!form.handlerName" arrow @click="navigate('handler', { type: 'followUser' })">
        <text>{{ form.handlerName }}</text>
      </label-cell>
      <label-cell label="预约时间" :required="false" :placehoderVisible="!form.appointment" arrow @click="showPickerTime">
        <text>{{ form.appointment }}</text>
      </label-cell>
    </template>
    <view class="gap"></view>
    <view class="bottom-section">
      <u--textarea v-model="form.descr" border="none" :cursorSpacing="20" placeholder="请输入详细描述"></u--textarea>
      <u-upload name="upload" :fileList="form.fileList" :maxCount="9" previewFullImage sizeType="compressed" @afterRead="afterRead"
        @delete="deleteImg" />
    </view>
    <!-- 按钮 -->
    <view class="button-box">
      <!-- <text class="storage" @click="clickButton(2)">暂存</text> -->
      <text class="submit" @click="clickButton(pageType == 'edit' ? 3 : 1)">提交</text>
    </view>
    <u-safe-bottom />
    <!-- 预约时间 -->
    <u-datetime-picker :minDate="minDate" :show="showTimePicker" mode="datetime" @cancel="showTimePicker = false"
      @confirm="confirmTime"></u-datetime-picker>
    <!-- 确认弹框 -->
    <u-modal width="500rpx" title="确认操作" :show="modal.show" :content="modal.content" showCancelButton
      @cancel="modal.show = false" @confirm="modalConfirm"></u-modal>
    <!-- 暂存操作 -->
    <!-- <u-modal width="500rpx" title="确认操作" :show="cache.show" :content="cache.content" :cancelText="cache.cancelText"
      :confirmText="cache.confirmText" showCancelButton @cancel="cacheModal(0)" @confirm="cacheModal(1)"></u-modal> -->

    <!-- 选择紧急层度 -->
    <u-picker :show="picker.show" :columns="picker.list" :keyName="picker.keyName" @cancel="pickerEvent('cancel')"
      :immediateChange="true" @confirm="pickerEvent('confirm', null, $event)"></u-picker>
  </view>
</template>

<script>
import utils from '@/js/utils';
import labelCell from './components/label-cell.vue';
import pageRefresh from '@/js/pageRefresh';
import {
  getDictDetail, uploadMutiFile, saveQuestionTask,
  getDeviceInfoByQrcode, getQuestionTaskList, getOwnerInfo,
  getSettingDetailById, updateQuestionTask, sendQuesTaskAgentMsg,
  getCrmAutoPhoneSetting, 
  ownerInfoList} from '@/service/landcrm';

/**
 * 页面参数
 * pageType edit: 编辑, add: 新增
 * pageCode repair: 客户报修, complain: 客户投诉, other: 其他问题, self-repair: 自查报修, self-report: 自查报事
 * taskId 工单id
 */
export default {
  components: {
    labelCell,
  },
  data() {
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
          
    return {
      companyId:companyId,
      pageType: 'add',
      pageCode: 'repair',
      taskId: '',
      houseInfoId: '', // 房间id
      ownerPhone: '', // 业主手机号码
      radioList: [],
      radioIndex: 0,
      repairRadio: [
        {
          label: '户内报修',
          value: 0,
        },
        {
          label: '公区报修',
          value: 1,
        },
      ],
      taskRadio: [
        {
          label: '报事',
          value: 0,
        },
        {
          label: '咨询',
          value: 1,
        },
      ],
      taskDetail: {},
      form: {
        radioModel: 0,
        customerValue: '',
        customer: '',
        contact: '',
        phone: '',
        questionType: '',
        questionValue: '',
        place: '',
        complaintChannel: '',
        emergency: '',
        needPay: 0,
        acceptOrder: 0,
        acceptStaffId: '', // 接单人id
        acceptStaffName: '', // 接单人姓名
        appointment: '',
        handlerId: '', // 报修人，报事人，受理人 id
        handlerName: '', // 报修人，报事人，受理人 姓名
        descr: '',
        fileList: [],
        areaId: '',
        project: '',
        projectId: '',
        device: '',
        houseFixProgress: '',
        houseAddrInfoId: '', // 房间id
        followUpProcessorId: '', // 接单人id
        followUpProcessorName: '', // 接单人姓名
      },
      showTimePicker: false,
      minDate: new Date().getTime(),
      modal: {
        show: false,
        content: '',
        action: 1, // 1 提交 2 暂存
      },
      picker: {
        show: false,
        type: '',
        list: [],
        keyName: ''
      },
      questionTypeData: null,
      emergencyDegree: [],
      complaintChannel: [],
      roomInfo: [[]], // 物业管家页面，所选数据
      roomIndex: 0,
      cache: {
        key: 'CACHE_FORM_DATA',
        show: false,
        content: '是否加载上次暂存内容？',
        cancelText: '否',
        confirmText: '是'
      },
      options: null,
      settingAuth: {
        showAutoSend: false, // true: 显示指定接单人选项, false: 隐藏指定接单人选项
        autoSendOrder: false, // true: 指定接单人默认为是, false: 指定接单人默认为否
      }
    };
  },
  computed: {
    radioLabel() {
      const pageCode = this.pageCode;
      return pageCode === 'repair' ? '报修区域' : pageCode === 'other' ? '任务类型' : '';
    },
    tastType() {
      const radioIndex = this.radioIndex
      const pageCode = this.pageCode;
      const isRepair = pageCode == 'repair' || pageCode == 'self-repair'; // 报修
      const isComplain = pageCode == 'complain'; // 投诉
      const isReport = pageCode == 'self-report' || (pageCode == 'other' && radioIndex == 0); // 报事
      const isConsult = pageCode == 'other' && radioIndex == 1; // 咨询
      return isRepair ? 620 : isComplain ? 619 : isReport ? 618 : isConsult ? 622 : ''
    },
    // 自查
    selfCheck() {
      const pageCode = this.pageCode
      return pageCode === 'self-repair' || pageCode === 'self-report'
    },
    // 是否有偿
    needPayVisible() {
      const pageCode = this.pageCode
      const visiblePage = ['repair', 'self-repair']
      return visiblePage.includes(pageCode)
    },
    // 报修人，报事人
    getStaffText() {
      const pageCode = this.pageCode
      return ['repair', 'self-repair'].includes(pageCode) ? '报修人' : ['report', 'self-report'].includes(pageCode) ? '报事人' : ''
    }
  },
  methods: {
    // 设置标题
    setPageTile(options) {
      const { pageCode } = options || {};
      const title = pageCode === 'complain' ? '客户投诉'
        : pageCode === 'other' ? '其他问题'
          : pageCode === 'self-repair' ? '自查报修'
            : pageCode === 'self-report' ? '自查报事'
              : '客户报修';
      uni.setNavigationBarTitle({ title });
    },
    // 获取页面参数
    setPageQuery(options = {}) {
      this.pageType = options.pageType || 'add'
      this.pageCode = options.pageCode || 'repair'
      this.taskId = options.taskId || ''
      this.houseInfoId = options.houseInfoId || ''
      this.ownerPhone = options.ownerPhone || ''
    },
    // 上传图片
    afterRead(evt) {
      uploadMutiFile({ filePath: evt.file.url, name: 'file' }).then((res) => {
        if (res.success) {
          const file = res.fileInfo || {};
          this.form.fileList.push({ ...file, url: file.resPath });
        }
      });
    },
    // 删除图片
    deleteImg(evt) {
      this.form.fileList.splice(evt.index, 1);
    },
    // 打开时间picker
    showPickerTime() {
      this.showTimePicker = true;
      this.minDate = Date.now()
    },
    // 确认预约时间
    confirmTime(evt) {
      this.form.appointment = uni.$u.timeFormat(evt.value, 'yyyy-mm-dd hh:MM:00')
      this.showTimePicker = false;
    },
    // 暂存/提交
    clickButton(action) {
      const modal = {
        show: true,
        content: `您确定要${action == 2 ? '暂存' : '提交'}页面的内容吗`,
        action,
      };
      const valid = this.verifyForm()
      if (valid) Object.assign(this.modal, modal);
    },
    // 弹框确认
    modalConfirm() {
      const { action } = this.modal
      this.modal.show = false;
      if (action == 1 && this.pageType == 'add') this.saveQuestionTask();
      else if (action == 3 && this.pageType == 'edit') this.updateQuestionTask()
      if (action == 2) this.saveCache()
    },
    // 任务类型切换
    radioSwitch(index) {
      const pageCodeTmp = this.pageCode
      this.radioIndex = index
      if (pageCodeTmp == 'repair') {
        this.form.needPay = index == 1 ? 1 : 0
      } else if (pageCodeTmp == 'other' && this.pageType != 'edit') {
        this.form.questionType = ''
        this.form.questionValue = ''
      }
    },
    // 存取暂存
    saveCache() {
      const pageCode = this.pageCode
      const { key } = this.cache
      const radioIndex = this.radioIndex
      const form = this.form
      const roomInfo = this.roomInfo
      const emergencyDegree = this.emergencyDegree
      const complaintChannel = this.complaintChannel
      const cacheData = utils.storageAction({ key, action: 'get' }) || {}

      const data = {
        radioIndex,
        form,
        roomInfo,
        emergencyDegree,
        complaintChannel
      }
      cacheData[pageCode] = data
      utils.storageAction({ key, action: 'set', value: cacheData })
    },
    // 读取暂存
    loadCache() {
      const { key } = this.cache
      const pageCode = this.pageCode
      const cacheData = utils.storageAction({ key, action: 'get' }) || {}
      const data = cacheData[pageCode]
      if (data) {
        const {
          radioIndex,
          form,
          roomInfo,
          emergencyDegree,
          complaintChannel
        } = data

        this.radioIndex = radioIndex
        this.form = form;
        this.roomInfo = roomInfo
        this.emergencyDegree = emergencyDegree
        this.complaintChannel = complaintChannel
      }
    },
    // 暂存操作
    cacheModal(confirm) {
      if (confirm) this.loadCache()
      this.cache.show = false
    },
    // 是否存在暂存提交的数据
    hasCacheModal() {
      const cacheData = utils.storageAction({ key: this.cache.key, action: 'get' }) || {}
      const cacheForm = cacheData[this.pageCode]
      if (cacheForm) this.cache.show = true
    },
    // 加载紧急程度、投诉渠道
    getDictDetail(key) {
      const params = {
        data: {
          dictCode: key,
        },
      };
      getDictDetail(params).then((res) => {
        if (res.success) {
          this[key] = [res.data || []];
        }
      });
    },
    // 紧急程度事件
    pickerEvent(action, key, data) {
      if (action === 'open') {
        const isRooInfo = key === 'roomInfo'
        const hasCustomerData = this.roomInfo[0].length
        if (!hasCustomerData && isRooInfo) return uni.showToast({ title: '请选择客户', duration: 2000, icon: 'none' });
        this.picker.show = true;
        this.picker.type = key;
        this.picker.list = this[key];
        this.picker.keyName = isRooInfo ? 'ownerName' : 'detailName'
      } else if (action === 'cancel') {
        this.picker.show = false;
      } else if (action === 'confirm') {
        const { value, indexs } = data;
        const { detailName } = value[0];
        const { type } = this.picker;
        if (type === 'complaintChannel') {
          this.form.complaintChannel = detailName;
        }
        if (type === 'emergencyDegree') {
          this.form.emergency = detailName;
        }
        if (type === 'roomInfo') {
          const i = indexs[0]
          const customer = this.roomInfo[0][i]
          this.roomIndex = i
          this.selectCustomer(customer)
        }
        setTimeout(()=>{
          this.picker.show = false;
        },50)
      }
    },
    // 弹框选择客户列表
    openCustomer() {
      this.customer.show = true;
      setTimeout(() => {
        this.$refs.customer.search();
      }, 0);
    },
    // 页面跳转
    navigate(page = '', query = {}) {
      const { areaId, projectId } = this.form

      if (page == 'handler') {
        if (!areaId || !projectId) return uni.showToast({ title: `请选择${this.selfCheck ? '区域项目' : '客户'}`, duration: 2000, icon: 'none' })

        query = Object.assign(query, {
          areaId,
          projectId
        })
      }
      const queryArg = uni.$u.queryParams(query, true)
      uni.navigateTo({ url: `/pages-a/related-submission/${page}${queryArg}` })
    },
    // 监听事件
    onUniEvent() {
      // 监听问题分类
      uni.$on('updateQuestionType', ({ type, data }) => {
        this.form.questionType = data.text
        this.form.questionValue = data.id
      });
      // 监听 报修人/报事人，受理人，接单人
      uni.$on('select-handler', ({ type, data }) => {
        if (type == 'followUpProcessor') {
          // 接单人
          this.form.acceptStaffId = data.id
          this.form.acceptStaffName = data.text
        } else if (type == 'followUser') {
          // 受理人
          this.form.handlerId = data.id
          this.form.handlerName = data.text
          if (this.selfCheck) {
            // 如果是自查工单，选择 报修人/报事人 时候，自动带出手机号码
            this.form.phone = data.telephone || ''
          }
        }
      });
      // 监听客户
      uni.$on('select-unit', ({ type, data }) => {
        const index = this.roomIndex
        this.selectCustomer(data[index])
        this.roomInfo = [data]
      });
      // 监听选择项目
      uni.$on('select-project', ({ type, data }) => {
        const { projectName, areaId, projectId } = data
        this.form.areaId = areaId
        this.form.project = projectName
        this.form.projectId = projectId
      });
    },
    // 选择客户
    selectCustomer(customer) {
      const { ownerAddress = '', ownerPhone = '', ownerName = '' } = customer || {}
      this.form.customer = ownerAddress
      this.form.phone = ownerPhone
      this.form.contact = ownerName
      this.form.place = ownerAddress
    },
    // 校验表单
    verifyForm() {
      let text = ''
      const selfCheck = this.selfCheck
      const pageCode = this.pageCode
      const { customer, phone, questionType, place, complaintChannel, emergency, descr, acceptOrder, acceptStaffName, handlerName, project } = this.form
      const customerInvalid = customer == '';
      const phoneInvalid = phone == '';
      const questionTypeInvalid = questionType == '';
      const placeInvalid = place == '';
      const complaintChannelInvalid = pageCode === 'complain' && complaintChannel == '';
      const emergencyInvalid = emergency == '';
      const acceptStaffInvalid = acceptStaffName == ''
      const handlerlInvalid = handlerName == '';
      const descrInvalid = descr == '';
      const projectInvalid = project == '';
      const verifyLocation = pageCode !== 'self-report'

      if (selfCheck && projectInvalid) text = '请选择区域项目'
      if (!selfCheck && customerInvalid) text = '请选择客户'
      if (!selfCheck && !text && phoneInvalid) text = '请填写联系号码'
      if (!text && questionTypeInvalid) text = '请选择问题类型'
      if (verifyLocation && !text && placeInvalid) text = '请填写位置'
      if (!text && complaintChannelInvalid) text = '请选择投诉渠道'
      if (!text && emergencyInvalid) text = '请选择紧急程度'
      if (!text && acceptStaffInvalid && acceptOrder == 1 && this.settingAuth.showAutoSend) text = '请选择接单人'
      if (!text && handlerlInvalid && ['self-repair', 'self-report'].includes(pageCode)) text = `请选择${pageCode == 'self-repair' ? '报修' :  '报事'}人`
      if (!text && handlerlInvalid && ['repair', 'report', 'other'].includes(pageCode)) text = '请选择受理人'
      if (!text && descrInvalid) text = '请填写描述'
      if (text) uni.showToast({ title: text, duration: 2000, icon: 'none' });

      return !!!text
    },
    // 新建工单
    async saveQuestionTask() {
      const selfCheck = this.selfCheck
      const { place, questionValue, emergency, descr, fileList, needPay, appointment, complaintChannel, handlerId, handlerName, projectId: pjid, areaId, houseFixProgress, acceptOrder, acceptStaffId, acceptStaffName, phone, contact } = this.form
      const roomIndex = this.roomIndex
      const { projectId, ownerName = '', ownerPhone = '', roomId = '', ownerId = '', relateId = '' } = this.roomInfo[0][roomIndex] || {}
      const typeReport = this.tastType
      const pageCode = this.pageCode
      const isRepair = pageCode === 'repair'

      const { recordId } = this.options || {}
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      
      const params = {
        data: {
          quesTaskId: '',
          userId: userInfo.userId,
          areaId,
          projectId: pjid,
          relateId, // 业主房间关联表ID
          infoId: roomId, // 房间id
          ownerInfoId: selfCheck ? '' : ownerId, // 业主id
          regName: selfCheck ? handlerName : contact, // 业主姓名
          regNumber: phone, // 业主手机号码
          location: place,
          typeReport, // 任务类型 618: 报事, 619: 投诉建议, 620: 报修, 621: 表扬, 622: 咨询
          questionType: questionValue, // 问题类型
          postRecordppointment: '', // 请求来源
          RecordSourceName: '管家端',
          emergencyLevel: emergency, // 紧急程度
          recordDesc: descr,
          files: '',
          followUserId: handlerId, // 报修人，报事人，受理人id
          followUserName: handlerName, // 报修人，报事人，受理人姓名
          ifPaid: needPay, // 是否有偿 0: 无偿, 1: 有偿
          taskSourceValue: selfCheck ? 0 : 1, // 起单来源,任务注来源   0：自查下单 1：客户下单
          houseFixStatus: 0, // 是否房修 0: 否 1: 是
          houseFixProgress,
          appointmentDate: appointment, // 预约时间
          complaintChannel, // 投诉渠道
          isAutomaticSend: acceptOrder, // 是否指定接单人员 0: 否，指定派单人 1: 是，指定接单人
          followUpProcessorId: acceptOrder ? acceptStaffId : '', // 接单人id
          followUpProcessorName: acceptOrder ? acceptStaffName : '', // 接单人姓名
        }
      }

      if (fileList.length) {
        let ids = ''
        fileList.forEach(item => {
          ids += `${ids ? ',' : ''}${item.fid}`
        })
        params.data.files = ids
      }
      if (isRepair) params.data.isPublic = this.radioIndex // 报修区域 0: 户内报修, 1: 公区报修
      // 舆情预警工单
      if(recordId){
        params.data.outOrderTaskSystem =10;
        params.data.yqWarningId =recordId;

      }
       const res = await saveQuestionTask(params)
      if (res.resultCode == 200) {
        uni.showToast({ title: '操作成功', duration: 2000, icon: 'none' })

        // 工单消息推送
        await this.sendQuesTaskAgentMsg(res.data)
        if(this.options.isFromSingleChat){
          // 从单聊会话的工具栏进入，只回退一层
          uni.navigateBack();
          return;
        }
        if(recordId){
          setTimeout(() => {
            pageRefresh.setRefresh('YQWORK_DETAIL')
               uni.navigateBack({
                delta: 2       
               })
          }, 750);
        }else{
          uni.switchTab({ url: '/pages/index/index' })

        }
       } else {
        uni.showToast({ title: res.resultDesc || '提交失败', duration: 2000, icon: 'none' })
      }

    },
    // 更新工单
    async updateQuestionTask() {
      const roomIndex = this.roomIndex
      const { projectId, ownerName = '', ownerPhone = '', roomId = '', ownerId = '', relateId = '' } = this.roomInfo[0][roomIndex] || {}
      const { emergency, questionValue, needPay, descr, complaintChannel, contact, phone, acceptOrder, acceptStaffId, appointment, fileList, handlerId, projectId: pjid, place, handlerName } = this.form
      const isRepair = this.pageCode === 'repair'
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const strToDate = (str) => str ? new Date(str.replace(/-/g, '/')) : ''

      const params = {
        data: {
          quesTaskId: this.taskId || '',
          projectId: pjid,
          userId: userInfo.userId,
          infoId: roomId, // 房间id
          ownerInfoId: this.selfCheck ? '' : ownerId, // 业主id
          location: place, // 位置
          contactName: this.selfCheck ? handlerName : contact, // 联系姓名
          contactPhone: phone, // 联系电话
          isPublic: '', // 报修区域
          isPaid: needPay, // 是否有偿
          emergencyLevel: emergency, // 紧急程度
          replyCustomerDeadline: strToDate(this.taskDetail.replyCustomerDeadline), //	响应时限
          questionTypeId: this.tastType, // 任务类型
          problemTemplateId: questionValue, // 问题类型id，只填最后一个id
          promiseFinishDate: strToDate(this.taskDetail.promiseFinishDate), //	承诺完成时间
          endDate: strToDate(this.taskDetail.endDate), //	任务处理时限
          quesDesc: descr, //	任务描述
          complaintChannel, // 投诉渠道
          sapOddNo: this.taskDetail.sapOddNo || '',
          followUserId: handlerId, // 受理人id
          followUpProcessorId: acceptOrder == 1 ? acceptStaffId : '', // 处理人id，接单人id
          appointmentDate: appointment, // 预约时间
          saveFileIdList: fileList.map(item => item.fid || item).join(','), // 附件id
        },
        responeToast: false
      }
      if (isRepair) {
        params.data.repairAreaType = this.radioIndex // 报修区域
        params.data.isPublic = this.radioIndex // 报修区域
      }
      const res = await updateQuestionTask(params)
      if (res.resultCode == 200) {
        pageRefresh.setRefresh('WORK_ORDER_EDIT')
          uni.navigateBack({
            delta: 1
          })
                } else {
        uni.showToast({ title: res.resultDesc || '提交失败', duration: 2000, icon: 'none' })
      }
    },
    // 工单消息推送
    async sendQuesTaskAgentMsg(taskId) {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          companyId: this.companyId,
          userId: userInfo.userId,
          quesTaskId: taskId,
          quesTaskState: '0', // 0: 新建工单的提醒, 1: 派单工单的提醒
          toUserId: this.form.handlerId, // 接收用户（受理人）
          pageUrl: 'pages-workorder/workorder-detail/detail?taskId=' + taskId
        },
        hideLoading: true,
        responeToast: false
      }
      await sendQuesTaskAgentMsg(params)
    },
    // 关联设备
    getDeviceInfo() {
      // uni.scanCode({
      //   scanType: ['qrCode'],
      //   success: function (res) {
      //     
      //   }
      // });

      getDeviceInfoByQrcode({
        data: {
          deviceNumber: '072d21f7-1d90-4b2f-a1f0-701925a7e146'
        }
      }).then(res => {

      })
    },
    // 初始化数据
    initData(options) {
      const { key } = this.cache
      const pageCode = this.pageCode;
      this.radioList = pageCode === 'repair' ? this.repairRadio : pageCode === 'other' ? this.taskRadio : [];
      this.getDictDetail('emergencyDegree');
      if (pageCode === 'complain') this.getDictDetail('complaintChannel');

      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      this.$emit('select-handler', { type: 'regUser', data: { id: userInfo.id, text: userInfo.userName } })

      if (this.pageType == 'add') {
        // 设置报修人，报事人，受理人
        this.form.handlerId = userInfo.userId || ''
        this.form.handlerName = userInfo.userName || ''
        if (this.selfCheck) {
          // 如果是自查工单，自动带出手机号码
          this.form.phone = userInfo.telephone || ''
        }
      }
      
      
      // 工单草稿暂存
      // const cacheData = utils.storageAction({ key, action: 'get' }) || {}
      // const cacheForm = cacheData[pageCode]
      // if (cacheForm) this.cache.show = true
    },
    // 编辑模式下，获取工单详情
    async getTaskDetail() {
      const params = {
        data: {
          quesTaskId: this.taskId
        },
        hideLoading: true
      }
      let res = await getQuestionTaskList(params)
      res = res?.[0] ?? {}
      this.taskDetail = res
      this.form.fileList = (res.saveFileList || []).map(item => ({
        ...item,
        url: item.saveFilePath,
        fid: item.saveFileId
      }))
      this.form.appointment = res.appointmentDate

      // 只有 pageCode=其他问题/客户报修，才需要设置 报修区域 或 任务类型
      const taskType = res.taskType // 工单类型
      const isPublic = res.isPublic // 是否公区报修
      let radioIndex = -1
      if (this.pageCode == 'other') {
        if (taskType == 620) radioIndex = 0
        if (taskType == 622) radioIndex = 1
      } else if (this.pageCode == 'repair') {
        if (!isNaN(parseInt(isPublic))) radioIndex = parseInt(isPublic)
      }
      radioIndex > -1 && this.radioSwitch(radioIndex)

      // 设置 客户地址 联系人 联系电话
      if (!this.selfCheck) {
        // 只有客户录单，才需要设置 客户 联系人 联系电话
        let ownerInfoList = await this.getOwnerInfo(res.houseAddrInfoId)
        ownerInfoList = ownerInfoList.map(item => ({
          ...item,
          roomId: res.houseAddrInfoId, // 房间id
          ownerId: item.infoId, // 业主id
        }))
        const ownerIndex = ownerInfoList.findIndex((item) => item.ownerId == res.ownerInfoId)
        if (ownerIndex != -1) {
          this.roomInfo = [ownerInfoList]
          this.picker.type = 'roomInfo'
          this.pickerEvent('confirm', null, {
            value: [ownerInfoList[ownerIndex]],
            indexs: [ownerIndex]
          })
          this.form.customer = res.contactAddress || ''
          this.form.contact = res.contactName || ''
          this.form.phone = res.contactPhone || ''
        }
      } else {
        // 自查下单
        this.form.place = res.quesLocation
        this.form.phone = res.contactPhone || ''
      }

      // 设置 区域项目
      uni.$emit('select-project', { data: {
        areaId: res.areaId,
        projectId: res.projectId,
        projectName: res.projectName
      } })

      // 设置问题类型
      uni.$emit('updateQuestionType', { data: {
        text: res.quesLibName,
        id: res.quesLibId
      } })

      // 设置投诉渠道
      this.form.complaintChannel = res.complaintChannel
      // 设置紧急程度
      this.form.emergency = res.emergencyDegreeName
      // 设置 是否有偿
      this.form.needPay = parseInt(res.ifPaid)
      // 设置 预约时间
      if (res.appointmentDate) {
        this.form.appointment = uni.$u.timeFormat(res.appointmentDate, 'yyyy-mm-dd hh:MM:ss')
      }
      // 设置 报修人，报事人，受理人
      uni.$emit('select-handler', { type: 'followUser', data: {
        id: res.oriUserId,
        text: res.oriUserName
      } })
      // 设置 工单描述
      this.form.descr = res.quesDesc
    },
    // add模式下，如果存在 houseInfoId 房间id，表示从客户拜访页面过来的，需要带出房间信息
    async getRoomInfoByHouseId() {
      const idTmp = this.houseInfoId
      if (!idTmp) return

      if (!this.selfCheck) {
        // 只有客户录单，才需要设置 客户 联系人 联系电话
        let ownerInfoList = await this.getOwnerInfo(idTmp)
        ownerInfoList = ownerInfoList.map(item => ({
          ...item,
          roomId: idTmp, // 房间id
          ownerId: item.infoId, // 业主id
        }))
        if (ownerInfoList.length > 0) {
          this.roomInfo = [ownerInfoList]
          this.picker.type = 'roomInfo'
          let currentOwnerIndex = -1
          if (this.ownerPhone) {
            // 选择显示指定的业主
            currentOwnerIndex = ownerInfoList.findIndex(item => item.ownerPhone == this.ownerPhone)
          }
          currentOwnerIndex = currentOwnerIndex == -1 ? 0 : currentOwnerIndex
          this.pickerEvent('confirm', null, {
            value: [ownerInfoList[currentOwnerIndex]],
            indexs: [currentOwnerIndex]
          })
        }

        // 如果从会话聊天底部的 业户工单 的添加工单按钮（/pages-workorder/modules/suction-cup-add.vue） 进入，则通过接口带出 区域项目
        if (this.houseInfoId) {
          const objTmp = ownerInfoList?.[0] ?? {}
          // 设置 区域项目
          uni.$emit('select-project', { data: {
            areaId: objTmp.areaId || '',
            projectId: objTmp.projectId || '',
            projectName: objTmp.projectName || ''
          } })
        }
      }
    },
    // 获取业主信息
    async getOwnerInfo(houseAddrInfoId) {
      const params = {
        data: {
          houseAddrInfoId
        },
        hideLoading: true,
        wrapResponse: true
      }
      const res = await getOwnerInfo(params)
      return res?.data ?? []
    },
    // 查询配置信息
    async getSettingDetailById() {
      const params = {
        data: {
          companyId: this.companyId,
          type: 1
        },
        hideLoading: true
      }
      const res = await getSettingDetailById(params)
      const data = res?.data ?? {}

      const houseFixStatus = 0 // 是否房修
      this.form.houseFixProgress = houseFixStatus == 1 ? data.dealType2 : data.dealType1
    },
    // 获取工单基础配置
    async getCrmAutoPhoneSetting() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const res = await getCrmAutoPhoneSetting(userInfo.userId)
      const data = res.data || {}
      const showTmp = this.settingAuth.showAutoSend = data.showAutoSend == 1 ? true : false // 1, 0
      this.settingAuth.autoSendOrder = data.autoSendOrder == 1 ? true : false // 1, 0
      this.form.acceptOrder = showTmp ? data.autoSendOrder : 0
    }
  },
  onLoad(options) {
    this.options = options; 
    this.setPageQuery(options)
    this.setPageTile(options);
    this.onUniEvent();
    this.initData(options)
    this.getSettingDetailById()
    this.getCrmAutoPhoneSetting()

    if (this.pageType == 'add') {
      // 新增工单
      this.getRoomInfoByHouseId()
    } else if (this.pageType == 'edit') {
      // 编辑工单
      this.getTaskDetail()
    }
  },
};
</script>
