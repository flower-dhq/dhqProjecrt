<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="header-panel">
      <cell-text label="处理人:" padding="30rpx" contentAlign="flex-end">{{ formObj.handleStaff.label || '' }}</cell-text>
      <!-- 设置了对外 -->
      <textarea
        v-if="settingAuth.isExternalReply" v-model="formObj.externalReply"
        placeholder="对外回复" style="width: 100%; padding: 10px; box-sizing: border-box; font-size: 13px;"
        placeholder-style="color: #cfcfcf; font-size: 13px;"
      />
      <block v-if="!settingAuth.isExternalReply">
        <textarea
          v-model="formObj.recordQues"
          placeholder="描述" style="width: 100%; padding: 24rpx 30rpx; box-sizing: border-box; font-size: 28rpx;"
          placeholder-style="color: #cfcfcf; font-size: 13px;"
        />
        <u-upload name="upload" :fileList="formObj.fileList" :maxCount="9" previewFullImage sizeType="compressed" :customStyle="{ paddingLeft: '30rpx' }" @afterRead="afterRead" @delete="deleteImg" />
      </block>
    </view>

    <view class="header-panel" v-if="settingAuth.isExternalReply">
      <textarea
        v-model="formObj.internalReply"
        placeholder="对内回复" style="width: 100%; padding: 10px; box-sizing: border-box; font-size: 13px;"
        placeholder-style="color: #cfcfcf; font-size: 13px;"
      />
      <u-upload name="upload" :fileList="formObj.fileList" :maxCount="9" previewFullImage sizeType="compressed" @afterRead="afterRead" @delete="deleteImg" />
    </view>

    <view class="content-panel" v-if="false">
      <cell-text label="是否有偿" padding="10px" border="none" customStyle="font-size: 30rpx;" contentAlign="flex-start">
        <u-radio-group size="15" v-model="formObj.isPaid">
          <u-radio :name="1">有偿维修</u-radio>
          <text class="radio-gap"></text>
          <u-radio :name="0">无偿维修</u-radio>
        </u-radio-group>
      </cell-text>
    </view>

    <view class="content-panel auto-width">
      <cell-text label="维修事项" isRight padding="30rpx" customClass="panel-title">
        <u-button slot="right" text="添加" type="primary" plain :customStyle="{ width: '45px', height: '25px' }" @click="selQuestionType" />
      </cell-text>
      <cell-text v-for="(item) in repairList" :key="item.name" :label="item.label" padding="30rpx" contentAlign="flex-end" customStyle="font-size: 28rpx;">
        <u-number-box v-model="item.value" :min="0" integer :name="item.name" @change="repairChange" />
      </cell-text>
    </view>

    <!-- <view class="content-panel auto-width" v-if="settingAuth.ismateriel">
      <cell-text label="维修材料" isRight padding="30rpx" customClass="panel-title" />
      <cell-text v-for="(item, index) in materialList" :key="index" :label="item.label" padding="30rpx" contentAlign="flex-end" customStyle="font-size: 28rpx;">{{ item.value }}</cell-text>
    </view> -->

    <view class="content-panel" v-if="formObj.isPaid == 1">
      <!-- 设置有偿，设置需要支付 -->
      <cell-text label="费用信息(元)" isRight padding="30rpx" customClass="panel-title" />
      <cell-text v-for="(item, index) in payList" :key="index" :label="item.label + ':'" padding="30rpx" labelWidth="140rpx" contentAlign="flex-start" customStyle="font-size: 28rpx;">{{ item.value || 0 }}</cell-text>
      <cell-text label="实际费用:" :padding="0" labelWidth="140rpx" customClass="realtime-text auto-content" customStyle="font-size: 28rpx;">
        <u--input v-model="formObj.realPrice" placeholder="请输入实际费用" border="none" @blur="realPriceFilter" />
      </cell-text>
    </view>

    <view class="content-panel">
      <cell-text label="工时信息(分钟)" isRight padding="30rpx" customClass="panel-title" />
      <cell-text label="额定工时:" padding="30rpx" labelWidth="140rpx" contentAlign="flex-start" customStyle="font-size: 28rpx;">{{ ratedWorkHour }}</cell-text>
      <cell-text label="实际工时:" :padding="0" labelWidth="140rpx" customClass="realtime-text auto-content" customStyle="font-size: 28rpx;">
        <u--input v-model="formObj.workHour" placeholder="请输入实际工时" border="none" @blur="resetTableList" />
      </cell-text>
    </view>

    <view class="content-panel auto-width">
      <cell-text label="维修人员" isRight padding="30rpx" customClass="panel-title">
        <u-button slot="right" text="添加" type="primary" plain :customStyle="{ width: '45px', height: '25px' }" @click="linkTo('repair')" />
      </cell-text>
      <uni-table>
        <uni-tr>
          <uni-th width="90" align="center">维修人</uni-th>
          <uni-th width="90" align="center">人员类型</uni-th>
          <uni-th width="90" align="center">额定工时(分钟)</uni-th>
          <uni-th width="90" align="center">实际工时(分钟)</uni-th>
          <uni-th width="110" align="center">工时比例(%)</uni-th>
          <uni-th width="70" align="center">操作</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in tableList" :key="index">
          <uni-td align="center">{{ item.repairStaff }}</uni-td>
          <uni-td align="center">{{ item.staffType }}</uni-td>
          <uni-td align="center">{{ item.ratedTime }}</uni-td>
          <uni-td align="center">{{ item.actualTime || 0 }}</uni-td>
          <uni-td align="center">
            <u-number-box v-model="item.timeRatio" :min="0" :max="100" :decimalLength="2" :inputWidth="50" asyncChange @blur="workTimeChange($event, item)" @plus="numberEvent('plus', item)" @minus="numberEvent('minus', item)" />
          </uni-td>
          <uni-td align="center">
            <text v-if="index != 0" :style="{ color: THEME_COLOR }" @click="delTableItem(item, index)">删除</text>
          </uni-td>
        </uni-tr>
      </uni-table>
    </view>
    <view class="content-panel" v-if="formObj.isPaid == 1">
      <cell-text label="支付类型:" :padding="0" labelWidth="140rpx" customClass="realtime-text auto-content" customStyle="font-size: 28rpx;">
        <view class="radio-panel">
          <text :class="['radio-box', { selected: item.name == formObj.payType }]" v-for="(item, index) in payTypeList" :key="index" @click="radioEvent(item)">{{ item.label }}</text>
        </view>
      </cell-text>
    </view>

    <u-button text="提交" type="primary" :disabled="isLoading" :customStyle="{ margin: '0px 10px 10px', width: 'initial' }" @click="handleSubmit" />
    <u-safe-bottom />

    <u-toast ref="messageEl" />

    <!-- 数字键盘 -->
    <!-- <u-keyboard mode="number" :show="keyboardShow" dotDisabled :overlay="false" @change="keyboardChange" @backspace="keyboardBackspace" @close="keyboardShow = false" @confirm="keyboardShow = false" /> -->
  </view>
