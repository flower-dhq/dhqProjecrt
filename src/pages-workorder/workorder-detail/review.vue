<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="model-panel">
      <view class="report-panel" v-if="modelType.id == 'report' || modelType.id == 'dispatch' || modelType.id == 'getTask' || modelType.id == 'cancel' || modelType.id == 'pressTask' || modelType.id == 'transfer' || modelType.id == 'returnTask' || modelType.id == 'closeHouseRepair' || modelType.id == 'inceptTask' || modelType.id == 'close' || modelType.id == 'rework' || modelType.id == 'restart' || (modelType.id == 'review1' && !taskInfo.settingAuth.isExternalReply) || modelType.id == 'closeAbnormal' || modelType.id == 'delay' || modelType.id == 'activateTask'">
        <textarea class="report-textarea" v-model="formObj.reportContent" placeholder="描述" placeholder-style="color: #CCCCCC; font-size: 28rpx;" />
        <u-upload v-if="modelType.id != 'pressTask'" name="upload" :fileList="formObj.fileList" :maxCount="9" previewFullImage sizeType="compressed" @afterRead="afterRead"
          @delete="deleteImg" />
      </view>
      <block v-if="modelType.id == 'review1' && taskInfo.settingAuth.isExternalReply">
        <!-- 操作是处理完成，设置了对外 -->
        <view class="report-panel border-bottom">
          <textarea class="report-textarea" v-model="formObj.externalReply" placeholder="对外回复" placeholder-style="color: #CCCCCC; font-size: 28rpx;" />
        </view>
        <view class="report-panel">
          <textarea class="report-textarea" v-model="formObj.internalReply" placeholder="对内回复" placeholder-style="color: #CCCCCC; font-size: 28rpx;" />
        </view>
        <view class="report-panel">
          <u-upload name="upload" :fileList="formObj.fileList" :maxCount="9" previewFullImage sizeType="compressed" @afterRead="afterRead" @delete="deleteImg" />
        </view>
      </block>
      <view class="form-panel">
        <cell-text v-if="modelType.id == 'dispatch' || modelType.id == 'getTask'" label="问题类型" isRight padding="30rpx 0" border="none" customStyle="font-size: 30rpx;" @tap.native="selQuestionType">
          <text>{{ formObj.questionType.label || '请选择' }}</text>
          <u-icon slot="right" name="arrow-right" />
        </cell-text>
        <cell-text v-if="(modelType.id == 'getTask' || modelType.id == 'inceptTask') && taskInfo.settingAuth.switchdept" label="部门" isRight padding="30rpx 0" border="none" customStyle="font-size: 30rpx;" @tap.native="departmentObj.isShow = true">
          <text>{{ departmentObj.label || '请选择' }}</text>
          <u-icon slot="right" name="arrow-right" />
        </cell-text>
        <cell-text v-if="modelType.id == 'cancel'" label="作废原因" isRight padding="30rpx 0" border="none" customStyle="font-size: 30rpx;" @tap.native="zuofeiObj.isShow = true">
          <text>{{ zuofeiObj.label || '请选择' }}</text>
          <u-icon slot="right" name="arrow-right" />
        </cell-text>
        <cell-text v-if="modelType.id == 'returnTask'" label="退单原因" isRight padding="30rpx 0" border="none" customStyle="font-size: 30rpx;" @tap.native="tuidanObj.isShow = true">
          <text>{{ tuidanObj.label || '请选择' }}</text>
          <u-icon slot="right" name="arrow-right" />
        </cell-text>
        <cell-text v-if="modelType.id == 'delay'" label="暂停原因" isRight padding="30rpx 0" border="none" customStyle="font-size: 30rpx;" @tap.native="zantingObj.isShow = true">
          <text>{{ zantingObj.label || '请选择' }}</text>
          <u-icon slot="right" name="arrow-right" />
        </cell-text>
        <cell-text v-if="modelType.id == 'delay'" label="暂停截止时间" labelWidth="200rpx" isRight padding="30rpx 0" border="none" customStyle="font-size: 30rpx;" @tap.native="zantingDate.isShow = true">
          <text>{{ zantingDate.label || '请选择' }}</text>
          <u-icon slot="right" name="arrow-right" />
        </cell-text>
        <cell-text v-if="modelType.id == 'transfer'" label="跟进人" isRight padding="30rpx 0" border="none" customStyle="font-size: 30rpx;" @tap.native="linkTo('handler')">
          <text>{{ formObj.handleStaff.label || '请选择' }}</text>
          <u-icon slot="right" name="arrow-right" />
        </cell-text>
        <cell-text v-if="modelType.id == 'dispatch' || modelType.id == 'rework' || modelType.id == 'restart'" label="处理人" isRight padding="30rpx 0" border="none" customStyle="font-size: 30rpx;" @tap.native="linkTo('handler')">
          <text>{{ formObj.handleStaff.label || '请选择' }}</text>
          <u-icon slot="right" name="arrow-right" />
        </cell-text>
        <cell-text v-if="modelType.id == 'changeOrign'" label="受理人" isRight padding="30rpx 0" border="none" customStyle="font-size: 30rpx;" @tap.native="linkTo('handler')">
          <text>{{ formObj.handleStaff.label || '请选择' }}</text>
          <u-icon slot="right" name="arrow-right" />
        </cell-text>
        <cell-text v-if="false" label="是否有偿" padding="30rpx 0" border="none" customStyle="font-size: 30rpx;">
          <u-radio-group size="15" v-model="formObj.isPaid">
            <u-radio :name="1">有偿维修</u-radio>
            <text class="radio-gap"></text>
            <u-radio :name="0">无偿维修</u-radio>
          </u-radio-group>
        </cell-text>
      </view>
      <view class="footer-panel">
        <u-button text="取消" :customStyle="{ margin: '0', borderColor: THEME_COLOR, color: THEME_COLOR, fontSize: '32rpx', borderTopRightRadius: '0', borderBottomRightRadius: '0' }" @click="closePage" />
        <u-button text="提交" type="primary" :disabled="isLoading" :customStyle="{ margin: '0', fontSize: '32rpx', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }" @click="handleQuestionTask" />
      </view>
    </view>

    <u-picker :show="zuofeiObj.isShow" :columns="zuofeiObj.list" keyName="detailName" @cancel="zuofeiObj.isShow = false" @confirm="handlePicker('zuofei', $event)" />
    <u-picker :show="tuidanObj.isShow" :columns="tuidanObj.list" keyName="detailName" @cancel="tuidanObj.isShow = false" @confirm="handlePicker('tuidan', $event)" />
    <u-picker :show="zantingObj.isShow" :columns="zantingObj.list" keyName="detailName" @cancel="zantingObj.isShow = false" @confirm="handlePicker('zanting', $event)" />
    <u-picker :show="departmentObj.isShow" :columns="departmentObj.list" keyName="detailName" @cancel="departmentObj.isShow = false" @confirm="handlePicker('department', $event)" />
    <u-datetime-picker :show="zantingDate.isShow" mode="datetime" :minDate="Date.now()" @confirm="handlePicker('zantingDate', $event)" @cancel="zantingDate.isShow = false" />
    <u-toast ref="messageEl" />
  </view>
