<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="card">
      <text class="content-title">内容&附件</text>
      <view class="line"></view>
      <!-- 群发文字内容 -->
      <text class="content-text">{{ dataInfo.contentText || '' }}</text>
      <!-- 附件 -->
      <text v-if="dataInfo.contentAttachmentList.length == 0" style="color: #8d8d8d; margin-left: 40rpx;font-size: 28rpx;">暂无附件</text>
      <share-attachments ref="attachmentsEl" :data="dataInfo.contentAttachmentList" customStyle="margin: 0 40rpx 30rpx;" />
      <!-- 任务创建日期 -->
      <text class="content-create">{{ getCreationTime }}</text>
      <!-- <cell-text label="发送给：" isRight :customStyle="{borderTop: '1px solid #ecedf3'}" :labelStyle="{fontWeight: 'bold'}" @click="isShowSend = true">
        <text>请选择客户</text>
        <u-icon slot="right" name="arrow-right" />
      </cell-text> -->
    </view>
    <view class="card">
      <text class="end-title">发送截止日期</text>
      <view class="item-content">
        <cell-text :label="getEndDate" labelWidth="250rpx" labelColor="#8d8d8d" padding="30rpx 0">
          <!-- 任务状态 -->
          <text :class="['title-state', getTaskState.class]">{{ getTaskState.label }}</text>
        </cell-text>
        <!-- <view class="line"></view> -->
      </view>
      <view style="padding: 0 30rpx 30rpx;">
        <cell-text label="备注" :labelStyle="{fontWeight: 'bold', fontSize:'30rpx'}" border="none" padding="0rpx 0" labelWidth="auto">
          <text style="font-size:30rpx;color:#8d8d8d">（仅内部人员查看）</text>
        </cell-text>
        <text class="remark-text">{{ dataInfo.remark || '' }}</text>
      </view>
    </view>
    <u-action-sheet :actions="sendList" :show="isShowSend" @close="isShowSend = false" @select="selectGroupChat" cancelText="取消"/>

    <u-safe-bottom />
    <view class="footer-fix" v-if="getTaskState.class == 'doing' || getTaskState.class =='timeout'">
      <!-- 客户，客户群 -->
      <u-button v-if="dataInfo.taskType == 1" text="选择客户" type="primary" @click="handleSelect" />
      <!-- 朋友圈 -->
      <u-button v-if="dataInfo.taskType == 2" text="确认发表" type="primary" @click="handleSubmit(2)" />
    </view>

    <yb-complete ref="completeEl" />
    <u-toast ref="messageEl" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text.vue'
import YbComplete from '@/components/yb-complete/yb-complete.vue'
import storeGroup from '@/pages-tasks/group-send/storeGroup'
import ShareAttachments from '@/pages-tasks/modules/share-attachments.vue'
import { formatAttachments } from '@/pages-tasks/modules/toAttachments'
import { getMyTaskInfo, contactGroup, uploadRecord } from '@/service/api-gateway'

/**
 * 我的任务详情-消息群发
 */
