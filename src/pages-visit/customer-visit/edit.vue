<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]" :disable-scroll="canvasPosition.zoomFlag">
    <customer-info-sheet :data="visitDetail" :houseInfoId="queryObj.houseInfoId" @userList="getUserList" />

    <view class="card-panel">
      <view class="card-title">拜访信息</view>
      <cell-text label="拜访人" labelWidth="160rpx" padding="30rpx 0" customStyle="font-size: 28rpx; margin: 0 30rpx; width: auto;">
        <u--input placeholder="请输入拜访人" v-model="formObj.visitUserName" clearable border="none" fontSize="28rpx" />
      </cell-text>
      <!-- 任务类型为 访谈 时，不允许选择拜访方式 -->
      <cell-text
        v-if="formObj.taskType != '0'"
        label="拜访方式 *" labelWidth="160rpx" padding="30rpx 0"
        customStyle="font-size: 28rpx; margin: 0 30rpx; width: auto;"
        @click="pickerShowEvent('visitType')"
      >
        <text :class="[visitTypeObj.curLabel ? 'cell-text--input' : 'cell-text--placeholder']">{{ visitTypeObj.curLabel || '请选择拜访方式' }}</text>  
      </cell-text>
      <cell-text
        label="拜访时间 *" labelWidth="160rpx" padding="30rpx 0"
        customStyle="font-size: 28rpx; margin: 0 30rpx; width: auto;"
        @click="pickerShowEvent('visitDate')"
      >
        <text :class="[formObj.visitDate ? 'cell-text--input' : 'cell-text--placeholder']">{{ formObj.visitDate || '请选择拜访时间' }}</text>
      </cell-text>
      <cell-text label="被访人 *" labelWidth="160rpx" padding="30rpx 0" customStyle="font-size: 28rpx; margin: 0 30rpx; width: auto;">
        <u--input placeholder="请输入被访人" v-model="formObj.intervieweeName" clearable border="none" fontSize="28rpx" />
      </cell-text>
      <cell-text label="联系电话" labelWidth="160rpx" padding="30rpx 0" border="none" customStyle="font-size: 28rpx; margin: 0 30rpx; width: auto;">
        <u--input placeholder="请输入联系电话" v-model="formObj.intervieweePhone" clearable border="none" fontSize="28rpx" />
      </cell-text>
    </view>

    <view class="card-panel">
      <view class="card-title">
        <text class="title-h1">问卷内容</text>
        <text class="title-desc"></text>
        <u-button text="发送问卷" :icon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)" type="primary" plain customStyle="width: auto; height: 60rpx; padding: 0 12rpx; margin: 0; font-weight: initial; flex: 0 0 auto;" @click="sendQuestion" />
      </view>
      <visit-question ref="questionEl" :subjectList="subjectList" :questionType="isEdit ? 'edit' : 'read'" />
    </view>

    <view class="card-panel" :style="[{marginBottom: '20rpx'}]">
      <view class="card-title">拜访结果</view>
      <view class="file-input-panel">
        <textarea class="text-area" v-model="formObj.visitContent" placeholder="请输入拜访内容" placeholder-style="font-size: 28rpx; color: #c0c4cc;" />
        <u-upload name="upload" :fileList="formObj.fileList" :maxCount="9" previewFullImage sizeType="compressed" @afterRead="afterRead"
          @delete="deleteImg" />
      </view>
    </view>

    <!-- 是否需要客户签名 -->
    <view v-if="visitDetail.isSignature == '1'" id="signature" :class="['canvas-wrap', {'zoom-in': canvasPosition.zoomFlag}]" :style="[getZoomStyle]">
      <view class="card-panel" :style="[{marginTop: 0, height: '100%'}]">
        <view class="card-title">
          <text class="title-h1">客户签名</text>
          <text class="title-desc">（请在下方区域完成签名）</text>
          <u-button text="重签" type="primary" plain customStyle="width: 120rpx; height: 60rpx; margin: 0; font-weight: initial; flex: 0 0 auto;" @click="resetCanvas" />
        </view>
        <view class="card-content" @touchmove.stop.prevent="onScroll">
          <signature-canvas ref="signEl" />
          <image v-if="!canvasPosition.zoomFlag" class="zoom-icon" :src="require(`@/static/theme-default/visit/icon-zoom-in.png`)" @click="zoomCanvas" />
          <image v-if="canvasPosition.zoomFlag" class="zoom-icon" :src="require(`@/static/theme-default/visit/icon-zoom-out.png`)" @click="zoomCanvas" />
        </view>
      </view>
    </view>

    <view class="placeholder"></view>
    <u-safe-bottom />
    
    <cover-view class="footer-panel" v-if="isShowFooter && !canvasPosition.zoomFlag">
      <cover-view class="footer-wrap">
        <cover-view class="footer-btn" @click="createOrder">
          <cover-image :style="{width: '34rpx', height: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" :src="require(`@/static/${THEME_NAME}/common/add.png`)" /
          <cover-view>新建工单</cover-view>
        </cover-view>
        <cover-view class="vertical-line"></cover-view>
        <cover-view class="footer-btn" @click="submitEvent">
          <cover-image :style="{width: '34rpx', height: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" :src="require(`@/static/${THEME_NAME}/common/icon-submit.png`)" />
          <cover-view>提交</cover-view>
        </cover-view>
      </cover-view>
      <u-safe-bottom />
    </cover-view>

    <!-- 拜访方式 -->
    <u-picker :show="visitTypeObj.isShow" :columns="visitTypeObj.list" keyName="label" @confirm="pickerConfirmEvent('visitType', $event)" @cancel="pickerCancelEvent('visitType')" />
    <!-- 拜访日期 -->
    <u-datetime-picker :show="visitDateObj.isShow" model="datetime" :minDate="minDate" @confirm="pickerConfirmEvent('visitDate', $event)" @cancel="pickerCancelEvent('visitDate')" />
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import CustomerInfoSheet from '@/pages-visit/modules/customer-info-sheet.vue'
import CellText from '@/components/cell-text.vue'
import VisitQuestion from '@/pages-visit/modules/visit-question.vue'
import SignatureCanvas from '@/pages-visit/modules/signature-canvas.vue'
import CanvasPosition from '@/pages-visit/modules/canvas-position'
import { getCustomerVisitDetailById, uploadCustomerVisitInfo } from '@/service/returnVisit'
import { getCustomerVisitType, uploadMutiFile } from '@/service/landcrm'