</template>

<script>
import listenerMixin from '@/js/mixin/eventListenerMixin'
import CellText from '@/components/cell-text.vue'
import pageRefresh from '@/js/pageRefresh'
import { getQuesTaskDetailRecord, uploadMutiFile, getProjectSetting, handleQuestionTask, getCrmserverTypeinfos, getSettingDetailById, getCrmAutoPhoneSetting, saveBillToPay } from '@/service/landcrm'

/**
 * 报修工单的处理完成操作
 */
export default {
  mixins: [listenerMixin],
  components: {
    CellText,
  },
  data() {
    return {
      quesTaskId: '',
      taskDetail: {},
      formObj: {
        recordQues: '',
        externalReply: '', // 对外回复
        internalReply: '', // 对内回复
        fileList: [],
        isPaid: 0, // 0: 无偿支付, 1: 有偿支付
        payType: 1, // 支付类型。1: 现金, 2: 扫码, 3: 月结
        handleStaff: {
          label: '',
          userId: ''
        },
        workHour: 0,
        realPrice: 0,
      },
      settingAuth: {
        paySetting: false, // 有偿是否预支付配置。true: 先支付后处理, false: 先处理后支付
        isExternalReply: false, // 是否需要对外回复
        isNeedFinishFile: false, // 报修工单是否强制上传附件
        ismateriel: false, // 是否需要物料
        paySystem: false, // 是否开启有偿工单线上支付
      },
      repairList: [], // 问题分类
      materialList: [
        // { label: '智慧花园1号仓', value: '33(件)' },
        // { label: '消防应急照明灯', value: '1.0' },
        // { label: '电焊条', value: '1.0' },
      ],
      payTypeList: [
        { label: '现金支付', name: 1 },
        { label: '扫码支付', name: 2 }
      ],
      tableList: [
        // { repairStaff: '谢霉霉', staffType: '维修员', ratedTime: 500, actualTime: 600, timeRatio: 20 },
      ],
      keyboardShow: false, // 数字键盘
      isLoading: false, // 禁止按钮重复点击
    }
  },
  computed: {
    // 计算费用信息，计算方式：维修事项的数量 * 维修事项的费用信息，然后再把每个维修事项的费用相加，得到总的费用信息
    payList() {
      const res = this.repairList.reduce((store, item) => {
        store.rengong += item.manMadePrice * item.value
        store.cailiao += item.materialPrice * item.value
        store.cankao += store.rengong + store.cailiao
        return store
      }, {
        rengong: 0,
        cailiao: 0,
        cankao: 0
      })
      return [
        { label: '人工费用', name: 'manMadePrice', value: res.rengong },
        { label: '材料费用', name: 'materialPrice', value: res.cailiao },
        { label: '参考费用', name: 'ratedAmount', value: res.cankao }
      ]
    },
    // 计算额定工时
    ratedWorkHour() {
      const res = this.repairList.reduce((res, item) => {
        return res + (item.fixDate * item.value)
      }, 0)
      return res
    }
  },
  async onLoad(options) {
    this.quesTaskId = options.taskId || ''

    await this.getTaskDetail()

    // 获取问题类型id
    const serverId = this.taskDetail.problemTemplate.split(',').slice(-1)[0] || ''
    const setting = await Promise.all([
      this.getProjectSetting(),
      this.getCrmserverTypeinfos(serverId),
      this.getSettingByRepair(),
      this.getCrmAutoPhoneSetting()
    ])
    this.collectSetting(setting)
  },
  beforeDestroy() {
    uni.$emit('refresh')
  },
  listener: {
    // 监听问题分类
    updateQuestionType({ type, data }) {
      const { list } = data
      const item = list.slice(-1)[0] || {}
      const has = this.repairList.some((node) => node.name == item.serverId)
      // 已经选择了，则不需要再添加进去
      if (!item || has) return

      this.getCrmserverTypeinfos(item.serverId).then(res => {
        this.repairList.push({ label: item.title, name: item.serverId, list, value: 1, manMadePrice: res.manMadePrice, materialPrice: res.materialPrice, ratedAmount: res.ratedAmount, fixDate: res.fixDate }) // list: id层级列表
        this.resetTableList(this.formObj.workHour)
      })
    },
    // 监听受理人，处理人
    'select-handler'({ type, data }) {
      if (type == 'handler') {
        // 处理人
        this.formObj.handleStaff = {
          ...data,
          label: data.text
        }
      } else if (type == 'repair') {
        // 维修人员
        const userId = data.userId || ''
        if (!userId) reurn
        this.repairStaffChange(data.userName, userId, '协助人')
      }     
    }
  },
  methods: {
    // 获取工单详情
    async getTaskDetail() {
      const params = {
        data: {
          quesTaskId: this.quesTaskId
        },
        wrapResponse: true
      }
      const res = await getQuesTaskDetailRecord(params)
      this.taskDetail = res?.data?.taskDetail ?? {}

      // 设置问题分类
      const listTmp = (this.taskDetail.problemTemplate || '')
        .split(',')
        // 给最后一个填上title问题分类名称
        .map((serverId, index, arr) => ({ serverId, title: index == arr.length - 1 ? this.taskDetail.problemTmpName : '' }))
      if (listTmp.length) {
        uni.$emit('updateQuestionType', { data: { list: listTmp } })
      }

      // 设置处理人
      uni.$emit('select-handler', { type: 'handler', data: { userId: this.taskDetail.followUserId, text: this.taskDetail.followUpProcessorName } })

      this.formObj.isPaid = this.taskDetail.isPaid
      this.calcWorkHour()
      this.repairStaffChange(this.taskDetail.followUpProcessorName, this.taskDetail.followUserId, '维修人')
    },
    /**
     * 根据问题分类id，获取配置信息
     */
    async getCrmserverTypeinfos(serverId) {
      const res = await getCrmserverTypeinfos(serverId)
      const data = res?.data?.[0] ?? {}
      const manMadePrice = parseFloat(data.price || '0')
      const materialPrice = parseFloat(data.materialPrice || '0')
      const fixDate = parseFloat(data.fixDate || '0')
      const isExternalReply = data.isExternalReply == 1 ? true : false // 1, 0

      return {
        manMadePrice, // 人工费(元)
        materialPrice, // 材料费(元)
        ratedAmount: manMadePrice + materialPrice,
        fixDate, // 工时(分钟)
        isExternalReply, // 是否需要对外回复
      }
    },
    // 获取支付配置
    async getProjectSetting() {
      const res = await getProjectSetting(this.taskDetail.projectId)
      const data = res.data || {}
      return {
        paySetting: data.paySetting == 1 ? true : false, // 1, 2
        isExternalReply: data.externalReply == 1 ? true : false, // 1, 2 自查工单是否需要对外回复
        isNeedFinishFile: data.isNeedFinishFile == 1 ? true : false, // 1, 2
      }
    },
    // 获取维修单的配置
    async getSettingByRepair() {      
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      const params = {
        data: {
          companyId: companyId,
          type: 1
        },
        hideLoading: true
      }
      const res = await getSettingDetailById(params)
      const data = res.data || {}
      return {
        ismateriel: data.dealType3 == 1 ? true : false, // 1, 2
      }
    },
    // 获取工单基础参数配置
    async getCrmAutoPhoneSetting() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const res = await getCrmAutoPhoneSetting(userInfo.userId)
      const data = res.data || {}
      return {
        paySystem: data.paySystem == 1 ? true : false, // 1, 0
      }
    },
    // 收集配置
    collectSetting(setting = []) {
      this.settingAuth = setting.reduce((store, item, index) => {
        if (index == 1) {
          const zichaFlag = store.isExternalReply // 自查工单是否需要对外回复
          const kehuFlag = item.isExternalReply // 问题标类型的是否需要对外回复配置
          const isSelf = this.taskDetail.orignSource == 0 ? true : false // true: 自查工单; false: 客户工单
          /**
           * 1、客户下单：是否对外回复，根据问题标准库那边的设置来
           * 2、自查下单：综合“项目及参数配置”和“问题标准库”的配置，意思是，这2个地方，都是“是”-》需要对外回复；都是“否”-》不需要对外回复；一个是，一个否-》不需要对外回复
           */
          store.isExternalReply = !isSelf ? kehuFlag : (kehuFlag == zichaFlag ? kehuFlag : false)
        } else {
          Object.assign(store, item)
        }
        return store
      }, {})
    },
    // 选择问题类型
    selQuestionType() {
      const typeReport = this.taskDetail.questionTypeId || ''
      uni.navigateTo({ url: `/pages-a/related-submission/repair-category?typeReport=${typeReport}` })
    },
    // 维修事项操作
    repairChange(item) {
      if (!item.value) {
        // 删除该节点
        const oldList = [].concat(this.repairList)
        const index = oldList.findIndex((node) => node.name == item.name)
        if (index == -1) return

        oldList.splice(index, 1)
        this.repairList = oldList
      }
      setTimeout(() => {
        this.resetTableList(this.formObj.workHour)
      })
    },
    // 维修人员操作
    repairStaffChange(userName, userId, typeName) {
      if (!userId) return

      // 判断是否有重复的
      const hasItem = this.tableList.some((item) => item.userId == userId)
      if (hasItem) return

      const rateVal = 100
      const timeTmp = this.calcTimeRate(rateVal)
      this.tableList.push({ repairStaff: userName, userId, staffType: typeName, ratedTime: timeTmp.ratedWorkHour, actualTime: timeTmp.workHour, timeRatio: rateVal })
    },
    // 选择处理人，维修人
    linkTo(type) {
      const query = uni.$u.queryParams({
        areaId: this.taskDetail.areaId,
        projectId: this.taskDetail.projectId,
        type
      }, true)
      uni.navigateTo({ url: `/pages-a/related-submission/handler${query}` })
    },
    // 计算实际工时
    calcWorkHour() {
      const nowDate = new Date()
      const acceptDate = new Date(this.taskDetail.acceptDate.replace(/-/g, '/'))
      let diff = nowDate.getTime() - acceptDate.getTime()
      diff = diff < 0 ? 0 : diff
      this.formObj.workHour = Math.floor(diff / (60 * 1000)) // 单位 分钟 
    },
    calcTimeRate(rate) {
      // 额定工时，向下取两位小数
      const ratedWorkHour = (Math.floor(this.ratedWorkHour * (rate / 100) * 100) / 100) || 0

      // 实际工时
      const workHour = (Math.floor(this.formObj.workHour * (rate / 100) * 100) / 100) || 0
      return { ratedWorkHour, workHour }
    },
    workTimeChange(data, item) {
      // 控制输入的值
      const value = this.formatNum(data.value)
      item.timeRatio = 0
      setTimeout(() => {
        item.timeRatio = value
      })

      const timeTmp = this.calcTimeRate(value)
      item.ratedTime = timeTmp.ratedWorkHour
      item.actualTime = timeTmp.workHour
    },
    // 格式化数字，保留两位小数
    formatNum(val) {
      let res = parseFloat(val) // 转成数字类型
      res = isNaN(val) ? 0 : res
      res = Math.floor(res * 100) / 100 // 保留两位小数
      res = res > 100 ? 100 : (res < 0 ? 0 : res) // 控制范围在 1-100
      return res
    },
    numberEvent(type, item) {
      let value = this.formatNum(item.timeRatio)
      if (type == 'plus') {
        value = value + 1 > 100 ? value : (value + 1)
      } else if (type == 'minus') {
        value = value - 1 < 0 ? value : (value - 1)
      }
      this.workTimeChange({ value }, item)
    },
    // 上传图片
    async afterRead(evt) {
      const res = await uploadMutiFile({ filePath: evt.file.url, name: 'file' })

      const file = res.fileInfo || {}
      this.formObj.fileList.push({ ...file, url: file.resPath })
    },
    // 删除图片
    deleteImg(evt) {
      this.formObj.fileList.splice(evt.index, 1)
    },
    // 删除维修人
    delTableItem(item, index) {
      this.tableList.splice(index, 1)
    },
    validateParams() {
      const response = (success = false, data = {}, message = '') => ({
        success,
        message,
        data
      })

      if (this.settingAuth.isExternalReply && !this.formObj.externalReply) {
        return response(false, {}, '请填写对外回复')
      }
      if (this.settingAuth.isExternalReply && !this.formObj.internalReply) {
        return response(false, {}, '请填写对内回复')
      }
      if (this.taskDetail.biProblemCategory == 5 && this.settingAuth.isNeedFinishFile && !this.formObj.fileList.length) {
        // 报修工单，设置了强制上传附件
        return response(false, {}, '请上传附件')
      }
      if (typeof(this.formObj.isPaid) != 'number') {
        return response(false, {}, '请选择是否有偿')
      }
      if (this.repairList.length == 0) {
        return response(false, {}, '请添加维修事项')
      }
      if (this.formObj.isPaid == 1 && !this.formObj.realPrice) {
        // 有偿工单，设置了支付
        return response(false, {}, '请输入实际费用')
      }
      if (!this.formObj.workHour) {
        return response(false, {}, '请输入实际工时')
      }
      const hasErr = this.tableList.some((item) => !item.timeRatio)
      if (hasErr) {
        return response(false, {}, '请输入工时比例')
      }
      const sumIs100 = this.tableList.reduce((sum, item) => sum += item.timeRatio, 0)
      if (sumIs100 != 100) return response(false, {}, '工时比例总和需要等于100%')

      return response(true, {})
    },
    async handleSubmit() {
      const errRes = this.validateParams()
      if (!errRes.success) {
        this.$refs.messageEl.show({
          type: 'default',
          message: errRes.message
        })
        return
      }

      if (this.isLoading) return
      this.isLoading = true

      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });

      const params = {
        data: {
          quesTaskIds: this.quesTaskId,
          userId: userInfo.userId,
          biProblemCategory: 5,
          modelType: 22, // 处理完成
          origUser: this.taskDetail.originalUserId, // 受理人
          ratedWorkHour: this.ratedWorkHour, // 额定工时
          workHour: this.formObj.workHour, // 实际工时
          price: this.formObj.isPaid ? this.formObj.realPrice : 0, // 实际费用
          isNeedPay: this.formObj.isPaid,
          manMadePrice: this.payList[0].value || 0,
          materialPrice: this.payList[1].value || 0,
          ratedAmount: this.payList[2].value || 0, // 参考费用
          payType: this.formObj.isPaid ? this.formObj.payType : '', // 现金支付
          paySetting: this.settingAuth.paySetting ? 2 : 1,
          isPayAgain: 0, // 工时是否需要再次支付
          isPaid: this.formObj.isPaid, // 是否有偿
          processUser: this.formObj.handleStaff.userId,
          externalReply: this.settingAuth.isExternalReply ? this.formObj.externalReply : '', // 对外回复
          recordQues: this.settingAuth.isExternalReply ? this.formObj.internalReply : this.formObj.recordQues, // 对内回复 或 描述
          files: this.formObj.fileList.map((item) => item.fid).join(','), // 附件
          replyReviewStatus: 1, // 审核状态
          // 问题分类
          servers: JSON.stringify(this.repairList.map((item) => ({
            serverId: item.name, serverName: item.label, serverQuantity: item.value,
            valCas: item.list.map((ids) => ids.serverId),
            fixDate: 0, materialPrice: this.taskDetail.materialPrice || 0, price: this.taskDetail.manMadePrice || 0
          }))),
          // 维修人员
          helpers: JSON.stringify(this.tableList.map((item) => ({ userId: item.userId, userName: item.repairStaff, percent: item.timeRatio, ratedWorkHour: item.ratedTime, workHour: item.actualTime, userType: item.staffType == '维修人' ? 1 : 2 }))),
        },
        hideLoading: true
      }
      const res = await handleQuestionTask(params).catch(() => {
        this.isLoading = false
      })
      
      if (res.resultCode == 200) {
        this.$refs.messageEl.show({
          type: 'default',
          message: '操作成功'
        })

        if (this.formObj.payType == 1) {
          // 现金支付，直接返回刷新页面
          pageRefresh.setRefresh('WORK_ORDER_DETAIL')
          uni.navigateBack({ delta: 1 })
        } else if (this.formObj.payType == 2 && this.settingAuth.paySystem && this.formObj.isPaid == 1) {
          // 扫码支付，如果设置了线上支付，是有偿报修工单，需要保存订单
          const { success, message } = await this.saveBillToPay()
          if (success) {
            // 跳转到二维码页面
            uni.redirectTo({ url: '/pages-payment/workorder-pay/pay?taskId=' + this.quesTaskId + '&price=' + this.formObj.realPrice })
          } else {
            this.$refs.messageEl.show({
              type: 'default',
              message
            })
          }
        } else {
          // 否则不需要支付，直接返回刷新页面
          pageRefresh.setRefresh('WORK_ORDER_DETAIL')
          uni.navigateBack({ delta: 1 })
        }
      } else {
        this.isLoading = false
        this.$refs.messageEl.show({
          type: 'default',
          message: '操作失败'
        })
      }
    },
    // 保存订单，然后生成二维码
    async saveBillToPay() {
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const params = {
        data: {
          taskId: this.quesTaskId,
          userId: userInfo.userId,
          money: this.formObj.realPrice,
          payType: this.formObj.payType
        },
        hideLoading: true
      }
      const res = await saveBillToPay(params)
      return {
        success: res.status == 200,
        message: res.message || '操作失败'
      }
    },
    // 重新计算维修人员工时
    resetTableList(num) {
      num = parseInt(num)
      num = isNaN(num) ? 0 : num
      num = num < 0 ? 0 : num
      this.formObj.workHour = num

      this.tableList = this.tableList.map((item) => {
        const { ratedWorkHour, workHour } = this.calcTimeRate(item.timeRatio)
        return { ...item, ratedTime: ratedWorkHour, actualTime: workHour }
      })
    },
    // 实际费用需要过滤值
    realPriceFilter(num) {
      num = parseFloat(num)
      num = isNaN(num) ? 0 : num
      num = num < 0 ? 0 : num
      num = Math.floor(num * 100) / 100
      this.formObj.realPrice = num
    },
    inputFocus() {
      // #ifdef APP-PLUS || APP-NVUE
      plus && plus?.key?.hideSoftKeybord()
      // #endif
      this.keyboardShow = true
      setTimeout(() => {
        uni.hideKeyboard()
      })
    },
    radioEvent(item) {
      this.formObj.payType = item.name
    },
    keyboardChange(val) {
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  width: 100%;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24rpx 0 0.1px;
  font-family: initial;
}
.header-panel {
  border-radius: 7px;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0px 20rpx 24rpx;
  font-size: 30rpx;

  ::v-deep .cell-text {
    color: #666;
  }
  ::v-deep .u-upload {
    padding-left: 10px;
  }
}
::v-deep .u-upload .u-upload__button {
  margin: 0 24rpx 24rpx 0;
}
.content-panel {
  @include flx-dsp(flex-start, flex-start, column);
  padding: 0px;
  border-radius: 7px;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0px 20rpx 24rpx;

  &.auto-width ::v-deep .cell-text-label {
    flex: 1 1 auto;
  }
  &.auto-width ::v-deep .cell-text-content {
    flex: 0 0 auto;
  }
  ::v-deep .cell-text {
    width: 100%;
    font-size: 30rpx;
  }
  ::v-deep .panel-title .cell-text-label {
    font-weight: bold;
    width: 100% !important;
  }
  ::v-deep .cell-text-content {
    color: #333;
  }
  ::v-deep .realtime-text .cell-text-label {
    padding: 30rpx 0 30rpx 30rpx;
  }
  ::v-deep .realtime-text input {
    height: 98rpx;
    padding-right: 30rpx;
  }
  ::v-deep .radio-panel {
    height: 98rpx;
    padding-right: 30rpx;
    flex: 1;
    display: flex;
    align-items: center;
  }
  ::v-deep .radio-box {
    display: inline-block;
    width: 150rpx;
    height: 60rpx;
    border-radius: 4rpx;
    background-color: #F7F7F7;
    color: #333;
    text-align: center;
    line-height: 56rpx;
    margin-right: 10rpx;
    font-size: 28rpx;
    border: 1px solid #F7F7F7;
    box-sizing: border-box;

    &.selected {
      background-color: #F1F8FF;
      border-color: var(--app-primary-color);
      color: var(--app-primary-color);
    }
  }
}
::v-deep .auto-content .cell-text-panel {
  align-items: center;
}
::v-deep .uni-table-scroll .uni-table-th {
  font-size: 24rpx;
  color: #333;
  font-weight: bold;
}
.radio-gap {
  display: inline-block;
  margin: 0 5px;
}
</style>