<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="header-panel">
      <!-- 任务描述，工单状态 -->
      <cell-text customClass="auto-width header-title" :label="taskDetail.quesDesc" border="none" padding="0 0 8px">{{ getStateText }}</cell-text>
      <view class="header-tag">
        <view class="header-tag-left">
          <yb-tag v-if="taskDetail.taskTypeName" :text="taskDetail.taskTypeName" size="mini" plain plainFill type="primary" customStyle="border-color: rgba(0,0,0,0); margin-right: 10rpx;" />
          <yb-tag v-if="taskDetail.emergencyLevel" :text="taskDetail.emergencyLevel" size="mini" plain plainFill :type="taskDetail.emergencyLevel == '紧急' ? 'error' : 'warning'" customStyle="border-color: rgba(0,0,0,0);" />
        </view>
        <view class="header-tag-right">
          <yb-tag v-if="!!getChildStateText" :text="getChildStateText" size="mini" type="error" customStyle="background-color: #E71E1E;border-color: #E71E1E;" />
        </view>
      </view>
      <cell-text customStyle="font-size: 28rpx;" labelWidth="0" border="none" padding="16rpx 0 0">{{ taskDetail.contactAddress }}</cell-text>
      <view class="desc-tag-panel">
        <u--text prefixIcon="phone" text="联系反馈人" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="callPhone" />
        <u--text :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)" text="发起会话" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="openChat" />
        <u--text v-if="isShareBtn || isDev" prefixIcon="share-square" text="分享" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="handleShare" />
      </view>
    </view>

    <view class="content-panel">
      <template v-for="(item, index) in infoForm">
        <cell-text v-if="!!taskDetail[item.code]" :key="index" :label="item.label + ':'" :labelWidth="item.labelWidth || '140rpx'" customStyle="font-size: 28rpx" labelColor="#666"
          contentAlign="flex-start" border="none" padding="4px 0" :isRight="item.label == '问题类型'">
          {{ taskDetail[item.code] || '' }}
        </cell-text>
      </template>

    </view>

    <!-- 报修工单，处理中，设置了开启物料选择 -->
    <!-- <view class="content-panel none-padding" v-if="taskDetail.quesTaskState == '2' &&  taskDetail.biProblemCategory == '5' && settingAuth.ismateriel">
      <cell-text customClass="auto-width" customStyle="font-size: 30rpx; font-weight: bold;" label="维修材料" isRight padding="30rpx">
        <u-button slot="right" text="添加" type="primary" plain :customStyle="{ width: '48px', height: '24px', padding: '0' }" />
      </cell-text>
      <cell-text v-for="(item, index) in materialList" :key="index" customClass="auto-width" :label="item.label" padding="30rpx" customStyle="font-size:28rpx;">{{ item.value }}</cell-text>
    </view> -->

    <view class="log">
      <view class="log-title">操作记录</view>
      <view class="log-steps">
        <u-steps current="0" dot direction="column">
          <u-steps-item v-for="(item, index) in taskRecord" :key="index" ref="stepsItemEl">
            <view slot="desc">
              <view class="log-left">
                <!-- 任务状态 -->
                <view class="logcell1">{{ item.operate }}</view>
                <!-- 日期时间 -->
                <view class="logcell2">{{ item.submitDate ? $u.timeFormat(item.submitDate, 'mm-dd hh:MM') : '' }}</view>
              </view>
              <view :class="['log-right', { 'no-bottom': index === taskRecord.length - 1 }]">
                <view class="logcell1">{{ item.userName }}</view>
                <!-- 任务描述 -->
                <view class="logcell2">{{ item.recordDesc }}</view>
                <!-- 相册 -->
                <u-album :urls="item.urls" :singleSize="60" :multipleSize="60" :space="12" />
              </view>
            </view>
          </u-steps-item>
        </u-steps>
      </view>
    </view>
    <view class="placeholder"></view>
    <u-safe-bottom />

    <!-- 底部按钮 -->
    <view class="footer-panel">
      <view class="footer-btn">
        <!-- 工单审批 -->
        <block v-if="pageType == 'approval' || isReview">
          <u-button text="同意" icon="file-text" plain type="primary" @click="handleApprovalBtn('agress')" />
          <u-button text="拒绝" icon="file-text" plain type="primary" @click="handleApprovalBtn('reject')" />
        </block>
        <!-- 不是工单审批，不是工单回访，并且状态不是审批中，则才能显示按钮 -->
        <block v-else-if="pageType != 'approval' && pageType != 'visitWorkorder' && !isReview">
          <u-button v-if="btnOptList[0]" :text="btnOptList[0].name" icon="file-text" plain type="primary" @click="handleTaskBtn(btnOptList[0])" />
          <u-button v-if="btnOptList[1]" :text="btnOptList[1].name" icon="file-text" plain type="primary" @click="handleTaskBtn(btnOptList[1])" />
          <u-button v-if="menuList.length" text="更多" icon="more-dot-fill" plain type="primary" @click="moreBtnShow = true" />
        </block>
      </view>
      <u-safe-bottom />
    </view>

    <!-- 更多按钮的弹窗 -->
    <u-action-sheet :show="moreBtnShow" :actions="menuList" cancelText="取消" closeOnClickOverlay @close="moreBtnShow = false" @select="handleTaskBtn" />
    <u-toast ref="messageEl" />
    <yb-complete ref="completeMsgEl" />
    <u-modal :show="ownerModal.isShow" title="提示" content="业主未认证，暂时无法发起会话。您可以选择其他联系人发起" confirmText="选择联系人" showCancelButton @confirm="chooseExternal" @cancel="ownerModal.isShow = false" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text.vue'