/**
 * 拜访详情-未拜访
 */
export default {
  components: {
    CustomerInfoSheet,
    CellText,
    VisitQuestion,
    SignatureCanvas
  },
  data() {
    return {
      queryObj: {
        visitRecordId: '', // 拜访任务id
        houseInfoId: '' // 房间id
      },
      visitDetail: {}, // 拜访任务详情
      formObj: {
        taskType: '', // 0: 访谈; 1: 互动
        visitUserName: '', // 拜访人姓名
        intervieweeName: '', // 被访人姓名
        intervieweePhone: '', // 被访人手机号码
        fileList: [],
        typeLabel: '',
        visitType: '', // 拜访方式
        visitDate: '', // 拜访时间
        visitContent: '', // 拜访内容
      },
      // 拜访方式
      visitTypeObj: {
        isShow: false,
        list: [[]],
        curLabel: ''
      },
      subjectList: [], // 问卷题目
      minDate: new Date().getTime(), // 最小的拜访时间
      visitDateObj: {
        isShow: false
      },
      canvasPosition: new CanvasPosition(),
      isEdit: true, // 如果问卷已填写，则只能查看；否则，可以填写
      isShowFooter: true, // 解决使用 cover-view 后，弹窗菜单被遮挡问题
    }
  },
  computed: {
    // 当前时间在拜访结束日期之内，并且拜访任务是未拜访，则有权限填写信息
    isEditAuth() {
      // 拜访结束日期
      let endTime = 0

      let dateTmp = this.visitDetail.visitTaskEnd || ''
      if (dateTmp) {
        dateTmp = dateTmp.replace(/-/ig, '\/')
        endTime = new Date(dateTmp).getTime()
      }
      
      const nowTime = new Date().getTime()
      return nowTime - endTime < 0 && this.visitDetail.visitState == '0'
    },
    // canvas 缩放样式
    getZoomStyle() {
      if (this.canvasPosition.zoomFlag) {
        // 放大的样式，覆盖整个页面
        return {
          zIndex: 4,
          top: - this.canvasPosition.top + 'px',
          height: this.canvasPosition.pageHeight + 'px',
        }
      } else {
        return {
        }
      }
    }
  },
  onLoad(query) {
    this.queryObj.visitRecordId = query.visitRecordId || ''
    this.queryObj.houseInfoId = query.houseInfoId || ''

    this.getCustomerVisitDetailById()
    this.getCustomerVisitType()
  },
  onPageScroll() {
    this.canvasPosition.disableScroll()
  },
  methods: {
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
    pickerShowEvent(type) {
      if (type == 'visitType') {
        // 拜访类型
        // 任务类型为 访谈 时，不允许选择拜访方式
        if (this.formObj.taskType == '0') return
        this.visitTypeObj.isShow = true
      } else if (type == 'visitDate') {
        // 拜访时间
        this.visitDateObj.isShow = true
      }

      this.isShowFooter = false
    },
    pickerConfirmEvent(type, val) {
      if (type == 'visitType') {
        const value = val.value[0]

        this.formObj.visitType = value.name
        this.visitTypeObj.curLabel = value.label
      } else if (type == 'visitDate') {
        const value = val.value

        this.formObj.visitDate = uni.$u.timeFormat(value, 'yyyy-mm-dd hh:MM:00')
      }

      this.pickerCancelEvent(type)
    },
    pickerCancelEvent(type) {
      if (type == 'visitType') {
        this.visitTypeObj.isShow = false
      } else if (type == 'visitDate') {
        this.visitDateObj.isShow = false
      }

      this.isShowFooter = true
    },
    // 获取客户拜访详情
    async getCustomerVisitDetailById() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params= {
        data: {
          visitRecordId: this.queryObj.visitRecordId,
          houseInfoId: this.queryObj.houseInfoId,
          userId: userInfo.userId,
          userName: userInfo.userName
        }
      }
      const res = await getCustomerVisitDetailById(params)
      const _dataTmp = this.visitDetail = res.data.data?.[0] ?? {}
      this.formObj.taskType = _dataTmp.interactionType
      this.formObj.visitUserName = _dataTmp.visitUserName
      this.formObj.intervieweeName = _dataTmp.intervieweeName
      this.formObj.intervieweePhone = _dataTmp.intervieweePhone
      this.subjectList = _dataTmp.questionnaireAnswerData.subjectsList || []

      this.isEdit = !this.hasAnswer(this.subjectList)
    },
    // 获取问卷是否已填写过
    hasAnswer(subjectList) {
      const res = subjectList.some(item => {
        const type = item.type
        if (type == '0' || type == 1) {
          // 单选/多选
          return item.elementList.some(el => el.answer)
        } else if (type == 2 || type == 3) {
          // 填空/评价
          return !!(item.elementList?.[0]?.value)
        }
      })
      return res
    },
    // 获取拜访方式
    async getCustomerVisitType() {
      const params = {
        data: {
          dictCode: 'visitType'
        }
      }
      const res = await getCustomerVisitType(params)
      let data = res.data || []
      data = data.map(item => ({
        ...item,
        label: item.value,
        name: item.key
      }))
      this.visitTypeObj.list = [data]
    },
    // 获取房间下的所有联系人
    getUserList(list) {
      // 将第一个联系人做为默认的被访人
      const item = list[0] || null
      if (!item) return

      this.formObj.intervieweeName = item.regName || ''
      this.formObj.intervieweePhone = item.ownerCalls || ''
    },
    // 校验参数
    validateParams() {
      if (this.formObj.taskType != '0' && !this.formObj.visitType) {
        // 拜访任务类型为 访谈 时，不允许选择拜访方式
        return { success: false, message: '请选择拜访方式' }
      } else if (!this.formObj.visitDate) {
        return { success: false, message: '请选择拜访时间' }
      } else if (!this.formObj.intervieweeName) {
        return { success: false, message: '请填写被访人' }
      } else if (!this.formObj.visitContent) {
        return { success: false, message: '请填写拜访结果' }
      }

      return { success: true }
    },
    // 提交事件
    async submitEvent() {
      const { success, message } = this.validateParams()
      if (!success) {
        this.$refs.uToast.show({
          type: 'default',
          message
        })
        return
      }
      const subValid = this.$refs.questionEl.getSubjectAnswer()
      if (!subValid.success) {
        this.$refs.uToast.show({
          type: 'default',
          message: subValid.message
        })
        return
      }

      let signFile = {}
      if (this.visitDetail.isSignature == 1) {
        // 需要客户签名
        if (!this.$refs.signEl.getIsSign()) {
          this.$refs.uToast.show({
            type: 'default',
            message: '请客户签名'
          })
          return
        }

        signFile = await this.$refs.signEl.finish()
      }
      

      const fileIds = this.formObj.fileList.map(item => item.fid).join(',')
      const filesrcs = this.formObj.fileList.map(item => item.resPath).join(',')
      // const subjectsList = this.subjectList.map(item => ({
      //   id: item.id,
      //   title: item.title,
      //   subjectDesc: item.subjectDesc,
      //   type: item.type,
      //   value: '',
      //   elementList: item.elementList.map(el => ({
      //     id: el.id,
      //     subjectsId: el.subjectsId,
      //     title: el.title
      //   }))
      // }))

      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          userId: userInfo.userId,
          userName: userInfo.userName,
          visitRecordId: this.queryObj.visitRecordId, // 拜访记录id
          visitRecordCode: this.visitDetail.visitRecordCode, // 记录code
          userName: this.formObj.visitUserName, // 拜访人姓名
          intervieweeName: this.formObj.intervieweeName, // 被访人姓名
          intervieweePhone: this.formObj.intervieweePhone, // 被访人手机号码
          visitTime: this.formObj.visitDate, // 拜访时间
          visitType: this.formObj.visitType, // 拜访方式
          visitContent: this.formObj.visitContent, // 拜访内容
          fileIds, // 附件id
          filesrcs, // 附件路径
          questionnaireAnswerData: {
            ...this.visitDetail.questionnaireAnswerData,
            answered: 1,
            subjectsList: subValid.data, // 题目
          },
          sigFileIds: signFile.sigFileIds || '', // 签名的图片id
          sigFilesrcs: signFile.sigFilesrcs || '' // 签名的图片路径
        }
      }
      const res = await uploadCustomerVisitInfo(params)
      this.$refs.uToast.show({
        type: 'default',
        message: res.data.resultCode == 200 ? '操作成功' : res.data.resultDesc
      })

      if (res.data.resultCode == 200) {
        uni.navigateBack({ delta: 1 })
      }
    },
    // 新建工单
    createOrder() {
      uni.navigateTo({ url: '/pages/workorder/index?houseInfoId=' + this.visitDetail.houseInfoId })
    },
    // 重签
    resetCanvas() {
      this.$refs.signEl.clear()
    },
    // 当滚动签名时，禁止页面跟随滚动
    onScroll(e) {
      e.preventDefault()
    },
    // 发送问卷，跳转到业主端小程序的客户拜访填写问卷页面
    sendQuestion() {
      const query = uni.$u.queryParams({
        visitRecordId: this.visitDetail.visitRecordId,
        houseInfoId: this.visitDetail.houseInfoId
      })

      wx.qy.shareToExternalContact({
        text: {
          content: this.visitDetail.questionnaireAnswerData.name || '',
        },
        attachments: [
          {
            msgtype: 'miniprogram',
            miniprogram: {
              appid: this.$appConfig.OWNER_APPID,
              title: '点击参与问卷内容',
              imgUrl: 'https://saas60.wuyeface.com/qw-online-assets/static/theme-default/common/gdhfQuestion.png',
              page: 'pages-c/customer-visit/question.html' + query
            }
          }
        ]
      })
    },
    // 缩放canvas
    zoomCanvas() {
      this.canvasPosition.setPageInfo()

      const query = uni.createSelectorQuery().in(this)
      query.select('#signature').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(async res => {
        const elTop = res[0].top
        const elScrollTop = res[1].scrollTop

        let isZoomIn = this.canvasPosition.zoomFlag // 是否放大
        if (isZoomIn) {
          // 缩小操作。因缩小时，无法截取到canvas之外的图片，所以需要先把放大时的canvas先转为临时文件
          await this.$refs.signEl.finish(true)
        }
        
        this.canvasPosition.setCanvasInfo({
          top: elTop,
          scrollTop: elScrollTop
        })
        isZoomIn = this.canvasPosition.zoomFlag
        this.$refs.signEl.allScreen(isZoomIn)
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f3f5f9;
  box-sizing: border-box;
  font-family: "PingFang SC";
}
::v-deep .customer-info-sheet {
  margin-bottom: 20rpx;
}

@mixin animation() {
  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
}

.card-panel {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12rpx;
  margin-top: 20rpx;
}
.canvas-wrap {
  position: relative;
  height: 102rpx + 30rpx + 60rpx + 300rpx + 6rpx;
  top: 0;
  margin-left: 0;
  margin-right: 0;
  background-color: #f3f5f9;
  box-sizing: border-box;
  @include animation();

  &.zoom-in {
    margin-left: -20rpx;
    margin-right: -20rpx;
    padding: 20rpx;
    background-color: #f3f5f9;
  }
}
.card-title {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 102rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  border-bottom: 1px solid #EBEBEB;

  .title-h1 {
    flex: 0 0 auto;
  }
  .title-desc {
    flex: 1 1 auto;
    font-weight: initial;
    font-size: 26rpx;
    color: #999999;
  }
}
.card-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: 30rpx 30rpx 60rpx;
  position: relative;
}
.zoom-icon {
  position: absolute;
  bottom: 10rpx;
  right: 27rpx;
  width: 40rpx;
  height: 40rpx;
}
.file-input-panel {
  display: flex;
  flex-direction: column;
  padding: 24rpx 30rpx 0;
}
.text-area {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 24rpx;
  width: 100%;
  height: 200rpx;
}
::v-deep .cell-text--placeholder {
  color: #c0c4cc;
}
::v-deep .cell-text--input {
  color: #333;
}

$height: 100rpx;

.placeholder {
  height: $height;
}

.footer-panel {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  background-color: #ffffff;
}
.footer-wrap {
  display: flex;
}
.footer-btn {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: $height;
  color: var(--app-primary-color);
  font-size: 28rpx;
}
.vertical-line{
  width: 1px;
  height: $height;
  background-color: #eaeaea;
}
</style>