export default {
  components: {
    CellText,
    YbComplete,
    ShareAttachments
  },
  data() {
    return {
      employeeTaskId: '', // 员工任务id
      dataInfo: {},
      isShowSend: false,
      sendList: [
        { 
          name: '客户',
          fontWeight: '200',
          fontSize: '32rpx',
          color: '#0050C5' 
        },
        { 
          name: '客户群',
          fontSize:'32rpx',
          fontWeight: '200',
          color: '#333333'
        }
      ],
      flagInit: false, // 标记，表示是否刚选择客户
    }
  },
  computed: {
    // 获取任务的截止日期
    getEndDate() {
      const date = this.dataInfo.endTime || ''
      if (!date) return ''
      return uni.$u.timeFormat(date, 'yyyy年mm月dd日')
    },
    // 获取任务的创建时间
    getCreationTime() {
      const date = this.dataInfo.createDate || ''
      if (!date) return ''
      return uni.$u.timeFormat(date, 'yyyy年mm月dd日 hh时MM分ss秒')
    },
    // 获取任务状态
    getTaskState() {
      const state = this.dataInfo.sendStatus
      if (state == '0') {
        return {
          label: '进行中',
          class: 'doing'
        }
      } else if (state == '1') {
        return {
          label: '已完成',
          class: 'finished'
        }
      } else if (state == '2') {
        return {
          label: '已过期',
          class: 'expired'
        }
      } else if (state == '3') {
        return {
          label: '超时进行中',
          class: 'timeout'
        }
      } else if (state == '4') {
        return {
          label: '超时完成',
          class: 'timeoutFinished'
        }
      } else if (state == '5') {
        return {
          label: '已作废',
          class: 'abolished'
        }
      }
    },
  },
  onLoad(query) {
    this.employeeTaskId = query.employeeTaskId || ''

    this.getTaskDetail()
  },
  onShow() {
    // 当选择客户群时，需要跳转到“客户群列表页面”，选择数据后，再返回到当前页面
    const selGroupList = storeGroup.get()
    if (selGroupList.length) {
      // 如果有选择数据，则需要继续之前的操作
      this.handleSubmit({ name: '客户群' })
    }
  },
  methods: {
    async getTaskDetail() {
      const res = await getMyTaskInfo(this.employeeTaskId)

      const data = res.data || {}
      data.contentAttachmentList = formatAttachments(data.contentAttachmentList || [])
      this.dataInfo = data
    },
    // 选择发送对象
    handleSelect() {
      const taskType = this.dataInfo.taskType
      if (taskType == 1) {
        // 消息群发
        this.isShowSend = true
      } else if (taskType == 2) {
        // 朋友圈转发
        this.handleSubmit(2)
      }
    },
    // 发送给客户群
    selectGroupChat(sendType) {
      if (sendType.name == '客户群') {
        this.flagInit = true // 表示需要选择客户群
      }
      this.handleSubmit(sendType)
    },
    // 确认发送
    async handleSubmit(sendType) {
      if (sendType == 2) {
        // 朋友圈转发
        const mediaRes = await this.$refs.attachmentsEl.mediaUpload(this.dataInfo.contentAttachmentList)
        if (!mediaRes.success) return
        const sendRes = await this.shareToExternalMoments(mediaRes.data)
        if (!sendRes.success) return

        this.uploadRecord(3)
      } else if (sendType.name == '客户') {
        // 客户群发
        const chooseRes = await this.chooseExternal()
        if (!chooseRes.success) return
        const mediaRes = await this.$refs.attachmentsEl.mediaUpload(this.dataInfo.contentAttachmentList)
        if (!mediaRes.success) return
        const sendRes = await this.shareToExternalContact(chooseRes.data, mediaRes.data)
        if (!sendRes.success) return

        this.uploadRecord(1, { userId: chooseRes.data })
      } else if (sendType.name == '客户群') {
        // 客户群群发
        if (this.flagInit) {
          // 初次选择数据，需要跳转到“选择客户群”页面
          this.flagInit = false
          uni.navigateTo({ url: '/pages-tasks/group-send/group-list' })
          return
        }
        
        // 已经选择过数据了，需要获取选择的客户群数据
        const selGroupList = storeGroup.get()
        if (!selGroupList.length) {
          this.$refs.completeEl.showMessage('请选择客户群')
          return
        }
        storeGroup.init()

        const mediaRes = await this.$refs.attachmentsEl.mediaUpload(this.dataInfo.contentAttachmentList)
        console.log(mediaRes)
        if (!mediaRes.success) return
        const chatIds = selGroupList.map(item => item.chatId)
        const sendRes = await this.shareToExternalChat(chatIds, mediaRes.data)
        if (!sendRes.success) return

        this.uploadRecord(2, { groupId: chatIds })
      }
    },
    // 选择外部联系人（客户）
    chooseExternal() {
      return new Promise((resolve, reject) => {
        wx.qy.selectExternalContact({
          filterType: 0,
          success: (res) => {
            // 客户id
            const data = res.userIds || []
            if (data.length == 0) {
              this.$refs.completeEl.showMessage('请选择客户')
              resolve({ success: false })
              return
            }
            
            resolve({ success: true, data })
          },
          fail: (err) => resolve({ success: false })
        })
      })
    },
    // 群发给客户
    shareToExternalContact(externalUserIds = [], attachments = []) {
      return new Promise((resolve, reject) => {
        wx.qy.shareToExternalContact({
          externalUserIds,
          text: {
            content: this.dataInfo.contentText || '',
          },
          attachments,
          success: () => resolve({ success: true }),
          fail: err => {
            if (err.errMsg.lastIndexOf('cancel') > 0) {
              this.$refs.completeEl.showMessage('取消发送给客户')
            } else {
              this.$refs.completeEl.showMessage('发送给客户失败，请重新发送')
            }
            resolve({ success: false })
          }
        })
      })
    },
    // 获取客户群
    async getContactGroup() {
      const params = {
        data: {}
      }
      const res = await contactGroup(params)

      const data = (res.data || []).map(item => ({ chatId: item.chatId, groupName: item.groupName }))
      return Promise.resolve({ success: true, data })
    },
    // 群发给客户群
    shareToExternalChat(chatIds = [], attachments = []) {
      return new Promise((resolve, reject) => {
        // 注意，需要清除已选择的客户群数据，防止重复弹窗
        wx.qy.shareToExternalChat({
          chatIds,
          text: {
            content: this.dataInfo.contentText || '',
          },
          attachments,
          success: () => resolve({ success: true }),
          fail: err => {
            if (err.errMsg.lastIndexOf('cancel') > 0) {
              this.$refs.completeEl.showMessage('取消发送给客户群')
            } else {
              this.$refs.completeEl.showMessage('发送给客户群失败，请重新发送')
            }
            resolve({ success: false })
          }
        })
      })
    },
    // 朋友圈转发
    shareToExternalMoments(attachments = []) {
      return new Promise((resolve, reject) => {
        wx.qy.shareToExternalMoments({
          text: {
            content: this.dataInfo.contentText || '',
          },
          attachments: attachments.filter(item => ['image', 'link', 'video'].includes(item.msgtype)),
          success: () => resolve({ success: true }),
          fail: err => {
            if (err.errMsg.lastIndexOf('cancel') > 0) {
              // 取消发送
              this.$refs.completeEl.showMessage('取消发送到朋友圈')
            } else {
              // 发送失败
              this.$refs.completeEl.showMessage('发送到朋友圈失败，请重新发送')
            }
            resolve({ success: false })
          }
        })
      })
    },
    // 上传群发送的记录
    async uploadRecord(sendType, data = {}) {
      const params = {
        data: {
          employeeTaskId: this.employeeTaskId, // 员工群发任务id
          sendType, // 发送类型，1-客户；2-客户群；3-朋友圈
        }
      }
      if (sendType == 1) {
        // 发送给客户，所以传外部联系人id
        params.data.userId = data.userId
      } else if (sendType == 2) {
        // 发送给客户群，所以传群聊id
        params.data.groupId = data.groupId
      }
      const res = await uploadRecord(params)
      if (res.status == 200) {
        this.$refs.messageEl.show({
          message: '发送成功',
          complete: () => {
            uni.navigateBack()
          }
        })
      } else {
        this.$refs.completeEl.showMessage(res.message || '发送失败，请重新发送')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  font-family: PingFang SC;
  height: 100%;
  background-color: #F9F9F9;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  box-sizing: border-box;
}
.card{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  background-color: white;
  border-radius: 12rpx;
  margin-top: 24rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
  /* padding: 30rpx; */
}
.content-title {
  font-size: 30rpx;
  font-weight: bold;
  color:#333333;
  /* margin-bottom: 30rpx; */
  padding: 30rpx;
  /* border-bottom: 1px solid #ecedf3; */
}
.line {
  height: 1px; 
  background-color: #ebebeb;
}
.item-content {
  padding: 30rpx;
}
.content-text {
  /* font-weight: 500; */
  color:#333333;
  font-size: 28rpx;
  text-indent: 40rpx;
  margin-bottom: 30rpx;
  padding-top: 30rpx;
}
.content-create {
  color: #8d8d8d;
  padding: 0 0 30rpx;
  
}
.end-title {
  font-size: 30rpx;
  font-weight: bold;
  padding-top: 30rpx;
  padding-left: 30rpx;
}
.title-state {
  font-size: 27rpx;
  width:100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  height: 36rpx;
  line-height: 36rpx;
  padding: 0 10rpx;
  
  
  border-radius: 6rpx;

  &.doing {
    color: #2d8cf0;
  }
  &.finished, &.timeoutFinished {
    color: #19be6b;
  }
  &.timeout {
    color: #ff0000;
  }
  &.expired, &.abolished {
    color: #bbbec4;
  }
}
.remark-text {
  font-size: 28rpx;
  text-indent: 40rpx;
  font-weight: 400;
  color: #333333;
}
::v-deep .u-tag--mini {
  height: 18px !important;
  line-height: 18px !important;
}
.footer-fix {
  position: fixed;
  left: 40rpx;
  right: 40rpx;
  bottom: 80rpx;
}
::v-deep .u-action-sheet__cancel-text {
  color: #999 !important;
  font-size: 36rpx;
}
</style>