</template>

<script>
import listenerMixin from '@/js/mixin/eventListenerMixin'
import CellText from '@/components/cell-text.vue'
import reviewStore from './reviewStore'
import pageRefresh from '@/js/pageRefresh'
import { uploadMutiFile, handleQuestionTask, questionTaskGiveOut, getDictDetail, sendQuesTaskAgentMsg, getPostByUserId } from '@/service/landcrm'

/**
 * 工单操作
 */
export default {
  name: 'WorkorderModel',
  mixins: [listenerMixin],
  components: {
    CellText
  },
  data() {
    return {
      // 工单信息
      taskInfo: {
        settingAuth: {}
      },
      // 按钮操作类型，参考 ./taskButton.js btnMap 配置
      modelType: {
        name: '',
        id: ''
      },
      formObj: {
        reportContent: '',
        externalReply: '', // 对外回复
        internalReply: '', // 对内回复
        fileList: [],
        handleStaff: {
          label: ''
        },
        questionType: {
          label: '',
          name: ''
        },
        closeReasonId: '', // 房修关单原因id
        isPaid: 0,
      },
      fileList: [], // 上传的图片
      zuofeiObj: {
        isShow: false,
        list: [[]],
        label: '',
        name: ''
      },
      tuidanObj: {
        isShow: false,
        list: [[]],
        label: '',
        name: ''
      },
      zantingObj: {
        isShow: false,
        list: [[]],
        label: '',
        name: ''
      },
      departmentObj: {
        isShow: false,
        list: [[]],
        label: '',
        name: ''
      },
      zantingDate: {
        isShow: false,
        label: '',
        name: ''
      },
      isLoading: false, // 按钮点击后，在请求的接口做出响应之前，是禁止点击的
    }
  },
  created() {
    this.setQuery()
    this.initDataByTaskInfo()

    this.getNsdReasonList()
    this.getCloseReason()
    this.getReturnReason()
    this.getPauseReason()
    this.getDepartment()
  },
  listener: {
    // 监听问题分类
    updateQuestionType({ type, data }) {
      this.formObj.questionType.label = data.text
      this.formObj.questionType.name = data.id
    },
    // 监听受理人，处理人
    'select-handler'({ type, data }) {
      this.formObj.handleStaff = {
        ...data,
        label: data.text
      }
    }
  },
  methods: {
    // 返回 工单详情 页面
    closePage() {
      uni.navigateBack({ delta: 1 })
    },
    // 获取 工单详情 传递过来的数据
    setQuery() {
      this.taskInfo = reviewStore.getData('taskInfo')
      const _modelType = this.modelType = reviewStore.getData('modelType')

      // 将按钮操作的操作名称做为页面标题显示
      const pageTitle = _modelType.name
      uni.setNavigationBarTitle({ title: pageTitle })
    },
    // 获取 问题类型，人员 的数据
    initDataByTaskInfo() {
      this.formObj.questionType.label = this.taskInfo.problemTemplateNames || ''
      this.formObj.questionType.name = (this.taskInfo.problemTemplate || '').split(',').slice(-1)[0] || ''
      if (this.modelType.id == 'changeOrign') {
        // 受理人
        this.formObj.handleStaff = {
          label: this.taskInfo.originalUserName || '',
          userId: this.taskInfo.originalUserId || ''
        }
      } else {
        this.formObj.handleStaff = {
          label: this.taskInfo.followUpProcessorName || '',
          userId: this.taskInfo.followUserId || ''
        }
      }
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
    // 获取作废类型
    async getNsdReasonList() {
      const params = {
        data: {
          dictCode: 'crmNsdReason'
        },
        hideLoading: true
      }
      const res = await getDictDetail(params)
      this.zuofeiObj.list = [res.data || []]
    },
    // 获取房修关单原因
    async getCloseReason() {
      const params = {
        data: {
          dictCode: 'crmCloseReason'
        },
        hideLoading: true
      }
      const res = await getDictDetail(params)
      this.closeReasonId = (res.data || []).find((item) => item.detailCode == 'crmCloseReason3')
    },
    // 获取退单原因列表
    async getReturnReason() {
      const params = {
        data: {
          dictCode: 'mtainRejectReason'
        },
        hideLoading: true
      }
      const res = await getDictDetail(params)
      this.tuidanObj.list = [res.data || []]
    },
    // 获取暂停原因
    async getPauseReason() {
      const params = {
        data: {
          dictCode: 'crmPauseReason'
        },
        hideLoading: true
      }
      const res = await getDictDetail(params)
      this.zantingObj.list = [res.data || []]
    },
    // 获取部门
    async getDepartment() {
      const params = {
        data: {
          dictCode: 'jobDepartment'
        },
        hideLoading: true
      }
      const res = await getDictDetail(params)
      this.departmentObj.list = [res.data || []]

      await this.getDepartmentByUserId()
    },
    // 根据用户id获取部门
    async getDepartmentByUserId() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const res = await getPostByUserId(userInfo.userId)
      this.departmentObj.label = res.data.deptName
      this.departmentObj.name = res.data.deptId
    },
    // 选择问题类型
    selQuestionType() {
      const typeReport = this.taskInfo.questionTypeId || ''
      uni.navigateTo({ url: `/pages-a/related-submission/repair-category?typeReport=${typeReport}` })
    },
    // 选择作废原因
    handlePicker(type, item) {
      if (type == 'zantingDate') {
        item = item.value
      } else {
        item = item.value[0]
      }
      if (!item) return

      if (type == 'zuofei') {
        this.zuofeiObj.label = item.detailName
        this.zuofeiObj.name = item.detailId
        this.zuofeiObj.isShow = false
      } else if (type == 'tuidan') {
        this.tuidanObj.label = item.detailName
        this.tuidanObj.name = item.detailId
        this.tuidanObj.isShow = false
      } else if (type == 'zanting') {
        this.zantingObj.label = item.detailName
        this.zantingObj.name = item.detailId
        this.zantingObj.isShow = false
      } else if (type == 'zantingDate') {
        this.zantingDate.label = uni.$u.timeFormat(item, 'yyyy年mm月dd日 hh时')
        this.zantingDate.name = uni.$u.timeFormat(item, 'yyyy-mm-dd hh:MM:ss')
        this.zantingDate.isShow = false
      } else if (type == 'department') {
        this.departmentObj.label = item.detailName
        this.departmentObj.name = item.detailId
        this.departmentObj.isShow = false
      }
    },
    linkTo(type) {
      if (type == 'handler') {
        const query = uni.$u.queryParams({
          areaId: this.taskInfo.areaId,
          projectId: this.taskInfo.projectId,
        }, true)
        uni.navigateTo({ url: `/pages-a/related-submission/handler${query}` })
      }
    },
    // 参数校验
    validateParams() {
      const response = (success = false, data = {}, message = '') => ({
        success,
        message,
        data
      })
      const fileList = this.formObj.fileList.map((item) => item.fid + '@-@-@' + item.fName).join(',')
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })

      if (this.modelType.id == 'report') {
        // 汇报进展
        const reportContent = this.formObj.reportContent
        if (!reportContent) return response(false, {}, '请填写信息确认内容！')

        return response(true, {
          modelType: 8,
          recordQues: reportContent,
          files: fileList
        })
      } else if (this.modelType.id == 'transfer') {
        // 转派
        const userId = this.formObj.handleStaff.userId
        const followUpProcessorId = this.taskInfo.followUserId
        const reportContent = this.formObj.reportContent || '' // 可选
        // 如果 转派人 和 跟进人 相同，则判断为没有设置新的派单人员
        if (!userId || userId == followUpProcessorId) return response(false, {}, '跟进人没有变更')

        return response(true, {
          recordQues: reportContent,
          followUserId: userId,
          files: fileList,
          userFlag: 3, // 1: 受理人, 2: 处理人, 3: 跟进人
        })
      } else if (this.modelType.id == 'dispatch') {
        // 派单
        const userId = this.formObj.handleStaff.userId
        const serverId = this.formObj.questionType.name; 
        const reportContent = this.formObj.reportContent
        if (!userId) return response(false, {}, '请选择处理人')
        if (!serverId) return response(false, {}, '请选择问题分类')
        if (!reportContent) return response(false, {}, '请填写信息确认内容！')

        return response(true, {
          modelType: 13,
          processUser: userId,
          recordQues: reportContent,
          files: fileList,
          // isPaid: this.formObj.isPaid, // 是否有偿
          serverId: this.formObj.questionType.name
        })
      } else if (this.modelType.id == 'getTask') {
        // 领单
        const reportContent = this.formObj.reportContent || ''
        const serverId = this.formObj.questionType.name
        const department = this.departmentObj.label
        if (!serverId) return response(false, {}, '请选择问题分类')
        // 配置了部门，就需要选择操作人部门
        if (!department && this.taskInfo.settingAuth.switchdept) return response(false, {}, '请选择领单部门')

        return response(true, {
          modelType: 14,
          processUser: userInfo.userId,
          recordQues: reportContent,
          files: fileList,
          serverId,
          deptId: this.departmentObj.name,
          deptName: this.departmentObj.label
        })
      } else if (this.modelType.id == 'cancel') {
        // 作废申请
        const reportContent = this.formObj.reportContent || ''
        const reasonId = this.zuofeiObj.name
        if (!reportContent) return response(false, {}, '请填写信息确认内容！')
        if (!reasonId) return response(false, {}, '请选择作废申请类型！')

        return response(true, {
          modelType: 7,
          reasonId,
          recordQues: '作废原因：' + this.zuofeiObj.label + ';' + reportContent,
          files: fileList
        })
      } else if (this.modelType.id == 'closeHouseRepair') {
        // 房修审批
        const reportContent = this.formObj.reportContent
        if (!reportContent) return response(false, {}, '请填写信息确认内容！')

        return response(true, {
          modelType: 21,
          reasonId: this.formObj.closeReasonId, // 房修关单原因
          recordQues: reportContent,
          files: fileList
        })
      } else if (this.modelType.id == 'inceptTask') {
        // 接单
        const reportContent = this.formObj.reportContent || ''
        const department = this.departmentObj.label
        // 配置了部门，就需要选择操作人部门
        if (!department && this.taskInfo.settingAuth.switchdept) return response(false, {}, '请选择接单部门')

        return response(true, {
          modelType: 12,
          processUser: userInfo.userId, // 接单人,受理人
          recordQues: reportContent,
          files: fileList,
          deptId: this.departmentObj.name,
          deptName: this.departmentObj.label
        })
      } else if (this.modelType.id == 'returnTask') {
        // 退单
        const reportContent = this.formObj.reportContent || ''
        const reasonId = this.tuidanObj.name
        if (reasonId == void 0 || reasonId == '') return response(false, {}, '请选择退单原因！')

        return response(true, {
          modelType: 24,
          reasonId, // 退单原因
          recordQues: `${reportContent} 退单原因：${this.tuidanObj.label}`,
          files: fileList
        })
      } else if (this.modelType.id == 'close') {
        // 正常关闭
        const reportContent = this.formObj.reportContent || ''
        const reasonId = 0 // 正常关闭原因
        // if (!fileList) return response(false, {}, '请上传附件')

        return response(true, {
          modelType: 5,
          reasonId, // 关闭原因
          files: fileList ? fileList : '',
          recordQues: reportContent
        })
      } else if (this.modelType.id == 'closeAbnormal') {
        // 非正常关闭
        const reportContent = this.formObj.reportContent || ''
        const reasonId = 1679 // 非正常关闭原因
        if (!reportContent) return response(false, {}, '请填写信息确认内容！')
        // if (!fileList) return response(false, {}, '请上传附件')

        return response(true, {
          modelType: 26,
          reasonId, // 关闭原因
          files: fileList ? fileList : '',
          recordQues: reportContent
        })
      } else if (this.modelType.id == 'rework' || this.modelType.id == 'restart') {
        // 返工，重启
        const userId = this.formObj.handleStaff.userId
        if (!userId) return response(false, {}, '请选择处理人')
        const reportContent = this.formObj.reportContent || ''

        return response(true, {
          modelType: this.modelType.id == 'rework' ? 1 : this.modelType.id == 'restart' ? 11 : '',
          processUser: userId,
          files: fileList,
          recordQues: reportContent
        })
      } else if (this.modelType.id == 'review1') {
        // 处理完成
        const isExternalReply = this.taskInfo.settingAuth.isExternalReply
        const externalReply = this.formObj.externalReply
        const internalReply = this.formObj.internalReply
        const reportContent = this.formObj.reportContent || ''
        if (isExternalReply && !externalReply) return response(false, {}, '请填写对外回复')
        if (isExternalReply && !internalReply) return response(false, {}, '请填写对内回复')
        // 报修工单，设置了强制上传附件
        if (this.taskInfo.biProblemCategory == 5 && this.taskInfo.settingAuth.isNeedFinishFile && !fileList)  return response(false, {}, '请上传附件')

        return response(true, {
          modelType: 22,
          replyReviewStatus: 1, // 审核状态
          externalReply, // 对外回复
          recordQues: this.taskInfo.isExternalReply ? internalReply : reportContent, // 对内回复
          files: fileList
        })
      } else if (this.modelType.id == 'changeOrign') {
        // 更改受理人
        const userId = this.formObj.handleStaff.userId
        const originalUserId = this.taskInfo.originalUserId
        if (!userId || userId == originalUserId) return response(false, {}, '受理人没有变更')

        return response(true, {
          followUserId: userId,
          userFlag: 1
        })
      } else if (this.modelType.id == 'delay') {
        // 暂停申请
        const reportContent = this.formObj.reportContent || ''
        const reasonId = this.zantingObj.name
        const pauseDeadline = this.zantingDate.name
        if (!reportContent) return response(false, {}, '请填写信息确认内容！')
        if (!reasonId) return response(false, {}, '请选择暂停原因')
        if (!pauseDeadline) return response(false, {}, '请选择暂停日期')

        return response(true, {
          modelType: 6,
          reasonId: this.zantingObj.name,
          pauseDeadline,
          recordQues: this.formObj.reportContent || '' + ';暂停原因：' + this.zantingObj.label,
          files: fileList
        })
      } else if (this.modelType.id == 'activateTask') {
        // 激活
        const reportContent = this.formObj.reportContent || ''
        return response(true, {
          modelType: 4,
          recordQues: '激活操作：' + reportContent,
          files: fileList
        })
      }

      return response(false)
    },
    // 工单按钮操作
    async handleQuestionTask() {
      const data = this.validateParams()
      if (!data.success && !data.message) return
      if (!data.success) {
        this.$refs.messageEl.show({
          type: 'default',
          message: data.message
        })
        return
      }

      // 禁止重复请求
      if (this.isLoading) return
      this.isLoading = true

      let res = {}
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })

      if (['transfer', 'changeOrign'].includes(this.modelType.id)) {
        const params = {
          data: {
            quesTaskId: this.taskInfo.quesTaskId,
            userId: userInfo.userId,
            ...data.data
          },
          hideLoading: true
        }
        res = await questionTaskGiveOut(params).catch(() => {
          this.isLoading = false
        })
      } else {
        const params = {
          data: {
            quesTaskIds: this.taskInfo.quesTaskId,
            userId: userInfo.userId,
            ...data.data
          },
          hideLoading: true
        }
        res = await handleQuestionTask(params).catch(() => {
          this.isLoading = false
        })
      }

      this.$refs.messageEl.show({
        type: 'default',
        message: res.resultCode == 200 ? '操作成功' : (res.resultDesc || '操作失败')
      })
      
      if (['transfer', 'dispatch'].includes(this.modelType.id) && res.resultCode == 200) {
        // 派单操作，转派操作，需要推送消息
        this.sendQuesTaskAgentMsg(this.taskInfo.quesTaskId, this.formObj.handleStaff.userId)
      }

      if (res.resultCode == 200) {
        // 刷新工单详情页面
        pageRefresh.setRefresh('WORK_ORDER_DETAIL')

        this.closePage()
      }
      setTimeout(() => {
        this.isLoading = false
      })
    },
    // 工单消息推送
    async sendQuesTaskAgentMsg(taskId, staffId) {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })      
      let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      const params = {
        data: {
          companyId: companyId,
          userId: userInfo.userId,
          quesTaskId: taskId,
          quesTaskState: '1', // 0: 新建工单的提醒, 1: 派单工单的提醒
          toUserId: staffId, // 接收用户（跟进人）
          pageUrl: 'pages-workorder/workorder-detail/detail?taskId=' + taskId
        },
        hideLoading: true,
        responeToast: false
      }
      await sendQuesTaskAgentMsg(params)
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding: 24rpx 20rpx;
  min-height: 100vh;
  background-color: #f3f5f9;
  box-sizing: border-box;
}
.model-panel {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F3F4F7;
}
.footer-panel {
  width: 100%;
  display: flex;
  padding: 60rpx 54rpx;
  box-sizing: border-box;
}
.report-panel {
  background-color: #fff;
  box-sizing: border-box;
  padding: 30rpx;

  &.border-bottom {
    border-bottom: 1px solid #ccc;
  }
  .report-textarea {
    width: 100%;
    height: 200rpx;
    padding-bottom: 20rpx;
  }
}
.form-panel {
  background-color: #fff;
  padding: 0 30rpx;
  border-top: 1px solid #ccc;
}
.radio-gap {
  display: inline-block;
  margin: 0 5px;
}
</style>