import YbTag from '@/components/yb-tag/yb-tag.vue'
import YbComplete from '@/components/yb-complete/yb-complete.vue'
import { getProjectSetting, getQuesTaskDetailRecord, getSettingDetailById, getMenuButtonsByTaskId, getCrmserverTypeinfos } from '@/service/landcrm'
import { getQYInfoByOwnerId, getQYInfoByUserId, syncOwnerInfo, getCompanyAgentMaterialList } from '@/service/api-gateway'
import { btnMap } from '@/pages-workorder/modules/taskButton'
import reviewStore from './reviewStore'
import approvalStore from '@/pages-workorder/workorder-approval/approvalStore'
import pageRefresh from '@/js/pageRefresh'

export default {
  components: {
    CellText,
    YbTag,
    YbComplete
  },
  data() {
    return {
      quesTaskId: '',
      taskDetail: {},
      btnAuth: {}, // 按钮权限
      settingAuth: {
        paySetting: false, // 有偿是否预支付配置。true: 先支付后处理, false: 先处理后支付
        isExternalReply: false, // 是否需要对外回复
        isNeedFinishFile: false, // 报修工单是否强制上传附件
        ismateriel: false, // 是否需要物料
        switchdept: false, // 是否需要显示部门选择，true: 是，接单、领单、抢单页面将显示部门选择
        builderFlag: false, // true: 客户下单时会展示合作方、质保期等字段
      }, // 工单配置
      taskRecord:[],
      infoForm: [
        { label: '任务单号', code: 'quesTaskCode', value: 'HYYUNV20230206001' },
        { label: '受理时间', code: 'startDate', value: '2013-02-06 15:34:45' },
        { label: '派单时限', code: 'giveOutDateLine', value: '2013-02-06 15:34:45' },
        { label: '接单时限', code: 'acceptDateLine', value: '2013-02-06 15:34:45' },
        { label: '处理时限', code: 'endDate', value: '2013-02-06 15:34:45' },
        { label: '关闭时限', code: 'closeDateLine', value: '2013-02-06 15:34:45' },
        { label: '暂停截止时间', code: 'pauseEndDate', value: '2023-02-06 15:34:45', labelWidth: '170rpx' },
        { label: '预约时间', code: 'appointmentDate', value: '2023-02-06 15:34:45' },
        { label: '受理人', code: 'originalUserName', value: '管理员' },
        { label: '处理人', code: 'followUpProcessorName', value: '跟进人' }, // 处理人,跟进人
        { label: '合作方人员', code: 'followUpProcessorName', value: '接单人', labelWidth: '170rpx' }, // 领单人，接单人，抢单人
        { label: '紧急程度', code: 'emergencyLevel', value: '紧急' },
        { label: '请求来源', code: 'taskSource', value: 'App' },
        { label: '起单来源', code: 'orignSourceName', value: '自查下单' },
        { label: '反馈人', code: 'contactName', value: '管理员' }, // 业主,客户
        { label: '联系地址', code: 'contactAddress', value: '一碑-科技产业员' },
        { label: '任务类型', code: 'taskTypeName', value: '报事报修' },
        { label: '问题类型', code: 'problemTemplateNames', value: '报修-电器维修' },
        { label: '问题描述', code: 'quesDesc', value: '玻璃划痕玻璃划痕玻璃划痕玻璃划痕玻璃划痕玻璃划痕玻璃划痕玻璃划痕' },
        { label: '是否房修', code: 'houseFixStatusName', value: '否' },
        { label: '是否有偿', code: 'isPaidName', value: '否' },
        { label: '金额', code: 'priceText', value: '1000' },
        { label: '支付状态', code: 'payStatusName', value: '已支付' },
        { label: '协助人', code: 'helperName', value: '小二，小李' }
      ],
      materialList: [
        // { label: '智慧花园1号仓', value: '33(件)' },
        // { label: '消防应急照明灯', value: '1.0' },
      ],
      pageType: '',
      // 按钮操作类型，参考 ./taskButton.js btnMap 配置
      modelType: { name: '', id: '' },
      moreBtnShow: false,
      menuList: [],
      btnOptList: [],
      isShareBtn: false, // 分享按钮
      isReview: false, // 审核中
      isDev: process.env.NODE_ENV != 'production',
      ownerModal: {
        isShow: false
      },
      shareConfig: {
        // 分享按钮的配置信息
        type: '',
        materialTitle: '',
        materialDesc: '',
        materialPicUrl: '',
        materialUrl: '',
        appId: '',
      }
    }
  },
  computed: {
    // 工单状态
    getStateText() {
      const quesTaskState = this.taskDetail.quesTaskState
      return this.getStatusNewName(quesTaskState)
    },
    getChildStateText() {
      this.isReview = false
      const quesTaskState = this.taskDetail.quesTaskState
      const abnormityCloseStatus = this.taskDetail.abnormityCloseStatus
      const pauseStatus = this.taskDetail.pauseStatus
      const closeStatus = this.taskDetail.closeStatus
      const waitStatus = this.taskDetail.waitStatus
      const houseFixCloseStatus = this.taskDetail.houseFixCloseStatus
      const replyReviewStatus = this.taskDetail.replyReviewStatus
      const payStatus = this.taskDetail.payStatus
      const isPaid = this.taskDetail.isPaid
      const refuseBaseFlag = this.taskDetail.refuseBaseFlag

      if (abnormityCloseStatus == 2) {
        return '非正常关闭'
      }
      if (closeStatus == 2 && quesTaskState != 4) {
        return '已作废'
      } else if (pauseStatus == 1) {
        this.isReview = true
        return '暂停申请中'
      } else if (pauseStatus == 2 && quesTaskState != 5) {
        return '已暂停'
      } else if (abnormityCloseStatus == 1) {
        this.isReview = true
        return '非正常关闭申请中'
      } else if (closeStatus == 1) {
        this.isReview = true
        return '作废申请中'
      } else if (houseFixCloseStatus == 1) {
        this.isReview = true
        return '房修申请中'
      } else if (waitStatus == 1) {
        return '待料中'
      } else if (payStatus == '0' && isPaid == 1) {
        return '待支付'
      } else if (replyReviewStatus == 1) {
        // 代客录单的有偿维修单，处理完成后，会同时显示对外回复申请中，和显示待支付。这时候需要先显示待支付。如果支付完成了，才能显示对外回复申请
        this.isReview = true
        return '对外申请中'
      } else if (replyReviewStatus == 2) {
        return '对外回复申请通过'
      } else if (refuseBaseFlag == 1) {
        return '拒单'
      }
      
      return ''
    },
    // 按钮状态是否含有编辑按钮的操作
    isEditTask() {
      return this.btnOptList.some((item) => item.id == 'edit')
    }
  },
  async onLoad(options) {
    // 获取页面传递的参数
    this.pageType = options.type || '' // approval: 审批页面, graborderPool: 抢单池页面, visitWorkorder: 工单回访详情页面, '': 默认页面
    this.quesTaskId = options.taskId || ''

    this.getShareConfig()

    await this.getDetail()
    const setting = await Promise.all([
      this.getProjectSetting(),
      this.getCrmserverTypeinfos(),
      this.getSettingByRepair(),
    ])
    this.collectSetting(setting)
    await this.getMenuButtonsByTaskId()
    await this.BtnOptAuth() // 要先获取到上面的配置，才可以判断按钮
    const quesgetChildStateText = this.getChildStateText
  },
  created() {
    pageRefresh.restore(['WORK_ORDER_DETAIL', 'WORK_ORDER_APPROVAL', 'WORK_ORDER_EDIT'])
  },
  onShow() {
    reviewStore.restore()
    approvalStore.restore()

    if (pageRefresh.isRefresh('WORK_ORDER_DETAIL', true) || pageRefresh.isRefresh('WORK_ORDER_APPROVAL') || pageRefresh.isRefresh('WORK_ORDER_EDIT', true)) {
      // 审批操作的刷新，不清除刷新标志，是因为经过 审批列表 -> 工单详情 -> 审批操作，所以回退时，审批列表 和 工单详情 都需要刷新页面
      this.refreshPage()
    }
  },
  methods: {
    // 当从 工单操作页面 返回来时，需要刷新页面数据
    refreshPage() {
      this.infoForm = this.$options.data().infoForm
      this.taskRecord = []

      let callback = this.$options.onLoad
      callback.forEach((fn) => {
        fn.call(this, { type: this.pageType, taskId: this.quesTaskId })
      })
    },
    // 获取工单详情
    async getDetail() {
      const params = {
        data: {
          quesTaskId: this.quesTaskId
        },
        wrapResponse: true
      }
      const res = await getQuesTaskDetailRecord(params)

      this.taskRecord = (res.data?.rectData ?? []).map(item => ({
        ...item,
        urls: (item.files || '').split(',').filter(file => /\.(?:png|jpg|jpeg|gif|bmp|WebP)$/i.test(file))
      }))
      const dataTmp = res.data?.taskDetail ?? {}
      this.taskDetail = Object.assign({}, dataTmp, {
        //  起单来源
        orignSourceName: dataTmp.orignSource == '0' ? '自查下单' : '客户下单',
        // 是否房修
        houseFixStatusName: dataTmp.houseFixStatus == '1' ? '是' : '否',
        // 是否有偿
        isPaidName: dataTmp.isPaid == '1' ? '是' : '否',
        // 金额
        priceText: dataTmp.price ? dataTmp.price : '0',
        // 任务类型
        taskTypeName: this.taskTypeName(dataTmp.biProblemCategory),
        // 问题类型
        getProblemTypeNameDisplay: (dataTmp?.quesLibName ?? '').replace('所有分类-', '')
      })

      this.infoForm = this.getOverdueTime(this.infoForm, this.taskDetail.quesTaskState)
        .filter(item => {
          if (item.label == '预约时间') {
            // 只有客户来源，才需要显示预约时间
            return this.taskDetail.orignSource == 1 ? true : false
          }
          if (item.label == '金额') {
            // 只有报修工单，设置有偿报修，才需要显示金额
            return this.taskDetail.biProblemCategory == 5 && this.taskDetail.isPaid == 1 ? true : false
          }
          if (item.label == '合作方人员') {
            // 只有在接单后，设置了合作商，才会显示
            const noAcceptOrder = [0, 1].some(item => item == this.taskDetail.quesTaskState) // 还没有人接单
            return noAcceptOrder && this.settingAuth.builderFlag ? false : true
          }
          if (item.label == '支付状态') {
            const noFinishing = [0, 1].some(item => item == this.taskDetail.quesTaskState) // 还没有进入处理状态
            const hasVal = !!this.taskDetail[item.name] // 支付状态是否有值，没有值就不显示出来，因为测试说不好看
            // 只有在（报修工单，可以判断也可以不判断，因为有偿维修就属于报修工单），有偿维修，（处理中，处理完成），才会显示
            return this.taskDetail.biProblemCategory == 5 && this.taskDetail.isPaid == 1 && !noFinishing && hasVal ? true : false
          }
          if (['是否房修', '是否有偿'].includes(item.label)) {
            // 只有报修单，才会显示
            return this.taskDetail.biProblemCategory == 5 ? true : false
          }
          if (item.label == '协助人') {
            // 只有报修工单，处理完成状态后，才会显示
            const helperData = res.data?.helperData ?? []
            this.taskDetail.helperName = helperData.filter(item => item.userType == '协助人').map(item => item.userName).join(',')
            const finished = [3, 4].some(item => item == this.taskDetail.quesTaskState) // 已经处理完成的工单
            return this.taskDetail.biProblemCategory == 5 && finished ? true : false
          }
          return true
        })

      // 处理操作记录， 竖线因图片延迟渲染问题导致高度不够问题
      this.$nextTick(() => {
        this.$refs.stepsItemEl.forEach(el => {
          el.getStepsItemRect()
        })
        setTimeout(() => {
          this.$refs.stepsItemEl.forEach(el => {
            el.getStepsItemRect()
          })
        }, 1000)
      })
    },
    // 获取按钮权限
    async getMenuButtonsByTaskId() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          userId: userInfo.userId,
          quesTaskId: this.quesTaskId,
          source: 2, // 写死，表示小程序端
        }
      }
      const res = await getMenuButtonsByTaskId(params)
      this.btnAuth = (res.data || []).reduce((store, item) => {
        store[item.code] = true
        return store
      }, {})
    },
    // 判断工单超期
    getOverdueTime(infoForm, quesTaskState) {
      const map = {
        0: '派单时限',
        1: '接单时限',
        2: '处理时限',
        3: '关闭时限',
        5: '暂停截止时间'
      }
      const curItem = map[quesTaskState] // 当前的时限状态
      const arrTmp = Object.values(map).filter(item => item != curItem) // 排除掉当前的时限状态，剩下的都是要在inforForm里删除掉的
      // 只匹配出当前的时限状态
      const res = infoForm.filter(item => {
        return arrTmp.includes(item.label) ? false : true
      })
      return res
    },
    // 根据项目获取工单配置
    async getProjectSetting() {
      const res = await getProjectSetting(this.taskDetail.projectId)
      const data = res.data || {}
      return {
        paySetting: data.paySetting == 1 ? true : false, // 1, 2
        isExternalReply: data.externalReply == 1 ? true : false, // 1, 2 自查工单是否需要对外回复
        isNeedFinishFile: data.isNeedFinishFile == 1 ? true : false, // 1, 2
      }
    },
    // 根据问题类型获取工单配置
    async getCrmserverTypeinfos() {
      const serverId = this.taskDetail.problemTemplate.split(',').slice(-1)[0] || ''
      const res = await getCrmserverTypeinfos(serverId)
      const data = res?.data?.[0] ?? {}
      const kehuFlag = data.isExternalReply == 1 ? true : false // 是否需要对外回复。1, 2

      const zichaFlag = this.settingAuth.isExternalReply // 自查工单是否需要对外回复
      const isSelf = this.taskDetail.orignSource == '0' ? true : false // true: 自查工单; false: 客户工单

      /**
       * 1、客户下单：是否对外回复，根据问题标准库那边的设置来
       * 2、自查下单：综合“项目及参数配置”和“问题标准库”的配置，意思是，这2个地方，都是“是”-》需要对外回复；都是“否”-》不需要对外回复；一个是，一个否-》不需要对外回复
       */
      return {
        isExternalReply: !isSelf ? kehuFlag : (kehuFlag == zichaFlag ? kehuFlag : false)
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
        switchdept: data.switchdept == 1 ? true : false, // 1, 2
        builderFlag: data.builderFlag == 1 ? true : false, // 1, 0
      }
    },
    // 收集配置
    collectSetting(setting = []) {
      this.settingAuth = setting.reduce((store, item, index) => {
        if (index == 1) {
          const zichaFlag = store.isExternalReply // 自查工单是否需要对外回复
          const kehuFlag = item.isExternalReply // 问题标类型的是否需要对外回复配置
          const isSelf = this.taskDetail.orignSource == '0' ? true : false // true: 自查工单; false: 客户工单
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
    // 获取工单类型
    taskTypeName(biProblemCategory) {
      const tmpMap = {
        5: '报修',
        6: '投诉',
        9: '咨询建议',
        11: '报事'
      }
      return tmpMap[biProblemCategory] || ''
    },
    // 获取工单状态名称
    getStatusNewName(quesTaskState) {
      const tmpMap = {
        0: '待派单',
        1: '待接单',
        2: '处理中',
        3: '待确认',
        4: '已关闭',
        5: '已暂停'
      }
      return tmpMap[quesTaskState] || ''
    },
    callPhone() {
      if (this.taskDetail.contactPhone) {
        wx.makePhoneCall({
          phoneNumber: this.taskDetail.contactPhone, //仅为示例，并非真实的电话号码
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        })
      }
    },
    // 获取按钮权限
    BtnOptAuth() {
      const stateText = this.taskDetail.quesTaskState
      const typeText = this.taskDetail.biProblemCategory
      const houseFixText = this.taskDetail.houseFixStatus // 是否房修
      const houseFixProgress = this.taskDetail.houseFixProgress
      const payText = this.taskDetail.payStatus // 支付状态。-1、已关闭，0、创建，1、已支付，2、已退款，3、部分退款 
      const isPaidText = this.taskDetail.isPaid // 是否有偿
      const visitText = this.taskDetail.visitId // 回访
      const orignSource = this.taskDetail.orignSource
      const closeStatus = this.taskDetail.closeStatus // 关闭类型
      let res = []
      const pushBtnByKey = (key) => {
        const item = btnMap[key]
        const code = item.code || ''
        if (code && this.btnAuth[code]) {
          res.push(item)
        } else if (!code) {
          res.push(item)
        }
      }

      if (stateText == '0') {
        // 待派单
        if (!(typeText == 5 && this.settingAuth.paySetting)) {
          // 报修工单 设置有偿工单 且 开启预付 时，不能领单
          pushBtnByKey('领单')
        }
        pushBtnByKey('汇报进展')
        pushBtnByKey('派单')
        pushBtnByKey('编辑')
        pushBtnByKey('作废申请')
        if (typeText == 5 && houseFixText == '0') {
          // 报修工单，设置不是房修
          pushBtnByKey('房修申请')
        }
        // 转派
        pushBtnByKey('转派')
      } else if (stateText == 1) {
        // 待接单
        if (typeText == 5 && houseFixText == '0' && houseFixProgress == 2) {
          // 报修工单，设置不是房修
        } else if (typeText == 5 && payText == '0') {
          // 报修工单，未支付
          pushBtnByKey('汇报进展')
          pushBtnByKey('退单')
        } else {
          pushBtnByKey('接单')
          pushBtnByKey('汇报进展')
          pushBtnByKey('退单')
          pushBtnByKey('作废申请')
          
          if (typeText == 5 && houseFixText == '0') {
            // 报修工单，设置不是房修
            pushBtnByKey('房修申请')
          }
          if ([3, 4, 5].some((item) => item == typeText) && this.taskDetail.waitStatus == 1) {
            pushBtnByKey('补料')
          }
        }
        pushBtnByKey('转派')
      } else if (stateText == 2) {
        // 处理中
        if (typeText == 5 && houseFixText == '0' && houseFixProgress == 2) {
          // 报修工单，设置不是房修
        } else if (typeText == 5 && payText == '0' && isPaidText == 1) {
          // 报修工单，未支付，有偿支付
          pushBtnByKey('支付')
        } else {
          pushBtnByKey('处理完成')
          pushBtnByKey('汇报进展')
          pushBtnByKey('退单')
          pushBtnByKey('暂停申请')
          pushBtnByKey('作废申请')
          pushBtnByKey('非正常关闭申请')

          if (typeText == 5 && houseFixText == '0') {
            // 报修工单，设置不是房修
            pushBtnByKey('房修申请')
          }
        }
      } else if (stateText == 3) {
        // 待确认
        if ((visitText == void 0 || visitText == '') && orignSource == 1) {
          // 未生成回访，客户下单
        }
        if (payText == '0' && isPaidText == 1) {
          // 待确认，未支付，有偿工单
          pushBtnByKey('支付')
        } else {
          pushBtnByKey('关闭问题')
          pushBtnByKey('非正常关闭申请')
          pushBtnByKey('作废申请')
          pushBtnByKey('返工')
        }
      } else if (stateText == 4) {
        // 已关闭
        if ((visitText == void 0 || visitText == '') && orignSource == 1) {
          // 未生成回访，客户下单
        }
        if ((typeText == 5 && houseFixText == '0' && houseFixProgress == 2) || closeStatus == 2 || typeText == 10) {
          // 报修工单 且 设置不是房修 时，或者 作废关闭（只有正常关闭 和 非正常关闭 才能重启） 时，或者 表扬工单 时，不能重启
        } else {
          pushBtnByKey('重启')
        }
      } else if (stateText == 5) {
        // 已暂停
        if (!(typeText == 5 && houseFixText == '0' && houseFixProgress == 2)) {
          // 报修工单 且 设置不是房修 时，不能重启
          pushBtnByKey('激活')
          pushBtnByKey('汇报进展')
        }
      }

      if (this.pageType == 'graborderPool') {
        res = []
        if (stateText == '0' || stateText == 1) {
          // 抢单池，待派单，待接单状态
          pushBtnByKey('抢单')
        }
      }

      // #ifdef MP-WEIXIN
      // 分享按钮
      const wxInfo = wx.getSystemInfoSync()
      if (wxInfo.environment && !this.pageType) {
        // 必须是企业微信的小程序，不是工单审批页面，才能分享工单详情
        this.isShareBtn = true
      }
      // #endif

      this.btnOptList = res
      this.menuList = res.slice(2)
    },
    // 编辑工单
    editOrder() {
      const originSource = this.taskDetail.orignSource
      const biProblemCategory = this.taskDetail.biProblemCategory

      let res = { taskId: this.quesTaskId, pageType: 'edit' }
      if (originSource == '0' && biProblemCategory == 5) {
        // '自查报修'
        res['pageCode'] = 'self-repair'
      } else if (originSource == '0' && biProblemCategory != 5) {
        // '自查其他问题'
        res['pageCode'] = 'self-report'
      } else if (originSource == 1 && biProblemCategory == 5) {
        // '客户报修'
        res['pageCode'] = 'repair'
      } else if (originSource == 1 && biProblemCategory == 6) {
        // '客户投诉'
        res['pageCode'] = 'complain'
      } else {
        // '其他问题'
        res['pageCode'] = 'other'
      }
      
      uni.navigateTo({ url: `/pages-a/related-submission/form${ uni.$u.queryParams(res, true) }` })
    },
    handleTaskBtn(item) {
      if (item.id == 'edit') {
        // 编辑
        this.editOrder()
        return
      } else if (item.id == 'review1' && this.taskDetail.biProblemCategory == 5) {
        // 操作是处理完成，是报修工单，才能打开维修完成页面
        // if (this.settingAuth.ismateriel && !this.materialList.length) {
        //   this.$refs.messageEl.show({
        //     type: 'default',
        //     message: '请选择维修材料！'
        //   })
        //   return
        // }
        uni.navigateTo({ url: `/pages-workorder/repair-order/add?taskId=${this.quesTaskId}` })
        return
      } else if (item.id == 'payment' && this.taskDetail.biProblemCategory == 5) {
        // 报修工单，去支付，才能打开支付页面
        uni.navigateTo({ url: `/pages-payment/workorder-pay/change-price?taskId=${this.quesTaskId}` })
        return
      }
      this.modelType = item
      this.linkTo('review')
    },
    handleApprovalBtn(type) {
      approvalStore.setData('flagText', type)
      approvalStore.setData('quesTaskId', this.taskDetail.quesTaskId)

      if (this.taskDetail.replyReviewStatus == '1') {
        // 对外回复审批，需要设置默认的描述内容
        approvalStore.setData('externalReply', this.taskDetail.externalReply)
      }
      this.linkTo('approval')
    },
    // 分享工单
    handleShare() {
      if (!this.shareConfig.materialUrl) {
        uni.showToast({ title: '请联系管理员配置常用链接', icon: 'none' })
        return
      }

      const params = {
        orderId: this.quesTaskId
      }

      wx.qy.getContext({
        success: (res) => {
          if (res.entry == 'single_chat_tools') {
            // 从单聊进入

            if (this.shareConfig.type == 1) {
              // 发送 H5
              wx.qy.sendChatMessage({
                msgtype: 'news', //消息类型，必填
                enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段 
                news: {
                  title: '点击可查看该工单处理详情',
                  desc: this.shareConfig.materialDesc || '',
                  imgUrl: this.shareConfig.materialPicUrl,
                  link: this.shareConfig.materialUrl + '&arg=' + encodeURIComponent(JSON.stringify(params))
                },
              })
            } else if (this.shareConfig.type == 2) {
              // 发送 小程序
              wx.qy.sendChatMessage({
                msgtype: 'miniprogram', //消息类型，必填
                enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段 
                miniprogram: {
                  appid: this.shareConfig.appId,
                  title: '点击可查看该工单处理详情',
                  imgUrl: this.shareConfig.materialPicUrl,
                  page: this.shareConfig.materialUrl + '&arg=' + encodeURIComponent(JSON.stringify(params)), // 小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
                }
              })
            }

          } else {

            let attachments = []
            if (this.shareConfig.type == 1) {
              // 发送 H5
              attachments.push({
                msgtype: 'link',
                link: {
                  title: '点击可查看该工单处理详情',
                  desc: this.shareConfig.materialDesc || '',
                  imgUrl: this.shareConfig.materialPicUrl,
                  url: this.shareConfig.materialUrl + '&arg=' + encodeURIComponent(JSON.stringify(params))
                }
              })
            } else if (this.shareConfig.type == 2) {
              // 发送 小程序
              attachments.push({
                msgtype: 'miniprogram',
                miniprogram: {
                  appid: this.shareConfig.appId,
                  title: '点击可查看该工单处理详情',
                  imgUrl: this.shareConfig.materialPicUrl,
                  page: this.shareConfig.materialUrl + '&arg=' + encodeURIComponent(JSON.stringify(params))
                }
              })
            }

            wx.qy.shareToExternalContact({
              text: {
                content: this.taskDetail.taskTypeName + ' ' + this.taskDetail.quesTaskCode,
              },
              attachments
            })

          }
        }
      })
    },
    /**
     * 根据反馈人，在企微上打开 当前登录人 与 反馈人 的会话
     * 自查下单，反馈人是员工，在企微上开通的是企业成员(即企微名字后面不带 @微信 标志)
     * 客户下单，反馈人是业主，在企微上开通的是外部联系人（即企微名字后面带 @微信 标志，也叫客户）
     */
    async openChat() {
      const isSelf = this.taskDetail.orignSource == '0' ? true : false // true: 自查工单; false: 客户工单
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })

      if (isSelf) {
        const staffId = this.taskDetail.originalUserId // 反馈人员工id
        if (staffId == userInfo.userId) {
          // 反馈人跟当前登录人一致
          this.$refs.completeMsgEl.showMessage('不支持与自己发起会话')
          return
        }

        const res = await getQYInfoByUserId(staffId) // 获取反馈人在企微上的信息
        const data = res.data || {}
        if (data.isEnableQw != 1) {
          // 员工没有开通企微
          this.$refs.completeMsgEl.showMessage('员工未开通企微，暂时无法直接发起会话')
          return
        }

        // 打开与企业成员的单聊会话
        wx.qy.openEnterpriseChat({
          userIds: data.wechatUserId,
          success: (res) => { }
        })
      } else {
        const ownerId = this.taskDetail.contactId || '' // 反馈人业主id
        if (!ownerId) {
          // 业主没有开通业主端（一般不存在，因为新建工单可以选择当前业主客户，就证明已经注册过业主端了）
          this.ownerModal.isShow = true
          return
        }

        const res = await getQYInfoByOwnerId(ownerId) // 获取反馈人在企微上的信息
        const data = res.data || {}
        if (!data.userId) {
          // 如果不存在外部联系人id
          this.ownerModal.isShow = true
          return
        }

        // 需要先根据外部联系人id同步企微外部联系人信息
        await syncOwnerInfo(data.userId)
        // 打开与客户的单聊会话
        wx.qy.openEnterpriseChat({
          externalUserIds: data.userId,
          success: (res) => {}
        })
      }
    },
    // 选择外部联系人（客户）
    chooseExternal() {
      wx.qy.selectExternalContact({
        filterType: 0,
        success: (res) => {
          const data = res.userIds || []
          // 客户id
          const userItem = data[0] || ''
          this.ownerModal.content = ''
          this.ownerModal.isShow = false

          wx.qy.openEnterpriseChat({
            externalUserIds: userItem,
            success: (res) => {
            }
          })
        }
      })
    },
    // 跳转到操作页面
    linkTo(type) {
      if (type == 'review') {
        // 跳转到操作页面
        reviewStore.setData('taskInfo', Object.assign({}, this.taskDetail, { settingAuth: this.settingAuth }))
        reviewStore.setData('modelType', this.modelType)
        uni.navigateTo({ url: '/pages-workorder/workorder-detail/review' })
      } else if (type == 'approval') {
        // 跳转到审批操作页面
        approvalStore.setData('fromPage', '/pages-workorder/workorder-detail/detail')
        uni.navigateTo({ url: '/pages-workorder/workorder-approval/approval' })
      }
    },
    // 获取“分享工单”的配置
    async getShareConfig() {
      const params = {
        data: {
					pageNum: 1,
					pageSize: 100,
					title: '分享工单'
				},
        hideLoading: true
      }
      const res = await getCompanyAgentMaterialList(params)

      const data = res?.data?.records?.[0]
      if (!data) {
        this.shareConfig = {}
        return
      }

      this.shareConfig = data
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding: 24rpx 20rpx;
  min-height: 100vh;
  background-color: #f3f5f9;
  box-sizing: border-box;
  font-family: "PingFang SC";
}
.header-panel {
  @include flx-dsp(flex-start, flex-start, column);
  width: 100%;
  padding: 24rpx 30rpx;
  border-radius: 12rpx;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 24rpx;
}
::v-deep .header-title {
  .cell-text-label {
    font-size: 30rpx;
    font-weight: bold;
    color: #222;
  }
  .cell-text-content {
    font-size: 28rpx;
    color: var(--app-primary-color);
  }
}
.header-tag {
  @include flx-dsp(space-between, flex-start);
  width: 100%;

  .header-tag-left {
    @include flx-dsp(flex-start, flex-start);
  }
}
.desc-tag-panel {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid #EBEBEB;
  padding-top: 20rpx;
  margin-top: 16rpx;

  ::v-deep .u-text {
    flex: 1 1 auto;
    display: flex;
    justify-content: center !important;
  }
}
.content-panel {
  @include flx-dsp(flex-start, flex-start, column);
  width: 100%;
  padding: 16rpx 30rpx;
  border-radius: 12rpx;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 24rpx;

  ::v-deep .cell-text-content {
    color: #333;
  }
  &.none-padding {
    padding: 0;
  }
}
::v-deep .auto-width {
  .cell-text-label {
    flex: 1 1 auto;
  }
  .cell-text-content {
    flex: 0 0 auto;
  }
}
::v-deep .cell-text {
  .cell-text-label {
    min-height: 1rem;
  }
  .cell-text-content {
    min-height: 1rem;
  }
}
.placeholder {
  width: 100%;
  height: 40px;
}
.footer-panel {
  @include flx-dsp(flex-start, flex-start, column);
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #d9dce7;
  border-bottom: 1px solid #d9dce7;
  position: fixed;
  left: 0;
  bottom: 0;

  .footer-btn {
    width: 100%;
    @include flx-dsp(flex-start, center);
  }
  ::v-deep .u-button {
    flex: 1 1 auto;
    border-radius: 0;
    border-width: 0;

    &--plain:not(:last-child) {
      border-right-width: 1px;
      border-right-color: #d9dce7 !important;
    }
  }
}
.log {
  background: #FFFFFF;
  border-radius: 12rpx;
  padding: 24rpx 30rpx;

  .log-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 30rpx;
  }
}
.log-left {
  position: absolute;
  top: -8rpx;
  left: -80px;
  text-align: center;
  width: 163rpx;
}
.log-right {
  margin-top: -8rpx;
  margin-bottom: 38rpx;

  &.no-bottom {
    margin-bottom: 0rpx;
  }
}
::v-deep .u-album {
  margin-top: 8rpx;
}
.logcell1 {
  font-size: 28rpx;
  color: #333333;
  padding: 8rpx 0;
}
.logcell2 {
  font-size: 26rpx;
  color: #999999;
}
.log-steps {
  margin-left: 80px;
}
::v-deep .yb-complete .u-modal__button-group--confirm-button {
  border-top: 1px solid #eaebec;
  padding: 0 !important;
  height: 48px;
  justify-content: center;
}
</style>